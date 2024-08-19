import mysql from 'mysql2/promise';

async function connect(){
    return await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        password: 'vip123',
        database: 'niceDatabase',
        user: 'root'
    })
}

export default {connect}