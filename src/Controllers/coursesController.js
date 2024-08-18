import express from 'express';
import coursesService from '../Services/coursesService.js';

const routes = express.Router();

routes.get('/', async (req, res) => {
    try {
        const courseData = await coursesService.listCourse();
        console.log(courseData);

        if (courseData.length < 1) {
            return res.status(204).end(); //no content
        }
        res.status(200).send({ message: courseData });

    } catch (error) {
        console.error('Erro ao buscar cursos.', error);
        res.status(500).send('Erro interno.');
    }
});

routes.post('/', async (req, res) => {

    const {courseName, moduleQnt, coordinatorId} = req.body;

    try {

        const isCoordinator = await coursesService.validateCoordinator(coordinatorId);

        if(courseName.length < 1){
            return res.status(400).send({ message: 'O nome do curso não pode ser nulo.'})
        }

        if(moduleQnt === 0){
            return res.status(400).send({ message: 'O curso precisa ter ao menos um módulo.'})
        }

        if(!isCoordinator){
            return res.status(403).send({ message: 'Somente coordenadores podem criar cursos.'});
        }
        
        const createCourseRes = await coursesService.createCourse(courseName, moduleQnt, coordinatorId);
        if(!createCourseRes.success){
            return res.status(400).send({ message: createCourseRes.message, data: createCourseRes.data });
        }
        res.status(201).send({message: createCourseRes.message });

    }catch (error){
        console.error('Erro ao criar curso:', error.message);
        res.status(500).send({message: 'Erro interno.'});
    }
});

routes.put('/', async (req, res) => {
    const {courseId, courseName, moduleQnt, coordinatorId } = req.body;

    try {

        const isCoordinator = await coursesService.validateCoordinator(coordinatorId);

        if(!isCoordinator){
            return res.status(403).send({ message: 'Somente coordenadores podem atualizar cursos. '});
        }
        
        const result = await coursesService.updateCourse(courseId, courseName, moduleQnt, coordinatorId);
        if(!result.success){
            return res.status(400).send({ message: result.message })
        }

        res.status(200).send({ message: result.message });

    }catch(error){
        console.error('Erro ao atualizar curso:', error);
        res.status(400).send({message: error.message});
    }
})

routes.put('/:idCourse', async (req, res) => {
    const courseId = parseInt(req.params.idCourse, 10);
    const {coordinatorId} = req.body;

    try{

        const isCoordinator = await coursesService.validateCoordinator(coordinatorId);

        if(!isCoordinator){
            return res.status(403).send({ message: 'Somente coordenadores podem deletar cursos.'});
        }

        const result = await coursesService.deleteCourse(courseId, coordinatorId);

        if(!result.success){
            return res.status(400).send({ message: result.message });
        }

        res.status(200).send({ message: result.message });
    }catch(error){
        console.error('Erro ao deletar curso:', error);
        res.status(500).send({ message: 'Erro ao deletar o curso.'});
    }
})

export default routes;
