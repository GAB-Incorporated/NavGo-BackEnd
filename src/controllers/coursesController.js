import express from 'express';
import coursesService from '../services/coursesService.js';

const routes = express.Router();

routes.get('/', async (req, res) => {
    try {
        const courseData = await coursesService.listCourse();

        if (courseData.length < 1) {
            return res.status(204).end();
        }
        res.status(200).send({ message: courseData });

    } catch (error) {
        res.status(500).send('Erro interno.');
    }
});

routes.post('/', async (req, res) => {

    const {courseName, coordinatorId} = req.body;

    try {
        const isCoordinator = await coursesService.validateCoordinator(coordinatorId);
        
        if(!isCoordinator.success){
            return res.status(isCoordinator.status).send({ message: isCoordinator.message });
        }

        if(!courseName || courseName.length < 1){
            return res.status(400).send({ message: 'O nome do curso não pode ser nulo.'});
        }

        const createCourseRes = await coursesService.createCourse(courseName, coordinatorId);

        if(!createCourseRes.success){
            return res.status(400).send({ message: createCourseRes.message, data: createCourseRes.data }); 
        }
        res.status(201).send({message: createCourseRes.message });

    } catch (error) {
        res.status(500).send({message: 'Erro interno.'});
    }
});

routes.put('/', async (req, res) => {
    const {courseId, courseName, coordinatorId} = req.body;

    try {
        const isCoordinator = await coursesService.validateCoordinator(coordinatorId);

        if(!isCoordinator.success){
            return res.status(isCoordinator.status).send({ message: isCoordinator.message });
        }
        
        const result = await coursesService.updateCourse(courseId, courseName, coordinatorId);

        if(!result.success){
            return res.status(400).send({ message: result.message });
        }

        res.status(200).send({ message: result.message });

    } catch (error) {
        res.status(400).send({message: error.message});
    }
})

routes.put('/:idCourse', async (req, res) => {
    const courseId = parseInt(req.params.idCourse, 10); 
    const {coordinatorId} = req.body; 

    try {
        const isCoordinator = await coursesService.validateCoordinator(coordinatorId);
        
        if(!isCoordinator.success){
            return res.status(isCoordinator.status).send({ message: isCoordinator.message });
        }

        const result = await coursesService.deleteCourse(courseId, coordinatorId);

        if(!result.success){
            return res.status(400).send({ message: result.message });
        }

        res.status(200).send({ message: result.message });
    } catch (error) {
        res.status(500).send({ message: 'Erro ao deletar o curso.'});
    }
})

export default routes;
