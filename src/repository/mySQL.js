import dotenv from "dotenv";
import mysql from 'mysql2/promise'

dotenv.config();

console.log(process.env.DB_NAME);
console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);


async function connect(){ 
    return await mysql.createConnection({ 
        host: 'localhost',
        port: 3306,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    })
}

export default {connect}