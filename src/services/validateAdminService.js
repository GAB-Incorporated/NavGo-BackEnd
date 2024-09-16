import database from '../repository/mySQL.js';

async function validateAdministrator(userId) {
    const sql = 'SELECT user_type FROM users WHERE user_id = ? AND soft_delete = 0';

    const conn = await database.connect();
    console.log(`Conectado ao banco para validar o administrador. ID: ${userId}`); // Log para verificar se a conexão foi bem-sucedida.

    try {
        const [rows] = await conn.query(sql, [userId]);
        console.log(`Resultado da consulta:`, rows); // Log do resultado da consulta

        if (rows.length === 0) {
            return {success: false, status: 404, message:'Usuário não encontrado.'};
        }

        const {user_type} = rows[0];

        if(user_type != 'ADMINISTRATOR'){
            return {success: false, status: 403, message: 'Somente coordenadores podem realizar essa ação.'};
        }

        return { success: true };
    } catch (error) {
        console.error(`Erro durante a validação do administrador: ${error.message}`);
        return { success: false, status: 500, message: 'Erro interno na validação do coordenador.'}
    } finally {
        conn.end();
    }
}

export default {validateAdministrator}