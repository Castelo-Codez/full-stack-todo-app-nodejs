import { connect } from "mongoose";
import passport from "passport";
import { Strategy } from "passport-local";
import User from "../model/User";
import bcrypt from "bcrypt";
passport.use(
    "local",
    new Strategy(
        {
            usernameField: "email",
        },
        async function verfiy(email: string, password: string, cb: any) {
            return await connect(process.env.MONGODB_URL as string)
                .then(async () => {
                    let foundUser = await User.findOne({
                        email: email,
                    });
                    if (foundUser) {
                        
                        let $checkPassword = bcrypt.compareSync(
                            password,
                            foundUser.password as string,
                        );
                        if ($checkPassword) {   
                            return cb(null, foundUser);
                        }
                        return cb(null, false);
                    }
                    return cb(null, false);
                })
                .catch((err) => {
                    return cb(err);
                });
        },
    ),
);
