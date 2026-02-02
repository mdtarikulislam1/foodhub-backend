import { OrderStatus, OrderItemStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import AppError from "../../middleware/error/app.error";
import { CreateOrderPayload } from "../../type/product.type";
import { User } from "../../type/user.type";
import { UserRole } from "../../middleware/auth";
const createOrder = async (data: CreateOrderPayload, user: User) => {
  const { items, ...productData } = data;

  if (!items || items.length === 0) {
    throw new AppError("Order must contain at least one item", 400);
  }

  const totalPrice = Number((productData as any).totalPrice);
  const totalQuantity = Number((productData as any).totalQuantity);
  const totalDiscount =
    (productData as any).totalDiscount !== undefined
      ? Number((productData as any).totalDiscount)
      : 0;
  const grandTotal = Number((productData as any).grandTotal);

  if (
    Number.isNaN(totalPrice) ||
    Number.isNaN(totalQuantity) ||
    Number.isNaN(totalDiscount) ||
    Number.isNaN(grandTotal)
  ) {
    throw new AppError(
      "You provide incorrect field type or missing fields",
      400,
    );
  }

  const normalizedItems = items.map((item) => {
    const productId = item.productId;
    const quantity = Number(item.quantity);
    const price = Number(item.price);
    const discount =
      item.discount !== undefined ? Number(item.discount) : undefined;

    if (!productId || Number.isNaN(quantity) || Number.isNaN(price)) {
      throw new AppError(
        "You provide incorrect field type or missing fields",
        400,
      );
    }

    if (quantity < 1) {
      throw new AppError("Item quantity must be at least 1", 400);
    }

    return { productId, quantity, price, discount };
  });

  // Validate product ids exist
  const productIds = Array.from(
    new Set(normalizedItems.map((i) => i.productId)),
  );
  const existingProducts = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true },
  });
  if (existingProducts.length !== productIds.length) {
    throw new AppError("One or more product ids are invalid", 400);
  }

  const order = await prisma.order.create({
    data: {
      totalPrice,
      totalQuantity,
      totalDiscount: totalDiscount ?? 0,
      grandTotal,
      deliveryAddress: (productData as any).deliveryAddress,
      phone: (productData as any).phone,
      notes: (productData as any).notes ?? null,
      userId: user.id,
      status: OrderStatus.PLACED,
      items: {
        create: normalizedItems.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.price,
        })),
      },
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              image: true,
              providerId: true,
            },
          },
        },
      },
    },
  });

  return order;
};

const getAllOrdersByUserId = async (user: User) => {
  const orders = await prisma.order.findMany({
    where: {
      items: {
        some: {
          product: {
            providerId: user.id,
          },
        },
      },
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              image: true,
              providerId: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return orders;
};


const calculateOrderStatus = (itemStatuses: OrderItemStatus[]): OrderStatus => {
  // Map OrderItemStatus array to overall OrderStatus
  if (itemStatuses.every((s) => s === OrderItemStatus.CANCELLED)) return OrderStatus.CANCELLED;
  if (itemStatuses.every((s) => s === OrderItemStatus.DELIVERED)) return OrderStatus.DELIVERED;
  if (itemStatuses.some((s) => s === OrderItemStatus.DELIVERED)) return OrderStatus.PARTIALLY_DELIVERED;
  if (itemStatuses.some((s) => s === OrderItemStatus.CANCELLED)) return OrderStatus.PARTIALLY_CANCELLED;
  if (itemStatuses.every((s) => s === OrderItemStatus.SHIPPED)) return OrderStatus.SHIPPED;
  if (itemStatuses.some((s) => s === OrderItemStatus.SHIPPED)) return OrderStatus.PARTIALLY_SHIPPED;

  return OrderStatus.PLACED;
};

const updateOrderStatus = async (
  status: string,
  orderId: string,
  productId: string,
  user: User,
) => {
  // Validate incoming status
  if (!Object.values(OrderItemStatus).includes(status as OrderItemStatus)) {
    throw new AppError("Invalid status value", 400);
  }
  const newStatus = status as OrderItemStatus;

  // Allowed transitions map
  const allowedTransitions: Record<OrderItemStatus, OrderItemStatus[]> = {
    [OrderItemStatus.PLACED]: [OrderItemStatus.PROCESSING, OrderItemStatus.CANCELLED],
    [OrderItemStatus.PROCESSING]: [OrderItemStatus.SHIPPED, OrderItemStatus.CANCELLED],
    [OrderItemStatus.SHIPPED]: [OrderItemStatus.DELIVERED, OrderItemStatus.RETURNED],
    [OrderItemStatus.DELIVERED]: [],
    [OrderItemStatus.CANCELLED]: [],
    [OrderItemStatus.RETURNED]: [],
  };

  return await prisma.$transaction(async (tx) => {
    // Find order item and include product + order
    const orderItem = await tx.orderItem.findFirst({
      where: {
        orderId,
        productId,
      },
      include: {
        product: { select: { providerId: true } },
        order: { select: { userId: true } },
      },
    });

    if (!orderItem) {
      throw new AppError("Order or product not found", 404);
    }

    const role = (user as any).role as string;

    if (role === UserRole.PROVIDER && orderItem.product.providerId !== user.id) {
      throw new AppError("Forbidden: you don't manage this product", 403);
    }

    if (role === UserRole.CUSTOMER && orderItem.order.userId !== user.id) {
      throw new AppError("Forbidden: you don't own this order", 403);
    }

    // Prevent changing delivered/cancelled/returned items
    const currentStatus = orderItem.status as OrderItemStatus;
    if (
      currentStatus === OrderItemStatus.DELIVERED ||
      currentStatus === OrderItemStatus.CANCELLED ||
      currentStatus === OrderItemStatus.RETURNED
    ) {
      throw new AppError("This order item cannot be updated", 400);
    }

    // Validate transition
    if (orderItem.status !== newStatus) {
      const allowed = allowedTransitions[orderItem.status as OrderItemStatus] || [];
      if (!allowed.includes(newStatus)) {
        throw new AppError(`Status transition from ${orderItem.status} to ${newStatus} is not allowed`, 400);
      }
    }

    // Update the item status
    await tx.orderItem.update({
      where: { id: orderItem.id },
      data: { status: newStatus },
    });

    // Recalculate order status
    const updatedItems = await tx.orderItem.findMany({ where: { orderId }, select: { status: true } });
    const itemStatuses = updatedItems.map((i) => i.status as OrderItemStatus);
    const newOrderStatus = calculateOrderStatus(itemStatuses);

    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: { status: newOrderStatus },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return updatedOrder;
  });
};

export const orderService = {
  createOrder,
  getAllOrdersByUserId,
  updateOrderStatus,
};
