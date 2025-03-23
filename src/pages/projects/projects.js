import { showNewProjectModal } from "../modals/create-new-project-modal";

const projectsCreateButton = document.querySelector("#create-project-btn");
const emptyProject = document.querySelector(".empty-project");

if (projectsCreateButton) {
  projectsCreateButton.addEventListener("click", showNewProjectModal);
}

if (emptyProject) {
  emptyProject.addEventListener("click", showNewProjectModal);
}
