import { Router } from "express";
import {
  createClinic,
  getClinics,
  getClinicByNit,
  updateClinic,
  deleteClinic,
} from "../controllers/clinic.controller.js";
import { verifyToken, verifyAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("", verifyToken, verifyAdmin, getClinics);
router.get("/:nit", verifyToken, verifyAdmin, getClinicByNit);
router.post("", verifyToken, verifyAdmin, createClinic);
router.put("/:nit", verifyToken, verifyAdmin, updateClinic);
router.delete("/:nit", verifyToken, verifyAdmin, deleteClinic);

export default router