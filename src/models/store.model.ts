import { Sequelize, Model, DataTypes } from "sequelize";
import db from '../config/db.js';
import { toUSVString } from "node:util";


class Store extends Model{
    declare id:number;
    declare name:string;
    declare adreess:string;
    declare phone:string;
}

Store.init(
    {
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        name:{
            type:DataTypes.STRING(40),
            allowNull:false
        },
        address:{
            type:DataTypes.STRING(50),
            allowNull:false
        },
        phone:{
            type:DataTypes.STRING(30),
            allowNull:false
        }
    },{
        sequelize:db
    }
)

export default Store