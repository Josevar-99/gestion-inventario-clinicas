import { DataTypes, Model } from "sequelize";
import db from "../config/db.js";


class Rol extends Model {
  declare id: number;
  declare name: "gestor" | "admin";
}

Rol.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: {
      type: DataTypes.ENUM("gestor", "admin"),
      allowNull: false,
    },
  },
  {
    sequelize: db,
  },
);

export default Rol;
