// 第三階段：JavaScript 功能

// 用陣列保存所有任務，每個任務是 { id, text, completed }
let tasks = [];
let nextId = 1;
let currentFilter = 'all'; // all / active / completed

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const message = document.getElementById('message');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filter-btn');
const totalCount = document.getElementById('total-count');
const activeCount = document.getElementById('active-count');
const completedCount = document.getElementById('completed-count');

// ---------- 新增任務 ----------
function addTask(text) {
  tasks.push({ id: nextId, text: text, completed: false });
  nextId++;
  render();
}

// ---------- 完成／取消完成 ----------
function toggleTask(id) {
  const task = tasks.find(function (t) {
    return t.id === id;
  });
  task.completed = !task.completed;
  render();
}

// ---------- 刪除任務 ----------
function deleteTask(id) {
  tasks = tasks.filter(function (t) {
    return t.id !== id;
  });
  render();
}

// ---------- 依照目前的篩選條件取出要顯示的任務 ----------
function getFilteredTasks() {
  if (currentFilter === 'active') {
    return tasks.filter(function (t) {
      return !t.completed;
    });
  }
  if (currentFilter === 'completed') {
    return tasks.filter(function (t) {
      return t.completed;
    });
  }
  return tasks;
}

// ---------- 更新畫面：重新產生任務清單和統計數字 ----------
function render() {
  taskList.innerHTML = '';

  const visibleTasks = getFilteredTasks();

  visibleTasks.forEach(function (task) {
    const li = document.createElement('li');
    li.className = 'task-item';
    if (task.completed) {
      li.classList.add('completed');
    }

    const label = document.createElement('label');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', function () {
      toggleTask(task.id);
    });

    const span = document.createElement('span');
    span.textContent = task.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '刪除';
    deleteBtn.addEventListener('click', function () {
      deleteTask(task.id);
    });

    label.appendChild(checkbox);
    label.appendChild(span);
    li.appendChild(label);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });

  if (visibleTasks.length === 0) {
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = '目前沒有任務';
    taskList.appendChild(li);
  }

  updateStats();
}

// ---------- 統計資訊 ----------
function updateStats() {
  const completed = tasks.filter(function (t) {
    return t.completed;
  }).length;

  totalCount.textContent = tasks.length;
  activeCount.textContent = tasks.length - completed;
  completedCount.textContent = completed;
}

// ---------- 事件：送出表單 ----------
taskForm.addEventListener('submit', function (event) {
  event.preventDefault(); // 避免表單送出後重新整理頁面

  const text = taskInput.value.trim();

  // 沒有輸入內容（或只有空白）就不新增
  if (text === '') {
    message.textContent = '請輸入任務名稱！';
    taskInput.focus();
    return;
  }

  message.textContent = '';
  addTask(text);
  taskInput.value = '';
  taskInput.focus();
});

// ---------- 事件：切換篩選 ----------
filterButtons.forEach(function (btn) {
  btn.addEventListener('click', function () {
    currentFilter = btn.dataset.filter;

    filterButtons.forEach(function (b) {
      b.classList.remove('active');
    });
    btn.classList.add('active');

    render();
  });
});

render();
