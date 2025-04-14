import "./home.scss";
import { showNewProjectModal } from "../modals/create-new-project-modal.js";
import {
  loadPage,
  setActiveMenuLink,
} from "../../common/javascript/helper/navigation-helper.js";
import { initPage } from "../../common/javascript/helper/page-init.js";
import { pageConfig } from "../../common/javascript/config/page-config.js";
import {
  setCurrentProject,
  addProject,
} from "../../common/javascript/helper/project-helper.js";

export const initHomePage = () => {
  const createProjectButton = document.querySelector("#create-project-button");
  if (createProjectButton) {
    createProjectButton.addEventListener("click", (event) => {
      showNewProjectModal();
    });
  }
  const sampleProjectButton = document.querySelector("#sample-project-button");
  if (sampleProjectButton) {
    sampleProjectButton.addEventListener("click", async (event) => {
      const sampleProject = {
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

      const success = addProject(sampleProject);
      try {
        await loadPage("project-builder", pageConfig, initPage, {
          projectId: sampleProject.technicalName,
        });
      } catch (error) {
        showToast("Failed to load the project builder page.", "error");
        console.error(error);
      }
    });
  }

  const viewResourcesProjectButton = document.querySelector(
    "#view-resources-button"
  );

  if (viewResourcesProjectButton) {
    viewResourcesProjectButton.addEventListener("click", async () => {
      try {
        await loadPage("help", pageConfig, initPage);
        setActiveMenuLink("help");
      } catch (error) {
        showToast("Failed to load the help page.", "error");
        console.error(error);
      }
    });
  }
};
