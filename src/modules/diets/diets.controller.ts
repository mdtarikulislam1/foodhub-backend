import { Request, Response } from "express";
import catchAsync from "../../helper/catchAsync";
import { prisma } from "../../lib/prisma";
import { dietService } from "./diets.service";

const createDiet = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const diet = await dietService.createDiet(data);
  res.status(201).json({
    status: "success",
    data: {
      diet,
    },
  });
});

const getAllDiets = catchAsync(async (req: Request, res: Response) => {
  const diets = await dietService.getAllDiets();
  res.status(200).json({
    status: "success",
    results: diets.length,
    data: {
      diets,
    },
  });
});

export const dietController = {
  createDiet,
  getAllDiets,
};
