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
        id_usuario: user.user_id,
        nome: user.first_name,
        email: user.email,
        user_type: user.user_type
    });
    
    conn.end();
    return { token };
}

async function getCoordinators() {
    const conn = await database.connect();
    try {

        const getCoordinators = 'SELECT * FROM users WHERE user_type = "ADMINISTRATOR"'
        const [coordinators] = await conn.query(getCoordinators)

        if (coordinators.length === 0) {
            throw new Error("Não existem administradores cadastrados!")
        }

        return coordinators
    } catch (error) {
        console.log("Error Pegando Coordenadores: "+error)
    } finally {
        if (conn) {
            conn.end();
        }
    }
}

async function getUsers() {
    const conn = await database.connect();
    const sql = "select * from users where soft_delete = 0";

    try {

        const [users] = await conn.query(sql);

        if (users.length === 0) {
            throw new Error("Não existem usuários cadastrados!");
        }
        return users;
    } catch (error) {
        throw new Error(error);
    } finally {
        if (conn) {
            conn.end();
        }
    }
}

async function getOneUser(user_id) {
    const conn = await database.connect();
    const sql = "select * from users where soft_delete = 0 and user_id = ?";

    try {

        const [users] = await conn.query(sql, user_id);

        if (users.length === 0) {
            throw new Error("Usuário não encontrado");
        }
        return users[0];
    } catch (error) {
        throw new Error(error);
    } finally {
        if (conn) {
            conn.end();
        }
    }
}

async function createStudent(course_id, user_id, module_id) {
    const conn = await database.connect();
    const sql = "insert into students (course_id, user_id, module_id) values (?, ?, ?)";
    const data = [course_id, user_id, module_id];

    try {

        const [user] = await conn.query("select * from students where user_id = ?", user_id);

        if(user.length > 0) {
            throw new Error("Usuário já foi cadastrado como estudante");
        }
        await conn.query(sql, data);
    } catch (error) {
        throw new Error(error);
    } finally {
        if (conn) {
            conn.end();
        }
    }
}

async function getStudents() {
    const conn = await database.connect();
    const sql = `
    SELECT 
        s.student_id,
        u.first_name, u.last_name, u.nick_name, u.email,
        c.course_name,
        m.module_number
    FROM students s
    JOIN users u ON s.user_id = u.user_id
    JOIN courses c ON s.course_id = c.course_id
    JOIN modules m ON s.module_id = m.module_id
    WHERE s.soft_delete = 0
`;

try {
    const [students] = await conn.query(sql);

    return students;

} catch (error) {
    throw error;
} finally {
    if (conn) {
        conn.end();  
    }
}
}

async function getOneStudent(id) {
    const conn = await database.connect();
    const sql = `    
    SELECT 
        s.student_id,
        u.first_name, u.last_name, u.nick_name, u.email,
        c.course_name,
        m.module_number
    FROM students s
    JOIN users u ON s.user_id = u.user_id
    JOIN courses c ON s.course_id = c.course_id
    JOIN modules m ON s.module_id = m.module_id
    WHERE s.soft_delete = 0 and s.student_id = ?`;

    try {

        const [students] = await conn.query(sql, id);

        if (students.length === 0) {
            throw new Error("Usuário não encontrado");
        }
        return students[0];
    } catch (error) {
        throw new Error(error);
    } finally {
        if (conn) {
            conn.end();
        }
    }
}

async function verifyClass(userId, classId, user_type) {

    const conn = await database.connect();

    try {

        if(user_type == 'TEACHER'){

            const sql = "SELECT bucket FROM class_info WHERE class_id = ? AND teacher_id = ? AND soft_delete = false";

            const [rows] = await conn.query(sql, [classId, userId]);

            if (rows.length > 0) {
                return rows[0].bucket;
            } else {
                return null;
            }
            
        } else if (user_type === 'STUDENT') {
            const sqlStudent = `
                SELECT ci.bucket 
                FROM students s
                INNER JOIN class_info ci 
                    ON ci.course_id = s.course_id 
                WHERE s.user_id = ? 
                AND ci.class_id = ?
                AND s.soft_delete = false
                AND ci.soft_delete = false
            `;
            const [rows] = await conn.query(sqlStudent, [userId, classId]);
        
            return rows.length > 0 ? rows[0].bucket : null;
        } else {
            const [rows] = await conn.query("SELECT bucket FROM class_info WHERE class_id = ? AND soft_delete = false", [classId]);

            if (rows.length > 0) {
                return rows[0].bucket;
            } else {
                return null;
            }

        }
    } catch (error) {
        throw new Error(error.message);
    } finally {
        conn.end();
    }
}

export default { createUser, getCoordinators, loginUser, getUsers, getOneUser, createStudent, getStudents, getOneStudent, verifyClass };
