import { Model, DataTypes } from "sequelize";
import db from "../config/db.js";

class Request extends Model {
  declare id: number;
  declare id_user: number;
  declare id_store: number;
  declare id_medication: number;
  declare quantity_request: number;
  declare status: string;
}

Request.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    id_store: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_medication: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity_request: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "cancel"),
      defaultValue: "pending",
    },
  },
  {
    sequelize: db,
    tableName: "Requests",
  },
);

export default Request;
