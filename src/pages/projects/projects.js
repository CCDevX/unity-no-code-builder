import "./projects.scss";

import { loadPage } from "../../common/javascript/helper/navigation-helper";
import {
  getAllProjects,
  setCurrentProject,
} from "../../common/javascript/helper/project-helper";
import { showNewProjectModal } from "../modals/create-new-project-modal";
import { pageConfig } from "../../common/javascript/config/page-config";
import { initPage } from "../../common/javascript/helper/page-init";

const initProjectPage = () => {
  const projectsCreateButton = document.querySelector("#create-project-btn");
  const emptyProject = document.querySelector(".empty-project");
  const projects = getAllProjects();

  if (projectsCreateButton) {
    projectsCreateButton.addEventListener("click", showNewProjectModal);
  }

  if (emptyProject) {
    emptyProject.addEventListener("click", showNewProjectModal);
  }

  if (projects.length > 0) {
    const projectList = document.querySelector(".cards-container");
    if (projectList && projectList.querySelector(".empty-project")) {
      projectList.innerHTML = "";
      projects.forEach((project) => {
        console.log("project : ", project);
        const projectCard = document.createElement("div");
        projectCard.className = "card project-card";
        projectCard.innerHTML = `<h3>${project.name}</h3>
      <p>Technical name : ${project.technicalName}</p>
      <p>Created on : ${new Date(project.createdAt).toLocaleDateString()}</p>
      <div class="projects-actions">
        <button id="save-key" class="btn btn-secondary open-project" data-id="${
          project.technicalName
        }">Open</button>
        <button id="save-key" class="btn btn-secondary delete-project" data-id="${
          project.technicalName
        }"><i class="fa-solid fa-trash"></i> Delete</button>

      </div>`;
        projectList.appendChild(projectCard);
      });

      const emptyProjectCard = document.createElement("div");
      emptyProjectCard.className = "card project-card empty";
      emptyProjectCard.innerHTML = `
    <div class="empty-project">
      <i class="fa-solid fa-circle-plus"></i>
      <p>Create a new project</p>
    </div>`;

      projectList.appendChild(emptyProjectCard);

      emptyProjectCard
        .querySelector(".empty-project")
        .addEventListener("click", showNewProjectModal);
    }

    document.querySelectorAll(".open-project").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const projectId = event.currentTarget.getAttribute("data-id");
        //localStorage.setItem("currentProject", projectId);
        setCurrentProject(projectId);
        await loadPage("project-builder", pageConfig, initPage, { projectId });
      });
    });

    document.querySelectorAll(".delete-project").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const projectId = event.currentTarget.getAttribute("data-id");
        if (
          confirm(
            "Are you sure you want to delete this project ? This action cannot bu undone."
          )
        ) {
          deleteProject(projectId);
          await loadPage("projects", pageConfig, initPage);
        }
      });
    });
  }
};

const deleteProject = (projectId) => {
  let projects = getAllProjects();

  projects = projects.filter((p) => {
    return p.technicalName !== projectId;
  });
  localStorage.setItem("projects", JSON.stringify(projects));

  if (localStorage.getItem("currentProjet") === projectId) {
    localStorage.removeItem("currentProject");
  }
};

export { initProjectPage };
