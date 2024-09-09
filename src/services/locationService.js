import database from '../repository/mySQL.js';


async function checkBuildingExists(conn, building_id) {
    const [rows] = await conn.query('SELECT 1 FROM buildings WHERE building_id = ?', [building_id]);
    return rows.length > 0;
}

async function checkLocationTypeExists(conn, location_type_id) {
    const [rows] = await conn.query('SELECT 1 FROM location_types WHERE type_id = ?', [location_type_id]);
    return rows.length > 0;
}

async function createLocation(campus, building_id, floor_number, location_type_id, location_name, description){
    const conn = await database.connect();

    try {

        const buildingExists = await checkBuildingExists(conn, building_id);
        if (!buildingExists) {
            return { success: false, message: 'O prédio especificado não existe.' };
        }

        const locationTypeExists = await checkLocationTypeExists(conn, location_type_id);
        if (!locationTypeExists) {
            return { success: false, message: 'O tipo de localização especificado não existe.' };
        }

        const [existingLocations] = await conn.query(
            'SELECT location_id FROM locations WHERE location_name = ? AND building_id = ?;', [location_name, building_id],
        );

        if(existingLocations.length > 0) {
            return { success: false, message: 'Já existe uma localização com esse nome neste prédio.', data: existingLocations};
        }

        const locationData = `
            INSERT INTO locations (campus, building_id, floor_number, location_type_id, location_name, description) VALUES (?, ?, ?, ?, ?, ?);`;

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