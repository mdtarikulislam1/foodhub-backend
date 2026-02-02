import { prisma } from "../../lib/prisma";
import { CreateProduct } from "../../type/product.type";
import { User } from "../../type/user.type";
import AppError from "../../middleware/error/app.error";

const createProduct = async (data: CreateProduct, user: User) => {
  const { diets, ...productData } = data;

  let dietIds: string[] = [];
  if (diets && diets.length > 0) {
    if (!Array.isArray(diets))
      throw new AppError("diets must be an array of ids", 400);
    const uniqueDietIds = Array.from(new Set(diets));
    const existingDiets = await prisma.diet.findMany({
      where: { id: { in: uniqueDietIds } },
      select: { id: true },
    });
    if (existingDiets.length !== uniqueDietIds.length) {
      throw new AppError("One or more diet ids are invalid", 400);
    }
    dietIds = uniqueDietIds;
  }

  const productWithDiets = await prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        ...productData,
        providerId: user.id,
      },
    });

    if (dietIds.length > 0) {
      await tx.productDiet.createMany({
        data: dietIds.map((dietId) => ({
          productId: product.id,
          dietId,
        })),
        skipDuplicates: true,
      });
    }

    const p = await tx.product.findUnique({
      where: { id: product.id },
      include: {
        category: { select: { id: true, name: true } },
        brand: { select: { id: true, name: true } },
        provider: { select: { id: true, name: true } },
        diets: {
          include: {
            diet: { select: { id: true, name: true } },
          },
        },
      },
    });

    return p;
  });

  return productWithDiets;
};

// options for getting products
interface GetProductsOptions {
  searchProductByName?: string | undefined;
  categoryId?: string | undefined;
  dietIds?: string[] | undefined;
  priceRange?: { min?: number; max?: number } | undefined;
}

const getAllProducts = async ({
  searchProductByName,
  categoryId,
  dietIds,
  priceRange,
}: GetProductsOptions) => {
  const whereCondition: any = {
    isActive: true,
  };

  if (categoryId) {
    whereCondition.categoryId = categoryId;
  }

  // Price range filtering
  if (priceRange) {
    const { min, max } = priceRange;
    if (min !== undefined && max !== undefined) {
      whereCondition.price = { gte: min, lte: max };
    } else if (min !== undefined) {
      whereCondition.price = { gte: min };
    } else if (max !== undefined) {
      whereCondition.price = { lte: max };
    }
  }

  if (dietIds && dietIds.length > 0) {
    const uniqueDietIds = Array.from(
      new Set(dietIds.map((id) => id.trim()).filter(Boolean)),
    );
    if (uniqueDietIds.length > 0) {
      whereCondition.AND = whereCondition.AND || [];
      uniqueDietIds.forEach((id) => {
        whereCondition.AND.push({ diets: { some: { dietId: id } } });
      });
    }
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
      category: { select: { id: true, name: true } },
      brand: { select: { id: true, name: true } },
      provider: { select: { id: true, name: true } },
      diets: {
        include: {
          diet: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: [
      { ordersCount: "desc" },
      { views: "desc" },
      { createdAt: "desc" },
    ],
  });

  // Map diets to simpler structure
  const formattedProducts = products.map((p) => ({
    ...p,
    diets: p.diets.map((d) => ({
      dietId: d.diet.id,
      name: d.diet.name,
    })),
  }));

  return formattedProducts;
};

export const productService = {
  createProduct,
  getAllProducts,
};
