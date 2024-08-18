import database from '../repository/mySQL.js';
import crypto from 'crypto';

//Função para gerar um código de verificação
async function generateVerificationCode(user_id) {
    const code = crypto.randomBytes(4).toString('hex');
    const sql = 'INSERT INTO verification_codes (user_id, code) VALUES (?, ?)';
    
    const conn = await database.connect();
    await conn.query(sql, [user_id, code]);
    conn.end();
    
    return code;
}

async function createUser(first_name, last_name, nick_name, email, password_hash, is_student, is_teacher, is_coordinator, photo_id, verification_code = null) {
    const conn = await database.connect();
    
    if (is_coordinator) {
        const sql = 'SELECT COUNT(*) as admin_count FROM users WHERE is_coordinator = true';
        const [adminResult] = await conn.query(sql);

        if (adminResult[0].admin_count === 0) {
            //Cria como adm se não houver nenhum adm prévio
            const insertUserSql = "INSERT INTO users (first_name, last_name, nick_name, email, password_hash, is_student, is_teacher, is_coordinator, photo_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            const dataUser = [first_name, last_name, nick_name, email, password_hash, is_student, is_teacher, is_coordinator, photo_id];
            await conn.query(insertUserSql, dataUser);

            //Se não houver nenhum administrador, gera um novo código de verificação
            const [user] = await conn.query('SELECT LAST_INSERT_ID() as user_id');
            const user_id = user[0].user_id;
            const code = await generateVerificationCode(user_id);

            console.log(`Código de verificação gerado: ${code}`);
        } else {
            //Se já houver administradores, valida o código de verificação gerado anteriormente
            if (!verification_code) {
                conn.end();
                throw new Error("Código de verificação é necessário para criar um administrador.");
            }

            const verifySql = 'SELECT * FROM verification_codes WHERE code = ?';
            const [result] = await conn.query(verifySql, [verification_code]);
            
            if (result.length === 0) {
                conn.end();
                throw new Error("Código de verificação inválido.");
            }
        }
    } else {
        //Criação de usuário normal
        const insertUserSql = "INSERT INTO users (first_name, last_name, nick_name, email, password_hash, is_student, is_teacher, is_coordinator, photo_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const dataUser = [first_name, last_name, nick_name, email, password_hash, is_student, is_teacher, is_coordinator, photo_id];
        await conn.query(insertUserSql, dataUser);
    }
    
    conn.end();
}

export default { createUser };
