import express from "express";
import service from "../services/localTypeService.js";

const routes = express.Router();

routes.post('/', async (request, response) => {
    const { type_name, description } = request.body;
    try {

        const existingType = await service.findTypeByName(type_name);
        if (existingType) {
            return response.status(409).send({ message: 'Um local com esse nome já existe!' });
        }

        await service.createType(type_name, description);
        return response.status(201).send({message: "Tipo de local criado com sucesso"});

    } catch (error) {
        return response.status(400).send({message: "Não foi possível criar", error: error.message});
    }

})

routes.get('/:id', async (request, response) => {
    const { id } = request.params;

    if (!id) {
        return response.status(400).send({ message: "ID é necessário." });
    }

    try {
        const localType = await service.getOneType(id);

        if (!localType) {
            return response.status(404).send({ message: "Tipo de local não encontrado." });
        }

        return response.status(200).json(localType);
    } catch (error) {
        return response.status(500).send({ message: "Erro no servidor ao buscar tipo de local", error: error.message });
    }
})

routes.get('/', async (request, response) => {
    try {
        const localTypes = await service.getAllTypes();

        if (localTypes.length === 0) {
            return response.status(204).send({ message: "Nenhum tipo de local encontrado." });
        }

        return response.status(200).json(localTypes);
    } catch (error) {
        return response.status(500).send({ message: "Erro no servidor ao buscar tipos de local", error: error.message });
    }
});


routes.delete('/:id', async (request, response) => {
    const { id } = request.params;

    if (!id) {
        return response.status(400).send({ message: "ID é necessário." });
    }

    try {
        const localType = await service.getOneType(id);

        if (!localType) {
            return response.status(404).send({ message: "Tipo de local não encontrado ou já deletado." });
        }

        const deleteResult = await service.deleteType(id);

        if (deleteResult.affectedRows === 0) {
            return response.status(500).send({ message: "Falha ao deletar o tipo de local. Já está deletado." });
        }

        return response.status(200).send({ message: "Deletado com sucesso" });
    } catch (error) {
        return response.status(500).send({ message: "Delete os locais que usam esse tipo primeiro!", error: error.message });
    }
});

export default routes;
