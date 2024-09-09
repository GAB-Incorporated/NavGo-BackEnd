import express from 'express';
import locationService from '../services/locationService.js';

const routes = express.Router();

routes.post('/', async (req, res) => {
    const { campus, building_id, floor_number, location_type_id, location_name, description } = req.body;

    try {
        if (!campus || !building_id || !floor_number || !location_type_id || !location_name || !description) {
            return res.status(400).send({ message: 'Por favor, preencha todos os campos obrigatórios.' });
        }

        if (campus.length > 100 || location_name.length > 50) {
            return res.status(400).send({ success: false, message: 'O nome do campus não pode ter mais que 100 caracteres e o nome do local não pode ter mais que 50 caracteres.' });
        }

        if(description.length > 200){
            return res.status(400).send({ success: false, message: 'A descrição não pode conter mais que 200 caracteres.'});
        }

        const createLocationRes = await locationService.createLocation(campus, building_id, floor_number, location_type_id, location_name, description);

        if (!createLocationRes.success) {
            return res.status(400).send(createLocationRes);
        }

        return res.status(201).send(createLocationRes);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Erro interno do servidor.', error: error.message });
    }
});

export default routes;
