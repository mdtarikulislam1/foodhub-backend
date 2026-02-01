import { prisma } from "../../lib/prisma";
import { CreateProduct } from "../../type/product.type";
import { User } from "../../type/user.type";

const createProduct = async (data: CreateProduct, user: User) => {
  const product = prisma.product.create({
    data: {
      ...data,
      providerId: user.id,
    },
  });
  return product;
};

interface GetProductsOptions {
  searchProductByName?: string | undefined;
  categoryId?: string | undefined;
}

const getAllProducts = async ({
  searchProductByName,
  categoryId,
}: GetProductsOptions) => {
  const whereCondition: any = {
    isActive: true,
  };

  if (categoryId) {
    whereCondition.categoryId = categoryId;
  }

  if (searchProductByName) {
    whereCondition.OR = [
      { name: { contains: searchProductByName, mode: "insensitive" } },
      { description: { contains: searchProductByName, mode: "insensitive" } },
      {
        brand: { name: { contains: searchProductByName, mode: "insensitive" } },
      },
      {
        category: {
          name: { contains: searchProductByName, mode: "insensitive" },
        },
      },
      {
        provider: {
          name: { contains: searchProductByName, mode: "insensitive" },
        },
      },
    ];
  }

  const products = await prisma.product.findMany({
    where: whereCondition,
    include: {
      category: { select: { name: true } },
      brand: { select: { id: true, name: true } },
      provider: { select: { id: true, name: true } },
    },
    orderBy: [
      { ordersCount: "desc" },
      { views: "desc" },
      { createdAt: "desc" },
    ],
  });

  return products;
};

export const productService = {
  createProduct,
  getAllProducts,
};
