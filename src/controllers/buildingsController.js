import express from 'express';
import service from '../services/buildingsService.js'

const routes = express.Router();

routes.post('/', async (req, res) => {
    const { building_name, description } = req.body;

    try {
        const building = await service.listBuildingByName(building_name);
        if (building){
            return res.status(400).send({message: 'Prédio já existe!'})
        }
        if (!building_name) {
            return response.status(400).send({ message: 'O prédio precisa de um nome!' });
        }
        if (!description) {
            return response.status(400).send({ message: 'O prédio precisa de uma descrição!' });
        }
        await service.createBuilding(building_name, description);
        return res.status(201).send({ message: 'Prédio criado com sucesso!' });
    } catch (err) {
        return res.status(400).send({ message: err.message });
    }
});

routes.get('/', async (req, res) => {
    try {
        const buildings = await service.listAllBuildings();
        return res.status(200).send(buildings);
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});

routes.get('/:building_id', async (req, res) => {
    const { building_id } = req.params;

    try {
        const building = await service.listOneBuilding(building_id);
        return res.status(200).send(building);
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});

routes.put('/:building_id', async (req, res) => {
    const { building_id } = req.params;
    const { building_name, description } = req.body;

    try {
        if (!building_name) {
            return response.status(400).send({ message: 'O prédio precisa de um nome!' });
        }
        if (!description) {
            return response.status(400).send({ message: 'O prédio precisa de uma descrição!' });
        }
        await service.updateBuilding(building_name, description, building_id);
        return res.status(200).send({ message: 'Prédio atualizado com sucesso!' });
    } catch (err) {
        return res.status(400).send({ message: err.message });
    }
});

routes.delete('/:building_id', async (req, res) => {
    const { building_id } = req.params;

    try {
        await service.deleteBuilding(building_id);
        return res.status(200).send({ message: 'Prédio excluído com sucesso!' });
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});

export default routes;
