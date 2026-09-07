import { Request, Response } from "express";
import Clinic from "../models/clinic.model.js";

// CREATE CLINIC
export const createClinic = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { nit, name, responsable, city, address } = req.body;

    if (!nit || !name || !responsable || !city || !address) {
      return res.status(400).json({
        message:
          "Todos los campos son obligatorios (nit, name, responsable, city, address)",
      });
    }

    const existingClinic = await Clinic.findByPk(nit);
    if (existingClinic) {
      return res.status(400).json({
        message: "Ya existe una clínica registrada con este NIT",
      });
    }

    const newClinic = await Clinic.create({
      clinic_nit: nit,
      name,
      responsable,
      city,
      address,
    });

    return res.status(201).json({
      message: "Clínica creada con éxito",
      data: newClinic,
    });
  } catch (error: any) {
    console.error("DETALLE DEL ERROR AL CREAR CLÍNICA:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        error: "Ya existe una clínica con ese NIT único",
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

// GET ALL CLINICS
export const getClinics = async (
  _req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const clinics = await Clinic.findAll();
    return res.status(200).json({
      message: "Clínicas obtenidas con éxito",
      total: clinics.length,
      data: clinics,
    });
  } catch (error: any) {
    console.error("DETALLE DEL ERROR AL OBTENER CLÍNICAS:", error);
    return res.status(500).json({ error: error.message });
  }
};

// GET CLINIC BY NIT
export const getClinicByNit = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const  nit  = Number(req.params.nit);
    const clinic = await Clinic.findByPk(nit);

    if (!clinic) {
      return res.status(404).json({ message: "Clínica no encontrada" });
    }

    return res.status(200).json({
      message: "Clínica encontrada con éxito",
      data: clinic,
    });
  } catch (error: any) {
    console.error("DETALLE DEL ERROR AL BUSCAR CLÍNICA:", error);
    return res.status(500).json({ error: error.message });
  }
};

// UPDATE CLINIC
export const updateClinic = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const  nit  = Number(req.params.nit);
    const clinic = await Clinic.findByPk(nit);

    if (!clinic) {
      return res.status(404).json({ message: "Clínica no encontrada" });
    }

    const { responsable, city, address } = req.body;
    const updateData: any = {};

    if (responsable) updateData.responsable = responsable;
    if (city) updateData.city = city;
    if (address) updateData.address = address;

    await clinic.update(updateData);

    return res.status(200).json({
      message: "Clínica actualizada con éxito",
      data: clinic,
    });
  } catch (error: any) {
    console.error("DETALLE DEL ERROR AL ACTUALIZAR CLÍNICA:", error);

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Error de validación del modelo",
        details: error.errors?.map((e: any) => e.message),
      });
    }

    return res.status(400).json({ error: error.message });
  }
};

// DELETE CLINIC
export const deleteClinic = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const  nit  = Number(req.params.nit);
    const clinic = await Clinic.findByPk(nit);

    if (!clinic) {
      return res.status(404).json({ message: "Clínica no encontrada" });
    }

    await clinic.destroy();

    return res.status(200).json({
      message: "Clínica eliminada con éxito",
    });
  } catch (error: any) {
    console.error("DETALLE DEL ERROR AL ELIMINAR CLÍNICA:", error);
    return res.status(500).json({ error: error.message });
  }
};
