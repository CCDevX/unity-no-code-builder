import { initHomePage } from "../../../pages/home/home";
//import { initProjectBuilder } from "../../../pages/project-builder/project-builder";
import { initProjectPage } from "../../../pages/projects/projects";
import { initSettingsPage } from "../../../pages/settings/settings";

/**
 * Initialize logic and behavior specific to the given page.
 * Each case corresponds to a page name declared in the pageConfig object.
 *
 * @param {string} pageName - The name of the page to initialize.
 * @param {Object} params - Optional parameters for the page initialization.
 */
const initPage = (pageName, params = {}) => {
  switch (pageName) {
    case "home":
      try {
        initHomePage();
      } catch (e) {
        console.error(`Error initializing "home" page:`, e);
      }
      break;

    case "projects":
      try {
        initProjectPage();
      } catch (e) {
        console.error(`Error initializing "projects" page:`, e);
      }
      break;

    case "settings":
      try {
        initSettingsPage();
      } catch (e) {
        console.error(`Error initializing "settings" page:`, e);
      }
      break;

    case "help":
      // No logic yet for the "help" page — safe to leave empty
      break;

    case "project-builder":
      // Uncomment this when you implement the init function
      // try {
      //   initProjectBuilder();
      // } catch (e) {
      //   console.error(`Error initializing "project-builder" page:`, e);
      // }
      break;

    default:
      console.warn(`Unknown page: "${pageName}"`);
      break;
  }
};

export { initPage };
