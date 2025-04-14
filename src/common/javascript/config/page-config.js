// Configuration object for all application pages.
// Each key represents a page, and contains metadata such as the title and required script files.

const pageConfig = {
  // Home page configuration
  home: {
    title: "Dashboard", // Display title for the header
    scripts: ["pages/home/home.js"], // JavaScript files to load for this page
  },

  // Projects list page
  projects: {
    title: "Projects",
    scripts: ["pages/projects/projects.js"],
  },

  // Application settings page
  settings: {
    title: "Settings",
    scripts: ["pages/settings/settings.js"],
  },

  // Help or support page
  help: {
    title: "Help",
    scripts: ["pages/help/help.js"],
  },

  // Project builder (editor) page
  "project-builder": {
    title: "Project Builder",
    scripts: [
      "pages/project-builder/builder-export.js", // Script for exporting the project
      "pages/project-builder/project-builder.js", // Main script for the builder UI logic
    ],
  },
};

// Export the configuration object
export { pageConfig };
