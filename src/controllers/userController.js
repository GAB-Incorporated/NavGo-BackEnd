import express from 'express';
import userService from '../services/userService.js';

const routes = express.Router();

routes.post('/register', async (req, res) => {
    const { first_name, last_name, nick_name, email, password_hash, user_type, photo_id, verification_code } = req.body;

    try {

        await userService.createUser(first_name, last_name, nick_name, email, password_hash, user_type, photo_id, verification_code);
        
        return res.status(201).send({ message: 'Usuário criado com sucesso' });
    } catch (err) {
        return res.status(400).send({ message: err.message });
    }
});

routes.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const { token, user } = await userService.loginUser(email, password);
        res.status(200).send({ message: 'Login bem-sucedido!', token, user });
    } catch (err) {
        res.status(401).send({ message: err.message });
    }
});

routes.get('/coordinators', async (req, res) => {
    try {
        const user = await userService.getCoordinators();
        res.status(200).send(user);
    } catch (err) {
        console.log(err)
        res.status(400).send(err)
    }
})

routes.get('/users', async (req, res) => {
    try {

        const users = await userService.getUsers();

        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
})

routes.get('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {

        const user = await userService.getOneUser(id);

        res.status(200).send(user);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
})

routes.get('/students', async (req, res) => {

    try {
        const students = await userService.getStudents();

        res.status(200).send(students);
    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }   
});

routes.get('/students/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const student = await userService.getOneStudent(id);

        res.status(200).send(student);
    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
})

export default routes;
