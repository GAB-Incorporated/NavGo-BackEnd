import database from '../repository/mySQL.js';

const BUCKET_NAME = 'navgo-etec-bucket';

async function createClassInfo(subject_id, period_id, week_day, teacher_id, course_id, location_id) {
    const conn = await database.connect();

    try {
        const classDirectory = `class/${subject_id}/${course_id}/${new Date().getTime()}`;
        
        const sql = `INSERT INTO class_info 
                     (subject_id, period_id, week_day, teacher_id, course_id, location_id, bucket) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const data = [subject_id, period_id, week_day, teacher_id, course_id, location_id, classDirectory];

        await conn.query(sql, data);
        
        console.log(`Subdiretório ${classDirectory} criado para a turma no bucket ${BUCKET_NAME}.`);

    } catch (error) {
        throw new Error(error.message || 'Erro ao criar informações da aula');
    } finally {
        conn.end();
    }
}

async function listAllClasses() {
    const conn = await database.connect();

    try {
        const sql = 'SELECT * FROM class_info WHERE soft_delete = 0';
        const [rows] = await conn.query(sql);
        if (rows.length === 0) {
            throw new Error('Nenhuma aula encontrada');
        }
        return rows;
    } catch (error) {
        throw new Error('Erro ao listar aulas');
    } finally {
        conn.end();
    }
}

async function listOneClass(class_id) {
    const conn = await database.connect();

    try {
        const sql = 'SELECT * FROM class_info WHERE class_id = ? AND soft_delete = 0';
        const [rows] = await conn.query(sql, [class_id]);
        if (rows.length === 0) {
            throw new Error('Nenhuma aula encontrada');
        }
        return rows[0];
    } catch (error) {
        throw new Error('Erro ao buscar aula');
    } finally {
        conn.end();
    }
}

async function updateClassInfo(class_id, subject_id, period_id, week_day, teacher_id, course_id, location_id) {
    const conn = await database.connect();

    try {
        const sql = `UPDATE class_info 
                     SET subject_id = ?, period_id = ?, week_day = ?, teacher_id = ?, course_id = ?, location_id = ?
                     WHERE class_id = ? AND soft_delete = 0`;
        const data = [subject_id, period_id, week_day, teacher_id, course_id, location_id, class_id];
        await conn.query(sql, data);
    } catch (error) {
        throw new Error('Erro ao atualizar informações da aula');
    } finally {
        conn.end();
    }
}

async function deleteClass(class_id) {
    const conn = await database.connect();

    try {
        const sql = 'UPDATE class_info SET soft_delete = 1 WHERE class_id = ?';
        await conn.query(sql, [class_id]);
    } catch (error) {
        throw new Error('Erro ao excluir aula');
    } finally {
        conn.end();
    }
}

async function getClassesByStudent(userId) {
    const conn = await database.connect();

    try {
        const sql = `
            SELECT DISTINCT 
                ci.class_id, 
                sub.subject_name, 
                t.first_name AS first_name, 
                t.last_name AS last_name,
                ci.module_id, 
                l.location_name,
                l.description
            FROM 
                class_info ci
            JOIN 
                students s ON ci.course_id = s.course_id
            JOIN 
                subjects sub ON ci.subject_id = sub.subject_id
            JOIN 
                users t ON ci.teacher_id = t.user_id
            JOIN
                locations l ON ci.location_id = l.location_id 
            WHERE 
                s.user_id = ?
                AND ci.soft_delete = false
                AND s.soft_delete = false;
            `;

        const [rows] = await conn.query(sql, [userId]);

        if (rows.length === 0) {
            throw new Error('Nenhuma classe encontrada para este estudante.');
        }

        return rows;
    } catch (error) {
        throw new Error('Nenhuma classe encontrada para este estudante.');
    } finally {
        conn.end();
    }
}

export default { createClassInfo, listAllClasses, listOneClass, updateClassInfo, deleteClass, getClassesByStudent };
