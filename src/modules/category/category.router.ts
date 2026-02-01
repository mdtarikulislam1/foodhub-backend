import { Router } from "express";


import auth, { UserRole } from "../../middleware/auth";
import { categoryController } from "./category.controller";

const router = Router();

router.post("/", auth(UserRole.ADMIN,UserRole.PROVIDER), categoryController.createCategory);
router.get("/", auth(UserRole.ADMIN,UserRole.PROVIDER), categoryController.getAllCategories);

export const categoryRouter: Router = router;