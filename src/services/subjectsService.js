import database from '../repository/mySQL.js';

async function createSubjects(subject_name, course_id) {
    const sql = "INSERT INTO subjects(subject_name, course_id) VALUES (?, ?)";
    const data = [subject_name, course_id];

    const conn = await database.connect();
    await conn.query(sql, data);
    conn.end();
}


async function deleteSubject(idSubject) {
    const sql = "UPDATE subjects SET soft_delete = 1 WHERE subject_id = ?";
    
    const conn = await database.connect();
    const [rows] = await conn.query(sql, [idSubject]); 
    conn.end();
    
    return rows; 
}

async function updateSubject(subject_id, subject_name, course_id) {
    const sql = "UPDATE subjects SET subject_name = ?, course_id = ? WHERE subject_id = ?";
    const data = [subject_name, course_id, subject_id];

    const conn = await database.connect();
    const [rows] = await conn.query(sql, data);
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