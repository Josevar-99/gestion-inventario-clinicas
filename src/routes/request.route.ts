import { Router } from "express";
import {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  updateRequestStatus,
  deleteRequest,
  getRequestHistory,
} from "../controllers/request.controller.js";
import { validateRequestStatus } from "../middlewares/validateRequeststatus.middleware.js";
import { validateSufficientStock } from "../middlewares/request.middleware.js";
import { validateQuantityGreaterThanZero } from "../middlewares/validateQuantity.middleware.js";
import { verifyToken, verifyAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("",verifyToken, getRequests);
router.get("/history", verifyToken, verifyAdmin, getRequestHistory); // 👈 movido antes de "/:id"
router.get("/:id",verifyToken, getRequestById);

router.post("/", verifyToken, validateQuantityGreaterThanZero, createRequest);
router.put("/:id", verifyToken, validateQuantityGreaterThanZero, updateRequest);
router.delete("/:id", verifyToken, deleteRequest);

router.patch(
  "/:id/status",
  verifyToken,
  verifyAdmin,
  validateRequestStatus,
  validateSufficientStock,
  updateRequestStatus,
);

export default router;
