import { getFromStorage, saveToStorage } from "./local-storage-helper.js";

const PROJECTS_KEY = "projects";
const CURRENT_PROJECT_KEY = "currentProject";

const getAllProjects = () => {
  return getFromStorage(PROJECTS_KEY, []);
};

const getCurrentProject = () => {
  return getFromStorage(CURRENT_PROJECT_KEY, null);
};

const setCurrentProject = (technicalName) => {
  saveToStorage(CURRENT_PROJECT_KEY, technicalName);
};

const addProject = (project) => {
  const projects = getAllProjects();

  const alreadyExists = projects.some((p) => {
    return p.technicalName === project.technicalName;
  });

  if (alreadyExists) {
    alert("A project with the same technical name already exists.");
    return false;
  }

  projects.push(project);
  saveToStorage(PROJECTS_KEY, projects);
  setCurrentProject(project.technicalName);
  return true;
};

export { getAllProjects, getCurrentProject, setCurrentProject, addProject };
