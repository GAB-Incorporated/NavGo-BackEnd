import database from '../repository/mySQL.js';

// CREATE
async function createSubjects(subject_name, module){
    // Consulta SQL
    const typeSubjects = "INSERT INTO subjects(subject_name, module_id) VALUES (?,?)";

    const dataSubjects = [subject_name, module];

    // Conexão com o banco de dados
    const conn = await database.connect();

    // Execução da query com os dados
    await conn.query(typeSubjects, dataSubjects);

    // Encerramento da conexão
    conn.end();
}
// DELETE

async function deleteSubject(idSubject){

    const sql = "UPDATE subjects SET soft_delete=1 WHERE subject_id = ?";

    const conn = await database.connect();
    await conn.query(sql, [idSubject]);
    conn.end();
}

// UPDATE
async function updateSubject(subject_id, subject_name, module) {
    const sql = "UPDATE subjects SET subject_name = ?, module_id = ? WHERE subject_id = ?";
    const dataSubjects = [subject_name, module, subject_id];

    const conn = await database.connect();
    await conn.query(sql, dataSubjects);
    conn.end();
}

// LIST SPECIFIC SUBJECT

async function getSubject(subject_id) {
    const sql = "SELECT * FROM subjects WHERE subject_id = ?";
    const conn = await database.connect();
    const [rows] = await conn.query(sql, [subject_id]);
    conn.end();
    return rows[0];
}

// LIST ALL SUBJECTS

async function getAllSubjects(){
    const sql = "SELECT * FROM subjects WHERE soft_delete = 0";
    const conn = await database.connect();
    const [rows] = await conn.query(sql);
    conn.end();
    return rows;

}
export default {createSubjects, deleteSubject, updateSubject, getSubject, getAllSubjects};