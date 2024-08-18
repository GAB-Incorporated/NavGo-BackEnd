import express from 'express';
import routes from './routes.js';

const app = express();

app.use(express.json());

app.use('/', routes);

app.listen(3333, () => {
    console.log('Servidor rodando na porta 3333 😎😎');
});
