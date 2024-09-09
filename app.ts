import {
    Request,
    Response,
    NextFunction,
    Express,
} from "express-serve-static-core";
import createError from "http-errors";
import session from "express-session";
import express from "express";
import path from "node:path";
import "./auth/passport.local";
import "./auth/passport.github";
import cookieParser from "cookie-parser";
import logger from "morgan";
import indexRouter from "./routes/index";
import loginPage from "./routes/login";
import signupPage from "./routes/signup";
import controllers from "./controllers/controllers";
import passport from "passport";
import User from "./model/User";
import { connect } from "mongoose";
var app: Express = express();
app.set("views", path.resolve("./", "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve("./", "public")));
(async function () {
    await connect(process.env.MONGODB_URL as string);
})();
app.use(
    session({
        secret: process.env.AUTHSEC as string,
        saveUninitialized: false,
        resave: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 3,
        },
    }),
);

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => {
    //@ts-ignore
    done(null, user._id);
});
passport.deserializeUser(async function (id, done) {
    let $user = await User.findById({ _id: id });
    done(null, $user);
});
app.use(controllers);
app.use("/login", loginPage);
app.use("/signup", signupPage);
app.use((req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect("/login");
    }
});
app.use("/", indexRouter);
app.use(function (req: Request, res: Response, next: NextFunction) {
    next(createError(404));
});
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500);
    res.render("error", {
        error: err.message,
    });
});

export default app;
