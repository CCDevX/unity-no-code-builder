import { saveProjectState } from "./state-manager";

const dropArea = document.querySelector("#drop-area");
/**
 * Creates a UI component inside the drop area.
 * @param {string} type - The type of component (button, input, etc.)
 * @param {number} x - Mouse X position (unused for now)
 * @param {number} y - Mouse Y position (unused for now)
 * @param {HTMLElement} dropArea - The target container
 * @returns {HTMLElement} The newly created component
 */
const createComponent = (type) => {
  const dropArea = document.querySelector("#drop-area");
  const deleteBtn = document.querySelector("#delete-component");
  const existingComponents = dropArea.querySelectorAll(".preview-component");

  let nextTop = 10;
  existingComponents.forEach((comp) => {
    const rect = comp.getBoundingClientRect();
    const bottom = comp.offsetTop + rect.height;
    nextTop = Math.max(nextTop, bottom + 10);
  });

  const component = document.createElement("div");
  component.className = `preview-component ${type}-component`;
  component.style.position = "absolute";
  component.style.top = `${nextTop}px`;
  component.style.left = "10px";
  component.style.width = "calc(100% - 20px)";

  // Inner HTML based on component type
  component.innerHTML = getComponentHTML(type);

  makeComponentReorderable(component);

  const innerElement = component.firstElementChild;
  if (innerElement) {
    innerElement.addEventListener("click", (e) => {
      e.stopPropagation();

      document
        .querySelectorAll(".preview-component")
        .forEach((comp) => comp.classList.remove("selected"));

      const container = innerElement.closest(".preview-component");
      container.classList.add("selected");
      if (deleteBtn) deleteBtn.style.display = "flex";

      window.selectedComponent = container; // ou via setter
      updateStyleEditor(container, type);
    });
  }

  dropArea.appendChild(component);

  component.classList.add("component-placed");
  setTimeout(() => {
    component.classList.remove("component-placed");
  }, 500);

  return component;
};

/**
 * Returns the HTML structure for a given component type.
 * @param {string} type
 * @returns {string}
 */
const getComponentHTML = (type) => {
  switch (type) {
    case "button":
      return `<button class="unity-btn">Button</button>`;
    case "input":
      return `<input type="text" class="form-control unity-input" placeholder="Input field">`;
    case "text":
      return `<p class="unity-text">Text content</p>`;
    case "helpbox":
      return `
        <div class="unity-helpbox">
            <i class="fas fa-exclamation-circle unity-helpbox-icon"></i>
            <p class="unity-helpbox-text">Help text content</p>
        </div>`;
    default:
      return `<div>Component: ${type}</div>`;
  }
};

/**
 * Updates the style editor panel based on the selected component.
 * Enables/disables relevant controls and syncs values.
 *
 * @param {HTMLElement} component - The selected component
 * @param {string} componentType - The type of the component (text, button, etc.)
 */
const updateStyleEditor = (component, componentType) => {
  const boldGroup = document.querySelector(".form-group:has(#element-bold)");
  const textGroup = document.querySelector(".form-group:has(#element-text)");

  boldGroup.classList.add("disabled");
  textGroup.classList.add("disabled");

  console.log("component type update style : ", componentType);
  // Enable form groups based on the component type
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
  }

  // Inputs
  const boldInput = document.getElementById("element-bold");
  const textInput = document.getElementById("element-text");

  if (boldInput) {
    boldInput.checked = component.dataset.bold === "true";
    boldInput.onchange = function () {
      component.dataset.bold = this.checked;
      const textElement = component.querySelector(".unity-text, .unity-title");
      if (textElement) {
        textElement.style.fontWeight = this.checked ? "bold" : "normal";
      }
      saveProjectState();
    };
  }

  if (textInput) {
    textInput.value = component.dataset.text || "";
    textInput.oninput = function () {
      component.dataset.text = this.value;
      const textElement = component.querySelector(
        ".unity-text, .unity-title, .unity-btn, .unity-input, .unity-checkbox-label, .unity-helpbox-text"
      );
      if (textElement) {
        textElement.textContent = this.value;
      }
      saveProjectState();
    };
  }

  // Action editor bindings
  const actionTypeSelect = document.getElementById("action-type");
  const actionUrlInput = document.getElementById("action-url");
  const actionCodeInput = document.getElementById("action-code");
  const actionParams = document.querySelector(".action-params");
  const removeActionBtn = document.getElementById("remove-action");

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
    actionUrlInput.value =
      component.dataset.actionType === "DebugLog"
        ? component.dataset.debugMessage
        : component.dataset.actionUrl || "";
  }

  actionParams.style.display = ["OpenUrl", "DebugLog", "CustomCode"].includes(
    component.dataset.actionType
  )
    ? "block"
    : "none";

  if (component.dataset.actionType === "DebugLog") {
    actionUrlInput.placeholder = "Enter debug message...";
  } else if (component.dataset.actionType === "OpenUrl") {
    actionUrlInput.placeholder = "https://...";
  }

  removeActionBtn.style.display = component.dataset.actionType
    ? "inline-block"
    : "none";

  // Show or hide the Actions tab depending on component type
  const actionsTab = document.querySelector('.tab-item[data-target="actions"]');
  const actionsPane = document.getElementById("actions");

  if (componentType === "button") {
    actionsTab.style.display = "block";
  } else {
    actionsTab.style.display = "none";
    if (actionsPane.classList.contains("active")) {
      document.querySelector('.tab-item[data-target="styles"]').click();
    }
  }
};

