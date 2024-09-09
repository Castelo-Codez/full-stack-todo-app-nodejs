import { Strategy } from "passport-github2";
import User from "../model/User";
import passport from "passport";
import dotenv from "dotenv";
dotenv.config();
passport.use(
    "github",
    new Strategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SEC as string,
            callbackURL: `https://${process.env.VERCEL_URL}/auth/github/callback`,
        },
        async function (
            accessToken: string,
            refreshToken: string,
            profile: any,
            done: any,
        ) {
            let userInDb = await User.findOne({ githubId: profile.id });
            if (userInDb) {
                return done(null, userInDb);
            } else {
                let newUser = await User.create({
                    githubId: profile.id,
                    username: profile.username,
                    avatar: profile.photos[0].value,
                    todos: [],
                });
                done(null, newUser);
            }
        },
    ),
);
