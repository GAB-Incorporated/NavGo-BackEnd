import express from 'express';
import service from '../services/subjectsService.js';

const routes = express.Router();

// CREATE
routes.post('/', async (request,response) => {
    const {subject_name,module} = request.body;

    console.log(">>>>> Materia = ", subject_name)
    console.log(">>>>> modulo = ", module)
    await service.createSubjects(subject_name,module);

    return response.status(201).send({
        message: 'Materia cadastrada com sucesso!'
    })
});

// DELETE
routes.delete('/:idSubject', async (request, response) =>{
    const {idSubject} = request.params;

    console.log(">>>>>>> User Subject", idSubject)
    await service.deleteSubject(idSubject)
    return response.status(200).send({
        message: "Materia deletada com sucesso!"
    })
});

// UPDATE

routes.put('/:id', async (request, response) => {
    const { id } = request.params;
    const { subject_name, module } = request.body;

    console.log("Atualizando o subject_id =", id);
    console.log("Novo subject_name =", subject_name);
    console.log("Novo módulo =", module);

    await service.updateSubject(id, subject_name, module);

    return response.status(200).send({
        message: 'Materia atualizada com sucesso!'
    });
});

// LIST MATERIA ESPECIFICA 

// Rota para recuperar uma matéria específica pelo ID
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

// LIST

// Rota para recuperar todas as matérias
routes.get('/', async (request, response) => {
    const subjects = await service.getAllSubjects();
    
    return response.status(200).json(subjects);
});

export default routes;