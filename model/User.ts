import { Schema, model } from "mongoose";
import * as bcrypt from "bcrypt";
import UserSchema from "../schema/userSchema";

const userSchema = new Schema<UserSchema>({
    username: {
        type: String,
    },
    githubId: {
        type: String,
    },
    avatar: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    todos: [],
});

userSchema.pre("save", function (next) {
    if (this.password && this.password) {
        const salt: string = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
        next();
    }
    next();
});

const User = model("Users", userSchema);

export default User;
