import { Router } from "express";
import {
  createStore,
  getStores,
  getStoreById,
  updateStore,
  deleteStore,
} from "../controllers/store.controller.js";
import { verifyToken, verifyAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", verifyToken, verifyAdmin, getStores);
router.get("/:id", verifyToken, verifyAdmin, getStoreById);
router.post("/", verifyToken, verifyAdmin, createStore);
router.put("/:id", verifyToken, verifyAdmin, updateStore);
router.delete("/:id", verifyToken, verifyAdmin, deleteStore);

export default router;
