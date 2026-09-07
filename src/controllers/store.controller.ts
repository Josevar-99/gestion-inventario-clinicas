import { Request, Response } from "express";
import Store from "../models/store.model.js";

// CREATE STORE
export const createStore = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { name, address, phone } = req.body;

    if (!name || !address || !phone) {
      return res.status(400).json({
        message: "Los campos name, address y phone son obligatorios",
      });
    }

    const newStore = await Store.create({ name, address, phone });

    return res.status(201).json({
      message: "Almacén creado con éxito",
      data: newStore,
    });
  } catch (error: any) {
    console.error("DETALLE DEL ERROR AL CREAR ALMACÉN:", error);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Error de validación del modelo",
        details: error.errors?.map((e: any) => e.message),
      });
    }
    return res.status(400).json({ error: error.message });
  }
};

// GET ALL STORES
export const getStores = async (
  _req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const stores = await Store.findAll();
    return res.status(200).json({
      message: "Almacenes obtenidos con éxito",
      total: stores.length,
      data: stores,
    });
  } catch (error: any) {
    console.error("DETALLE DEL ERROR AL OBTENER ALMACENES:", error);
    return res.status(500).json({ error: error.message });
  }
};

// GET STORE BY ID
export const getStoreById = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const storeId = Number(req.params.id);
    const store = await Store.findByPk(storeId);

    if (!store) {
      return res.status(404).json({ message: "Almacén no encontrado" });
    }

    return res.status(200).json({
      message: "Almacén encontrado con éxito",
      data: store,
    });
  } catch (error: any) {
    console.error("DETALLE DEL ERROR AL BUSCAR ALMACÉN:", error);
    return res.status(500).json({ error: error.message });
  }
};

// UPDATE STORE
export const updateStore = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const storeId = Number(req.params.id);
    const store = await Store.findByPk(storeId);

    if (!store) {
      return res.status(404).json({ message: "Almacén no encontrado" });
    }

    const { name, address, phone } = req.body;
    const updateData: any = {};

    if (name) updateData.name = name;
    if (address) updateData.address = address;
    if (phone) updateData.phone = phone;

    await store.update(updateData);

    return res.status(200).json({
      message: "Almacén actualizado con éxito",
      data: store,
    });
  } catch (error: any) {
    console.error("DETALLE DEL ERROR AL ACTUALIZAR ALMACÉN:", error);

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Error de validación del modelo",
        details: error.errors?.map((e: any) => e.message),
      });
    }

    return res.status(400).json({ error: error.message });
  }
};

// DELETE STORE
export const deleteStore = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const storeId = Number(req.params.id);
    const store = await Store.findByPk(storeId);

    if (!store) {
      return res.status(404).json({ message: "Almacén no encontrado" });
    }

    await store.destroy();

    return res.status(200).json({
      message: "Almacén eliminado con éxito",
    });
  } catch (error: any) {
    console.error("DETALLE DEL ERROR AL ELIMINAR ALMACÉN:", error);
    return res.status(500).json({ error: error.message });
  }
};
