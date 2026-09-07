import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET || "default_secret";

export interface CustomRequest extends Request {
  user?: {
    id: number;
    email: string;
    rol_id: number;
    rol?: {
      name: string;
    };
    clinic_nit?: number | null;
    [key: string]: any;
  };
}

// 1. Middleware para verificar el Token JWT
export const verifyToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      message: "Acceso denegado. No se proporcionó token.",
    });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({
      message: "Token no proporcionado.",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Token inválido o expirado." });
  }
};

// 2. Middleware para validar los roles permitidos (comprobando el nombre del rol)
export const checkRole = (allowedRoles: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction): void => {
    // Buscamos el nombre del rol tanto en req.user.rol.name como en req.user.role por compatibilidad
    const userRole = req.user?.rol?.name || req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      res.status(403).json({
        message: "No tienes permisos suficientes para realizar esta acción.",
      });
      return;
    }

    next();
  };
};

// 3. Middleware simplificado específico para verificar si es Administrador
export const verifyAdmin = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): void => {
  const userRole = req.user?.rol?.name || req.user?.role;

  // Ajusta 'admin' al nombre exacto con el que guardas el rol de administrador en tu base de datos (ej. 'Administrador', 'admin')
  if (!userRole || userRole.toLowerCase() !== "admin") {
    res.status(403).json({
      message: "Acceso denegado. Se requieren privilegios de administrador.",
    });
    return;
  }

  next();
};
