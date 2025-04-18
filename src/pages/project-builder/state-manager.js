import {
  getAllProjects,
  getCurrentProject,
  getProjectByTechnicalName,
} from "../../common/javascript/helper/project-helper";

let selectedComponent = null;

const loadProjectState = (dropArea) => {
  const currentProject = getCurrentProject();
  if (!currentProject) return;

  const projects = getAllProjects();
  const project = getProjectByTechnicalName(currentProject);

  if (!project || !project.components) return;

  clearEmptyState(dropArea);

  project.components.forEach((compState) => {
    const component = rebuildComponent(compState);
    if (!component) return;

    makeComponentReorderable(component);
    addSelectionEvents(component, compState.type);
    dropArea.appendChild(component);
  });

  updateComponentPositions();
};

const clearEmptyState = (dropArea) => {
  const emptyState = dropArea.querySelector(".empty-state");
  if (emptyState) emptyState.remove();
};

const detectComponentType = (compState) => {
  if (compState.type !== "preview") {
    return compState.type;
  }

  const typeMap = {
    "unity-text": "text",
    "unity-btn": "button",
    "unity-input": "input",
    "unity-helpbox": "helpbox",
  };

  for (const key in typeMap) {
    if (compState.content.includes(key)) {
      return typeMap[key];
    }
  }

  return "unknown";
};

function rebuildComponent(compState) {
  const componentType = detectComponentType(compState);
  const component = document.createElement("div");
  component.className = `preview-component ${componentType}-component`;
  component.innerHTML = compState.content;

  applySavedProperties(component, compState);
  applySavedStyles(component, compState);
  applySavedActions(component, compState);

  return component;
}

const applySavedStyles = (component, compState) => {
  if (compState.styles) {
    Object.assign(component.style, compState.styles);
  }
};

const applySavedActions = (component, compState) => {
  if (!compState.actions) return;

  component.dataset.actionType = compState.actions.type;
  component.dataset.actionUrl = compState.actions.url;
  component.dataset.debugMessage = compState.actions.debugMessage;
  component.dataset.customCode = compState.actions.customCode;
};

function applySavedProperties(component, compState) {
  if (!compState.properties) return;

  component.dataset.bold = compState.properties.bold;
  component.dataset.text = compState.properties.text;

  const textElement = component.querySelector(".unity-text, .unity-title");
  if (textElement && compState.properties.bold) {
    textElement.style.fontWeight = "bold";
  }
}

const addSelectionEvents = (component, componentType) => {
  const innerElement = component.firstElementChild;
  if (!innerElement) return;

  innerElement.addEventListener("click", function (e) {
    e.stopPropagation();

    document
      .querySelectorAll(".preview-component")
      .forEach((comp) => comp.classList.remove("selected"));

    const componentContainer = this.closest(".preview-component");
    componentContainer.classList.add("selected");
    selectedComponent = componentContainer;

    const deleteBtn = document.getElementById("delete-component");
    if (deleteBtn) deleteBtn.style.display = "flex";

    updateStyleEditor(componentContainer, componentType);
  });
};

const saveProjectState = (dropArea) => {
  const currentProject = getCurrentProject();
  if (!currentProject) return;

  const components = Array.from(
    dropArea.querySelectorAll(".preview-component")
  ).map((comp) => extractComponentState(comp));

  const projects = getAllProjects();
  const projectIndex = projects.findIndex(
    (p) => p.technicalName === currentProject
  );

  if (projectIndex !== -1) {
    projects[projectIndex].components = components;
    saveToStorage("projects", projects);
  }
};

const extractComponentState = (comp) => {
  return {
    type: extractComponentType(comp),
    content: comp.innerHTML,
    styles: extractComponentStyles(comp),
    properties: extractComponentProperties(comp),
    actions: extractComponentActions(comp),
  };
};

const extractComponentType = (comp) => {
  return (
    comp.className
      .split(" ")
      .find((cls) => cls.endsWith("-component"))
      ?.replace("-component", "")
      ?.replace("preview-", "") || "unknown"
  );
};

const extractComponentProperties = (comp) => {
  const isSelected = comp.classList.contains("selected");
  const boldInput = document.getElementById("element-bold");
  const textInput = document.getElementById("element-text");

  return {
    bold: isSelected
      ? boldInput?.checked || false
      : comp.dataset.bold === "true",
    text: isSelected ? textInput?.value || "" : comp.dataset.text || "",
  };
};

const extractComponentStyles = (comp) => ({
  top: comp.style.top,
  left: comp.style.left,
  width: comp.style.width,
  height: comp.style.height,
});

const extractComponentActions = (comp) => ({
  type: comp.dataset.actionType || "",
  url: comp.dataset.actionUrl || "",
  debugMessage: comp.dataset.debugMessage || "",
  customCode: comp.dataset.customCode || "",
});

export { loadProjectState, saveProjectState };
