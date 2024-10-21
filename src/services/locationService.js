import database from '../repository/mySQL.js';

async function createLocation(campus, building_id, floor_number, location_type_id, location_name, description, coordinates){
    const conn = await database.connect();

    try {

        const [existingBuilding] = await conn.query('SELECT 1 FROM buildings WHERE building_id = ? AND soft_delete = false;', [building_id]);

        if(existingBuilding.length === 0){
            return { success: false, message: 'O prédio especificado não existe.' };
        }

        const [existingLocationTypeId] = await conn.query('SELECT 1 FROM location_types WHERE type_id = ? AND soft_delete = false;', [location_type_id]);

        if(existingLocationTypeId.length === 0){
            return { success: false, message: 'O tipo de localização não existe.' };
        }

        const [existingLocations] = await conn.query('SELECT location_id FROM locations WHERE location_name = ? AND building_id = ? AND soft_delete = false;', [location_name, building_id]);

        if(existingLocations.length > 0) {
            return { success: false, message: 'Já existe uma localização com esse nome neste prédio.', data: existingLocations };
        }

        const locationData = 'INSERT INTO locations (campus, building_id, floor_number, location_type_id, location_name, description, coordinates) VALUES (?, ?, ?, ?, ?, ?, ?);';

        const dataLocation = [campus, building_id, floor_number, location_type_id, location_name, description, JSON.stringify(coordinates)];

        await conn.query(locationData, dataLocation);

        return { success: true, message: `Localização ${location_name} criada com sucesso.`}
        
    } catch (error) {
        return { success: false, message: error.message };
    } finally {
        conn.end();
    }
}

async function deleteLocation(location_id) {
    const conn = await database.connect();
    
    try {

        const sql = "UPDATE locations SET soft_delete = 1 WHERE location_id = ?";
        await conn.query(sql, [location_id]);
        return{ success: true, message: `Localização deletada com sucesso.`};
    } catch (error) {
        console.error("Erro ao deletar localização:", error);
        return {success: false, message:'Erro ao remover a localização'};
    } finally {
        conn.end();
    }
}

async function updateLocation(location_id, campus, building_id, floor_number, location_type_id, location_name, description, coordinates){
    const conn = await database.connect();

    try {
        
        const [existingBuilding] = await conn.query('SELECT 1 FROM buildings WHERE building_id = ? AND soft_delete = 0', [building_id]);

        if(existingBuilding.length === 0){
            return { success: false, message: 'O prédio especificado não existe.' };
        }

        const [existingLocationTypeId] = await conn.query('SELECT 1 FROM location_types WHERE type_id = ? AND soft_delete = 0', [location_type_id]);

        if(existingLocationTypeId.length === 0){
            return { success: false, message: 'O tipo de localização não existe.' };
        }

        const [existingLocations] = await conn.query('SELECT location_id FROM locations WHERE location_name = ? AND building_id = ? AND soft_delete = 0', [location_name, building_id]);

        if(existingLocations.length > 0) {
            return { success: false, message: 'Já existe uma localização com esse nome neste prédio.', data: existingLocations };
        }

        const locationData = 'UPDATE locations SET campus = ?, building_id = ?, floor_number = ?, location_type_id = ?, location_name = ?, description = ?, coordinates = ? WHERE location_id = ? AND soft_delete = 0';

        const dataLocation = [campus, building_id, floor_number, location_type_id, location_name, description, location_id];

        await conn.query(locationData, dataLocation);

        return { success: true, message: `Localização ${location_name} atualizada com sucesso.`}

    } catch (error) {
        return { success: false, message: error.message}
    } finally{
        conn.end()
    }
}

async function getLocation(location_id){
    const conn = await database.connect();

    try{
    
        const sql = `
            SELECT 
                l.location_id, 
                l.campus, 
                l.floor_number, 
                l.location_name, 
                l.description, 
                l.open_time, 
                l.closing_time, 
                l.soft_delete, 
                b.building_name
            FROM locations l
            JOIN buildings b ON l.building_id = b.building_id
            WHERE l.location_id = ? AND l.soft_delete = 0;
        `;        
        const [rows] = await conn.query(sql, [location_id]);
        
        if(rows.length > 0){
            return rows;
        } else{
            return { success: false, message: 'Nenhuma localização encontrada com esse ID.' }
        }
        
    } catch(error){
        return { success: false, message: error.message}
    } finally{
        conn.end();
    }
}

async function getAllLocationsWithCoordinates() {
    const conn = await database.connect();
    const sql = "SELECT location_id, location_name, coordinates FROM locations WHERE soft_delete = 0";
    const [rows] = await conn.query(sql);
    conn.end();
    return rows;
}


async function getAllLocation(){
    const conn = await database.connect();

    const sql = `
        SELECT 
            l.location_id, 
            l.campus, 
            l.floor_number, 
            l.location_name, 
            l.description, 
            l.open_time, 
            l.closing_time, 
            l.soft_delete,
            l.building_id,
            b.building_name
        FROM locations l
        JOIN buildings b ON l.building_id = b.building_id
        WHERE l.soft_delete = 0;
    `;    
    const [rows] = await conn.query(sql);
    conn.end();
    return rows;
}

export default {createLocation, deleteLocation, updateLocation, getLocation, getAllLocation, getAllLocationsWithCoordinates}
