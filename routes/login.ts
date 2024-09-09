import e from "express";
import { Router, Request, Response } from "express-serve-static-core";
import { connect } from "mongoose";
import User from "../model/User";
const router: Router = e.Router();

router.get("/", async (req: Request, res: Response) => {
    const $theme = req.cookies["app-theme"] === "dark" ? "dark" : null;
    res.render("login", {
        dark: $theme,
    });
});

export default router;
