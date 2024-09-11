import e from "express";
import { Router, Request, Response } from "express-serve-static-core";

var router: Router = e.Router();

router.get("/", function (req: Request, res: Response) {
    const $theme = req.cookies["app-theme"] === "dark" ? "dark" : null;
    res.render("index", { dark: $theme, user: req.user });
});

export default router;
