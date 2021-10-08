import express from "express";
import {edit, see, logout, remove } from "../Controllers/userController";

const userRouter = express.Router();

userRouter.get("/edit", edit);
userRouter.get("/logout", logout);
userRouter.get("/remove", remove);
userRouter.get("/:id", see);

export default userRouter;