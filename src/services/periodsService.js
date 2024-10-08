import database from '../repository/mySQL.js';

async function createPeriod(start_hour, end_hour, day_time) {
    const conn = await database.connect();

    try {
        const [existingPeriods] = await conn.query('SELECT period_id FROM periods WHERE start_hour = ? AND end_hour = ? AND day_time = ? AND soft_delete = false;', 
        [start_hour, end_hour, day_time]);

        if (existingPeriods.length > 0) {
            return { message: 'Já existe um período com esses horários nesse dia.', data: existingPeriods };
        }

        const periodData = 'INSERT INTO periods (start_hour, end_hour, day_time) VALUES (?, ?, ?);';
        const dataPeriod = [start_hour, end_hour, day_time];

        await conn.query(periodData, dataPeriod);

        return { success: true, message: 'Período criado com sucesso.' };
    } catch (error) {
        return { message: error.message };
    } finally {
        conn.end();
    }
}

async function deletePeriod(period_id) {
    const conn = await database.connect();
    
    try {
        const sql = "UPDATE periods SET soft_delete = 1 WHERE period_id = ?";
        await conn.query(sql, [period_id]);
        return { success: true, message: 'Período deletado com sucesso.' };
    } catch (error) {
        console.error("Erro ao deletar período:", error);
        return { message: 'Erro ao remover o período.' };
    } finally {
        conn.end();
    }
}

async function updatePeriod(period_id, start_hour, end_hour, day_time) {
    const conn = await database.connect();

    try {
        const [existingPeriods] = await conn.query('SELECT period_id FROM periods WHERE start_hour = ? AND end_hour = ? AND day_time = ? AND period_id != ? AND soft_delete = false;', 
        [start_hour, end_hour, day_time, period_id]);

        if (existingPeriods.length > 0) {
            return { message: 'Já existe um período com esses horários nesse dia.', data: existingPeriods };
        }

        const periodData = 'UPDATE periods SET start_hour = ?, end_hour = ?, day_time = ? WHERE period_id = ? AND soft_delete = 0';
        const dataPeriod = [start_hour, end_hour, day_time, period_id];

        await conn.query(periodData, dataPeriod);

        return { success: true, message: 'Período atualizado com sucesso.' };
    } catch (error) {
        return { message: error.message };
    } finally {
        conn.end();
    }
}

async function getPeriod(period_id) {
    const conn = await database.connect();

    try {
        const sql = "SELECT * FROM periods WHERE period_id = ? AND soft_delete = 0";
        const [rows] = await conn.query(sql, [period_id]);
        
        if (rows.length > 0) {
            const period = rows[0]
            return period;
        } else {
            return { message: 'Nenhum período encontrado com esse ID.' };
        }
    } catch (error) {
        return { message: error.message };
    } finally {
        conn.end();
    }
}

async function getAllPeriods() {
    const conn = await database.connect();

    try {
        const sql = "SELECT * FROM periods WHERE soft_delete = 0";
        const [rows] = await conn.query(sql);
        return rows;
    } catch (error) {
        return { message: error.message };
    } finally {
        conn.end();
    }
}

export default { createPeriod, deletePeriod, updatePeriod, getPeriod, getAllPeriods };