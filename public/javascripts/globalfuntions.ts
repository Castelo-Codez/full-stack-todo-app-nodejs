interface ErrorObj {
    error: boolean;
    message?: string;
    type?: string;
}
export function $removeError($ob: ErrorObj) {
    let el = document.querySelector(`.${$ob.type}-wrapper`);
    el?.classList.remove("has-error");
    let $erroEl = el?.querySelector(".error");
    if ($erroEl && !$ob.message) {
        $erroEl.textContent = null;
    }
}
export function $setError($ob: ErrorObj): void {
    let el = document.querySelector(`.${$ob.type}-wrapper`);
    el?.classList.add("has-error");
    let $erroEl = el?.querySelector(".error");
    if ($erroEl && $ob.message) {
        $erroEl.textContent = $ob.message;
    }
}
