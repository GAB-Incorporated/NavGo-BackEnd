import mysql from 'mysql2/promise'

async function connect(){ 
    return await mysql.createConnection({ 
        host: 'localhost',
        port: 3306,
        password: 'navPassword',
        database: 'navgo_db',
        user: 'navUser'
    })
}

export default {connect} 