import { Router } from "express";
import {
  loginUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = Router();

// Endpoint público -> Ruta final: POST /api/users/login
router.post("/login", loginUser);

// Endpoints protegidos -> Rutas finales directas bajo /api/users
router.post("/", verifyToken, checkRole(["admin"]), createUser);
router.put("/:id", verifyToken, checkRole(["admin"]), updateUser);
router.delete("/:id", verifyToken, checkRole(["admin"]), deleteUser);

export default router;
