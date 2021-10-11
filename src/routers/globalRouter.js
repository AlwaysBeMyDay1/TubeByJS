import express from "express";
import {join, login} from "../Controllers/userController"
import {home} from "../Controllers/videoController";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/join", join);
globalRouter.get("/login", login);

export default globalRouter;