import {
  getAllProjects,
  getCurrentProject,
} from "../../common/javascript/helper/project-helper";

const initProjectBuilderPage = () => {
  const currentProject = getCurrentProject();
  const projects = getAllProjects();
  const dropArea = document.getElementById("drop-area");
  loadProjectState(dropArea);
};

export { initProjectBuilderPage };
