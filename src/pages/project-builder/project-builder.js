import {
  getAllProjects,
  getCurrentProject,
} from "../../common/javascript/helper/project-helper";
import "./project-builder.scss";

let currentProject;
let projects;
let dropArea;
let selectedComponent = null;
let isDragging = false;
let draggedComponentType = null;
let dropIndicator;

const initProjectBuilder = () => {
  currentProject = getCurrentProject();
  projects = getAllProjects();
  dropArea = document.querySelector("#drop-area");
  dropIndicator = document.querySelector("#drop-indicator");

  if (!currentProject || !dropArea) return;

  const project = projects.find((p) => p.technicalName === currentProject);
  if (!project) return;

  setupProjectTitle(project);
  loadProjectState(project);
  setupTabs();
  setupDragAndDrop();

  // Auto-save after component creation or position update
  wrapWithAutoSave("createComponent");
  wrapWithAutoSave("updateComponentPositions");
};

const setupProjectTitle = (project) => {
  document.querySelector("#main-project-title").textContent = project.name;
  document.title = `${project.name} - Unity Builder`;

  const input = document.querySelector("#project-title-input");
  if (input) input.value = project.name;
};

const setupTabs = () => {
  document.querySelectorAll(".tab-item").forEach((tab) => {
    tab.addEventListener("click", (e) => {
      const target = e.currentTarget.getAttribute("data-target");
      document
        .querySelectorAll(".tab-item")
        .forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach((p) => {
        p.classList.remove("active");
        p.style.display = "none";
      });
      if (target) {
        const targetEl = document.querySelector(`#${target}`);
        if (targetEl) {
          targetEl.style.display = "block";
          targetEl.classList.add("active");
          e.currentTarget.classList.add("active");
        }
      }
    });
  });
};
const setupDragAndDrop = () => {
  document.querySelectorAll(".component-item").forEach((item) => {
    item.setAttribute("draggable", "true");
    item.addEventListener("dragstart", handleDragStart);
    item.addEventListener("mousedown", (e) =>
      e.currentTarget.classList.add("component-grabbing")
    );
    item.addEventListener("mouseup", (e) =>
      e.currentTarget.classList.remove("component-grabbing")
    );
  });

  dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    e.currentTarget.classList.add("drag-over");
    showDropIndicator(e.clientX, e.clientY);
  });

  dropArea.addEventListener("dragleave", (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");
    hideDropIndicator();
  });

  dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");
    hideDropIndicator();

    document.querySelectorAll(".component-item").forEach((item) => {
      item.classList.remove("dragging");

      const componentType = e.dataTransfer.getData("text/plain");

      createComponent(componentType, e.clientX, e.clientY);
      const emptyState = e.currentTarget.querySelector(".empty-state");
      if (emptyState) emptyState.remove();
    });
  });
};
const handleDragStart = (e) => {
  isDragging = true;
  //draggedComponentType = e.currentTarget.dataset.componentType;
  draggedComponentType = event.currentTarget.getAttribute(
    "data-component-type"
  );
  e.dataTransfer.setData("text/plain", draggedComponentType);
  e.dataTransfer.effectAllowed = "copy";

  if (e.dataTransfer.setDragImage) {
    const ghost = e.currentTarget.cloneNode(true);
    ghost.style.opacity = 0.7;
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 50, 25);
    setTimeout(() => document.body.removeChild(ghost), 0);
  }
};

const showDropIndicator = (x, y) => {
  const rect = dropArea.getBoundingClientRect();
  dropIndicator.style.left = `${x - rect.left}px`;
  dropIndicator.style.top = `${y - rect.top}px`;
  //dropIndicator.classList.add("active");
  dropIndicator.className = "drop-indicator active";
};

const hideDropIndicator = () => {
  dropIndicator = document.querySelector("#drop-indicator");
  dropIndicator.classList.remove("active");
};

dropIndicator = document.querySelector("#drop-indicator");

const loadProjectState = (project) => {
  if (project && project.components && project.components.length > 0) {
    const emptyState = dropArea.querySelector(".empty-state");
    if (emptyState) emptyState.remove();

    project.components.forEach((compState) => {
      const component = createComponentElement(compState);
      dropArea.appendChild(component);
    });

    updateComponentPositions();
  }
};

