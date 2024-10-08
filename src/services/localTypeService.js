import database from "../repository/mySQL.js"

async function createType(type_name, description){
    const sql = "INSERT into location_types(type_name, description) VALUES(?, ?)";

    const data = [type_name, description];

    const conn = await database.connect();
    await conn.query(sql, data);
    conn.end();
}

async function deleteType(id) {
    const sql = "UPDATE location_types SET soft_delete = true WHERE type_id = ?";

    const conn = await database.connect();
    const [rows] = await conn.query(sql, [id]);
    conn.end();
    return rows;
}

async function getAllTypes(){
    const sql = "SELECT * FROM location_types WHERE soft_delete = 0";

    const conn = await database.connect();
    const [rows] = await conn.query(sql);
    conn.end();
    return rows;
}

async function getOneType(id){
    const sql = "SELECT * from location_types WHERE type_id= ? and soft_delete = 0"

    const conn = await database.connect();
    const [rows] = await conn.query(sql, id);
    conn.end();
    return rows;
}

async function findTypeByName(id) {
    const sql = "SELECT * FROM location_types WHERE type_name = ? AND soft_delete = 0";

    const conn = await database.connect();
    const [rows] = await conn.query(sql, id);
    conn.end();
    return rows.length > 0 ? rows[0] : null;
}

export default {createType, deleteType, getAllTypes, getOneType, findTypeByName};