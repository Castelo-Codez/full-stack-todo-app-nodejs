import { $removeError, $setError } from "./globalfuntions.js";
const $table = document.querySelector("table");
const $noItemsSpan = document.querySelector("section .container > span");
const $accountButton = document.querySelector("#Account");
const $toggleMenu = document.querySelector("#toggle-menu");
const $form = document.querySelector("form");
$accountButton?.addEventListener("click", (e) => {
    if ($accountButton.ariaExpanded === "false") {
        $accountButton.ariaExpanded = "true";
    } else {
        $accountButton.ariaExpanded = "false";
    }
    e.stopPropagation();
    $toggleMenu?.toggleAttribute("expanded");
});

const $logOutBtn = $toggleMenu?.querySelector("button");

$logOutBtn?.addEventListener("click", (e) => {
    //@ts-expect-error
    axios.delete("/logout").then(() => window.location.assign("/login"));
});

window.addEventListener("click", (e) => {
    $accountButton ? ($accountButton.ariaExpanded = "false") : "";
    $toggleMenu?.toggleAttribute("expanded", false);
});

$toggleMenu?.addEventListener("click", (e) => {
    e.stopPropagation();
});

interface Todo {
    title: string;
    status: boolean;
    createdAt: string | null;
    id: number;
}
$form?.addEventListener("submit", (e) => {
    e.preventDefault();
    let $checkTodoErrors: {
        todo: string | { error: boolean; type: string; message?: string };
    } = {
        todo:
            $form.todo.value.length < 4
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
    if (
        typeof $checkTodoErrors.todo !== "string" &&
        !$checkTodoErrors.todo.error
    ) {
        const todo: Todo = {
            title: $form.todo.value,
            status: false,
            createdAt:
                `${new Date()}`.match(/\w+\s\w+\s\w+\s\w+:\w+/gi)?.join() ||
                null,

            id: Date.now(),
        };
        $noItemsSpan?.remove();

        $appendToTable(todo);
        $appendToServer(todo);
        $form.todo.value = "";
    }
});
function $appendToTable(todo: Todo) {
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
    statusToggle?.addEventListener("change", (e) => {
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
            //@ts-expect-error
            axios.delete(
                `/todos/delete-todo/${deleteButton.parentElement?.parentElement ? deleteButton.parentElement?.parentElement.id : ""}`,
            );
            deleteButton.parentElement?.parentElement?.remove();
            $checkIfTodosEmpty();
        })
        : "";
    tr.append(TodoTitle, TodoId, createdAt, status, deleteBtnTd);
    $table?.querySelector("tbody")?.appendChild(tr);
}

function $appendToServer(todo: Todo) {
    //@ts-expect-error
    axios.post("/todos/add-todo", {
        ...todo,
    });
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

$table?.querySelectorAll("button").forEach(($btn) => {
    $btn.addEventListener("click", (e) => {
        //@ts-expect-error
        axios.delete(
            `/todos/delete-todo/${$btn.parentElement?.parentElement ? $btn.parentElement?.parentElement.id : ""}`,
        );
        $btn.parentElement?.parentElement?.remove();
        $checkIfTodosEmpty();
    });
});

function $checkIfTodosEmpty() {
    if (!$table?.querySelector("tbody")?.querySelectorAll("tr").length) {
        const span = document.createElement("span");
        span.textContent = "No Items";
        $table?.parentElement?.appendChild(span);
    }
}
