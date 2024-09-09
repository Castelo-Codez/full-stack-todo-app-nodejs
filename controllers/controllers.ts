import e from "express";
import { Router } from "express-serve-static-core";
import passport from "passport";
import User from "../model/User";
const router: Router = e.Router();

router.post("/login", passport.authenticate("local"), (req, res) => {
    if (req.user) {
        res.status(200).send("ok");
    }
});

router.post("/signup", async (req, res) => {
    try {
        let $createNewUser = await User.create({ ...req.body });
        if ($createNewUser) {
            res.json({
                email: req.body.email,
                password: req.body.password,
            });
        }
    } catch (err) {
        res.json({
            error: err,
        });
    }
});

router.delete("/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.status(200).send("ok");
    });
});
router.post("/todos/add-todo", async (req, res) => {
    if (req.user) {
        await User.findOneAndUpdate(
            //@ts-expect-error
            { _id: req.user._id },
            {
                $push: {
                    todos: req.body,
                },
            },
        );
        res.status(200).send("ok");
    }
});
router.post("/todos/update-status", async (req, res) => {
    if (req.user) {
        await User.findOneAndUpdate(
            { "todos.id": +req.body.id },
            {
                $set: {
                    "todos.$.status": req.body.status,
                },
            },
        );
        res.status(200).send("ok");
    }
});

router.delete("/todos/delete-todo/:id", async (req, res) => {
    if (req.user) {
        await User.findOneAndUpdate(
            { "todos.id": +req.params.id },
            {
                $pull: {
                    todos: {
                        id: +req.params.id,
                    },
                },
            },
        );
        res.status(200).send("ok");
    }
});

router.get("/auth/github", passport.authenticate("github"));

router.get(
    "/auth/github/callback",
    passport.authenticate("github"),
    function (req, res) {
        if (req.user) {
            res.locals.user = req.user;
            res.redirect("/");
        }
    },
);

router.post("/change-theme/dark", (req, res) => {
    res.cookie("app-theme", "dark", {
        expires: new Date("9-8-2030"),
        secure: true,
    })
        .status(200)
        .send("ok");
});

router.post("/change-theme/light", (req, res, next) => {
    res.cookie("app-theme", "light", {
        expires: new Date("9-8-2030"),
        secure: true,
    })
        .status(200)
        .send("ok");
});

export default router;
