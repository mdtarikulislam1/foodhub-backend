import { Request, Response } from "express";
import catchAsync from "../../helper/catchAsync";
import AppError from "../../middleware/error/app.error";
import { CreateProduct } from "../../type/product.type";
import { User } from "../../type/user.type";
import { productService } from "./product.service";

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const user: User | undefined = req.user;
  if (!user) throw new AppError("Unauthorized", 401);

  const {
    name,
    categoryId,
    price,
    image,
    description,
    isActive,
    brandId,
    discount,
    diets,
  } = req.body;

  if (!name || !categoryId || !price || !image) {
    throw new AppError("name, categoryId, price and image are required", 400);
  }

  const data: CreateProduct = {
    name,
    categoryId,
    price,
    image,
    description: description ?? null,
    brandId: brandId ?? null,
    discount: discount ?? null,
    isActive: isActive ?? true,
    diets: Array.isArray(diets) ? (diets as string[]) : undefined,
  };

  const result = await productService.createProduct(data, user);

  res.status(201).json({
    status: "success",
    data: result,
  });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const searchProductByName = req.query.searchProductByName as
    | string
    | undefined;
  const categoryId = req.query.categoryId as string | undefined;
  const dietIds = req.query.dietIds as string | undefined;
  const priceMin =
    req.query.priceMin !== undefined ? Number(req.query.priceMin) : undefined;
  const priceMax =
    req.query.priceMax !== undefined ? Number(req.query.priceMax) : undefined;

  if (priceMin !== undefined && Number.isNaN(priceMin)) {
    throw new AppError("priceMin must be a valid number", 400);
  }
  if (priceMax !== undefined && Number.isNaN(priceMax)) {
    throw new AppError("priceMax must be a valid number", 400);
  }

  let priceRangeParam: { min?: number; max?: number } | undefined = undefined;
  if (priceMin !== undefined || priceMax !== undefined) {
    priceRangeParam = {};
    if (priceMin !== undefined) priceRangeParam.min = priceMin;
    if (priceMax !== undefined) priceRangeParam.max = priceMax;
  }

  const products = await productService.getAllProducts({
    searchProductByName,
    categoryId,
    dietIds: dietIds ? dietIds.split(",") : undefined,
    priceRange: priceRangeParam,
  });
  res.status(200).json({
    status: "success",
    data: products,
  });
});

export const productController = {
  createProduct,
  getAllProducts,
};
