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


const getAllProducts = async (searchProductByName?: string) => {
  const whereCondition: any = {
    isActive: true,
  };

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
      category: { select: { id: true, name: true } },
      brand: { select: { id: true, name: true } },
      provider: { select: { id: true, name: true } },
    },
  });

  return products;

  return products;
};

export const productService = {
  createProduct,
  getAllProducts,
};
