import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, Rol, Clinic } from "../models/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

// LOGIN

export const loginUser = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email y contraseña son requeridos" });
    }

    const user = await User.findOne({
      where: { email },
      include: [{ model: Rol, as: "rol" }],
    });

    if (!user) {
      return res.status(404).json({ message: "Credenciales inválidas" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        rol_id: user.rol_id,
        rol: (user as any).rol ? { name: (user as any).rol.name } : undefined,
        clinic_nit: user.clinic_nit,
      },
      JWT_SECRET,
      { expiresIn: "8h" },
    );

    return res.json({
      message: "Login exitoso",
      token,
    });
  } catch (error: any) {
    console.error("DETALLE DEL ERROR DE LOGIN:", error);
    return res.status(400).json({ error: error.message });
  }
};

// registro de Usuario

export const createUser = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { name, email, password, rol_id, clinic_nit } = req.body;

    // 1. Validar campos requeridos
    if (!name || !email || !password || !rol_id) {
      return res.status(400).json({
        message:
          "Faltan campos obligatorios para el registro del usuario (name, email, password, rol_id)",
      });
    }

    // 2. Validar que el Rol exista en la BD
    const rolExists = await Rol.findByPk(rol_id);
    if (!rolExists) {
      return res.status(404).json({
        error: `El rol con ID ${rol_id} no existe en la base de datos.`,
      });
    }

    // 3. Validar la Clínica solo si se envía clinic_nit
    if (clinic_nit) {
      const clinicExists = await Clinic.findByPk(clinic_nit);
      if (!clinicExists) {
        return res.status(404).json({
          error: `La clínica con NIT ${clinic_nit} no existe en la base de datos.`,
        });
      }
    }

    // 4. Hash de contraseña y creación del usuario
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      rol_id,
      clinic_nit: clinic_nit || null,
    });

    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      rol_id: newUser.rol_id,
      clinic_nit: newUser.clinic_nit,
    };

    return res.status(201).json({
      message: "Usuario registrado con éxito",
      data: userResponse,
    });
  } catch (error: any) {
    console.error("DETALLE DEL ERROR DE REGISTRO:", error);

    // Captura específica de violación de clave foránea en Sequelize
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        error: "Violación de restricción de clave foránea",
        detail:
          "El rol_id o clinic_nit especificado no existe en sus respectivas tablas.",
      });
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        error: "Ya existe un registro con ese correo electrónico único",
        details: error.errors?.map((e: any) => e.message),
      });
    }

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Error de validación del modelo",
        details: error.errors?.map((e: any) => e.message),
      });
    }

    return res.status(500).json({
      error: "Error interno del servidor",
      details: error.message,
    });
  }
};
// UPDATE
export const updateUser = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const id = req.params.id as string;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const { name, email, password, rol_id, clinic_nit } = req.body;

    const updateData: any = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (rol_id) updateData.rol_id = rol_id;
    if (clinic_nit !== undefined) updateData.clinic_nit = clinic_nit; // Permite asignar o limpiar la clínica con null

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    await user.update(updateData);

    return res.json({
      message: "Usuario actualizado con éxito",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        rol_id: user.rol_id,
        clinic_nit: user.clinic_nit,
      },
    });
  } catch (error: any) {
    console.error("DETALLE DEL ERROR DE ACTUALIZACIÓN:", error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        error: "Ya existe un registro con ese correo electrónico único",
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

// DELETE
export const deleteUser = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const id = req.params.id as string;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await user.destroy();
    return res.json({ message: "Usuario eliminado con éxito" });
  } catch (error: any) {
    console.error("DETALLE DEL ERROR DE ELIMINACIÓN:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const userController = {
  updateAvatar: async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "No se ha subido ningún archivo" });
      }

      // Aquí puedes guardar la ruta en tu base de datos usando Sequelize
      // Ej: const filePath = req.file.path;
      // await User.update({ avatar: filePath }, { where: { id: req.user.id } });

      return res.status(200).json({
        message: "Archivo subido exitosamente con Sequelize",
        file: req.file,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error al subir el archivo", error });
    }
  },
};
