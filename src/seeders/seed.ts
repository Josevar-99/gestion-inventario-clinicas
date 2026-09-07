import db from "../config/db.js";
import {
  Rol,
  User,
  Clinic,
  Store,
  Medication,
  Inventory,
  Request,
} from "../models/index.js";
import bcrypt from "bcrypt";

const runSeeders = async () => {
  try {
    await db.authenticate();
    console.log("📦 Conexión a PostgreSQL establecida.");

    // Resetea y crea las tablas con las relaciones
    await db.sync({ force: true });
    console.log("🔄 Tablas reseteadas y sincronizadas.");

    // 1. Roles
    console.log("🌱 Insertando roles...");
    await Rol.create({ id: 1, name: "admin" });
    await Rol.create({ id: 2, name: "gestor" });

    // 2. Clínicas
    console.log("🌱 Insertando clínicas...");
    await Clinic.create({
      clinic_nit: 900123456,
      name: "Clínica Central de Bogotá",
      responsable: "Dr. Carlos Ruiz",
      city: "Bogotá",
      address: "Calle 100 #15-20",
    });

    // 3. Usuarios
    console.log("🌱 Insertando usuarios...");
    const hashedPassword = await bcrypt.hash("Password123*", 10);

   await User.create({
     name: "Administrador General",
     email: "admin@sistema.com",
     password: hashedPassword,
     rol_id: 1,
     clinic_nit: null,
   });

   await User.create({
     name: "Juan Gestor",
     email: "juan.gestor@clinica.com",
     password: hashedPassword,
     rol_id: 2,
     clinic_nit: 900123456,
   });

   // ...

   await Store.create({
     name: "Almacén Principal Logística",
     address: "Zona Franca Bodega 4",
     phone: "3001234567",
   });

   // ...

   await Medication.create({
     name: "Paracetamol 500mg",
     description: "Analgésico y antipirético",
   });
    // 6. Inventario
    console.log("🌱 Insertando inventario...");
    await Inventory.create({
      id_medication: 1,
      id_store: 1,
      stock: 2500,
    });

    // 7. Solicitud (Request) vinculada al Gestor (id_user: 2)
    console.log("🌱 Insertando solicitudes de prueba...");
    await Request.create({
      id_user: 2, // 👈 la clínica se resuelve vía User.clinic_nit
      id_store: 1,
      id_medication: 1,
      quantity_request: 100,
      status: "pending",
    });
    
    console.log("✨ ¡Base de datos sembrada exitosamente!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al ejecutar el seeder:", error);
    process.exit(1);
  }
};

runSeeders();
