import database from '../repository/mySQL.js';

async function createCourse(courseName, moduleQnt, coordinatorId){
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
        
        const courseData = 'insert into courses (course_name, module_qnt, coordinator_id) values (?, ?, ?)';
        const dataCourse = [courseName, moduleQnt, coordinatorId];

        await conn.query(courseData, dataCourse); 
        return { success: true, message: `Curso ${courseName} criado com sucesso.`}
    } catch (error) {
        return { success: false, message: error.message }; 
    } finally {
        conn.end(); 
    }
}

async function listCourse(){
    const sql = "select * from courses";

    const conn = await database.connect();
    const [rows] = await conn.query(sql);
    conn.end();

    return rows;
}

async function updateCourse(courseId, courseName, moduleQnt, coordinatorId){
    const conn = await database.connect();

    try{
        const[existingCourses] = await conn.query('select course_id from courses where course_name = ? and course_id != ?', [courseName, courseId])

        if(existingCourses.length > 0) {
            return{ success: false, message:'Já existe um curso com esse nome.', data: existingCourses }
            
        }

        const sql = "update courses set course_name = ?, module_qnt = ?, coordinator_id = ? where course_id = ?"
        const dataCourse = [courseName, moduleQnt, coordinatorId, courseId];

        await conn.query(sql, dataCourse);
        return { success: true, message: `Curso ${courseName} atualizado com sucesso.` }
    } catch(error){
        return { success: false, message: error.message };
    } finally{
        conn.end();
    }
}

async function deleteCourse(idCourse, coordinatorId){
    const conn = await database.connect();

    try{
        const [rows] = await conn.query('select user_type from users where user_id = ?', [coordinatorId]);

        const {user_type} = rows[0];

        if(user_type != 'ADMINISTRATOR'){
            throw new Error('Somente coordenadores podem realizar essa ação.')
        }

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
            return {success: false, status: 404, message:'Usuário não encontrado.'};
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

export default {createCourse, listCourse, validateCoordinator, updateCourse, deleteCourse}