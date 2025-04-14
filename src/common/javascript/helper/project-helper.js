import { getFromStorage, saveToStorage } from "./local-storage-helper.js";
import { showToast } from "./toast-helper.js";

// Define keys used in localStorage to store all projects and the current project
const PROJECTS_KEY = "projects";
const CURRENT_PROJECT_KEY = "currentProject";

/**
 * Retrieve all projects stored in localStorage.
 * If none are found, returns an empty array.
 */
const getAllProjects = () => {
  return getFromStorage(PROJECTS_KEY, []);
};

/**
 * Retrieve the currently active project.
 * If none is set, returns null.
 */
const getCurrentProject = () => {
  return getFromStorage(CURRENT_PROJECT_KEY, null);
};

/**
 * Set a given project (by its technical name) as the currently active project.
 * @param {string} technicalName - Unique identifier of the project
 */
const setCurrentProject = (technicalName) => {
  saveToStorage(CURRENT_PROJECT_KEY, technicalName);
};

/**
 * Add a new project to the list of saved projects.
 * Checks for duplicates based on the technical name.
 * Also sets the newly added project as the current project.
 *
 * @param {Object} project - The project object to add
 * @returns {boolean} - True if the project was added, false if it already existed
 */
const addProject = (project) => {
  const projects = getAllProjects();

  // Check if a project with the same technical name already exists
  const alreadyExists = projects.some((p) => {
    return p.technicalName === project.technicalName;
  });

  if (alreadyExists) {
    showToast(
      "A project with the same technical name already exists.",
      "error"
    );
    return false;
  }

  // Add the new project and persist the updated list
  projects.push(project);
  saveToStorage(PROJECTS_KEY, projects);

  // Set the new project as the current one
  setCurrentProject(project.technicalName);

  return true;
};

export { getAllProjects, getCurrentProject, setCurrentProject, addProject };
