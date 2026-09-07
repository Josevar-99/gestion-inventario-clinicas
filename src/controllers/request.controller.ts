import { Response } from "express";
import { CustomRequest } from "../middlewares/auth.middleware.js";
import RequestModel from "../models/request.model.js";
import Inventory from "../models/inventory.model.js";
import Clinic from "../models/clinic.model.js";
import Store from "../models/store.model.js";
import Medication from "../models/medication.model.js";
import User from "../models/user.model.js";

const isAdmin = (req: CustomRequest): boolean =>
  (req.user?.rol?.name || "").toLowerCase() === "admin";

const requestIncludes = [
  {
    model: User,
    as: "user",
    attributes: ["id", "name", "email", "clinic_nit"],
    include: [{ model: Clinic, as: "clinic" }],
  },
  { model: Store, as: "store" },
  { model: Medication, as: "medication" },
];

// CREATE REQUEST
export const createRequest = async (
  req: CustomRequest,
  res: Response,
): Promise<Response> => {
  try {
    const { id_store, id_medication, quantity_request, id_user } = req.body;

    if (!id_store || !id_medication || !quantity_request || !id_user) {
      return res.status(400).json({
        message:
          "Todos los campos son obligatorios (id_store, id_medication, quantity_request, id_user)",
      });
    }

    const user = await User.findByPk(id_user);
    if (!user) {
      return res.status(404).json({ message: "El id del usuario no existe" });
    }
    if (!user.clinic_nit) {
      return res
        .status(400)
        .json({ message: "El usuario no tiene una clínica asignada" });
    }

    const store = await Store.findByPk(id_store);
    if (!store) {
      return res
        .status(404)
        .json({ message: "El almacén especificado no existe" });
    }

    const medication = await Medication.findByPk(id_medication);
    if (!medication) {
      return res
        .status(404)
        .json({ message: "El medicamento especificado no existe" });
    }

    const newRequest = await RequestModel.create({
      id_store,
      id_medication,
      quantity_request,
      status: "pending",
      id_user,
    });

    return res.status(201).json({
      message: "Solicitud creada con éxito en estado pendiente",
      data: newRequest,
    });
  } catch (error: any) {
    console.error("DETALLE DEL ERROR AL CREAR SOLICITUD:", error);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Error de validación del modelo",
        details: error.errors?.map((e: any) => e.message),
      });
    }
    return res.status(400).json({ error: error.message });
  }
};

// GET ALL REQUESTS (admin ve todas; usuario normal solo las de su clínica)
export const getRequests = async (
  req: CustomRequest,
  res: Response,
): Promise<Response> => {
  try {
    let includes: any = requestIncludes;

    if (!isAdmin(req)) {
      const clinicNit = req.user?.clinic_nit;
      if (!clinicNit) {
        return res.status(403).json({
          message: "Tu usuario no tiene una clínica asignada",
        });
      }

      // where dentro del include filtra el JOIN por la clínica del usuario logueado
      includes = [
        {
          ...requestIncludes[0],
          where: { clinic_nit: clinicNit },
        },
        requestIncludes[1],
        requestIncludes[2],
      ];
    }

    const requests = await RequestModel.findAll({ include: includes });

    return res.status(200).json({
      message: "Solicitudes obtenidas con éxito",
      total: requests.length,
      data: requests,
    });
  } catch (error: any) {
    console.error("DETALLE DEL ERROR AL OBTENER SOLICITUDES:", error);
    return res.status(500).json({ error: error.message });
  }
};

// GET REQUEST BY ID (admin ve cualquiera; usuario normal solo si es de su clínica)
export const getRequestById = async (
  req: CustomRequest,
  res: Response,
): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    const request: any = await RequestModel.findByPk(id, {
      include: requestIncludes,
    });

    if (!request) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    if (!isAdmin(req) && request.user?.clinic_nit !== req.user?.clinic_nit) {
      return res.status(403).json({
        message: "No tienes permiso para ver solicitudes de otra clínica",
      });
    }

    return res.status(200).json({
      message: "Solicitud encontrada con éxito",
      data: request,
    });
  } catch (error: any) {
    console.error("DETALLE DEL ERROR AL BUSCAR SOLICITUD:", error);
    return res.status(500).json({ error: error.message });
  }
};


