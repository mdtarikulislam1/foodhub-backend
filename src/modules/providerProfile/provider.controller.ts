import { Request, Response } from "express";
import catchAsync from "../../helper/catchAsync";
import AppError from "../../middleware/error/app.error";
import { providerProfileService } from "./provider.service";
import { prisma } from "../../lib/prisma";

const createProviderProfile = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) throw new AppError("Unauthorized", 401);

    const existingProfile = await prisma.providerProfile.findFirst({
      where: {
        providerId: user.id,
      },
    });

    if (existingProfile) {
      throw new AppError("Provider profile already exists", 400);
    }

    const data = req.body;
    if (!data.name || !data.phone) {
      throw new AppError("Name and phone are required", 400);
    }

    const result = await providerProfileService.createProviderProfile(
      data,
      user,
    );

    res.status(201).json({
      status: true,
      message: "Provider profile created successfully",
      data: result,
    });
  },
);

const getProviderProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) throw new AppError("Unauthorized", 401);
  const profile = await providerProfileService.getProviderProfile(user);
  if (!profile) {
    throw new AppError("Provider profile not found", 404);
  }
  res.status(200).json({
    status: true,
    message: "Provider profile retrieved successfully",
    data: profile,
  });
});

const updateProviderProfile = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) throw new AppError("Unauthorized", 401);
    const data = req.body;

    const updatedProfile = await providerProfileService.updateProviderProfile(
      data,
      user,
    );
    res.status(200).json({
      status: true,
      message: "Provider profile updated successfully",
      data: updatedProfile,
    });
  },
);

export const providerProfileController = {
  createProviderProfile,
  getProviderProfile,
  updateProviderProfile,
};
