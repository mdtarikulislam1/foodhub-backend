import { normalizeName } from "../../helper/normalize";
import { prisma } from "../../lib/prisma";
import AppError from "../../middleware/error/app.error";
import { CreateDiet } from "../../type/product.type";


// create a diet
const createDiet = async (data: CreateDiet,) => {
  const normalizedName = normalizeName(data.name);

  const slug = data.slug
    ? normalizeName(data.slug, true)
    : normalizeName(data.name, true);

  const existing = await prisma.diet.findFirst({
    where: {
      OR: [{ name: { equals: normalizedName, mode: "insensitive" } }, { slug }],
    },
  });

  if (existing) {
    throw new AppError(
      "You already have a diet with this name or slug",
      400,
    );
  }

  // create diet
  const category = await prisma.diet.create({
    data: {
      ...data,
      name: data.name.trim(),
      slug,
    },
  });

  return category;
};

// get all categories for a provider
const getAllDiets  = async () => {
  return prisma.diet.findMany();
};

export const dietService = {
  createDiet,
  getAllDiets,
};
