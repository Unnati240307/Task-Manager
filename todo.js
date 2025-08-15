const titleInput = document.getElementById('tasktitle');
const descInput = document.getElementById('Description');
const catSelect = document.getElementById('taskCategory');
const prioSelect = document.getElementById('priority');

const btnAll = document.getElementById('btnAll');
const btnCompleted = document.getElementById('btnCompleted');
const btnPending = document.getElementById('btnPending');

const taskDisplay = document.getElementById('taskDisplay');
const displayTitle = document.getElementById('displayTitle');
const listEl = document.getElementById('taskList');

let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let currentFilter = 'all';

function save() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function openTaskDisplay(title) {
  displayTitle.innerText = title;
  taskDisplay.style.display = 'block';
}

function closeTaskDisplay() {
  taskDisplay.style.display = 'none';
}

function render() {
  listEl.innerHTML = '';
  let data = tasks;

  if (currentFilter === 'completed') data = tasks.filter(t => t.status === 'completed');
  if (currentFilter === 'pending') data = tasks.filter(t => t.status === 'pending');

  if (!data.length) {
    listEl.innerHTML = `<p>No tasks found.</p>`;
    return;
  }

  data.forEach(t => {
    const card = document.createElement('div');
    card.style.border = t.status === 'completed' ? '2px solid green' : '2px solid gray';
    card.style.borderRadius = '10px';
    card.style.padding = '10px';
    card.style.margin = '10px 0';
    card.style.background = '#f9f9f9';
    card.style.color = '#333';

    card.innerHTML = `
      <h3 style="${t.status === 'completed' ? 'text-decoration: line-through;' : ''}">${t.title}</h3>
      <p>${t.description}</p>
      <p><b>Category:</b> ${t.category} | <b>Priority:</b> ${t.priority}</p>
      <p><b>Status:</b> ${t.status}</p>
      ${t.status === 'pending'
        ? `<button onclick="markCompleted(${t.id})">Mark Completed</button>`
        : `<button onclick="undoTask(${t.id})">Undo</button>`}
      <button onclick="deleteTask(${t.id})">Delete</button>
    `;
    listEl.appendChild(card);
  });
}

function addTask() {
  const title = titleInput.value.trim();
  if (!title) return alert('Please enter a title');

  const task = {
    id: Date.now(),
    title,
    description: descInput.value.trim(),
    category: catSelect.value,
    priority: prioSelect.value,
    status: 'pending'
  };

  tasks.push(task);
  save();
  alert('Task added successfully!');

  titleInput.value = '';
  descInput.value = '';
  catSelect.value = 'Work';
  prioSelect.value = 'low';
}

function markCompleted(id) {
  const task = tasks.find(t => t.id === id);
  if (task) task.status = 'completed';
  save();
  render();
}

function undoTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) task.status = 'pending';
  save();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save();
  render();
}

// Event Listeners for filter buttons
btnAll.addEventListener('click', () => {
  currentFilter = 'all';
  openTaskDisplay('All Tasks');
  render();
});

btnCompleted.addEventListener('click', () => {
  currentFilter = 'completed';
  openTaskDisplay('Completed Tasks');
  render();
});

btnPending.addEventListener('click', () => {
  currentFilter = 'pending';
  openTaskDisplay('Pending Tasks');
  render();
});
