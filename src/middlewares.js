
export const localsMiddleware = (req,res,next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = "Wetube";
    res.locals.loggedInUser = req.session.user || {};
    next();
}

//login이 필요조건인 페이지에 로그인 없이 들어가는 걸 방지하는 미들웨어
export const protectorMiddleware = (req,res,next) => {
    if(req.session.loggedIn){
        next()
    } else {
        return res.redirect("/login");
    }
}

//login한 사람들은 갈 수 없는 페이지 (ex. 로그인페이지)
export const publicOnlyMiddleware = (req,res,next) => {
    if(!req.session.loggedIn){
        next();
    } else{
        return res.redirect("/");
    }
}