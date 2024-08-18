import express from 'express';
import admController from './controllers/admUserController.js';

const app = express();

app.use(express.json());

app.use('/user', admController);

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000 😎😎');
});
