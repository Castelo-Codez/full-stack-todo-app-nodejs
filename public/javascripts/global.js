"use strict";
const $themeSwitcher = document.querySelector("#theme-switcher");
const $table = document.querySelector("table");
if (window.matchMedia("prefers-color-scheme: dark")) {
    if (!document.cookie.includes("app-theme")) {
        //@ts-ignore
        axios.post("/change-theme/dark");
        document.documentElement.classList.add("dark");
        $table ? $table.classList.add("table-dark") : null;
    }
}
$themeSwitcher === null || $themeSwitcher === void 0 ? void 0 : $themeSwitcher.addEventListener("click", (el) => {
    document.documentElement.classList.toggle("dark");
    $table ? $table.classList.toggle("table-dark") : null;
    if (document.documentElement.classList.contains("dark")) {
        //@ts-ignore
        axios.post("/change-theme/dark");
    }
    else {
        //@ts-ignore
        axios.post("/change-theme/light");
    }
});
//# sourceMappingURL=global.js.map