import { normalizeName } from "../../helper/normalize";
import { prisma } from "../../lib/prisma";
import AppError from "../../middleware/error/app.error";
import { Category } from "../../type/categorytype";
import { User } from "../../type/user.type";

// create a category
const createCategory = async (data: Category, user: User) => {
  const normalizedName = normalizeName(data.name);

  const slug = data.slug
    ? normalizeName(data.slug, true)
    : normalizeName(data.name, true);

  const existing = await prisma.category.findFirst({
    where: {
      providerId: user.id,
      OR: [{ name: { equals: normalizedName, mode: "insensitive" } }, { slug }],
    },
  });

  if (existing) {
    throw new AppError(
      "You already have a category with this name or slug",
      400,
    );
  }

  // create category
  const category = await prisma.category.create({
    data: {
      ...data,
      providerId: user.id,
      name: data.name.trim(),
      slug,
    },
  });

  return category;
};

// get all categories for a provider
const getAllCategories = async (user: User) => {
  return prisma.category.findMany({
    where: {
      providerId: user.id,
    },
  });
};

export const categoryService = {
  createCategory,
  getAllCategories,
};
