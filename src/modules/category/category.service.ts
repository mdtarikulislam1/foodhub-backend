import { normalizeName } from "../../helper/normalize";
import { prisma } from "../../lib/prisma";
import AppError from "../../middleware/error/app.error";
import { Category } from "../../type/product.type";

// create a category
const createCategory = async (data: Category) => {
  const normalizedName = normalizeName(data.name);

  const slug = data.slug
    ? normalizeName(data.slug, true)
    : normalizeName(data.name, true);

  const existing = await prisma.category.findFirst({
    where: {
      OR: [{ name: { equals: normalizedName, mode: "insensitive" } }, { slug }],
    },
  });

  if (existing) {
    throw new AppError(
      "You already have a category with this name or slug",
      400,
    );
  }

  const category = await prisma.category.create({
    data: {
      name: data.name.trim(),
      slug,
      image: data.image ?? null,
      description: data.description ?? null,
    },
  });

  return category;
};

// get all categories for a provider
const getAllCategories = async () => {
  return prisma.category.findMany();
};

export const categoryService = {
  createCategory,
  getAllCategories,
};
