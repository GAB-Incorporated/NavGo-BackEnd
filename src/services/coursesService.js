import database from '../repository/mySQL.js';

async function createCourse(courseName, coordinatorId){
    const conn = await database.connect();

    try{        
        const [rows] = await conn.query('select user_type from users where user_id = ?', [coordinatorId]);
        
        if (rows.length === 0){
            throw new Error('Coordenador não encontrado'); 
        }
        
        const {user_type} = rows[0];
        
        if(user_type != 'ADMINISTRATOR'){
            throw new Error('Somente coordenadores podem criar cursos'); 
        }

        const [existingCourses] = await conn.query('select course_id from courses where course_name = ?', [courseName]);

        if(existingCourses.length > 0) {
            return { success: false, message:'Já existe um curso com esse nome.', data: existingCourses } 
        }
        
        const courseData = 'insert into courses (course_name, coordinator_id) values (?, ?)';
        const dataCourse = [courseName, coordinatorId];
      
        await conn.query(courseData, dataCourse); 
        return { success: true, message: `Curso ${courseName} criado com sucesso.`}
    } catch (error) {
        return { success: false, message: error.message }; 
    } finally {
        conn.end(); 
    }
}

async function listCourse(){
    const sql = `
        SELECT 
            c.course_id, 
            c.course_name, 
            u.first_name AS coordinator_first_name, 
            u.last_name AS coordinator_last_name, 
            u.email AS coordinator_email
        FROM courses c
        JOIN users u ON c.coordinator_id = u.user_id
        WHERE c.soft_delete = false;
    `;

    const conn = await database.connect();

    try {
        const [rows] = await conn.query(sql);

        if (rows.length === 0){
            throw new Error('Não há cursos registrados'); 
        }

        return rows;

    } catch (error) {
        throw new Error(error)
    }
    conn.end();

}

async function updateCourse(courseId, courseName, coordinatorId){
    const conn = await database.connect();

    try{
        const[existingCourses] = await conn.query('select course_id from courses where course_name = ? and course_id != ?', [courseName, courseId])

        if(existingCourses.length > 0) {
            return{ success: false, message:'Já existe um curso com esse nome.', data: existingCourses }
            
        }

        const sql = "update courses set course_name = ?, coordinator_id = ? where course_id = ?"
        const dataCourse = [courseName, coordinatorId, courseId];

        await conn.query(sql, dataCourse);
        return { success: true, message: `Curso ${courseName} atualizado com sucesso.` }
    } catch(error){
        return { success: false, message: error.message };
    } finally{
        conn.end();
    }
}

async function deleteCourse(idCourse){
    const conn = await database.connect();

    try{

        const sql = 'update courses set soft_delete = 1 where course_id = ?'
        const dataCourse = [idCourse];

        await conn.query(sql, dataCourse);
        return{ success: true, message: `Curso deletado com sucesso.`};
    } catch(error){
        return { success: false, message: error.message };
    } finally{
        conn.end();
    }
}

async function validateCoordinator(userId) {
    const sql = 'SELECT user_type FROM users WHERE user_id = ?';

    const conn = await database.connect();
    try {
        const [rows] = await conn.query(sql, [userId]);

        if (rows.length === 0) {
            return {success: false, status: 404, message:'Coordenador não encontrado.'};
        }

        const {user_type} = rows[0];

        if(user_type != 'ADMINISTRATOR'){
            return {success: false, status: 403, message: 'Somente coordenadores podem realizar essa ação.'};
        }

        return { success: true };
    } catch (error) {
        return { success: false, status: 500, message: 'erro interno na validação do coordenador.'}
    } finally {
        conn.end();
    }
}

async function getCourseModule(courseId) {
    const sql = 'SELECT * FROM modules WHERE course_id = ?';

    const conn = await database.connect();

    try {
        const [rows] = await conn.query(sql, [courseId]);

        if (rows.length === 0) {
            throw new Error('Curso não possui módulos registrados');
        }

        return rows; 

    } catch (error) {
        throw new Error(error.message || "Erro ao buscar módulo");
    } finally {
        conn.end();
    }   
}

async function getTeachersByCourse(courseId) {
    const sql = `
        SELECT u.user_id, u.first_name, u.last_name, u.email, c.course_name
        FROM users u
        JOIN class_info ci ON u.user_id = ci.teacher_id
        JOIN courses c ON ci.course_id = c.course_id
        WHERE c.course_id = ? AND u.user_type = 'TEACHER';
    `;

    const conn = await database.connect();

    try {
        const [rows] = await conn.query(sql, [courseId]);

        if (rows.length === 0) {
            throw new Error('Nenhum professor atualmente com aulas nesse curso.');
        }

        return rows;
    } catch (error) {
        throw new Error(error.message || 'Erro ao buscar professores.');
    } finally {
        conn.end();
    }
}

export default {createCourse, listCourse, validateCoordinator, updateCourse, deleteCourse, getCourseModule, getTeachersByCourse}