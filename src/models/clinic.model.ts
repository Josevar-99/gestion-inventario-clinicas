import { DataTypes, DATE, Model } from "sequelize";
import db from "../config/db.js";

export class Clinic extends Model {
  declare clinic_nit: number;
  declare responsable: string;
  declare name: string;
  declare city: string;
  declare address: string;
}

Clinic.init(
  {
    clinic_nit: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    responsable: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    city: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    address: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
  },
  {
    sequelize: db,
  },
);

export default Clinic;