/**
 * Makes a component draggable within the drop area to allow reordering.
 * @param {HTMLElement} element - The component to make reorderable.
 */
const makeComponentReorderable = (element) => {
  let startY;
  let initialIndex;

  /**
   * Starts dragging the component and sets up drag listeners.
   * Triggered on mousedown.
   * @param {MouseEvent} e
   */
  const onStartDrag = (e) => {
    e.preventDefault();
    startY = e.clientY;
    initialIndex = getComponentIndex(element);
    element.classList.add("dragging");

    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
  };

  // Attach the drag start handler to the component
  element.addEventListener("mousedown", onStartDrag);

  /**
   * Handles the dragging motion to detect vertical movement and reordering.
   * @param {MouseEvent} e
   */
  const onDrag = (e) => {
    const dropArea = document.querySelector("#drop-area");
    const deltaY = e.clientY - startY;
    const components = Array.from(
      dropArea.querySelectorAll(".preview-component")
    );
    const currentIndex = getComponentIndex(element);
    let newIndex = currentIndex;

    // Move up
    if (deltaY < 0 && currentIndex > 0) {
      const prevComponent = components[currentIndex - 1];
      if (e.clientY < prevComponent.getBoundingClientRect().bottom) {
        newIndex--;
      }
    }

    // Move down
    else if (deltaY > 0 && currentIndex < components.length - 1) {
      const nextComponent = components[currentIndex + 1];
      if (e.clientY > nextComponent.getBoundingClientRect().top) {
        newIndex++;
      }
    }

    if (newIndex !== currentIndex) {
      reorderComponent(element, newIndex);
      startY = e.clientY; // Reset drag position
    }
  };

  /**
   * Stops the dragging and cleans up event listeners.
   */
  const stopDrag = () => {
    element.classList.remove("dragging");
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
    updateComponentPositions();
  };
};

/**
 * Gets the current index of a component inside the drop area.
 * @param {HTMLElement} element - The component element.
 * @returns {number} Index of the component.
 */
const getComponentIndex = (element) => {
  const dropArea = document.querySelector("#drop-area");
  return Array.from(dropArea.querySelectorAll(".preview-component")).indexOf(
    element
  );
};

/**
 * Moves the component to the new index inside the drop area.
 * @param {HTMLElement} element - The component to reorder.
 * @param {number} newIndex - Target position index.
 * @param {HTMLElement} dropArea - The container element.
 */
const reorderComponent = (element, newIndex) => {
  const dropArea = document.querySelector("#drop-area");
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

/**
 * Updates the vertical position of all components inside the drop area,
 * stacking them with consistent spacing and adjusting the drop area's height.
 */
const updateComponentPositions = () => {
  const dropArea = document.querySelector("#drop-area");
  const components = dropArea.querySelectorAll(".preview-component");

  let currentTop = 10; // Initial top padding

  components.forEach((comp) => {
    comp.style.top = `${currentTop}px`;
    const height = comp.getBoundingClientRect().height;
    currentTop += height + 10; // Add spacing between components
  });

  // Adjust the height of the drop area to fit all components
  dropArea.style.height = components.length > 0 ? `${currentTop}px` : "500px"; // Fallback minimum height
};

export {
  createComponent,
  makeComponentReorderable,
  updateComponentPositions,
  updateStyleEditor,
};
