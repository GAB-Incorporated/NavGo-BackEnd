import database from '../repository/mySQL.js';

//Função para criar novos cursos
async function createCourse(courseName, moduleQnt, coordinatorId){
    const conn = await database.connect();


    try{
        //Verifica se o usuário é um coordenador
        const [rows] = await conn.query('select user_type from users where user_id = ?', [coordinatorId]);
        
        if (rows.length === 0){
            throw new Error('Coordenador não encontrado'); //Lança um erro se o coordenador não for encontrado
        }
        
        const {user_type} = rows[0];
        
        if(user_type != 'ADMINISTRATOR'){
            throw new Error('Somente coordenadores podem criar cursos'); // Verifica se o usuário é um coordenador
        }

        //Verifica na base de dados se o curso que está tentando ser criado já não existe
        const [existingCourses] = await conn.query('select course_id from courses where course_name = ?', [courseName]);

        if(existingCourses.length > 0) {
            return { success: false, message:'Já existe um curso com esse nome.', data: existingCourses } // Retorna uma mensagem informando o erro
        }
        
        //Após passar por todas as tratavidas, insere um curso no banco
        const courseData = 'insert into courses (course_name, module_qnt, coordinator_id) values (?, ?, ?)';
        const dataCourse = [courseName, moduleQnt, coordinatorId];

        await conn.query(courseData, dataCourse); //Executa a query acima
        return { success: true, message: `Curso ${courseName} criado com sucesso.`}
    } catch (error) {
        return { success: false, message: error.message }; // Retorna a mensagem de erro em caso de falha
    } finally {
        conn.end(); // Encerra a conexão
    }
}

//Função para listar os cursos
async function listCourse(){
    const sql = "select * from courses";

    const conn = await database.connect();
    const [rows] = await conn.query(sql);
    conn.end();

    return rows;
}

//Função para atualizar um curso já existente
async function updateCourse(courseId, courseName, moduleQnt, coordinatorId){
    const conn = await database.connect();

    try{
        //Verifica se existe um curso com o mesmo nome
        const[existingCourses] = await conn.query('select course_id from courses where course_name = ? and course_id != ?', [courseName, courseId])

        if(existingCourses.length > 0) {
            return{ success: false, message:'Já existe um curso com esse nome.', data: existingCourses }
            
        }

        //Atualiza as informações do curso
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

//Função para executar soft_delete em um curso
async function deleteCourse(idCourse, coordinatorId){
    const conn = await database.connect();

    try{

        //Verifica se o usuário é um coordenador
        const [rows] = await conn.query('select user_type from users where user_id = ?', [coordinatorId]);

        const {user_type} = rows[0];

        if(user_type != 'ADMINISTRATOR'){
            throw new Error('Somente coordenadores podem realizar essa ação.')
        }

        //Marca o curso como excluído
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

//Função para validar se o usuário é um coordenador
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

        return { success: true }; //Retorna sucesso caso o usuário seja um coordenador
    } catch (error) {
        console.error('Erro na validação do coordenador:', error.message);
        return { success: false, status: 500, message: 'erro interno na validação do coordenador.'}
    } finally {
        conn.end();
    }
}

export default {createCourse, listCourse, validateCoordinator, updateCourse, deleteCourse}