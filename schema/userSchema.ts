interface UserSchema {
    username: string;
    githubId: string | null;
    email: string | null;
    password: string | null;
    avatar: string | null;
    todos: [];
}

export default UserSchema;
