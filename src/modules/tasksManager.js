import { isToday, isThisWeek, parseISO, parse } from "date-fns";

let currentTasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(currentTasks));
}

function generateID() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

function addTask(title, dueDate, priority = "none", project = "none") {
  const newTask = {
    id: generateID(),
    title,
    dueDate,
    priority,
    project,
  };

  currentTasks.push(newTask);
  saveTasks();
  return newTask;
}

function deleteTask(id) {
  currentTasks = currentTasks.filter((task) => task.id !== id);
  saveTasks();
}

function getTasksByProject(project) {
  return currentTasks.filter((task) => task.project === project);
}

function getInboxTasks() {
  return currentTasks;
}

function getTodayTasks() {
  return currentTasks.filter((task) => isToday(parseISO(task.dueDate)));
}

function getThisWeekTasks() {
  return currentTasks.filter((task) => isThisWeek(parseISO(task.dueDate)));
}

export {
  addTask,
  deleteTask,
  getInboxTasks,
  getTodayTasks,
  getThisWeekTasks,
  getTasksByProject,
};
