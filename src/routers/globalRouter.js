import express from "express";
import {join} from "../Controllers/userController"
import { trending } from "../Controllers/videoController";

const globalRouter = express.Router();

globalRouter.get("/", trending);
globalRouter.get("/join", join);

export default globalRouter;