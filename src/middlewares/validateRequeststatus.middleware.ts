import { Request, Response, NextFunction } from "express";

// MIDDLEWARE PARA VALIDAR ESTADOS PERMITIDOS Y QUE NO QUEDE EN BLANCO
export const validateRequestStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { status } = req.body;

    // Validar si no se envía, es null, undefined o una cadena vacía
    if (
      status === undefined ||
      status === null ||
      String(status).trim() === ""
    ) {
      return res.status(400).json({
        error: "El estado no puede estar en blanco",
        message: "Debe proporcionar un estado válido para la solicitud.",
      });
    }

    const allowedStatuses = ["pending", "completed", "cancel"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: "Estado no permitido",
        message: `El estado '${status}' no es válido. Los estados permitidos son: ${allowedStatuses.join(", ")}`,
      });
    }

    next();
  } catch (error: any) {
    console.error("ERROR EN EL MIDDLEWARE DE VALIDACIÓN DE ESTADO:", error);
    return res.status(500).json({ error: error.message });
  }
};
