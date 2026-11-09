"use strict";
// ---------- 2. Data (our app's "state") ----------
let todos = [];
let currentFilter = "all";
let nextId = 1;
// ---------- 3. Get the HTML elements we need ----------
const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("todo-list");
const countLabel = document.getElementById("count");
const clearCompletedBtn = document.getElementById("clear-completed");
const clearAllBtn = document.getElementById("clear-all");
const filterButtons = document.querySelectorAll(".filter-btn");
// ---------- 4. Functions that change the data ----------
function addTodo() {
    const text = input.value.trim();
    if (text === "")
        return; // ignore empty input
    todos.push({ id: nextId++, text: text, done: false });
    input.value = "";
    render();
}
function toggleTodo(id) {
    const todo = todos.find((t) => t.id === id);
    if (todo)
        todo.done = !todo.done;
    render();
}
function deleteTodo(id) {
    todos = todos.filter((t) => t.id !== id);
    render();
}
function editTodo(id, newText) {
    const todo = todos.find((t) => t.id === id);
    if (todo && newText.trim() !== "")
        todo.text = newText.trim();
    render();
}
// ---------- 5. Show the todos on the page ----------
function render() {
    list.innerHTML = ""; // clear the list, then rebuild it
    // Pick which todos to show based on the filter
    const visible = todos.filter((t) => {
        if (currentFilter === "active")
            return !t.done;
        if (currentFilter === "completed")
            return t.done;
        return true; // "all"
    });
    for (const todo of visible) {
        const li = document.createElement("li");
        if (todo.done)
            li.classList.add("done");
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
function startEditing(li, span, todo) {
    const editBox = document.createElement("input");
    editBox.type = "text";
    editBox.value = todo.text;
    editBox.className = "edit-input";
    li.replaceChild(editBox, span);
    editBox.focus();
    editBox.addEventListener("keydown", (e) => {
        if (e.key === "Enter")
            editTodo(todo.id, editBox.value); // save
        if (e.key === "Escape")
            render(); // cancel
    });
    editBox.addEventListener("blur", () => editTodo(todo.id, editBox.value));
}
// ---------- 6. Connect buttons to functions ----------
addBtn.addEventListener("click", addTodo);
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter")
        addTodo();
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
        currentFilter = btn.dataset.filter;
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        render();
    });
});
// Show the (empty) list when the page first loads
render();
