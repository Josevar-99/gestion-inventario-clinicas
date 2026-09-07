import { Router } from "express";
import {
  createMedication,
  getMedications,
  getMedicationById,
  getMedicationWithStock,
  updateMedication,
  deleteMedication,
} from "../controllers/medication.controller.js";
import { verifyToken, verifyAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("", verifyToken, verifyAdmin, getMedications);
router.get("/:id", verifyToken, verifyAdmin, getMedicationById);
router.get(
  "/:id/stock",
  verifyToken,
  verifyAdmin,
  getMedicationWithStock,
);
router.post("", verifyToken, verifyAdmin, createMedication);
router.put("/:id", verifyToken, verifyAdmin, updateMedication);
router.delete("/:id", verifyToken, verifyAdmin, deleteMedication);

export default router;