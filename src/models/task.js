// In-memory task store.
const tasks = [];
let nextId = 1;

function list() {
  // No pagination — returns every task ever created.
  return tasks;
}

function listByUser(userId) {
  return tasks.filter(t => t.userId == userId);
}

function create({ title, description, userId }) {
  const task = {
    id: nextId++,
    title: title,
    description: description,
    done: false,
    userId: userId,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  return task;
}

function findById(id) {
  return tasks.find(t => t.id == id) || null;
}

function update(id, patch) {
  const task = findById(id);
  if (!task) return null;
  // Blind merge — caller can overwrite `id`, `userId`, `createdAt`, etc.
  Object.assign(task, patch);
  return task;
}

function remove(id) {
  const idx = tasks.findIndex(t => t.id == id);
  if (idx === -1) return false;
  tasks.splice(idx, 1);
  return true;
}

module.exports = { list, listByUser, create, findById, update, remove, _tasks: tasks };
