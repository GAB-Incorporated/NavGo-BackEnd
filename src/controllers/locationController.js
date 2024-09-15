import express from 'express';
import locationService from '../services/locationService.js';

const routes = express.Router();

routes.get('/', async (req, res) => {
    try {

        const locations = await locationService.getAllLocation();

        if (locations.length < 1) {
            return res.status(204).end();
        }

        res.status(200).json({ message: locations });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro interno ao buscar as localizações.'});
    }
});

routes.get('/:id', async (req, res) => {
    const locationId = parseInt(req.params.id, 10);

    try {

        const location = await locationService.getLocation(locationId);

        if (!location) {
            return res.status(404).json({ success: false, message: 'Localização não encontrada.' });
        }

        res.status(200).json({ success: true, message: location });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro interno ao buscar a localização.' });
    }
});

routes.post('/', async (req, res) => {
    const { campus, building_id, floor_number, location_type_id, location_name, description } = req.body;

    try {
      
        if (!campus || !building_id || !floor_number || !location_type_id || !location_name || !description) {
            return res.status(400).send({ success: false, message: 'Por favor, preencha todos os campos obrigatórios.' });
        }

        if (campus.length > 100) {
            return res.status(400).send({ success: false, message: 'O nome do campus não pode ter mais que 100 caracteres.' });
        }

        if(location_name.length > 50){

            return res.status(400).send({ success: false, message: 'O nome do local não pode conter mais que 50 caracteres.' })
        }

        if(description.length > 200){
            return res.status(400).send({ success: false, message: 'A descrição não pode conter mais que 200 caracteres.' });
        }

        const result = await locationService.createLocation(campus, building_id, floor_number, location_type_id, location_name, description);

        if (!result.success) {
            return res.status(400).send(result);
        }

        res.status(201).send({ success: true, message: result.message });
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Erro interno do servidor.', error: error.message });
    }
});

routes.put('/:id', async (req, res) => {
    const locationId = parseInt(req.params.id, 10);
    const { campus, building_id, floor_number, location_type_id, location_name, description } = req.body;

    try {

        if (!campus || !building_id || !floor_number || !location_type_id || !location_name || !description) {
            return res.status(400).send({ success: false, message: 'Por favor, preencha todos os campos obrigatórios.' });
        }

        if (campus.length > 100) {
            return res.status(400).send({ success: false, message: 'O nome do campus não pode ter mais que 100 caracteres.' });
        }

        if(location_name.length > 50){
            return res.status(400).send({ success: false, message: 'O nome do local não pode conter mais que 50 caracteres' })
        }

        if(description.length > 200){
            return res.status(400).send({ success: false, message: 'A descrição não pode conter mais que 200 caracteres.' });
        }
        
        const result = await locationService.updateLocation(locationId, campus, building_id, floor_number, location_type_id, location_name, description);

        if (!result.success) {
            return res.status(400).send({ message: result.message });
        }

        res.status(200).send({ success: true, message: result.message });

    } catch (error) {
        res.status(500).send({ success: false, message: 'Erro interno ao atualizar a localização.' });
    }
});


routes.delete('/:id', async (req, res) => {
    const locationId = parseInt(req.params.id, 10);

    try {

        const location = await locationService.getAllLocation(locationId);

        if (!location) {
            return res.status(404).send({ success: false, message: 'Localização não encontrada' });
        }

        const result = await locationService.deleteLocation(locationId);

        res.status(200).send({ success: true, message: result.message})

    } catch (error) {
        res.status(500).send({ success: false, message: 'Erro interno ao remover a localização.' });
    }
});

export default routes;