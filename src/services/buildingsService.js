import database from '../repository/mySQL.js';

async function createBuilding(building_name, description) {
    const conn = await database.connect();

    try { 
        if (!building_name || typeof building_name !== 'string') {
            throw new Error('Nome do prédio é obrigatório e deve ser em texto');
        }

        const building = await listBuildingByName(building_name);
        
        if (building) {
            throw new Error('Esse prédio já existe');
        }

        const data = [building_name, description];
        const sql = 'INSERT INTO buildings (building_name, description) VALUES (?, ?)';
        await conn.query(sql, data);
    } catch (error) {
        throw new Error('Prédio não criado');
    } finally {
        conn.end();
    }
}

async function listAllBuildings() {
    const conn = await database.connect();

    try {
        const sql = 'SELECT * FROM buildings WHERE soft_delete = 0';
        const [rows] = await conn.query(sql);
        if (rows.length === 0) {
            throw new Error('Nenhum prédio encontrado');
        }
        return rows;
    } catch (error) {
        throw new Error('prédio não encontrado');
    } finally {
        conn.end();
    }
}

async function deleteBuilding(building_id) {
    const conn = await database.connect();

    try {
        const [building] = await listOneBuilding(building_id);
        if (building.length < 1){
            throw new Error('Prédio não encontrado para exclusão');
        }

        const sql = 'UPDATE buildings SET soft_delete = 1 WHERE building_id = ?';
        await conn.query(sql, building_id);
    } catch (error) {
        throw new Error('prédio não encontrado', error.message);
    } finally {
        conn.end();
    }
}

async function updateBuilding(building_name, description, building_id) {
    const conn = await database.connect();

    try {
        if (!building_name || typeof building_name !== 'string') {
            throw new Error('Nome do prédio é obrigatório e deve ser em texto');
        }
        const [building] = await listOneBuilding(building_id);
        if (building.length < 1){
            throw new Error('Prédio não encontrado para exclusão');
        }
        if (building.length >= 1){
            throw new Error('Esse prédio já existe')
        }
        const data = [building_name, description, building_id];
        const sql = 'UPDATE buildings SET building_name = ?, description = ? WHERE building_id = ? and soft_delete = 0';
        await conn.query(sql, data);
    } catch (error) {
        throw new Error('prédio não encontrado');
    } finally {
        conn.end();
    }
}

async function listOneBuilding(building_id) {
    const conn = await database.connect();

    try {
        const sql = 'SELECT * FROM buildings WHERE building_id = ? and soft_delete = 0';
        const [rows] = await conn.query(sql, building_id);
        if (rows.length === 0) {
            throw new Error('Nenhum prédio encontrado');
        }
        return rows;
    } catch (error) {
        throw new Error('prédio não encontrado');
    } finally {
        conn.end();
    }
}

async function listBuildingByName(building_name) {
    const conn = await database.connect();

    try {
        const sql = 'SELECT * FROM buildings WHERE building_name = ?';
        const [rows] = await conn.query(sql, building_name);
        return rows;
    } catch (error) {
        throw new Error('prédio não encontrado por nome');
    } finally {
        conn.end();
    }
}

export default { createBuilding, listAllBuildings, deleteBuilding, updateBuilding, listOneBuilding, listBuildingByName };
