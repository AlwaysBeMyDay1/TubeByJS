import express from "express";

import {
  getEdit,
  postEdit,
  logout,
  startGithubLogin,
  finishGithubLogin,
  getChangePW,
  postChangePW,
  profile,
} from "../Controllers/userController";
import { avatarUpload, protectorMiddleware, publicOnlyMiddleware} from "../middlewares";

const userRouter = express.Router();

userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(avatarUpload.single("avatar"), postEdit);
userRouter.get("/logout", protectorMiddleware, logout);
userRouter
  .route("/change-pw")
  .all(protectorMiddleware)
  .get(getChangePW)
  .post(postChangePW);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/:id", profile);

export default userRouter;
