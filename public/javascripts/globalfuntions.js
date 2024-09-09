export function $removeError($ob) {
    let el = document.querySelector(`.${$ob.type}-wrapper`);
    el === null || el === void 0 ? void 0 : el.classList.remove("has-error");
    let $erroEl = el === null || el === void 0 ? void 0 : el.querySelector(".error");
    if ($erroEl && !$ob.message) {
        $erroEl.textContent = null;
    }
}
export function $setError($ob) {
    let el = document.querySelector(`.${$ob.type}-wrapper`);
    el === null || el === void 0 ? void 0 : el.classList.add("has-error");
    let $erroEl = el === null || el === void 0 ? void 0 : el.querySelector(".error");
    if ($erroEl && $ob.message) {
        $erroEl.textContent = $ob.message;
    }
}
//# sourceMappingURL=globalfuntions.js.map