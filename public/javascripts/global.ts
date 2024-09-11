const $themeSwitcher = document.querySelector(
    "#theme-switcher",
) as HTMLButtonElement;
const $table = document.querySelector("table");
if (window.matchMedia("prefers-color-scheme: dark")) {
    if (!document.cookie.includes("app-theme")) {
        //@ts-expect-error
        axios.post("/change-theme/dark");
        document.documentElement.classList.add("dark");
        $table ? $table.classList.add("table-dark") : null;
    }
}

$themeSwitcher?.addEventListener("click", (el) => {
    document.documentElement.classList.toggle("dark");
    $table ? $table.classList.toggle("table-dark") : null;
    if (document.documentElement.classList.contains("dark")) {
        //@ts-expect-error
        axios.post("/change-theme/dark");
    } else {
        //@ts-expect-error
        axios.post("/change-theme/light");
    }
});
