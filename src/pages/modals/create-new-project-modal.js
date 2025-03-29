import {
  showModal,
  hideModal,
} from "../../common/javascript/helper/modal-helper.js";

import { addProject } from "../../common/javascript/helper/project-helper.js";

import { loadPage } from "../../common/javascript/helper/navigation-helper.js";

import { initPage } from "../../common/javascript/helper/page-init.js";

import { pageConfig } from "../../common/javascript/config/page-config.js";

export const showNewProjectModal = async () => {
  await showModal("create-new-project-modal");

  //const modal = document.querySelector("#new-project-modal");
  const modalOverlay = document.querySelector("#modal-overlay");
  const closeModal = document.querySelector(".close-modal");
  const cancelProject = document.querySelector("#cancel-project");
  const createProjectBtn = document.querySelector("#create-project");
  const projectNameInput = document.querySelector("#project-name");
  const technicalNameDisplay = document.querySelector("#technical-name");

  modalOverlay.style.display = "block";

  projectNameInput.focus();

  if (projectNameInput.value) {
    technicalNameDisplay.textContent = convertToTechnicalName(
      projectNameInput.value
    );
  }

  projectNameInput.addEventListener("input", (event) => {
    technicalNameDisplay.textContent = convertToTechnicalName(
      event.target.value
    );
  });

  // Close modal events
  closeModal.addEventListener("click", hideNewProjectModal);
  cancelProject.addEventListener("click", hideNewProjectModal);
  modalOverlay.addEventListener("click", hideNewProjectModal);
  // Create project button in modal
  createProjectBtn.addEventListener("click", async (event) => {
    const projectName = projectNameInput.value.trim();
    const technicalName = technicalNameDisplay.textContent;

    if (!projectName) {
      alert("Please enter a project name");
      return;
    }

    const project = {
      name: projectName,
      technicalName: technicalName,
      createdAt: new Date().toISOString(),
      components: [],
    };

    const succes = addProject(project);
    if (succes) {
      hideNewProjectModal();
      console.log(initPage);
      await loadPage("project-builder", pageConfig, initPage, {
        projectId: technicalName,
      });
    }
  });
};

const hideNewProjectModal = () => {
  const modal = document.querySelector("#new-project-modal");
  const modalOverlay = document.querySelector("#modal-overlay");
  //const closeModal = document.querySelector(".close-modal");
  //const cancelProject = document.querySelector("#cancel-project");
  //const createProjectBtn = document.querySelector("#create-project");
  const projectNameInput = document.querySelector("#project-name");
  const technicalNameDisplay = document.querySelector("#technical-name");
  modal.style.display = "none";
  modalOverlay.style.display = "none";
  projectNameInput.value = "";
  technicalNameDisplay.textContent = "";
  hideModal();
};

const convertToTechnicalName = (name) => {
  return name
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .trim() // Remove leading/trailing whitespace
    .split(" ") // Split into words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
    .join(""); // Join without spaces
};
