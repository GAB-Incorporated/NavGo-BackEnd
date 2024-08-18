import express from "express";
import admUserService from "./services/admUserService";

const routes = express();

routes.use('/adm', admUserService);

export default routes;
