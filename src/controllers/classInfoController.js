import express from 'express';
import service from '../services/classInfoService.js';

const routes = express.Router();

// Criar uma nova aula
routes.post('/', async (req, res) => {
    const { subject_id, period_id, week_day, teacher_id, course_id, location_id } = req.body;

    try {
        if (!subject_id || !period_id || !week_day || !teacher_id || !course_id || !location_id) {
            return res.status(400).send({ message: 'Todos os campos são obrigatórios!' });
        }

        await service.createClassInfo(subject_id, period_id, week_day, teacher_id, course_id, location_id);
        return res.status(201).send({ message: 'Aula criada com sucesso!' });

    } catch (err) {
        return res.status(400).send({ message: err.message });
    }
});

// Listar todas as aulas
routes.get('/', async (req, res) => {
    try {
        const classes = await service.listAllClasses();
        return res.status(200).send(classes);
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});

// Listar uma aula específica
routes.get('/:class_id', async (req, res) => {
    const { class_id } = req.params;

    try {
        const classInfo = await service.listOneClass(class_id);
        return res.status(200).send(classInfo);
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});

// Atualizar uma aula
routes.put('/:class_id', async (req, res) => {
    const { class_id } = req.params;
    const { subject_id, period_id, week_day, teacher_id, course_id, location_id } = req.body;

    try {
        if (!subject_id || !period_id || !week_day || !teacher_id || !course_id || !location_id) {
            return res.status(400).send({ message: 'Todos os campos são obrigatórios!' });
        }

        await service.updateClassInfo(class_id, subject_id, period_id, week_day, teacher_id, course_id, location_id);
        return res.status(200).send({ message: 'Aula atualizada com sucesso!' });
    } catch (err) {
        return res.status(400).send({ message: err.message });
    }
});

// Deletar uma aula
routes.delete('/:class_id', async (req, res) => {
    const { class_id } = req.params;

    try {
        await service.deleteClass(class_id);
        return res.status(200).send({ message: 'Aula excluída com sucesso!' });
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});

export default routes;
