import express from "express";
import UserController from "../controllers/UserController";

const routes = express.Router();

routes.post("/signup", UserController.create);

export default routes;
