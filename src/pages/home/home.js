import { showNewProjectModal } from "../modals/create-new-project-modal.js";

export const initHomePage = () => {
  const createProjectButton = document.querySelector("#create-project-button");
  if (createProjectButton) {
    createProjectButton.addEventListener("click", (event) => {
      showNewProjectModal();
    });
  }
  const sampleProjectButton = document.querySelector("#sample-project-button");
  if (sampleProjectButton) {
    sampleProjectButton.addEventListener("click", (event) => {
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

      // Retrieve existing projects

      let projects = JSON.parse(localStorage.getItem("projects") || "[]");

      // Check if the project already exists
      if (
        !projects.some((p) => p.technicalName === sampleProject.technicalName)
      ) {
        projects.push(sampleProject);
        localStorage.setItem("projects", JSON.stringify(projects));
      }

      // Set as the current project and redirect

      localStorage.setItem("currentProject", sampleProject.technicalName);
      loadPage("project-builder", {
        projectId: sampleProject.technicalName,
      });
    });
  }

  const viewResourcesProjectButton = document.querySelector(
    "#view-resources-button"
  );

  if (viewResourcesProjectButton) {
    viewResourcesProjectButton.addEventListener("click", () => {
      document.querySelectorAll(".menu a").forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("data-page") === "help") {
          link.classList.add("active");
        }
      });
      loadPage("help");
    });
  }
};
