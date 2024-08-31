import database from '../repository/mySQL.js';

async function createSubjects(subject_name, module){

    const typeSubjects = "INSERT INTO subjects(subject_name) VALUES (?)";
    const dataSubjects = [subject_name, module];

    const conn = await database.connect();
    await conn.query(typeSubjects, dataSubjects);
    conn.end();
}

async function deleteSubject(idSubject){

    const sql = "UPDATE subjects SET soft_delete= 1 WHERE subject_id = ?";

    const conn = await database.connect();
    await conn.query(sql, [idSubject]);
    conn.end();
}

async function updateSubject(subject_id, subject_name) {
    const sql = "UPDATE subjects SET subject_name = ? WHERE subject_id = ?";
    const dataSubjects = [subject_name, subject_id];

    const conn = await database.connect();
    const [rows] = await conn.query(sql, dataSubjects);
    conn.end();
    return(rows);
}

async function getSubject(subject_id) {
    const sql = "SELECT * FROM subjects WHERE subject_id = ? and soft_delete = 0";

    const conn = await database.connect();
    const [rows] = await conn.query(sql, [subject_id]);
    conn.end();
    return rows[0];
}

async function getAllSubjects(){
    const sql = "SELECT * FROM subjects WHERE soft_delete = 0";

    const conn = await database.connect();
    const [rows] = await conn.query(sql);
    conn.end();
    return rows;

}

async function findSubjectByName(subject_name) {
    const sql = "SELECT * FROM subjects WHERE subject_name = ? AND soft_delete = 0";

    const conn = await database.connect();
    const [rows] = await conn.query(sql, [subject_name]);
    conn.end();
    return rows.length > 0 ? rows[0] : null;
}

export default {createSubjects, deleteSubject, updateSubject, getSubject, getAllSubjects, findSubjectByName};