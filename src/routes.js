import express from 'express';
import subjectsController from './controllers/subjectsController.js';
import userController from './controllers/userController.js';
import coursesController from './controllers/coursesController.js';
import locationController from './controllers/locationController.js';

const routes = express();

routes.use('/subjects', subjectsController);
routes.use('/user', userController);
routes.use('/courses', coursesController);
routes.use('/locations', locationController);

export default routes;