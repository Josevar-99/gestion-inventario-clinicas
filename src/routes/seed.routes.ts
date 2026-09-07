import { Router, Response, NextFunction } from "express";
import uploadJson from "../middlewares/uploadJson.middlewares.js";
import { uploadSeedData } from "../controllers/seed.controller.js";
import {verifyToken} from "../middlewares/auth.middleware.js"; // ajustar al export reall

const router = Router();

// TODO: adaptar según la forma real de req.user que setea tu auth.middleware.ts
const adminOnly = (req: any, res: Response, next: NextFunction) => {
  if (req.user?.rol_id !== 1) {
    return res
      .status(403)
      .json({ message: "Solo un administrador puede ejecutar esta acción" });
  }
  next();
};

router.post(
  "/upload",
  verifyToken,
  adminOnly,
  uploadJson.single("file"),
  uploadSeedData,
);

export default router;
