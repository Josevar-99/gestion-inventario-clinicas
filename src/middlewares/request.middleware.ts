import { Request, Response, NextFunction } from "express";
import Inventory from "../models/inventory.model.js";
import RequestModel from "../models/request.model.js";

// MIDDLEWARE PARA VALIDAR STOCK ANTES DE COMPLETAR UNA SOLICITUD
export const validateSufficientStock = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { status } = req.body;

    // Solo validamos si la intención es cambiar el estado a "completed"
    if (status === "completed") {
      const requestId = Number(req.params.id);

      const request = await RequestModel.findByPk(requestId);
      if (!request) {
        return res.status(404).json({ message: "Solicitud no encontrada" });
      }

      // Si ya estaba completada, no es necesario volver a descontar ni validar
      if (request.status === "completed") {
        return next();
      }

      // Buscar el inventario correspondiente al almacén y medicamento de la solicitud
      const inventory = await Inventory.findOne({
        where: {
          id_store: request.id_store,
          id_medication: request.id_medication,
        },
      });

      if (!inventory) {
        return res.status(400).json({
          message:
            "Rechazado: El medicamento no está registrado en el inventario de este almacén.",
        });
      }

      // Verificar si el stock actual es menor al solicitado
      if (inventory.stock < request.quantity_request) {
        return res.status(400).json({
          message:
            "Rechazado: El almacén no cuenta con el stock suficiente para completar esta solicitud.",
          stockDisponible: inventory.stock,
          cantidadSolicitada: request.quantity_request,
        });
      }
    }

    // Si pasa la validación, continúa hacia el controlador
    next();
  } catch (error: any) {
    console.error("ERROR EN EL MIDDLEWARE DE VALIDACIÓN DE STOCK:", error);
    return res.status(500).json({ error: error.message });
  }
};
