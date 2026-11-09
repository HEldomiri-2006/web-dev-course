
// Get the HTML elements
const title = document.getElementById("title");
const input = document.getElementById("name");
const list = document.getElementById("list");
const form = document.getElementById("greeting-form");
const hint = document.getElementById("hint");

function updateListVisibility() {
  const hasNames = list.children.length > 0;
  list.hidden = !hasNames;
  hint.hidden = !hasNames;
}

function addName(event) {
  event.preventDefault();

  const name = input.value.trim();

  if (!name) return;

  title.textContent = `Hello, ${name}!`;

  const li = document.createElement("li");
  const button = document.createElement("button");

  button.type = "button";
  button.className = "name-item";
  button.textContent = name;

  li.appendChild(button);
  list.appendChild(li);

  updateListVisibility();
  input.value = "";
  input.focus();
}

function removeName(event) {
  const button = event.target.closest(".name-item");

  if (!button || !list.contains(button)) return;

  const name = button.textContent;

  title.textContent =
    `Goodbye, ${name}! See you later.`;

  button.closest("li").remove();

  updateListVisibility();
}

form.addEventListener("submit", addName);
list.addEventListener("click", removeName);
