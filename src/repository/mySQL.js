import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

async function connect(){ 
    return await mysql.createConnection({ 
        host: process.env.DB_URL,
        port: 3306,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    })
}

export default {connect}