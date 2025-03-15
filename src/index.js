import "./index.scss";
import "./common/scss/main.scss";

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
