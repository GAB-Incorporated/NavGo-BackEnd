import database from "../repository/mySQL.js"

async function createType(){
    const sql = "INSERT into location_types(type_name, description) VALUES(?, ?)";

    const conn = await dabatase.connect();
    const [rows] = await conn.query(sql);
    conn.end();
    return rows;
}

async function deleteType(idType){
    const sql = "UPDATE location_types SET soft_delete= 1 WHERE location_id = ?";

    const conn = await database.connect();
    await conn.query(sql, idType);
    conn.end();
}

async function getAllTypes(){
    const sql = "SELECT * FROM location_types WHERE soft_delete = 0";

    const conn = await database.connect();
    const [rows] = await conn.query(sql);
    conn.end();
    return rows;
}

async function getOneType(idType){
    const sql = "SELECT * from location_types WHERE id= ? and soft_delete = 0"

    const conn = await database.connect();
    const [rows] = await conn.query(sql, idType);
    conn.end();
    return rows;
}

async function findSubjectByName(idType) {
    const sql = "SELECT * FROM location_types WHERE type_name = ? AND soft_delete = 0";

    const conn = await database.connect();
    const [rows] = await conn.query(sql, idType);
    conn.end();
    return rows.length > 0 ? rows[0] : null;
}

export default {createType, deleteType, getAllTypes, getOneType, findSubjectByName};