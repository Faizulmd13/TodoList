import "./styles.css";
import {
  getTasksByProject,
  getInboxTasks,
  getTodayTasks,
  getThisWeekTasks,
} from "./modules/tasksManager.js";
import renderTasks from "./modules/renderTasks.js";

const inboxButton = document.querySelector(".inbox");
const todayButton = document.querySelector(".today");
const thisWeekButton = document.querySelector(".this-week");

inboxButton.addEventListener("click", () => {
  setActive(inboxButton);
  renderTasks(getInboxTasks());
});

todayButton.addEventListener("click", () => {
  setActive(todayButton);
  renderTasks(getTodayTasks());
});

thisWeekButton.addEventListener("click", () => {
  setActive(thisWeekButton);
  renderTasks(getThisWeekTasks());
});

const projectLists = document.querySelector(".project-lists");

projectLists.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-project")) {
    const projectBtn = e.target.closest(".project-btn");
    const projectName = projectBtn
      .querySelector(".project-name")
      .textContent.trim();

    let projects = getProjects();
    projects = projects.filter((p) => p !== projectName);
    saveProjects(projects);

    renderProjects();
    return;
  }

  const project = e.target.closest(".project-btn");
  if (!project) return;

  setActive(project);
  const projectName = project.querySelector(".project-name").textContent.trim();
  renderTasks(getTasksByProject(projectName));
});

function setActive(button) {
  document
    .querySelectorAll(".default-btns, .project-btn")
    .forEach((btn) => btn.classList.remove("active"));
  button.classList.add("active");
}

// LocalStorage Helpers

function getProjects() {
  return JSON.parse(localStorage.getItem("projects")) || ["Default"];
}

function saveProjects(projects) {
  localStorage.setItem("projects", JSON.stringify(projects));
}

//New Project Form Handler

const addProjectBtn = document.querySelector(".add-project-btn");
const addProjectForm = document.querySelector(".add-project-form");
const newProjectCancel = addProjectForm.querySelector(".add-project-cancel");
const newProjectConfirm = addProjectForm.querySelector(".add-project-confirm");
const newProjectInput = addProjectForm.querySelector("input");

addProjectBtn.addEventListener("click", () => {
  addProjectBtn.classList.add("hidden");
  addProjectForm.classList.remove("hidden");
  newProjectInput.focus();
});

newProjectConfirm.addEventListener("click", () => {
  const newProjectName = newProjectInput.value.trim();
  if (!newProjectName) return;

  const projects = getProjects();
  projects.push(newProjectName);
  saveProjects(projects);

  renderProjects();

  formCloser();
});

newProjectCancel.addEventListener("click", () => {
  formCloser();
});

function formCloser() {
  newProjectInput.value = "";
  addProjectForm.classList.add("hidden");
  addProjectBtn.classList.remove("hidden");
}

function renderProjects() {
  const projects = getProjects();

  projectLists.innerHTML = "";

  projects.forEach((name) => {
    const btn = document.createElement("button");
    btn.classList.add("project-btn");

    if (name == "Default") {
      btn.innerHTML = `
        <span class="material-symbols-outlined">folder_open</span>
        <span class="project-name">${name}</span>
      `;
    } else {
      btn.innerHTML = `
        <span class="material-symbols-outlined">folder_open</span>
        <span class="project-name">${name}</span>
        <span class="material-symbols-outlined delete-project">delete</span>
      `;
    }

    projectLists.appendChild(btn);
  });
}

renderProjects();
renderTasks(getInboxTasks());
setActive(inboxButton);
