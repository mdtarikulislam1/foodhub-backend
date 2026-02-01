import { Router } from "express";
import { brandController } from "./brand.controller";

import auth, { UserRole } from "../../middleware/auth";

const router = Router();

router.post("/", auth(UserRole.ADMIN,UserRole.PROVIDER), brandController.createBrand);
router.get("/", auth(UserRole.ADMIN,UserRole.PROVIDER), brandController.getAllBrands);

export const brandRouter: Router = router;
