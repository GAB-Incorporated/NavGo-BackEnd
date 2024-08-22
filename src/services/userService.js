import database from '../repository/mySQL.js';
import crypto from 'crypto';
import jwt from '../middleware/jwt.js';

async function generateVerificationCode(user_id) {
    const code = crypto.randomBytes(4).toString('hex');
    const sql = 'INSERT INTO verification_codes (user_id, code) VALUES (?, ?)';
    
    const conn = await database.connect();
    await conn.query(sql, [user_id, code]);
    conn.end();
    
    return code;
}

async function createUser(first_name, last_name, nick_name, email, password_hash, user_type, photo_id, verification_code = null) {

    if (!user_type) {
        throw new Error("O tipo de usuário é obrigatório.");
    }

    const conn = await database.connect();
    try {
        if (user_type === "ADMINISTRATOR") {
            const sql = 'SELECT COUNT(*) as admin_count FROM users WHERE user_type = "ADMINISTRATOR"';
            const [adminResult] = await conn.query(sql);
            
            if (adminResult[0].admin_count === 0) {
                
                const sql = "INSERT INTO users (first_name, last_name, nick_name, email, password_hash, user_type, photo_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
                const dataUser = [first_name, last_name, nick_name, email, password_hash, user_type, photo_id];
                await conn.query(sql, dataUser);

                const [user] = await conn.query('SELECT LAST_INSERT_ID() as user_id');
                const user_id = user[0].user_id;
                const code = await generateVerificationCode(user_id);

            } else {
                if (!verification_code) {
                    throw new Error("Código de verificação é necessário para criar um administrador.");
                }

                const sql = 'SELECT * FROM verification_codes WHERE code = ?';
                const [result] = await conn.query(sql, [verification_code]);
                
                if (result.length === 0) {
                    throw new Error("Código de verificação inválido.");
                } else {
                    const sql = "INSERT INTO users (first_name, last_name, nick_name, email, password_hash, user_type, photo_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
                    const dataUser = [first_name, last_name, nick_name, email, password_hash, user_type, photo_id];
                    await conn.query(sql, dataUser);
                }
            }
        } else {
            const sql = "INSERT INTO users (first_name, last_name, nick_name, email, password_hash, user_type, photo_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
            const data = [first_name, last_name, nick_name, email, password_hash, user_type, photo_id];
            await conn.query(sql, data);
        }
    } catch (error) {
        throw error;
    } finally {
        conn.end();
    }
}

async function loginUser(email, password) {
    const conn = await database.connect();
    
    const sql = 'SELECT * FROM users WHERE email = ?';
    const [users] = await conn.query(sql, [email]);
    
    if (users.length === 0) {
        conn.end();
        throw new Error('Usuário não encontrado.');
    }
    
    const user = users[0];
    
    if (password != user.password_hash) {
        conn.end();
        throw new Error('Senha incorreta.');
    }

    const token = jwt.createTokenJWT({
        id_usuario: user.id_usuario,
        nome: user.first_name,
        email: user.email,
        user_type: user.user_type
    });
    
    conn.end();
    return { token };
}

export default { createUser, loginUser };
