import { Request, Response } from "express";
import Medication from "../models/medication.model.js";
import Inventory from "../models/inventory.model.js";
import Store from "../models/store.model.js";

// CREATE MEDICATION
export const createMedication = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "El nombre del medicamento es obligatorio",
      });
    }

    const newMedication = await Medication.create({
      name,
      ...(description !== undefined ? { description } : {}),
    });

    return res.status(201).json({
      message: "Medicamento creado con éxito",
      data: newMedication,
    });
  } catch (error: any) {
    console.error("DETALLE DEL ERROR AL CREAR MEDICAMENTO:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        error: "Ya existe un medicamento con ese ID o nombre único",
        details: error.errors?.map((e: any) => e.message),
      });
    }
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Error de validación del modelo",
        details: error.errors?.map((e: any) => e.message),
      });
    }
    return res.status(400).json({ error: error.message });
  }
};

// GET ALL MEDICATIONS
export const getMedications = async (
  _req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const medications = await Medication.findAll();
    return res.status(200).json({
      message: "Medicamentos obtenidos con éxito",
      total: medications.length,
      data: medications,
    });
  } catch (error: any) {
    console.error("DETALLE DEL ERROR AL OBTENER MEDICAMENTOS:", error);
    return res.status(500).json({ error: error.message });
  }
};

// GET MEDICATION BY ID (Básico)
export const getMedicationById = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const medicationId = Number(req.params.id);
    const medication = await Medication.findByPk(medicationId);

    if (!medication) {
      return res.status(404).json({ message: "Medicamento no encontrado" });
    }

    return res.status(200).json({
      message: "Medicamento encontrado con éxito",
      data: medication,
    });
  } catch (error: any) {
    console.error("DETALLE DEL ERROR AL BUSCAR MEDICAMENTO:", error);
    return res.status(500).json({ error: error.message });
  }
};

// GET MEDICATION WITH STOCK BY ID (Con inventario y almacenes)
export const getMedicationWithStock = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const medicationId = Number(req.params.id);

    const medication = await Medication.findByPk(medicationId, {
      include: [
        {
          model: Inventory,
          as: "inventories",
          include: [
            {
              model: Store,
              as: "store",
            },
          ],
        },
      ],
    });

    if (!medication) {
      return res.status(404).json({ message: "Medicamento no encontrado" });
    }

    return res.status(200).json({
      message: "Medicamento e inventario obtenidos con éxito",
      data: medication,
    });
  } catch (error: any) {
    console.error("DETALLE DEL ERROR AL BUSCAR MEDICAMENTO CON STOCK:", error);
    return res.status(500).json({ error: error.message });
  }
};

// UPDATE MEDICATION
export const updateMedication = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const medicationId = Number(req.params.id);
    const medication = await Medication.findByPk(medicationId);

    if (!medication) {
      return res.status(404).json({ message: "Medicamento no encontrado" });
    }

    const { name, description } = req.body;
    const updateData: any = {};

    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    await medication.update(updateData);

    return res.status(200).json({
      message: "Medicamento actualizado con éxito",
      data: medication,
    });
  } catch (error: any) {
    console.error("DETALLE DEL ERROR AL ACTUALIZAR MEDICAMENTO:", error);

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Error de validación del modelo",
        details: error.errors?.map((e: any) => e.message),
      });
    }

    return res.status(400).json({ error: error.message });
  }
};

// DELETE MEDICATION
export const deleteMedication = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const medicationId = Number(req.params.id);
    const medication = await Medication.findByPk(medicationId);

    if (!medication) {
      return res.status(404).json({ message: "Medicamento no encontrado" });
    }

    await medication.destroy();

    return res.status(200).json({
      message: "Medicamento eliminado con éxito",
    });
  } catch (error: any) {
    console.error("DETALLE DEL ERROR AL ELIMINAR MEDICAMENTO:", error);
    return res.status(500).json({ error: error.message });
  }
};
