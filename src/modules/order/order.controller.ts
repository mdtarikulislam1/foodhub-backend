import { Request, Response } from "express";
import catchAsync from "../../helper/catchAsync";
import AppError from "../../middleware/error/app.error";
import { orderService } from "./order.service";

// Create a new order
const createOrder = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const user = req.user;

  if (!user) {
    throw new AppError("Unauthorized", 401);
  }

  if (!data || !Array.isArray(data.items) || data.items.length === 0) {
    throw new AppError("Order must contain at least one item", 400);
  }

  const result = await orderService.createOrder(data, user);

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: result,
  });
});

// Get all orders for the authenticated user
const getOrdersByUserId = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    throw new AppError("Unauthorized", 401);
  }
  const result = await orderService.getAllOrdersByUserId(user);

  res.status(200).json({
    success: true,
    data: result,
  });
});


// Update order status
const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const status = req.params.status as string;
  const orderId = req.params.orderId as string;
  const productId = req.params.productId as string;
  const user = req.user;

  if (!user) {
    throw new AppError("Unauthorized", 401);
  }

  if (!status || !orderId || !productId) {
    throw new AppError("Missing parameters", 400);
  }

  const result = await orderService.updateOrderStatus(status, orderId, productId, user);

  res.status(200).json({
    success: true,
    message: "Order item status updated successfully",
    data: result,
  });
});

export const orderController = {
  createOrder,
  getOrdersByUserId,
  updateOrderStatus,
};
