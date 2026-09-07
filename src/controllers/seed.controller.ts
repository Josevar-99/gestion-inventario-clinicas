import { Request as ExpressRequest, Response } from "express";
import bcrypt from "bcrypt";
import db from "../config/db.js";
import {
  Rol,
  Clinic,
  User,
  Store,
  Medication,
  Inventory,
  Request as RequestModel,
} from "../models/index.js";

interface SeedPayload {
  roles?: { id: number; name: string }[];
  clinics?: {
    clinic_nit: number;
    name: string;
    responsable: string;
    city: string;
    address: string;
  }[];
  users?: {
    id: number;
    name: string;
    email: string;
    password: string; // texto plano en el JSON, se hashea acá
    rol_id: number;
    clinic_nit?: number | null;
  }[];
  stores?: { id: number; name: string; address: string; phone: string }[];
  medications?: { id: number; name: string; description: string }[];
  inventory?: { id_store: number; id_medication: number; stock: number }[];
  requests?: {
    id_user: number;
    id_store: number;
    id_medication: number;
    quantity_request: number;
    status?: "pending" | "completed" | "cancel";
  }[];
}

export const uploadSeedData = async (
  req: ExpressRequest,
  res: Response,
): Promise<Response> => {
  if (!req.file) {
    return res.status(400).json({ message: "Debes subir un archivo .json" });
  }

  let payload: SeedPayload;
  try {
    payload = JSON.parse(req.file.buffer.toString("utf-8"));
  } catch {
    return res.status(400).json({ message: "El archivo no es un JSON válido" });
  }

  const summary = {
    roles: 0,
    clinics: 0,
    users: 0,
    stores: 0,
    medications: 0,
    inventory: 0,
    requests: 0,
  };

  const t = await db.transaction();

  try {
    // Orden respetando dependencias de FK, igual que en tu seed.ts
    if (payload.roles?.length) {
      for (const r of payload.roles) {
        const [, created] = await Rol.findOrCreate({
          where: { id: r.id },
          defaults: r,
          transaction: t,
        });
        if (created) summary.roles++;
      }
    }

    if (payload.clinics?.length) {
      for (const c of payload.clinics) {
        const [, created] = await Clinic.findOrCreate({
          where: { clinic_nit: c.clinic_nit },
          defaults: c,
          transaction: t,
        });
        if (created) summary.clinics++;
      }
    }

    if (payload.users?.length) {
      for (const u of payload.users) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        const [, created] = await User.findOrCreate({
          where: { id: u.id },
          defaults: { ...u, password: hashedPassword },
          transaction: t,
        });
        if (created) summary.users++;
      }
    }

    if (payload.stores?.length) {
      for (const s of payload.stores) {
        const [, created] = await Store.findOrCreate({
          where: { id: s.id },
          defaults: s,
          transaction: t,
        });
        if (created) summary.stores++;
      }
    }

    if (payload.medications?.length) {
      for (const m of payload.medications) {
        const [, created] = await Medication.findOrCreate({
          where: { id: m.id },
          defaults: m,
          transaction: t,
        });
        if (created) summary.medications++;
      }
    }

    if (payload.inventory?.length) {
      for (const i of payload.inventory) {
        const [, created] = await Inventory.findOrCreate({
          where: { id_store: i.id_store, id_medication: i.id_medication },
          defaults: i,
          transaction: t,
        });
        if (created) summary.inventory++;
      }
    }

    // Request no tiene una clave natural única -> se inserta siempre (es data de prueba)
    if (payload.requests?.length) {
      for (const r of payload.requests) {
        await RequestModel.create(
          { ...r, status: r.status ?? "pending" },
          { transaction: t },
        );
        summary.requests++;
      }
    }

    await t.commit();

    return res.status(201).json({
      message: "Datos de prueba cargados con éxito",
      summary,
    });
  } catch (error: any) {
    await t.rollback();
    console.error("DETALLE DEL ERROR AL CARGAR SEED:", error);

    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      return res.status(400).json({
        error: "Error de validación al insertar datos",
        details: error.errors?.map((e: any) => e.message),
      });
    }

    return res.status(400).json({ error: error.message });
  }
};
