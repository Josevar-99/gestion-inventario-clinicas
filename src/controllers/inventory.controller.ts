import { Request, Response } from "express";
import Inventory from "../models/inventory.model.js";
import Medication from "../models/medication.model.js";
import Store from "../models/store.model.js";

// CREATE INVENTORY (Asignar medicamento a un almacén con stock inicial)
export const createInventory = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { id_medication, id_store, stock } = req.body;

    if (!id_medication || !id_store) {
      return res.status(400).json({
        message: "id_medication y id_store son obligatorios",
      });
    }

    // Verificar si ya existe este medicamento en este almacén
    const existingInventory = await Inventory.findOne({
      where: { id_medication, id_store },
    });

    if (existingInventory) {
      return res.status(400).json({
        message:
          "Este medicamento ya está registrado en este almacén. Use actualizar (PUT) para modificar el stock.",
      });
    }

    const newInventory = await Inventory.create({
      id_medication,
      id_store,
      stock: stock !== undefined ? stock : 0,
    });

    return res.status(201).json({
      message: "Inventario creado con éxito",
      data: newInventory,
    });
  } catch (error: any) {
    console.error("DETALLE DEL ERROR AL CREAR INVENTARIO:", error);

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Error de validación del modelo",
        details: error.errors?.map((e: any) => e.message),
      });
    }

    return res.status(400).json({ error: error.message });
  }
};

// GET ALL INVENTORIES
export const getInventories = async (
  _req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const inventories = await Inventory.findAll({
      include: [
        { model: Medication, as: "medication" },
        { model: Store, as: "store" },
      ],
    });

    return res.status(200).json({
      message: "Inventarios obtenidos con éxito",
      total: inventories.length,
      data: inventories,
    });
  } catch (error: any) {
    console.error("DETALLE DEL ERROR AL OBTENER INVENTARIOS:", error);
    return res.status(500).json({ error: error.message });
  }
};

// GET INVENTORY BY ID
export const getInventoryById = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    const inventory = await Inventory.findByPk(id, {
      include: [
        { model: Medication, as: "medication" },
        { model: Store, as: "store" },
      ],
    });

    if (!inventory) {
      return res
        .status(404)
        .json({ message: "Registro de inventario no encontrado" });
    }

    return res.status(200).json({
      message: "Inventario encontrado con éxito",
      data: inventory,
    });
  } catch (error: any) {
    console.error("DETALLE DEL ERROR AL BUSCAR INVENTARIO:", error);
    return res.status(500).json({ error: error.message });
  }
};

// UPDATE INVENTORY
export const updateInventory = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    const inventory = await Inventory.findByPk(id);

    if (!inventory) {
      return res
        .status(404)
        .json({ message: "Registro de inventario no encontrado" });
    }

    const { id_medication, id_store, stock } = req.body;
    const updateData: any = {};

    if (id_medication) updateData.id_medication = id_medication;
    if (id_store) updateData.id_store = id_store;
    if (stock !== undefined) updateData.stock = stock;

    await inventory.update(updateData);

    return res.status(200).json({
      message: "Inventario actualizado con éxito",
      data: inventory,
    });
  } catch (error: any) {
    console.error("DETALLE DEL ERROR AL ACTUALIZAR INVENTARIO:", error);

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Error de validación del modelo",
        details: error.errors?.map((e: any) => e.message),
      });
    }

    return res.status(400).json({ error: error.message });
  }
};

// DELETE INVENTORY
export const deleteInventory = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    const inventory = await Inventory.findByPk(id);

    if (!inventory) {
      return res
        .status(404)
        .json({ message: "Registro de inventario no encontrado" });
    }

    await inventory.destroy();

    return res.status(200).json({
      message: "Registro de inventario eliminado con éxito",
    });
  } catch (error: any) {
    console.error("DETALLE DEL ERROR AL ELIMINAR INVENTARIO:", error);
    return res.status(500).json({ error: error.message });
  }
};
