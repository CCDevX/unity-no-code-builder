import { initHomePage } from "../../../pages/home/home";
//import { initProjectBuilder } from "../../../pages/project-builder/project-builder";
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
      // initProjectBuilder();
      break;
    default:
      break;
  }
};

export { initPage };
