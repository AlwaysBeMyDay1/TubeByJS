import express from "express";
import {
  getEdit,
  postEdit,
  see,
  logout,
  startGithubLogin,
  finishGithubLogin,
  getChangePW,
  postChangePW,
} from "../Controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEdit, protectorMiddleware)
  .post(postEdit, protectorMiddleware);
userRouter.get("/logout", protectorMiddleware, logout);
userRouter
  .route("/change-pw")
  .all(protectorMiddleware)
  .get(getChangePW)
  .post(postChangePW);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/:id(\\d+)", see);

export default userRouter;
