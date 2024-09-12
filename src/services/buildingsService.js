import database from '../repository/mySQL.js';

// EM ANDAMENTO
async function createBuilding(building_name, description) {
    const conn = await database.connect();

    try {
        const data = [building_name, description];
        const sql = 'INSERT INTO buildings (building_name, description) VALUES (?, ?)';
        await conn.query(sql, data);
    } catch (error) {
        console.error('Error creating building:', error.message);
        throw new Error('Failed to create building');
    } finally {
        conn.end();
    }
}

// EM ANDAMENTO
async function listAllBuildings() {
    const conn = await database.connect();

    try {
        const sql = 'SELECT * FROM buildings';
        const [rows] = await conn.query(sql);
        return rows;
    } catch (error) {
        console.error('Error listing buildings:', error.message);
        throw new Error('Failed to list buildings');
    } finally {
        conn.end();
    }
}

// EM ANDAMENTO
async function deleteBuilding(building_id) {
    const conn = await database.connect();

    try {
        const sql = 'DELETE FROM buildings WHERE building_id = ?';
        await conn.query(sql, building_id);
    } catch (error) {
        console.error('Error deleting building:', error.message);
        throw new Error('Failed to delete building');
    } finally {
        conn.end();
    }
}

// EM ANDAMENTO
async function updateBuilding(building_name, description, building_id) {
    const conn = await database.connect();

    try {
        const data = [building_name, description, building_id];
        const sql = 'UPDATE buildings SET building_name = ?, description = ? WHERE building_id = ?';
        await conn.query(sql, data);
    } catch (error) {
        console.error('Error updating building:', error.message);
        throw new Error('Failed to update building');
    } finally {
        conn.end();
    }
}

// EM ANDAMENTO
async function getOneBuilding(building_id) {
    const conn = await database.connect();

    try {
        const sql = 'SELECT * FROM buildings WHERE building_id = ?';
        const [rows] = await conn.query(sql, building_id);
        return rows;
    } catch (error) {
        console.error('Error getting building:', error.message);
        throw new Error('Failed to get building');
    } finally {
        conn.end();
    }
}

// EM ANDAMENTO
async function findBuildingByName(building_name) {
    const conn = await database.connect();

    try {
        const sql = 'SELECT * FROM buildings WHERE building_name = ?';
        const [rows] = await conn.query(sql, building_name);
        return rows;
    } catch (error) {
        console.error('Error finding building by name:', error.message);
        throw new Error('Failed to find building by name');
    } finally {
        conn.end();
    }
}

export default { createBuilding, listAllBuildings, deleteBuilding, updateBuilding, getOneBuilding, findBuildingByName };
