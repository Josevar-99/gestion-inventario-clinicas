import { Model, DataTypes } from "sequelize";
import db from "../config/db.js";

class Inventory extends Model {
  declare id: number;
  declare id_medication: number;
  declare id_store: number;
  declare stock: number;
}

Inventory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_medication: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_store: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize: db,
  },
);

export default Inventory
