import express from 'express';
import admService from '../services/userService.js';

const routes = express.Router();

routes.post('/register', async (req, res) => {
    const { first_name, last_name, nick_name, email, password_hash, user_type, photo_id, verification_code } = req.body;

    try {

        await admService.createUser(first_name, last_name, nick_name, email, password_hash, user_type, photo_id, verification_code);
        
        return res.status(201).send({ message: 'Usuário criado com sucesso' });
    } catch (err) {
        return res.status(400).send({ message: err.message });
    }
});

export default routes;
