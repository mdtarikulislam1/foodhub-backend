import { Router } from "express";
import auth, { UserRole } from "../../middleware/auth";
import { providerProfileController } from "./provider.controller";

const router = Router();

router.post(
  "/",
  auth(UserRole.PROVIDER, UserRole.ADMIN),
  providerProfileController.createProviderProfile,
);

router.get(
  "/",
  auth(UserRole.PROVIDER, UserRole.ADMIN),
  providerProfileController.getProviderProfile,
);

router.put(
  "/",
  auth(UserRole.PROVIDER, UserRole.ADMIN),
  providerProfileController.updateProviderProfile,
);

export const providerProfileRouter: Router = router;
