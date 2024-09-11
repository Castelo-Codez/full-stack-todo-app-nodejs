import { $removeError, $setError } from "./globalfuntions.js";
const form = document.querySelector("form");

form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    let $credetialsHasError: {
        username: string | { error: boolean; message?: string; type?: string };
        email: string | { error: boolean; message?: string; type?: string };
        password: string | { error: boolean; message?: string; type?: string };
    } = {
        username:
            form.username.value.length < 5
                ? {
                      error: true,
                      type: "username",
                      message: "must be at least 5 characters",
                  }
                : /\W/gi.test(form.username.value)
                  ? {
                        error: true,
                        type: "username",
                        message: "username can't include special characters",
                    }
                  : {
                        error: false,
                        type: "username",
                    },
        //@ts-expect-error
        email: validator.isEmail(form.email.value)
            ? { error: false, type: "email" }
            : {
                  error: true,
                  type: "email",
                  message: "please enter a valid email",
              },
        password:
            form.password.value.length < 8
                ? {
                      error: true,
                      type: "password",
                      message: "must be at least 8 characters",
                  }
                : form.password.value.length >= 8
                  ? { error: false, type: "password" }
                  : {
                        error: true,
                        type: "password",
                        message: "can't be empty",
                    },
    };
    for (let [key, value] of Object.entries($credetialsHasError)) {
        if (typeof value !== "string" && value.error) {
            $setError(value);
        }
        if (typeof value !== "string" && !value.error) {
            $removeError(value);
        }
    }
    if (
        typeof $credetialsHasError.email !== "string" &&
        !$credetialsHasError.email.error &&
        typeof $credetialsHasError.password !== "string" &&
        !$credetialsHasError.password.error &&
        typeof $credetialsHasError.username !== "string" &&
        !$credetialsHasError.username.error
    ) {
        //@ts-expect-error
        axios
            .post("/signup", {
                username: form.username.value,
                email: form.email.value,
                password: form.password.value,
            })
            .then(
                (res: {
                    data: { error?: any; email?: string; password?: string };
                }) => {
                    if (res.data.error) {
                        $setError({
                            error: true,
                            type: "email",
                            message: "this email already exist",
                        });
                    } //@ts-expect-error
                    axios
                        .post("/login", {
                            email: res.data.email,
                            password: res.data.password,
                        })
                        .then((res: any) => {
                            window.location.assign("/");
                        });
                },
            );
    }
});
