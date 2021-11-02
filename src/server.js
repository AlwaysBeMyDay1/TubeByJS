import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";

const app = express();
//app 설정 (ex. get request에 응답하는 법,,)
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd()+"/src/views");
app.use(logger);
app.use(express.urlencoded({extended : true}));

app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave:false,//
    saveUninitialized:false, //uninitialized(세션이 새로 만들어지고 수정된 적이 없을 때 즉, 로그인했을 때)면 쿠키 한 줌
    cookie:{
        maxAge:2000,
    },
    store: MongoStore.create({mongoUrl:process.env.DB_URL}),
    //↑이 부분이 없으면 세션이 서버의 메모리에 저장되므로,
    //서버를 재시작할 때마다 메모리가 지워짐. 있으면 db에 세션 저장 가능.
}))
//↑ 위의 session 미들웨어가 사이트로 들어오는 모두를 기억함
//(들어온 사람에게 텍스트(쿠키)를 주고, 해당 텍스트로 유저가 누구인지 알아냄)

app.use(localsMiddleware); //← 이 미들웨어로는 session object에 접근
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;