// UPDATE REQUEST
export const updateRequest = async (
  req: CustomRequest,
  res: Response,
): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    const request: any = await RequestModel.findByPk(id, {
      include: [{ model: User, as: "user", attributes: ["id", "clinic_nit"] }],
    });

    if (!request) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    if (!isAdmin(req) && request.user?.clinic_nit !== req.user?.clinic_nit) {
      return res.status(403).json({
        message: "No tienes permiso para modificar solicitudes de otra clínica",
      });
    }

    const { quantity_request } = req.body;
    const updateData: any = {};

    if (quantity_request !== undefined) {
      updateData.quantity_request = quantity_request;
    }

    await request.update(updateData);

    return res.status(200).json({
      message: "Solicitud actualizada con éxito",
      data: request,
    });
  } catch (error: any) {
    console.error("DETALLE DEL ERROR AL ACTUALIZAR SOLICITUD:", error);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Error de validación del modelo",
        details: error.errors?.map((e: any) => e.message),
      });
    }
    return res.status(400).json({ error: error.message });
  }
};

// UPDATE REQUEST STATUS
export const updateRequestStatus = async (
  req: CustomRequest,
  res: Response,
): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    const request = await RequestModel.findByPk(id);

    if (!request) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    const { status } = req.body;
    const validStatuses = ["pending", "completed", "cancel"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Estado no válido. Los estados permitidos son: ${validStatuses.join(", ")}`,
      });
    }

    if (request.status === status) {
      return res.status(400).json({
        message: `La solicitud ya se encuentra en estado '${status}'`,
      });
    }

    if (status === "completed") {
      const inventory = await Inventory.findOne({
        where: {
          id_store: request.id_store,
          id_medication: request.id_medication,
        },
      });

      if (!inventory) {
        return res.status(400).json({
          message:
            "No se puede completar: el medicamento no está registrado en el inventario de este almacén.",
        });
      }

      if (inventory.stock < request.quantity_request) {
        return res.status(400).json({
          message: `Stock insuficiente en almacén. Disponible: ${inventory.stock}, Solicitado: ${request.quantity_request}`,
        });
      }

      inventory.stock -= request.quantity_request;
      await inventory.save();
    } else if (
      request.status === "completed" &&
      (status === "cancel" || status === "pending")
    ) {
      const inventory = await Inventory.findOne({
        where: {
          id_store: request.id_store,
          id_medication: request.id_medication,
        },
      });

      if (inventory) {
        inventory.stock += request.quantity_request;
        await inventory.save();
      }
    }

    request.status = status;
    await request.save();

    return res.status(200).json({
      message: `Estado de la solicitud actualizado a '${status}' con éxito`,
      data: request,
    });
  } catch (error: any) {
    console.error("DETALLE DEL ERROR AL CAMBIAR ESTADO DE SOLICITUD:", error);
    return res.status(400).json({ error: error.message });
  }
};

// DELETE REQUEST
export const deleteRequest = async (
  req: CustomRequest,
  res: Response,
): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    const request: any = await RequestModel.findByPk(id, {
      include: [{ model: User, as: "user", attributes: ["id", "clinic_nit"] }],
    });

    if (!request) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    if (!isAdmin(req) && request.user?.clinic_nit !== req.user?.clinic_nit) {
      return res.status(403).json({
        message: "No tienes permiso para eliminar solicitudes de otra clínica",
      });
    }

    await request.destroy();

    return res.status(200).json({ message: "Solicitud eliminada con éxito" });
  } catch (error: any) {
    console.error("DETALLE DEL ERROR AL ELIMINAR SOLICITUD:", error);
    return res.status(500).json({ error: error.message });
  }
};

// GET REQUEST HISTORY (solo admin, siempre todas)
export const getRequestHistory = async (
  _req: CustomRequest,
  res: Response,
): Promise<Response> => {
  try {
    const requests = await RequestModel.findAll({
      include: requestIncludes,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      message: "Historial completo de solicitudes obtenido con éxito",
      total: requests.length,
      data: requests,
    });
  } catch (error: any) {
    console.error(
      "DETALLE DEL ERROR AL OBTENER HISTORIAL DE SOLICITUDES:",
      error,
    );
    return res.status(500).json({ error: error.message });
  }
};