const createComponentElement = (compState) => {
  let type = compState.type;
  const content = compState.content;

  if (type === "preview") {
    if (content.includes("unity-text")) type = "text";
    else if (content.includes("unity-btn")) type = "button";
    else if (content.includes("unity-input")) type = "input";
    else if (content.includes("unity-helpbox")) type = "helpbox";
  }

  const comp = document.createElement("div");
  comp.className = `preview-component ${type}-component`;
  comp.innerHTML = content;

  if (compState.properties) {
    comp.dataset.bold = compState.properties.bold;
    comp.dataset.text = compState.properties.text;

    const textEl = comp.querySelector(".unity-text, .unity-title");
    if (textEl && compState.properties.bold) textEl.style.fontWeight = "bold";
  }

  Object.assign(comp.style, compState.styles);
  if (compState.actions) {
    comp.dataset.actionType = compState.actions.type;
    comp.dataset.actionUrl = compState.actions.url;
    comp.dataset.debugMessage = compState.actions.debugMessage;
    comp.dataset.customCode = compState.actions.customCode;
  }

  makeComponentReordable(comp);
  attachComponentEvents(comp, type);
  return comp;
};

const attachComponentEvents = (comp, type) => {
  const inner = comp.firstElementChild;
  if (!inner) return;

  inner.addEventListener("click", (e) => {
    e.stopPropagation();
    document
      .querySelectorAll(".preview-component")
      .forEach((c) => c.classList.remove("selected"));

    const container = e.currentTarget.closest(".preview-component");
    container.classList.add("selected");
    selectedComponent = container;

    const delBtn = document.querySelector("#delete-component");
    if (delBtn) delBtn.style.display = "flex";

    updateStyleEditor(container, type);
  });
};

const wrapWithAutoSave = (fnName) => {
  const original = window[fnName];
  if (typeof original !== "function") return;
  window[fnName] = function (...args) {
    const result = original.apply(this, args);
    saveProjectState();
    return result;
  };
};

const saveProjectState = () => {
  if (!currentProject) return;
  const components = [];

  dropArea.querySelectorAll(".preview-component").forEach((comp) => {
    const type = comp.className
      .split(" ")
      .find((cls) => cls.endsWith("-component"))
      ?.replace("-component", "")
      .replace("preview-", "");

    const properties = {
      bold: comp.dataset.bold === "true",
      text: comp.dataset.text || "",
    };

    const compState = {
      type,
      content: comp.innerHTML,
      styles: {
        top: comp.style.top,
        left: comp.style.left,
        width: comp.style.width,
        height: comp.style.height,
      },
      properties,
      actions: {
        type: comp.dataset.actionType || "",
        url: comp.dataset.actionUrl || "",
        debugMessage: comp.dataset.debugMessage || "",
        customCode: comp.dataset.customCode || "",
      },
    };

    components.push(compState);
  });

  const index = projects.findIndex((p) => p.technicalName === currentProject);
  if (index !== -1) {
    projects[index].components = components;
    localStorage.setItem("projects", JSON.stringify(projects));
  }
};
const makeComponentReordable = () => {};
const updateComponentPositions = () => {};

const createComponent = (type, x, y) => {
  const preview = dropArea;
  const deleteBtn = document.querySelector("#delete-component");

  const existingComponents = preview.querySelectorAll(".preview-component");
  let nextTop = 10; //Padding Top

  existingComponents.forEach((comp) => {
    const rect = comp.getBoundingClientRect();
    const bottom = comp.offsetTop + rect.height;
    nextTop = Math.max(nextTop, bottom + 10);
  });

  const component = document.createElement("div");
  component.className = `preview-component ${type}-component`;
  component.style.position = "absolute";
  component.style.top = `${nextTop}px`;
  component.style.left = `10px`;
  component.style.width = "calc(100% - 20px)";

  switch (type) {
    case "text":
      component.innerHTML = `<p class="unity-text">Texte content</p>`;
      break;
    case "button":
      component.innerHTML = `<button class="unity-btn">Bouton</button>`;
      break;
    case "input":
      component.innerHTML = `<input type="text" class="form-control unity-input" placeholder="Input field"/>`;
      break;
    case "helpbox":
      component.innerHTML = `
      <div class="unity-helpbox">
        <i class="fa-solid fa-circle-info unity-helpbox-icon"></i>
        <p class="unity-helpbox-text">Help text content</p>
      </div>`;
      break;
    default:
      component.innerHTML = `<div>Component : ${type}</div>`;
      break;
  }
  makeComponentReordable(component);

  //supprimer l'ancien gestionnaire d'évèment de sélection
  const innerElement = component.firstElementChild;
  if (innerElement) {
    component.removeEventListener("click", null);
    innerElement.addEventListener("click", (event) => {
      e.stopPropagation();
      document.querySelectorAll("preview-component").forEach((comp) => {
        comp.classList.remove("selected");
      });

      const componentContainer =
        event.currentTarget.closet(".preview-component");
      componentContainer.classList.add("selected");
      if (deleteBtn) deleteBtn.style.display.flex;
      updateStyleEditor(componentContainer, type);
    });
  }
  preview.appendChild(component);

  component.classList.add("component-placed");
  setTimeout(() => {
    component.classList.remove("component-placed");
  }, 500);
  return component;
};
const updateStyleEditor = () => {};

export { initProjectBuilder };
