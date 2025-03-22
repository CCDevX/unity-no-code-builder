import { initHomePage } from "../../../pages/home/home";

const initPage = (pageName, params = {}) => {
  switch (pageName) {
    case "home":
      initHomePage();
      break;
    case "projects":
      break;
    case "settings":
      break;
    case "help":
      break;
    case "project-builder":
      const currentProject = localStorage.getItem("currentProject");
      //initProjectBuilder(params);
      break;
    default:
      break;
  }
};

export { initPage };
