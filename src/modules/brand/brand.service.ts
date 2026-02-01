import { prisma } from "../../lib/prisma";
import { CreateBrandPayload } from "../../type/createBrand.type";
import { User } from "../../type/user.type";
import { normalizeName } from "../../helper/normalize";
import AppError from "../../middleware/error/app.error";

// create a brand
const createBrand = async (data: CreateBrandPayload, user: User) => {
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
      "You already have a brand with this name or slug",
      400,
    );
  }

  const brand = await prisma.brand.create({
    data: {
      ...data,
      providerId: user.id,
      name: data.name.trim(),
      slug,
    },
  });

  return brand;
};

// get all brands for a provider
const getAllBrands = async (user: User) => {
  return prisma.brand.findMany({
    where: {
      providerId: user.id,
    },
  });
};

export const brandService = {
  createBrand,
  getAllBrands,
};
