/**
 * @param {HTMLElement} listEl
 * @param {Array<{id:string,title:string,done:boolean,category:string,priority:string,assignee:string}>} todos
 * @param {{ onToggle:(id:string)=>void, onDelete:(id:string)=>void, onEdit:(id:string)=>void }} handlers
 * @returns {void}
 */
export function renderTodos(listEl, todos, handlers) {
  listEl.innerHTML = "";

  if (todos.length === 0) {
    const empty = document.createElement("li");
    empty.className = "item";
    empty.innerHTML = `<span></span><label><span class="title">Inga uppgifter här 👀</span><div class="meta">Lägg in mall eller skapa egna uppgifter.</div></label><span></span>`;
    listEl.appendChild(empty);
    return;
  }

  for (const t of todos) {
    const li = document.createElement("li");
    li.className = `item ${t.done ? "done" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = t.done;
    checkbox.addEventListener("change", () => handlers.onToggle(t.id));

    const label = document.createElement("label");

    const title = document.createElement("span");
    title.className = "title";
    title.textContent = t.title;

    const meta = document.createElement("div");
    meta.className = "meta";

    meta.appendChild(makeBadge(t.category || "Övrigt"));
    meta.appendChild(makeBadge(t.priority || "P2"));

    if (t.assignee && t.assignee.trim()) {
      meta.appendChild(makeBadge(`Ansvarig: ${t.assignee.trim()}`));
    }

    label.appendChild(title);
    label.appendChild(meta);

    const actions = document.createElement("div");
    actions.className = "actions";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "icon-btn";
    editBtn.textContent = "Redigera";
    editBtn.addEventListener("click", () => handlers.onEdit(t.id));

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "icon-btn";
    delBtn.textContent = "Ta bort";
    delBtn.addEventListener("click", () => handlers.onDelete(t.id));

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(actions);

    listEl.appendChild(li);
  }
}

/**
 * @param {HTMLElement} statsEl
 * @param {number} total
 * @param {number} done
 * @returns {void}
 */
export function renderStats(statsEl, total, done) {
  statsEl.textContent = `Totalt: ${total} • Klara: ${done} • Kvar: ${total - done}`;
}

/**
 * @param {HTMLElement} errorEl
 * @param {string} message
 * @returns {void}
 */
export function showError(errorEl, message) {
  errorEl.textContent = message;
  errorEl.hidden = false;
  window.setTimeout(() => (errorEl.hidden = true), 3000);
}

function makeBadge(text) {
  const b = document.createElement("span");
  b.className = "badge";
  b.textContent = text;
  return b;
}