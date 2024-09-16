import database from '../repository/mySQL.js';

async function createLocation(campus, building_id, floor_number, location_type_id, location_name, description){
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

        const locationData = 'INSERT INTO locations (campus, building_id, floor_number, location_type_id, location_name, description) VALUES (?, ?, ?, ?, ?, ?);';

        const dataLocation = [campus, building_id, floor_number, location_type_id, location_name, description];

        await conn.query(locationData, dataLocation);

        return { success: true, message: `Localização ${location_name} criada com sucesso.`}
        
    } catch (error) {
        return { success: false, message: error.message };
    } finally {
        conn.end();
    }

}

export default {createLocation}