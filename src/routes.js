import express from "express";
import userController from './controllers/userController.js'
import coursesController from './controllers/coursesController.js';

const routes = express();

routes.use('/user', userController);
routes.use('/cursos', coursesController);

export default routes;