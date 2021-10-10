import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
const PORT = 4000;

const app = express();
//app 설정 (ex. get request에 응답하는 법,,)
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd()+"/src/views");
app.use(logger);
app.use(express.urlencoded({extended : true}));
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

const handleListening = ()=> console.log(`Server listening on port http://localhost:${PORT}`);
app.listen(PORT, handleListening);
// 위 코드와 동일// app.listen(4000, ()=> console.log("Server listening on port 4000"));