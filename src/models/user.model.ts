import { DataTypes, Model } from "sequelize";
import db from "../config/db.js"



class User extends Model {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare rol_id: number;
  declare clinic_nit: number | null;
} 

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey: true,
      
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rol_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    clinic_nit: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize: db,
  },
);

export default User