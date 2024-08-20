import express from 'express';
import subjectsController from './Controllers/subjectsController.js'
import userController from './controllers/userController.js'

const routes = express();

routes.use('/Subjects', subjectsController);
routes.use('/user', userController);

export default routes;
