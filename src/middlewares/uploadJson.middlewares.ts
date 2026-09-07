import multer from "multer";
import { Request } from "express";

const storage = multer.memoryStorage(); // no se guarda en disco, solo se parsea el JSON

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const isJson =
    file.mimetype === "application/json" ||
    file.originalname.toLowerCase().endsWith(".json");

  if (!isJson) {
    return cb(new Error("Solo se permiten archivos .json"));
  }
  cb(null, true);
};

const uploadJson = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default uploadJson;
