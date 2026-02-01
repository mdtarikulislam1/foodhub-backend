import { Router } from "express";
import auth, { UserRole } from "../../middleware/auth";
import { productController } from "./product.controller";

const router = Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.PROVIDER),
  productController.createProduct,
);

router.get("/", productController.getAllProducts);

export const productRouter = router;
