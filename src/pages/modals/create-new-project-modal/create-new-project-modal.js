import {
  showModal,
  hideModal,
} from "../../../common/javascript/helper/modal-helper.js";

import { addProject } from "../../../common/javascript/helper/project-helper.js";

import { loadPage } from "../../../common/javascript/helper/navigation-helper.js";

import { initPage } from "../../../common/javascript/helper/page-init.js";

import { pageConfig } from "../../../common/javascript/config/page-config.js";
import { showToast } from "../../../common/javascript/helper/toast-helper.js";
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
      showToast("Veuillez entrer un nom de projet", "error");
      projectNameInput.focus();
      return;
    }

    // Validation : caractères spéciaux
    const hasSpecialChars = /[^a-zA-Z0-9\s]/.test(projectName);
    if (hasSpecialChars) {
      showToast(
        "Le nom ne peut contenir que des lettres, chiffres et espaces",
        "error"
      );
      projectNameInput.focus();
      return;
    }

    // Validation : nom technique vide (au cas où)
    if (!technicalName) {
      showToast("Impossible de générer un nom technique valide", "error");
      projectNameInput.focus();
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
  const projectNameInput = document.querySelector("#project-name");
  const technicalNameDisplay = document.querySelector("#technical-name");
  modal.style.display = "none";
  modalOverlay.style.display = "none";
  projectNameInput.value = "";
  technicalNameDisplay.textContent = "";
  hideModal();
};

const convertToTechnicalName = (name) => {
  if (!name || typeof name !== "string") return "DefaultProject";

  return (
    name
      .replace(/\s+/g, " ") // Replace multiple spaces with a single space
      .trim() // Remove leading/trailing whitespace
      .replace(/[^a-zA-Z0-9\s]/g, "") // Remove special characters, keep only letters, numbers and spaces
      .split(" ") // Split into words
      .filter((word) => word.length > 0) // Remove empty words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
      .join("") || // Join without spaces
    "DefaultProject"
  ); // Fallback if result is empty
};
