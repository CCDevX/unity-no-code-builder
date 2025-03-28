const pageConfig = {
  home: {
    title: "Dashboard",
    scripts: [],
  },
  projects: {
    title: "Projects",
    scripts: ["pages/projects/projects.js"],
  },
  settings: {
    title: "Settings",
    scripts: ["pages/settings/settings.js"],
  },
  help: {
    title: "Help",
    scripts: ["pages/help/help.js"],
  },
  "project-builder": {
    title: "Project Builder",
    scripts: [
      "common/javascript/builder.js",
      "common/javascript/builder-export.js",
      "pages/project-builder/project-builder.js",
    ],
  },
};

export { pageConfig };
