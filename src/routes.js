import express from 'express';
import subjectsController from './controllers/subjectsController.js'
import userController from './controllers/userController.js'

const routes = express();

routes.use('/subjects', subjectsController);
routes.use('/user', userController);

export default routes;
