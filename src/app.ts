import express from "express";
import cors from "cors";
import db from "./config/db.js";

// Importar el archivo de relaciones
import "./models/index.js";

// Importar rutas
import clinicRoutes from "./routes/clinic.routes.js";
import inventoryRoutes from "./routes/inventory.route.js";
import medicationRoutes from "./routes/medication.route.js";
import requestRoutes from "./routes/request.route.js";
import storeRoutes from "./routes/store.route.js";
import userRoutes from "./routes/user.route.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Registrar rutas
app.use("/api/clinics", clinicRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/medications", medicationRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/users", userRoutes);

// Ruta base de prueba
app.get("/", (req, res) => {
  res.json({ message: "API funcionando correctamente 🚀" });
});

const startServer = async () => {
  try {
    await db.authenticate();
    console.log("Conexión a la base de datos establecida exitosamente.");

    await db.sync({ alter: true });
    console.log("Modelos sincronizados con la base de datos.");

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error);
  }
};

startServer();

export default app;
