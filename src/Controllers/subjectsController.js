import express from 'express';
import service from '../services/subjectsService.js';

const routes = express.Router();

routes.post('/', async (request,response) => {
    const {subject_name,module} = request.body;

    await service.createSubjects(subject_name,module);

    return response.status(201).send({
        message: 'Materia cadastrada com sucesso!'
    })
});

routes.delete('/:idSubject', async (request, response) =>{
    const {idSubject} = request.params;

    await service.deleteSubject(idSubject)
    return response.status(200).send({
        message: "Materia deletada com sucesso!"
    })
});

routes.put('/:id', async (request, response) => {
    const { id } = request.params;
    const { subject_name, module } = request.body;

    await service.updateSubject(id, subject_name, module);

    return response.status(200).send({
        message: 'Materia atualizada com sucesso!'
    });
});

routes.get('/:id', async (request, response) => {
    const { id } = request.params;
    const subject = await service.getSubject(id);
    
    if (!subject) {
        return response.status(404).send({
            message: 'Matéria não encontrada'
        });
    }

    return response.status(200).json(subject);
});

routes.get('/', async (request, response) => {
    const subjects = await service.getAllSubjects();
    
    return response.status(200).json(subjects);
});

export default routes;