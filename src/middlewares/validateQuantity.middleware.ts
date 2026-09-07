import { Request, Response, NextFunction } from "express";

// MIDDLEWARE PARA VALIDAR QUE LA CANTIDAD SEA OBLIGATORIA Y MAYOR A 0
export const validateQuantityGreaterThanZero = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { quantity_request } = req.body;

    // Validar si no viene, es null, undefined o una cadena vacía
    if (
      quantity_request === undefined ||
      quantity_request === null ||
      String(quantity_request).trim() === ""
    ) {
      return res.status(400).json({
        error: "La cantidad es obligatoria",
        message: "Debe proporcionar una cantidad de solicitud.",
      });
    }

    const quantity = Number(quantity_request);

    // Validar si no es un número válido o si es menor o igual a 0
    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({
        error: "Cantidad no válida",
        message: "La cantidad solicitada debe ser un número mayor a 0.",
      });
    }

    next();
  } catch (error: any) {
    console.error("ERROR EN EL MIDDLEWARE DE VALIDACIÓN DE CANTIDAD:", error);
    return res.status(500).json({ error: error.message });
  }
};
