import express from 'express';
import admService from '../services/userService.js';
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

export default routes;
