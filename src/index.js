import "./index.scss";
import {
  showModal,
  hideModal,
} from "./common/javascript/helper/modal-helper.js";

const sidebar = document.querySelector("#sidebar");
const closeSidebarBtn = document.querySelector("#close-sidebar");
const toggleSidebarBtn = document.querySelector("#toggle-sidebar");
const menuLinks = document.querySelectorAll(".menu a");
const pageTitle = document.querySelector("#page-title");
const pageContent = document.querySelector("#page-content");
const pageConfig = {
  home: {
    title: "Dashboard",
    scripts: [],
  },
  projects: {
    title: "Projects",
    scripts: [],
  },
  settings: {
    title: "Settings",
    scripts: [],
  },
  help: {
    title: "Help",
    scripts: [],
  },
  "project-builder": {
    title: "Project Builder",
    scripts: [
      "common/javascript/builder.js",
      "common/javascript/builder-export.js",
    ],
  },
};

document.addEventListener("DOMContentLoaded", (event) => {
  initializeSidebar();
  loadPage("home");
});

const initializeSidebar = () => {
  toggleSidebarBtn.addEventListener("click", toggleSidebar);

  closeSidebarBtn.addEventListener("click", closeSidebar);

  document.addEventListener("click", (event) => {
    const isClickInside =
      sidebar.contains(event.target) || toggleSidebarBtn.contains(event.target);
    if (!isClickInside && sidebar.classList.contains("active")) {
      closeSidebar();
    }
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", handleMenuClick);
  });
};

const loadPage = async (pageName, params = {}) => {
  displayLoadingState();

  pageTitle.textContent = pageConfig[pageName]?.title || "Dashboard";

  clearOldScripts();

  try {
    const html = await fetchPageContent(pageName);
    pageContent.innerHTML = html;
    console.log(
      `Loading page: ${pageName} with scripts: ${pageConfig[pageName]?.scripts}`
    );

    const loadedScripts = await loadPageScripts(pageName);
    console.log(`All scripts loaded:`, loadedScripts);

    console.log(`Page ${pageName} is fully ready.`);
    initPageFunctionality(pageName, params);
  } catch (error) {
    console.log(`Could note load page ${pageName} : ${error}`);
    pageContent.innerHTML = `<div class="error-container">
                                <h1><Error loading page/h1>
                                <button class="btn btn-primary" onclick="location.reload()" >Reload</button>
                                </div>`;
  }
};

const toggleSidebar = () => sidebar.classList.toggle("active");
const closeSidebar = () => sidebar.classList.remove("active");

const handleMenuClick = (event) => {
  event.preventDefault();
  menuLinks.forEach((item) => item.classList.remove("active"));
  event.currentTarget.classList.add("active");

  loadPage(event.currentTarget.getAttribute("data-page"));
  if (window.innerWidth <= 768) {
    closeSidebar();
  }
};

const displayLoadingState = () => {
  pageContent.innerHTML =
    '<div class="loading"><i class="fa-solid fa-spinner"></i> Loading ... </div>';
};

const clearOldScripts = () => {
  document.querySelectorAll("script[data-page-script]").forEach((script) => {
    script.remove();
  });
};

const fetchPageContent = async (pageName) => {
  const response = await fetch(`./pages/${pageName}/${pageName}.html`);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.text();
};

const loadPageScripts = async (pageName) => {
  const scripts = pageConfig[pageName]?.scripts || [];

  if (scripts.length === 0) {
    console.log(`No scripts to load for page: ${pageName}`);
    return "No scripts loaded";
  }

  console.log(`Loading scripts for page: ${pageName}`);

  return Promise.all(
    scripts.map(
      (scriptSrc) =>
        new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = scriptSrc;
          script.setAttribute("data-page-script", "");
          script.async = true; // Chargement en arrière-plan
          document.body.appendChild(script);

          script.onload = () => {
            console.log(`Script loaded: ${scriptSrc}`);
            resolve(scriptSrc); // Renvoie le script chargé
          };

          script.onerror = () => {
            console.error(`Script failed to load: ${scriptSrc}`);
            reject(new Error(`Failed to load script: ${scriptSrc}`));
          };
        })
    )
  );
};

const initPageFunctionality = (pageName, params = {}) => {
  switch (pageName) {
    case "home":
      const createProjectButton = document.querySelector(
        "#create-project-button"
      );
      if (createProjectButton) {
        createProjectButton.addEventListener("click", (event) => {
          showNewProjectModal();
        });
      }
      const sampleProjectButton = document.querySelector(
        "#sample-project-button"
      );
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
                content:
                  '<p class="unity-text">Welcome to Unity Win Builder</p>',
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
            !projects.some(
              (p) => p.technicalName === sampleProject.technicalName
            )
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
      break;
    case "projects":
      break;
    case "settings":
      break;
    case "help":
      break;
    case "project-builder":
      initProjectBuilder(params);
      break;
    default:
      break;
  }
};

const initProjectBuilder = (params) => {};

/* Modal function to export */

const showNewProjectModal = async () => {
  await showModal("create-new-project-modal");

  const modal = document.querySelector("#new-project-modal");
  const modalOverlay = document.querySelector("#modal-overlay");
  const closeModal = document.querySelector(".close-modal");
  const cancelProject = document.querySelector("#cancel-project");
  const createProjectBtn = document.querySelector("#create-project");
  const projectNameInput = document.querySelector("#project-name");
  const technicalNameDisplay = document.querySelector("#technical-name");

  console.log("cancel project : ", cancelProject);

  //modal.style.display = "block";
  modalOverlay.style.display = "block";

  projectNameInput.focus();

  if (projectNameInput.value) {
    technicalNameDisplay.textContent = convertToTechnicalName(
      projectNameInput.value
    );
  }

  projectNameInput.addEventListener("input", (event) => {
    technicalNameDisplay.textContent = convertToTechnicalName(
      event.target.value
    );
  });

  // Close modal events
  closeModal.addEventListener("click", hideNewProjectModal);
  cancelProject.addEventListener("click", hideNewProjectModal);
  modalOverlay.addEventListener("click", hideNewProjectModal);
  // Create project button in modal
  createProjectBtn.addEventListener("click", (event) => {
    // TODO
  });
};

const hideNewProjectModal = () => {
  const modal = document.querySelector("#new-project-modal");
  const modalOverlay = document.querySelector("#modal-overlay");
  const closeModal = document.querySelector(".close-modal");
  const cancelProject = document.querySelector("#cancel-project");
  const createProjectBtn = document.querySelector("#create-project");
  const projectNameInput = document.querySelector("#project-name");
  const technicalNameDisplay = document.querySelector("#technical-name");
  modal.style.display = "none";
  modalOverlay.style.display = "none";
  projectNameInput.value = "";
  technicalNameDisplay.textContent = "";
  hideModal();
};

const convertToTechnicalName = (name) => {
  return name
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .trim() // Remove leading/trailing whitespace
    .split(" ") // Split into words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
    .join(""); // Join without spaces
};
