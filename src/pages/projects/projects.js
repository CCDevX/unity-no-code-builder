import "./projects.scss";

import { loadPage } from "../../common/javascript/helper/navigation-helper";
import {
  getAllProjects,
  setCurrentProject,
} from "../../common/javascript/helper/project-helper";
import { showNewProjectModal } from "../modals/create-new-project-modal/create-new-project-modal";
import { pageConfig } from "../../common/javascript/config/page-config";
import { initPage } from "../../common/javascript/helper/page-init";

/**
 * Creates and returns an empty project card element.
 * Used when there are no projects to display.
 *
 * @param {Function} onClickCallback - Function to call when the card is clicked.
 * @returns {HTMLElement} - The DOM element for the empty project card.
 */
const createEmptyProjectCard = () => {
  const emptyCard = document.createElement("div");
  emptyCard.className = "card project-card empty";
  emptyCard.innerHTML = `
    <div class="empty-project">
      <i class="fa-solid fa-circle-plus"></i>
      <p>Create a new project</p>
    </div>`;

  // Attach click event to open the modal
  emptyCard
    .querySelector(".empty-project")
    .addEventListener("click", showNewProjectModal);

  return emptyCard;
};

/**
 * Renders the list of projects in the UI.
 * @param {Array} projects - List of project objects to render.
 * @param {HTMLElement} projectList - Container where project cards will be added.
 */
const renderProjects = (projects, projectList) => {
  if (!projectList) return;

  const fragment = document.createDocumentFragment();
  projectList.innerHTML = ""; // Clear existing content

  projects.forEach((project) => {
    const projectCard = document.createElement("div");
    projectCard.className = "card project-card";
    projectCard.innerHTML = `
      <h3>${project.name}</h3>
      <p>Technical name : ${project.technicalName}</p>
      <p>Created on : ${new Date(project.createdAt).toLocaleDateString()}</p>
      <div class="projects-actions">
        <button class="btn btn-secondary open-project" data-id="${
          project.technicalName
        }">Open</button>
        <button class="btn btn-secondary delete-project" data-id="${
          project.technicalName
        }">
          <i class="fa-solid fa-trash"></i> Delete
        </button>
      </div>`;
    fragment.appendChild(projectCard);
  });

  const emptyProjectCard = createEmptyProjectCard();
  fragment.appendChild(emptyProjectCard);

  projectList.appendChild(fragment);
};

/**
 * Initializes the Projects page by rendering the project list
 * and setting up event listeners for user interactions.
 */
const initProjectPage = () => {
  const projectsCreateButton = document.querySelector("#create-project-btn");
  const emptyProject = document.querySelector(".empty-project");
  const projects = getAllProjects();
  const projectList = document.querySelector(".cards-container");

  if (projectsCreateButton) {
    projectsCreateButton.addEventListener("click", showNewProjectModal);
  }

  if (emptyProject) {
    emptyProject.addEventListener("click", showNewProjectModal);
  }

  if (projects.length > 0 && projectList) {
    renderProjects(projects, projectList);

    projectList.addEventListener("click", async (event) => {
      const target = event.target;

      if (target.classList.contains("open-project")) {
        const projectId = target.getAttribute("data-id");

        try {
          setCurrentProject(projectId);
          await loadPage("project-builder", pageConfig, initPage, {
            projectId,
          });
        } catch (error) {
          console.error("Error loading project-builder:", error);
          showToast("Failed to open the project.", "error");
        }
      } else if (target.classList.contains("delete-project")) {
        const projectId = target.getAttribute("data-id");

        const confirmed = confirm(
          "Are you sure you want to delete this project? This action cannot be undone."
        );

        if (confirmed) {
          try {
            deleteProject(projectId);
            await loadPage("projects", pageConfig, initPage);
            showToast("Project deleted successfully.", "success");
          } catch (error) {
            console.error("Error deleting project:", error);
            showToast("Failed to delete the project.", "error");
          }
        }
      }
    });
  } else if (projectList) {
    // Render empty state if no project exists
    projectList.innerHTML = ""; // Clear previous potential placeholder
    const emptyProjectCard = createEmptyProjectCard();
    projectList.appendChild(emptyProjectCard);
  }
};

export { initProjectPage };
