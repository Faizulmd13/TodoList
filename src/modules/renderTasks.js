import Pikaday from "pikaday";
import "pikaday/css/pikaday.css"; // if you want the default styles

import {
  addTask,
  deleteTask,
  getInboxTasks,
  getTodayTasks,
  getThisWeekTasks,
  getTasksByProject,
} from "./tasksManager.js";

const tasksContainer = document.querySelector(".tasks-container");

export default function renderTasks(tasks) {
  tasksContainer.innerHTML = "";

  tasks.forEach((task) => {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task-div");

    if (task.priority === "1") taskDiv.classList.add("priority-1");
    else if (task.priority === "2") taskDiv.classList.add("priority-2");
    else if (task.priority === "3") taskDiv.classList.add("priority-3");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("task-checkbox");

    checkbox.addEventListener("click", () => {
      deleteTask(task.id);
      taskDiv.remove();
    });

    const taskTitle = document.createElement("span");
    taskTitle.classList.add("task-title");
    taskTitle.textContent = task.title;

    const dueDate = document.createElement("span");
    dueDate.classList.add("due-date");
    dueDate.textContent = task.dueDate;

    const leftContainer = document.createElement("div");
    leftContainer.classList.add("left-container");

    leftContainer.appendChild(checkbox);
    leftContainer.appendChild(taskTitle);

    taskDiv.appendChild(leftContainer);
    taskDiv.appendChild(dueDate);

    tasksContainer.appendChild(taskDiv);
  });

  const newTaskBtn = document.createElement("div");
  newTaskBtn.classList.add("new-task-btn");
  newTaskBtn.innerHTML = `
    <span class="material-symbols-outlined">add</span>
    Add Task
  `;

  newTaskBtn.addEventListener("click", () => {
    const nav = document.querySelector(".nav");
    nav.classList.remove("show");

    newTaskBtn.style.display = "none";

    const newTaskdiv = document.createElement("div");
    newTaskdiv.classList.add("new-task-div");

    const taskInputs = document.createElement("div");
    taskInputs.classList.add("task-inputs");

    const newTaskName = document.createElement("input");
    newTaskName.classList.add("new-task-name");
    newTaskName.type = "text";
    newTaskName.placeholder = "Task name";
    newTaskName.focus();

    const newTaskPriority = document.createElement("select");
    newTaskPriority.classList.add("new-task-priority");
    ["Priority", "1", "2", "3"].forEach((priority) => {
      const option = document.createElement("option");
      if (priority === "Prioirity") {
        option.value = "none";
        option.textContent = priority;
        newTaskPriority.appendChild(option);
      } else {
        option.value = priority;
        option.textContent = priority;
        newTaskPriority.appendChild(option);
      }
    });

    const newTaskDue = document.createElement("input");
    newTaskDue.classList.add("new-task-due");
    newTaskDue.type = "text";

    const dateButton = document.createElement("button");
    dateButton.classList.add("date-button");
    dateButton.innerHTML = `<span class="material-symbols-outlined">calendar_today</span>`;

    const picker = new Pikaday({
      field: newTaskDue,
      trigger: dateButton,
      format: "DD/MM/YYYY",
      toString(date) {
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
      },
    });

    taskInputs.appendChild(newTaskName);
    taskInputs.appendChild(newTaskPriority);
    taskInputs.appendChild(dateButton);
    taskInputs.appendChild(newTaskDue);

    const taskActions = document.createElement("div");
    taskActions.classList.add("task-actions");

    const addBtn = document.createElement("button");
    addBtn.textContent = "Add";
    addBtn.classList.add("task-add-btn");

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.classList.add("task-cancel-btn");
    cancelBtn.addEventListener("click", () => {
      newTaskdiv.remove();
      newTaskBtn.style.display = "flex";
    });

    taskActions.appendChild(addBtn);
    taskActions.appendChild(cancelBtn);

    newTaskdiv.appendChild(taskInputs);
    newTaskdiv.appendChild(taskActions);

    tasksContainer.appendChild(newTaskdiv);

    const active = document.querySelector(".active");

    if (active && active.classList.contains("today")) {
      const today = new Date().toISOString().split("T")[0];
      newTaskDue.value = today;
    }

    addBtn.addEventListener("click", () => {
      const title = newTaskName.value.trim();
      const dueDate = newTaskDue.value;
      const priority = newTaskPriority.value;

      if (!title || !dueDate) return;

      let project = "Default";
      if (active && active.classList.contains("project-btn")) {
        project = active.querySelector(".project-name").textContent.trim();
      }

      addTask(title, dueDate, priority, project);

      if (active && active.classList.contains("today")) {
        renderTasks(getTodayTasks());
      } else if (active && active.classList.contains("this-week")) {
        renderTasks(getThisWeekTasks());
      } else if (active && active.classList.contains("project-btn")) {
        renderTasks(getTasksByProject(project));
      } else {
        renderTasks(getInboxTasks());
      }
    });
  });

  tasksContainer.appendChild(newTaskBtn);
}
