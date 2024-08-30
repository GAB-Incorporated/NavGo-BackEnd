import express from 'express';
import service from '../services/subjectsService.js';

const routes = express.Router();

routes.post('/', async (request, response) => {
    const { subject_name } = request.body;

    try {
        if (!subject_name || subject_name.length < 1) {
            return response.status(400).send({ message: 'A matéria precisa de um nome!' });
        }

        if (subject_name.length > 100) {
            return response.status(400).send({ message: 'O nome da matéria não pode exceder 100 caracteres!' });
        }

        const existingSubject = await service.findSubjectByName(subject_name);
        if (existingSubject) {
            return response.status(409).send({ message: 'Uma matéria com esse nome já existe!' });
        }

        await service.createSubjects(subject_name);

        return response.status(201).send({
            message: 'Matéria cadastrada com sucesso!',
        });
    } catch (error) {
        console.error('Erro ao cadastrar matéria:', error);

        return response.status(500).send({
            message: 'Erro interno no servidor. Por favor, tente novamente mais tarde.',
            error: error.message,
        });
    }
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
    const { subject_name } = request.body;

    await service.updateSubject(id, subject_name );

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