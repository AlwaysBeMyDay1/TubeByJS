import express from "express";
import {edit, remove} from "../Controllers/userController";

const userRouter = express.Router();

userRouter.get("/edit", edit);
userRouter.get("/remove", remove);

export default userRouter;