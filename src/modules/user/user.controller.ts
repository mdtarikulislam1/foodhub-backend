import { Request, Response } from "express";
import { userService } from "./user.service";

const getAllUsers = async (req: Request, res: Response, next: Function) => {
  try {
    const result = await userService.getAllUsers();
    res
      .status(200)
      .json({ message: "Get all users", status: true, data: result });
  } catch (e) {
    next(e);
  }
};
export const userController = {
  getAllUsers,
};
