import User from "./user.model.js";
import Rol from "./rol.model.js";
import Clinic from "./clinic.model.js";
import Store from "./store.model.js";
import Medication from "./medication.model.js";
import Inventory from "./inventory.model.js";
import Request from "./request.model.js";

// --- ROL <-> USER ---
Rol.hasMany(User, { foreignKey: "rol_id", as: "users" });
User.belongsTo(Rol, { foreignKey: "rol_id", as: "rol" });

// --- CLINIC <-> USER ---
Clinic.hasMany(User, { foreignKey: "clinic_nit", as: "users" });
User.belongsTo(Clinic, { foreignKey: "clinic_nit", as: "clinic" });

// --- USER <-> REQUEST ---
User.hasMany(Request, { foreignKey: "id_user", as: "requests" });
Request.belongsTo(User, { foreignKey: "id_user", as: "user" });

// --- STORE <-> REQUEST ---
Store.hasMany(Request, { foreignKey: "id_store", as: "requests" });
Request.belongsTo(Store, { foreignKey: "id_store", as: "store" });

// --- MEDICATION <-> REQUEST ---
Medication.hasMany(Request, { foreignKey: "id_medication", as: "requests" });
Request.belongsTo(Medication, {
  foreignKey: "id_medication",
  as: "medication",
});

// --- STORE <-> INVENTORY ---
Store.hasMany(Inventory, { foreignKey: "id_store", as: "inventories" });
Inventory.belongsTo(Store, { foreignKey: "id_store", as: "store" });

// --- MEDICATION <-> INVENTORY ---
Medication.hasMany(Inventory, {
  foreignKey: "id_medication",
  as: "inventories",
});
Inventory.belongsTo(Medication, {
  foreignKey: "id_medication",
  as: "medication",
});

export { User, Rol, Clinic, Store, Medication, Inventory, Request };
