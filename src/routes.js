import express from 'express';
import subjectsController from './Controllers/subjectsController.js'

// ----------------------------------------------------------------

const routes = express();
// ----------------------------------------------------------------

routes.use('/Subjects', subjectsController);


// ----------------------------------------------------------------
export default routes;