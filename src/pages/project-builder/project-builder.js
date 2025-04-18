import {
  getAllProjects,
  getCurrentProject,
} from "../../common/javascript/helper/project-helper";

const initProjectBuilderPage = () => {
  const currentProject = getCurrentProject();
  const projects = getAllProjects();
  const dropArea = document.querySelector("#drop-area");
  const componentItems = document.querySelectorAll(".component-item");
  const dropIndicator = document.querySelector("#drop-indicator");

  updateProjectTitle(currentProject);
  loadProjectState(dropArea);
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
