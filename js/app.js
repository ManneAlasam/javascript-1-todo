import { loadTodos, saveTodos } from "./storage.js";

const form = document.getElementById("todoForm");
const input = document.getElementById("todoInput");
const listEl = document.getElementById("todoList");
const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");
const clearDoneBtn = document.getElementById("clearDoneBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const seedTemplateBtn = document.getElementById("seedTemplateBtn");
const statsEl = document.getElementById("stats");

let todos = loadTodos();
let searchTerm = "";
let filter = "all";

function sync() {
  saveTodos(todos);
  render();
}

function render() {
  listEl.innerHTML = "";

  let filtered = todos
    .filter((t) => t.title.toLowerCase().includes(searchTerm))
    .filter((t) => {
      if (filter === "done") return t.done;
      if (filter === "active") return !t.done;
      return true;
    });

  filtered.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const span = document.createElement("span");
    span.textContent = todo.title;
    if (todo.done) span.style.textDecoration = "line-through";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Ta bort";
    deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    listEl.appendChild(li);
  });

  const doneCount = todos.filter((t) => t.done).length;
  statsEl.textContent = `Totalt: ${todos.length} | Klara: ${doneCount}`;
}

function addTodo(title) {
  todos.unshift({
    id: crypto.randomUUID(),
    title: title.trim(),
    done: false,
  });
  sync();
}

function toggleTodo(id) {
  const t = todos.find((x) => x.id === id);
  if (!t) return;
  t.done = !t.done;
  sync();
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  sync();
}

function clearDone() {
  todos = todos.filter((t) => !t.done);
  sync();
}

function clearAll() {
  if (!confirm("Rensa alla uppgifter?")) return;
  todos = [];
  sync();
}

function seedTemplate() {
  if (todos.length > 0) {
    if (!confirm("Listan innehåller redan uppgifter. Fortsätt?")) return;
  }

  const template = [
    // 📁 Struktur & Git (G)
    "Skapa gemensamt Git-repo",
    "Bjuda in alla gruppmedlemmar + lärare",
    "Skapa tydlig filstruktur (separata HTML/CSS/JS-filer)",
    "Alla gruppmedlemmar har gjort minst 1 commit",
    "README.md finns i repot",
    "README: projektbeskrivning",
    "README: instruktioner för att köra projektet",
    "README: vilka som ingår i gruppen",

    // 💻 Grundfunktionalitet (G)
    "Minst 3 interaktiva funktioner finns (t.ex. sök/filter/kundvagn)",
    "JavaScript skapar/ändrar innehåll i DOM (createElement/appendChild)",
    "Koden är korrekt formaterad och konsekvent indenterad",

    // 🌐 API + felhantering (VG)
    "Välja externt API (FakeStore/PokéAPI/OpenWeatherMap etc.)",
    "Hämta data med fetch()",
    "Visa API-data dynamiskt på sidan",
    "Felhantering: om API-anrop misslyckas visas ett meddelande",
    "Visa gärna loading state (laddar...) när API hämtas",

    // 🧠 Kodkvalitet (VG)
    "Alla JavaScript-funktioner är kommenterade (vad den gör, parametrar, returvärde)",
    "Koden är uppdelad i funktioner/moduler (t.ex. api.js, ui.js, app.js)",
    "Undvik onödigt upprepade kodblock (DRY)",
    "Responsiv design: fungerar på mobil + desktop",
    "Testa layout i mobilvy och desktop",

    // 🛒 FakeStore-specifikt (om ni kör det)
    "Visa alla produkter",
    "Filtrera produkter på kategori",
    "Sök bland produkter",
    "Produktdetaljvy (klick på produkt)",
    "Lägg till i kundvagn",
    "Visa kundvagn",
    "Räkna totalpris",

    // 🎤 Redovisning
    "Slides: Introduktion (vad/varför/tekniker)",
    "Slides: Planering (verktyg + ansvarsfördelning)",
    "Slides: Utförande (kommunikation + Git-flöde)",
    "Slides: Demo (visa funktioner + API-data)",
    "Slides: Lärdomar och reflektion",
    "Fördela taltid (alla pratar)",
    "Öva presentationen minst 1 gång",
    "Förbered svar på möjliga frågor",
  ];

  todos = template.map((text) => ({
    id: crypto.randomUUID(),
    title: text,
    done: false,
  }));

  sync();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!input.value.trim()) return;
  addTodo(input.value);
  input.value = "";
});

searchInput.addEventListener("input", (e) => {
  searchTerm = e.target.value.toLowerCase();
  render();
});

filterSelect.addEventListener("change", (e) => {
  filter = e.target.value;
  render();
});

clearDoneBtn.addEventListener("click", clearDone);
clearAllBtn.addEventListener("click", clearAll);
seedTemplateBtn.addEventListener("click", seedTemplate);

render();
