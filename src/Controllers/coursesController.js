import express from 'express';
import coursesService from '../services/coursesService.js';

const routes = express.Router(); // Cria um roteador para definir as rotas

// Rota para listar todos os cursos
routes.get('/', async (req, res) => {
    try {
        const courseData = await coursesService.listCourse();
        console.log(courseData);

        if (courseData.length < 1) {
            return res.status(204).end();
        }
        res.status(200).send({ message: courseData });

    } catch (error) {
        console.error('Erro ao buscar cursos.', error);
        res.status(500).send('Erro interno.');
    }
});

// Rota para criar um novo curso
routes.post('/', async (req, res) => {

    const {courseName, moduleQnt, coordinatorId} = req.body;

    try {
        // Valida se o usuário é um administrador (coordenador)
        const isCoordinator = await coursesService.validateCoordinator(coordinatorId);
        
        if(!isCoordinator.success){
            return res.status(isCoordinator.status).send({ message: isCoordinator.message }); // Retorna erro se o usuário não for coordenador
        }

        // Validação do nome do curso
        if(!courseName || courseName.length < 1){
            return res.status(400).send({ message: 'O nome do curso não pode ser nulo.'});
        }

        // Validação da quantidade de módulos
        if(moduleQnt === undefined || moduleQnt === null || moduleQnt <= 0){
            return res.status(400).send({ message: 'O curso precisa ter ao menos um módulo.'});
        }

        // Criação do curso utilizando o serviço
        const createCourseRes = await coursesService.createCourse(courseName, moduleQnt, coordinatorId);
        if(!createCourseRes.success){
            return res.status(400).send({ message: createCourseRes.message, data: createCourseRes.data }); // Retorna erro se houver falha na criação do curso
        }
        res.status(201).send({message: createCourseRes.message });

    } catch (error) {
        console.error('Erro ao criar curso:', error.message);
        res.status(500).send({message: 'Erro interno.'});
    }
});

// Rota para atualizar um curso existente
routes.put('/', async (req, res) => {
    const {courseId, courseName, moduleQnt, coordinatorId} = req.body;

    try {
        // Valida se o usuário é um administrador (coordenador)
        const isCoordinator = await coursesService.validateCoordinator(coordinatorId);

        if(!isCoordinator.success){
            return res.status(isCoordinator.status).send({ message: isCoordinator.message });
        }
        
        // Atualiza o curso utilizando o serviço
        const result = await coursesService.updateCourse(courseId, courseName, moduleQnt, coordinatorId);
        if(!result.success){
            return res.status(400).send({ message: result.message });
        }

        res.status(200).send({ message: result.message });

    } catch (error) {
        console.error('Erro ao atualizar curso:', error);
        res.status(400).send({message: error.message});
    }
})

// Rota para realizar o soft delete de um curso
routes.put('/:idCourse', async (req, res) => {
    const courseId = parseInt(req.params.idCourse, 10); // Extrai e converte o ID do curso da URL
    const {coordinatorId} = req.body; // Extrai o ID do coordenador do corpo da requisição

    try {
        // Valida se o usuário é um administrador (coordenador)
        const isCoordinator = await coursesService.validateCoordinator(coordinatorId);
        
        if(!isCoordinator.success){
            return res.status(isCoordinator.status).send({ message: isCoordinator.message });
        }

        // Realiza o soft delete do curso utilizando a service
        const result = await coursesService.deleteCourse(courseId, coordinatorId);

        if(!result.success){
            return res.status(400).send({ message: result.message });
        }

        res.status(200).send({ message: result.message });
    } catch (error) {
        console.error('Erro ao deletar curso:', error);
        res.status(500).send({ message: 'Erro ao deletar o curso.'});
    }
})

export default routes;
