import "./home.scss";
import { showNewProjectModal } from "../modals/create-new-project-modal.js";
import {
  loadPage,
  setActiveMenuLink,
} from "../../common/javascript/helper/navigation-helper.js";
import { initPage } from "../../common/javascript/helper/page-init.js";
import { pageConfig } from "../../common/javascript/config/page-config.js";
import {
  getAllProjects,
  setCurrentProject,
  addProject,
  getSampleProjectTemplate,
} from "../../common/javascript/helper/project-helper.js";

/**
 * Initializes the home page:
 * - Binds the "Create Project" and "Sample Project" buttons
 * - Handles navigation to the help/resources page
 */
export const initHomePage = () => {
  // Handle "Create Project" button
  const createProjectButton = document.querySelector("#create-project-button");
  if (createProjectButton) {
    createProjectButton.addEventListener("click", (event) => {
      showNewProjectModal();
    });
  }

  // Handle "Sample Project" button
  const sampleProjectButton = document.querySelector("#sample-project-button");
  if (sampleProjectButton) {
    sampleProjectButton.addEventListener("click", async (event) => {
      const sampleProject = getSampleProjectTemplate();

      // Check if the sample project already exists in localStorage
      const existingProjects = getAllProjects();
      const alreadyExists = existingProjects.some(
        (p) => p.technicalName === sampleProject.technicalName
      );

      // If it doesn't exist, add it to storage
      if (!alreadyExists) {
        const success = addProject(sampleProject);
        if (!success) return; // Exit if project failed to be added
      }

      // Set the sample project as the current one
      setCurrentProject(sampleProject.technicalName);

      // Load the project builder page with the sample project
      try {
        await loadPage("project-builder", pageConfig, initPage, {
          projectId: sampleProject.technicalName,
        });
      } catch (error) {
        showToast("Failed to load the project builder page.", "error");
        console.error(error);
      }
    });
  }

  // Handle "View Resources" button
  const viewResourcesProjectButton = document.querySelector(
    "#view-resources-button"
  );

  if (viewResourcesProjectButton) {
    viewResourcesProjectButton.addEventListener("click", async () => {
      try {
        await loadPage("help", pageConfig, initPage);
        setActiveMenuLink("help");
      } catch (error) {
        showToast("Failed to load the help page.", "error");
        console.error(error);
      }
    });
  }
};
