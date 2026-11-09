// ---------- 1. Types ----------
// A todo has an id, some text, and a "done" flag.
interface Todo {
  id: number;
  text: string;
  done: boolean;
}

// The filter can only be one of these three words.
type Filter = "all" | "active" | "completed";

// ---------- 2. Data (our app's "state") ----------
let todos: Todo[] = [];
let currentFilter: Filter = "all";
let nextId = 1;

// ---------- 3. Get the HTML elements we need ----------
const input = document.getElementById("todo-input") as HTMLInputElement;
const addBtn = document.getElementById("add-btn") as HTMLButtonElement;
const list = document.getElementById("todo-list") as HTMLUListElement;
const countLabel = document.getElementById("count") as HTMLSpanElement;
const clearCompletedBtn = document.getElementById("clear-completed") as HTMLButtonElement;
const clearAllBtn = document.getElementById("clear-all") as HTMLButtonElement;
const filterButtons = document.querySelectorAll<HTMLButtonElement>(".filter-btn");

// ---------- 4. Functions that change the data ----------
function addTodo(): void {
  const text = input.value.trim();
  if (text === "") return; // ignore empty input

  todos.push({ id: nextId++, text: text, done: false });
  input.value = "";
  render();
}

function toggleTodo(id: number): void {
  const todo = todos.find((t) => t.id === id);
  if (todo) todo.done = !todo.done;
  render();
}

function deleteTodo(id: number): void {
  todos = todos.filter((t) => t.id !== id);
  render();
}

function editTodo(id: number, newText: string): void {
  const todo = todos.find((t) => t.id === id);
  if (todo && newText.trim() !== "") todo.text = newText.trim();
  render();
}

// ---------- 5. Show the todos on the page ----------
function render(): void {
  list.innerHTML = ""; // clear the list, then rebuild it

  // Pick which todos to show based on the filter
  const visible = todos.filter((t) => {
    if (currentFilter === "active") return !t.done;
    if (currentFilter === "completed") return t.done;
    return true; // "all"
  });

  for (const todo of visible) {
    const li = document.createElement("li");
    if (todo.done) li.classList.add("done");

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    // Text (double-click to edit)
    const span = document.createElement("span");
    span.textContent = todo.text;
    span.addEventListener("dblclick", () => startEditing(li, span, todo));

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "🗑";
    deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

    li.append(checkbox, span, deleteBtn);
    list.appendChild(li);
  }

  // Update "X items left" (counts only todos that are not done)
  const left = todos.filter((t) => !t.done).length;
  countLabel.textContent = left + (left === 1 ? " item left" : " items left");
}

// Replace the text with an input box so the user can edit it
function startEditing(li: HTMLLIElement, span: HTMLSpanElement, todo: Todo): void {
  const editBox = document.createElement("input");
  editBox.type = "text";
  editBox.value = todo.text;
  editBox.className = "edit-input";

  li.replaceChild(editBox, span);
  editBox.focus();

  editBox.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter") editTodo(todo.id, editBox.value); // save
    if (e.key === "Escape") render();                        // cancel
  });
  editBox.addEventListener("blur", () => editTodo(todo.id, editBox.value));
}

// ---------- 6. Connect buttons to functions ----------
addBtn.addEventListener("click", addTodo);

input.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key === "Enter") addTodo();
});

clearCompletedBtn.addEventListener("click", () => {
  todos = todos.filter((t) => !t.done);
  render();
});

clearAllBtn.addEventListener("click", () => {
  todos = [];
  render();
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter as Filter;
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    render();
  });
});

// Show the (empty) list when the page first loads
render();
