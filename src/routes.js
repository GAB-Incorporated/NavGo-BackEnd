import express from 'express';
import subjectsController from './controllers/subjectsController.js';
import userController from './controllers/userController.js';
import coursesController from './controllers/coursesController.js';
import locationController from './controllers/locationController.js';
import localTypeController from './controllers/localTypeController.js'
import buildingsController from './controllers/buildingsController.js'
import periodsController from './controllers/periodController.js'

const routes = express();

routes.use('/subjects', subjectsController);
routes.use('/user', userController);
routes.use('/courses', coursesController);
routes.use('/locations', locationController);
routes.use('/local-type', localTypeController);
routes.use('/buildings', buildingsController);
routes.use('/periods', periodsController);

export default routes;