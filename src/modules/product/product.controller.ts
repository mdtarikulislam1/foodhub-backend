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

  const products = await productService.getAllProducts({
    searchProductByName,
    categoryId,
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
