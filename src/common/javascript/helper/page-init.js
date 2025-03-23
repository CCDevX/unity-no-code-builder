import { initHomePage } from "../../../pages/home/home";
import { initProjectPage } from "../../../pages/projects/projects";

const initPage = (pageName, params = {}) => {
  switch (pageName) {
    case "home":
      initHomePage();
      break;
    case "projects":
      initProjectPage();
      break;
    case "settings":
      break;
    case "help":
      break;
    case "project-builder":
      const currentProject = localStorage.getItem("currentProject");
      break;
    default:
      break;
  }
};

export { initPage };
