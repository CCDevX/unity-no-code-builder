import "./project-builder.scss";
import "../../common/scss/component/_unity-components.scss";
import {
  getAllProjects,
  getCurrentProject,
} from "../../common/javascript/helper/project-helper";
import { loadProjectState } from "./helper/state-manager";
import { initTabs } from "./helper/tabs";
import { initDragAndDrop } from "./helper/dragdrop-handler";
import { useAutoSaveOnCreate } from "./helper/builder-autosave-hooks";
import { initComponentEvents } from "./helper/builder-events";
import { initGroqHandler } from "./helper/groc-handler";
import { initExportButton } from "./helper/builder-export";

const initProjectBuilderPage = () => {
  const currentProject = getCurrentProject();
  const dropArea = document.querySelector("#drop-area");
  const dropIndicator = document.querySelector("#drop-indicator");
  const createComponentWithSave = useAutoSaveOnCreate();

  updateProjectTitle(currentProject);
  loadProjectState(dropArea);
  initTabs();
  initDragAndDrop(dropArea, dropIndicator, createComponentWithSave);
  initComponentEvents(dropArea);
  initGroqHandler();
  initExportButton();
};

/**
 * Updates the UI title elements (main heading and input) based on the current project.
 * @param {Object} project - The project object to use for updating the title.
 */
const updateProjectTitle = (project) => {
  if (!project) return;

  const mainTitle = document.querySelector("#main-project-title");
  if (mainTitle) {
    mainTitle.textContent = project.name;
    document.title = `${project.name} - Unity UI Builder`;
  }

  const titleInput = document.querySelector("#project-title-input");
  if (titleInput) {
    titleInput.value = project.name;
  }
};

export { initProjectBuilderPage };
