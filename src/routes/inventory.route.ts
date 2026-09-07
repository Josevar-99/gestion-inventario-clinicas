import { Router } from "express";
import {
  createInventory,
  getInventories,
  getInventoryById,
  updateInventory,
  deleteInventory,
} from "../controllers/inventory.controller.js";
import { verifyToken, verifyAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("", verifyToken, verifyAdmin, getInventories);
router.get("/:id", verifyToken, verifyAdmin, getInventoryById);
router.post("", verifyToken, verifyAdmin, createInventory);
router.put("/:id", verifyToken, verifyAdmin, updateInventory);
router.delete("/:id", verifyToken, verifyAdmin, deleteInventory);

export default router