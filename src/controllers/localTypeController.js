import express from "express";
import service from "../services/localTypeService.js";

const routes = express.Router();

routes.post('/', async (request, response) => {
    const {  } = request.body;
})

routes.get('/', async (request, response) => {

    try {
        const localTypes = await service.getAllSubjects();
    
        return response.status(200).json(localTypes);
        
    } catch (error) {
        return response.status(404).send({message: "Conteúdo não encontrada", error: error.message});
    }

})

routes.get('/all/:id', async (request, response) => {
    const { id } = request.params;
})

routes.delete('/', async (request, response) => {
    const {  } = request.body;
})

export default routes;
