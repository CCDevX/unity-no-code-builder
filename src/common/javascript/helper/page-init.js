import { initHomePage } from "../../../pages/home/home";
import { initProjectPage } from "../../../pages/projects/projects";
import { initSettingsPage } from "../../../pages/settings/settings";

const initPage = (pageName, params = {}) => {
  switch (pageName) {
    case "home":
      initHomePage();
      break;
    case "projects":
      initProjectPage();
      break;
    case "settings":
      try {
        initSettingsPage();
      } catch (e) {
        console.log(e);
      }

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
