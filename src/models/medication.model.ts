import { DataTypes, Model, Sequelize } from "sequelize";
import db from "../config/db.js"

class Medication extends Model {
    declare id:number;
    declare name:string;
    declare description:string;
}

Medication.init(
    {
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        name:{
            type:DataTypes.STRING(30),
            allowNull:false
        },
        description:{
            type:DataTypes.STRING,
            allowNull:true
        }

    },{
        sequelize:db
    }
)

export default Medication