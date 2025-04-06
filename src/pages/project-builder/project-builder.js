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
const getComponentIndex = (element) => {
  return Array.from(dropArea.querySelectorAll(".preview-component")).indexOf(
    element
  );
};

const reorderComponents = (element, newIndex) => {
  const components = Array.from(
    dropArea.querySelectorAll(".preview-component")
  );

  if (newIndex >= components.length) {
    dropArea.appendChild(element);
  } else {
    dropArea.insertBefore(element, components[newIndex]);
  }

  updateComponentPositions();
};

const makeComponentReordable = (element) => {
  let startY;
  let initialIndex;

  const drag = (e) => {
    const deltaY = e.clientY - startY;
    const components = Array.from(
      dropArea.querySelectorAll(".preview-component")
    );
    const currentIndex = getComponentIndex(element);

    let newIndex = currentIndex;
    if (deltaY < 0 && currentIndex > 0) {
      const prevComponent = components[currentIndex - 1];
      if (e.clientY < prevComponent.getBoundingClientRect().bottom) {
        newIndex--;
      }
    } else if (deltaY > 0 && currentIndex < components.length - 1) {
      const nextComponent = components[currentIndex + 1];
      if (e.clientY > nextComponent.getBoundingClientRect().top) {
        newIndex++;
      }
    }

    if (newIndex !== currentIndex) {
      reorderComponents(element, newIndex);
      startY = e.clientY;
    }
  };

  const stopDrag = () => {
    element.classList.remove("dragging");
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseup", stopDrag);
    updateComponentPositions();
  };

  const startDrag = (e) => {
    e.preventDefault();
    startY = e.clientY;
    element.classList.add("dragging");
    initialIndex = getComponentIndex(element);

    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);
  };
  element.addEventListener("mousedown", startDrag);
};
const updateComponentPositions = () => {
  const components = dropArea.querySelectorAll(".preview-component");
  let currentTop = 10;

  components.forEach((comp) => {
    comp.style.top = `${currentTop}px`;
    const height = comp.getBoundingClientRect().height;
    currentTop += height + 10;
  });

  if (components.length > 0) {
    dropArea.style.height = `${currentTop}px`;
  } else {
    dropArea.style.height = "500px";
  }
};

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
const updateStyleEditor = (component, componentType) => {
  const boldGroup = document.querySelector(".form-group:has(#element-bold)");
  const textGroup = document.querySelector(".form-group:has(#element-text)");

  boldGroup.classList.add("disabled");
  textGroup.classList.add("disabled");

  switch (componentType) {
    case "text":
      boldGroup.classList.remove("disabled");
      textGroup.classList.remove("disabled");
      break;
    case "button":
    case "input":
    case "helpbox":
      textGroup.classList.remove("disabled");
      break;
    default:
      break;
  }

  const boldInput = document.querySelector("#element-bold");
  const textInput = document.querySelector("#element-text");
  if (boldInput) {
    boldInput.checked = component.dataset.bold === "true";
    boldInput.addEventListener("change", (event) => {
      component.dataset.bold = event.currentTarget.checked;
      const textElement = component.querySelector(".unity-text .unity-title");
      if (textElement) {
        textElement.style.fontWeight = event.currentTarget.checked
          ? "bold"
          : "normal";
      }
      saveProjectState();
    });
  }

  if (textInput) {
    textInput.value = component.dataset.text || "";
    textInput.addEventListener("input", (event) => {
      component.dataset.text = event.currentTarget.value;
      const textElement = component.querySelector(".unity-text .unity-title");
      if (textElement) {
        textElement.textContent = event.currentTarget.value;
      }
      saveProjectState();
    });
  }

  //mettre à jour l'éditeur d'action

  actionTypeSelect.value = component.dataset.actionType || "";
  actionUrlInput.value = "";
  actionCodeInput.value = "";

  if (component.dataset.actionType === "CustomCode") {
    actionUrlInput.style.display = "none";
    actionCodeInput.style.display = "block";
    actionCodeInput.value = component.dataset.customCode || "";
  } else {
    actionUrlInput.style.display = "block";
    actionCodeInput.style.display = "none";
    actionCodeInput.value =
      component.dataset.actionType === "DebugLog"
        ? component.dataset.debugMessage
        : component.dataset.actionUrl || "";
  }

  actionParams.style.display =
    component.dataset.actionType === "OpenUrl" ||
    component.dataset.actionType === "DebugLog" ||
    component.dataset.actionType === "CustomCode"
      ? "block"
      : "none";

  if (component.dataset.actionType === "DebugLog") {
    actionUrlInput.placeholder = "Enter debug message ...";
  } else if (component.dataset.actionType === "OpenUrl") {
    actionUrlInput.placeholder = "https://...";
  }

  removeActionBtn.style.display = component.dataset.actionType
    ? "inline-block"
    : "none";

  //générer la visibilité de l'onglet Actions
  const actionsTabs = document.querySelector(
    ".tab-item[data-target='actions']"
  );
  const actionsPane = document.querySelector("#actions");

  // N'afficher l'onglet Actions que pour les boutons
  if (componentType === "button") {
    actionsTab.style.display = "block";
  } else {
    actionsTab.style.display = "none";
    // Si l'onglet Actions est actif mais qu'on sélectionne un non-bouton
    if (actionsPane.classList.contains("active")) {
      // Basculer vers l'onglet Properties
      document.querySelector('.tab-item[data-target="styles"]').click();
    }
  }
};

export { initProjectBuilder };
