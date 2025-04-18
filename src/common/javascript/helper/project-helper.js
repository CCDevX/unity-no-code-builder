import { getFromStorage, saveToStorage } from "./local-storage-helper.js";
import { showToast } from "./toast-helper.js";

// Define keys used in localStorage to store all projects and the current project
const PROJECTS_KEY = "projects";
const CURRENT_PROJECT_KEY = "currentProject";

/**
 * Safely retrieves all saved projects.
 * @returns {Array} List of projects or an empty array if error occurs
 */
const getAllProjects = () => {
  try {
    return getFromStorage(PROJECTS_KEY, []);
  } catch (error) {
    console.error("Failed to get projects from storage:", error);
    showToast("Failed to load your projects.", "error");
    return [];
  }
};

/**
 * Retrieves the currently selected project from storage.
 * @returns {string|null} The current project ID or null
 */
const getCurrentProject = () => {
  try {
    return getFromStorage(CURRENT_PROJECT_KEY, null);
  } catch (error) {
    console.error("Failed to get current project:", error);
    showToast("Could not retrieve the current project.", "error");
    return null;
  }
};

/**
 * Sets the current active project in storage.
 * @param {string} technicalName - ID of the project to set as current
 */
const setCurrentProject = (technicalName) => {
  try {
    saveToStorage(CURRENT_PROJECT_KEY, technicalName);
  } catch (error) {
    console.error("Failed to set current project:", error);
    showToast("Could not save the selected project.", "error");
  }
};

/**
 * Retrieves a project object by its `technicalName`.
 * @param {string} technicalName - The technical identifier of the project
 * @returns {Object|null} The project object if found, otherwise null
 */
const getProjectByTechnicalName = (technicalName) => {
  try {
    if (!technicalName) return null;
    const projects = getAllProjects();
    return projects.find((p) => p.technicalName === technicalName) || null;
  } catch (error) {
    console.error("Failed to get project by technical name:", error);
    showToast("Could not retrieve the project.", "error");
    return null;
  }
};

/**
 * Adds a new project to localStorage.
 * Prevents duplicates and sets it as the active project.
 * @param {Object} project - New project data
 * @returns {boolean} True if added, false if duplicate or error
 */
const addProject = (project) => {
  try {
    const projects = getAllProjects();

    const alreadyExists = projects.some(
      (p) => p.technicalName === project.technicalName
    );

    if (alreadyExists) {
      showToast(
        "A project with the same technical name already exists.",
        "error"
      );
      return false;
    }

    projects.push(project);
    saveToStorage(PROJECTS_KEY, projects);
    setCurrentProject(project.technicalName);
    showToast("Project added successfully.", "success");
    return true;
  } catch (error) {
    console.error("Failed to add project:", error);
    showToast("Error while adding the project.", "error");
    return false;
  }
};

/**
 * Deletes a project and unsets it if it was active.
 * @param {string} projectId - The technical name of the project
 */
const deleteProject = (projectId) => {
  try {
    let projects = getAllProjects();
    projects = projects.filter((p) => p.technicalName !== projectId);
    saveToStorage(PROJECTS_KEY, projects);

    if (getCurrentProject() === projectId) {
      localStorage.removeItem(CURRENT_PROJECT_KEY);
    }

    showToast("Project deleted successfully.", "success");
  } catch (error) {
    console.error("Failed to delete project:", error);
    showToast("Error while deleting the project.", "error");
  }
};

/**
 * Returns a predefined sample project structure.
 * Useful for demonstration purposes.
 * @returns {Object} The sample project
 */
const getSampleProjectTemplate = () => {
  return {
    name: "Sample Project",
    technicalName: "SampleProject",
    createdAt: new Date().toISOString(),
    isSample: true,
    components: [
      {
        type: "preview",
        content: '<p class="unity-text">Welcome to Unity Win Builder</p>',
        properties: {
          bold: true,
          text: "Welcome to Unity Win Builder",
          values: "",
        },
        styles: {
          top: "10px",
          left: "10px",
          width: "calc(100% - 20px)",
          height: "",
        },
        actions: {
          type: "",
          url: "",
          debugMessage: "",
          customCode: "",
        },
      },
      {
        type: "preview",
        content: '<button class="unity-btn">Click me!</button>',
        properties: { bold: false, text: "Click me!", values: "" },
        styles: {
          top: "60px",
          left: "10px",
          width: "calc(100% - 20px)",
          height: "",
        },
        actions: {
          type: "DebugLog",
          url: "",
          debugMessage: "Button clicked!",
          customCode: "",
        },
      },
    ],
  };
};

export {
  getAllProjects,
  getCurrentProject,
  setCurrentProject,
  addProject,
  deleteProject,
  getSampleProjectTemplate,
  getProjectByTechnicalName,
};
