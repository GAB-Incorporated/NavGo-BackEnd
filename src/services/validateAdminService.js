import database from '../repository/mySQL.js';

async function validateAdministrator(userId) {
    const sql = 'SELECT user_type FROM users WHERE user_id = ? AND soft_delete = 0';

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
        return { success: false, status: 500, message: 'Erro interno na validação do coordenador.'}
    } finally {
        conn.end();
    }
}

export default {validateAdministrator}
