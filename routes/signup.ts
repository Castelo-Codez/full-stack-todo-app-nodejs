import e from "express";
import { Router } from "express-serve-static-core";

const router: Router = e.Router();

router.get("/", (req, res) => {
    const $theme = req.cookies["app-theme"] === "dark" ? "dark" : null;
    res.render("signup", {
        dark: $theme,
    });
});

export default router;
