import { $removeError, $setError } from "./globalfuntions.js";

const form = document.querySelector("form");

form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    let $credetialsHasError: {
        email: string | { error: boolean; message?: string; type?: string };
        password: string | { error: boolean; message?: string; type?: string };
    } = {
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
        !$credetialsHasError.password.error
    ) {
        //@ts-expect-error
        axios
            .post("/login", {
                email: form.email.value,
                password: form.password.value,
            })
            .then((res: any) => {
                window.location.assign("/");
            })
            .catch((error: any) => {
                $setError({
                    error: true,
                    type: "email",
                    message: "please check your email",
                });
                $setError({
                    error: true,
                    type: "password",
                    message: "please check your password",
                });
            });
    }
});
