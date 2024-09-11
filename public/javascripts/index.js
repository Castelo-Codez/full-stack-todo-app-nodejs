import { $removeError, $setError } from "./globalfuntions.js";
const $table = document.querySelector("table");
const $noItemsSpan = document.querySelector("section .container > span");
const $accountButton = document.querySelector("#Account");
const $toggleMenu = document.querySelector("#toggle-menu");
const $form = document.querySelector("form");
$accountButton === null || $accountButton === void 0 ? void 0 : $accountButton.addEventListener("click", (e) => {
    if ($accountButton.ariaExpanded === "false") {
        $accountButton.ariaExpanded = "true";
    }
    else {
        $accountButton.ariaExpanded = "false";
    }
    e.stopPropagation();
    $toggleMenu === null || $toggleMenu === void 0 ? void 0 : $toggleMenu.toggleAttribute("expanded");
});
const $logOutBtn = $toggleMenu === null || $toggleMenu === void 0 ? void 0 : $toggleMenu.querySelector("button");
$logOutBtn === null || $logOutBtn === void 0 ? void 0 : $logOutBtn.addEventListener("click", (e) => {
    //@ts-expect-error
    axios.delete("/logout").then(() => window.location.assign("/login"));
});
window.addEventListener("click", (e) => {
    $accountButton ? ($accountButton.ariaExpanded = "false") : "";
    $toggleMenu === null || $toggleMenu === void 0 ? void 0 : $toggleMenu.toggleAttribute("expanded", false);
});
$toggleMenu === null || $toggleMenu === void 0 ? void 0 : $toggleMenu.addEventListener("click", (e) => {
    e.stopPropagation();
});
$form === null || $form === void 0 ? void 0 : $form.addEventListener("submit", (e) => {
    var _a;
    e.preventDefault();
    let $checkTodoErrors = {
        todo: $form.todo.value.length < 4
            ? {
                error: true,
                type: "todo",
                message: "must be at least 4 characters",
            }
            : {
                error: false,
                type: "todo",
            },
    };
    for (let [key, value] of Object.entries($checkTodoErrors)) {
        if (typeof value !== "string" && value.error) {
            $setError(value);
        }
        if (typeof value !== "string" && !value.error) {
            $removeError(value);
        }
    }
    if (typeof $checkTodoErrors.todo !== "string" &&
        !$checkTodoErrors.todo.error) {
        const todo = {
            title: $form.todo.value,
            status: false,
            createdAt: ((_a = `${new Date()}`.match(/\w+\s\w+\s\w+\s\w+:\w+/gi)) === null || _a === void 0 ? void 0 : _a.join()) ||
                null,
            id: Date.now(),
        };
        $noItemsSpan === null || $noItemsSpan === void 0 ? void 0 : $noItemsSpan.remove();
        $appendToTable(todo);
        $appendToServer(todo);
        $form.todo.value = "";
    }
});
function $appendToTable(todo) {
    var _a;
    const tr = document.createElement("tr");
    tr.id = `${todo.id}`;
    const TodoTitle = document.createElement("td");
    TodoTitle.textContent = todo.title;
    const TodoId = document.createElement("td");
    TodoId.textContent = `${todo.id}`;
    const createdAt = document.createElement("td");
    createdAt.textContent = todo.createdAt;
    const status = document.createElement("td");
    status.innerHTML = `<div class="form-check form-switch">
  <input class="form-check-input" type="checkbox" role="switch" id='${todo.id}'>
</div>
    `;
    const statusToggle = status.querySelector("input");
    statusToggle === null || statusToggle === void 0 ? void 0 : statusToggle.addEventListener("change", (e) => {
        //@ts-expect-error
        axios.post("/todos/update-status", {
            //@ts-expect-error
            status: e.target.checked, //@ts-expect-error
            id: e.target.id,
        });
    });
    const deleteBtnTd = document.createElement("td");
    deleteBtnTd.innerHTML = `<button type='button' aria-label='remove todo' id='removeTodo' role='button'><svg fill="#ffffff" width="25px" height="25px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M5.755,20.283,4,8H20L18.245,20.283A2,2,0,0,1,16.265,22H7.735A2,2,0,0,1,5.755,20.283ZM21,4H16V3a1,1,0,0,0-1-1H9A1,1,0,0,0,8,3V4H3A1,1,0,0,0,3,6H21a1,1,0,0,0,0-2Z"></path></g></svg></button>`;
    const deleteButton = deleteBtnTd.querySelector("button");
    deleteButton
        ? deleteButton.addEventListener("click", (e) => {
            var _a, _b, _c, _d;
            //@ts-expect-error
            axios.delete(`/todos/delete-todo/${((_a = deleteButton.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) ? (_b = deleteButton.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement.id : ""}`);
            (_d = (_c = deleteButton.parentElement) === null || _c === void 0 ? void 0 : _c.parentElement) === null || _d === void 0 ? void 0 : _d.remove();
            $checkIfTodosEmpty();
        })
        : "";
    tr.append(TodoTitle, TodoId, createdAt, status, deleteBtnTd);
    (_a = $table === null || $table === void 0 ? void 0 : $table.querySelector("tbody")) === null || _a === void 0 ? void 0 : _a.appendChild(tr);
}
function $appendToServer(todo) {
    //@ts-expect-error
    axios.post("/todos/add-todo", Object.assign({}, todo));
}
document.querySelectorAll("input[type='checkbox']").forEach((input) => {
    input.addEventListener("change", (e) => {
        //@ts-expect-error
        axios.post("/todos/update-status", {
            //@ts-expect-error
            status: e.target.checked, //@ts-expect-error
            id: e.target.id,
        });
    });
});
$table === null || $table === void 0 ? void 0 : $table.querySelectorAll("button").forEach(($btn) => {
    $btn.addEventListener("click", (e) => {
        var _a, _b, _c, _d;
        //@ts-expect-error
        axios.delete(`/todos/delete-todo/${((_a = $btn.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) ? (_b = $btn.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement.id : ""}`);
        (_d = (_c = $btn.parentElement) === null || _c === void 0 ? void 0 : _c.parentElement) === null || _d === void 0 ? void 0 : _d.remove();
        $checkIfTodosEmpty();
    });
});
function $checkIfTodosEmpty() {
    var _a, _b;
    if (!((_a = $table === null || $table === void 0 ? void 0 : $table.querySelector("tbody")) === null || _a === void 0 ? void 0 : _a.querySelectorAll("tr").length)) {
        const span = document.createElement("span");
        span.textContent = "No Items";
        (_b = $table === null || $table === void 0 ? void 0 : $table.parentElement) === null || _b === void 0 ? void 0 : _b.appendChild(span);
    }
}
//# sourceMappingURL=index.js.map