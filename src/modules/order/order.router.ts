import { Router } from "express";
import { orderController } from "./order.controller";
import auth, { UserRole } from "../../middleware/auth";


const router = Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER),
  orderController.createOrder,
);
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.PROVIDER),
  orderController.getOrdersByUserId,
);

// Update specific order item's status
router.patch(
  "/:orderId/items/:productId/status/:status",
  auth(UserRole.ADMIN, UserRole.PROVIDER, UserRole.CUSTOMER),
  orderController.updateOrderStatus,
);

export const orderRouter: Router = router;