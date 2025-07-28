import { saveProjectState } from "./state-manager";
import { updateComponentPositions } from "./component-manager";
import {
  setSelectedComponent,
  getSelectedComponent,
} from "./selected-component";

// Global variable to track the currently selected component
let selectedComponent = null;

/**
 * Handles full deselection of components and UI cleanup
 * when clicking on empty space in the drop area.
 * This includes hiding the delete button and the "Actions" tab.
 */
const handleDropAreaClick = (dropArea) => {
  dropArea.addEventListener("click", (e) => {
    if (e.target !== dropArea) return;

    document
      .querySelectorAll(".preview-component")
      .forEach((comp) => comp.classList.remove("selected"));

    setSelectedComponent(null);

    const deleteBtn = document.querySelector("#delete-component");
    const actionsTab = document.querySelector(
      '.tab-item[data-target="actions"]'
    );
    const actionsPane = document.querySelector("#actions");

    if (deleteBtn) deleteBtn.style.display = "none";
    if (actionsTab) actionsTab.style.display = "none";
    if (actionsPane && actionsPane.classList.contains("active")) {
      document.querySelector('.tab-item[data-target="styles"]').click();
    }
  });
};

/**
 * Attaches an event to the drop area to only deselect
 * and hide the delete button without tab handling.
 * @param {HTMLElement} dropArea
 * @param {Function} setSelectedComponent
 */
const handleClickOnDropArea = (dropArea, setSelectedComponent) => {
  dropArea.addEventListener("click", (e) => {
    if (e.target !== dropArea) return;

    document
      .querySelectorAll(".preview-component")
      .forEach((comp) => comp.classList.remove("selected"));

    setSelectedComponent(null);

    const deleteBtn = document.querySelector("#delete-component");
    if (deleteBtn) deleteBtn.style.display = "none";
  });
};

/**
 * Handles deletion logic for the selected component.
 */
const handleDeleteButton = () => {
  const deleteBtn = document.querySelector("#delete-component");
  console.log("delete btn", deleteBtn);
  if (!deleteBtn) return;

  deleteBtn.addEventListener("click", () => {
    let currentSelectedComponent = getSelectedComponent();

    if (!currentSelectedComponent) {
      console.log("No component selected");
      return;
    }
    let response = confirm("Are you sure you want to delete this component?");
    if (response) {
      currentSelectedComponent.remove();
      currentSelectedComponent = null;
      deleteBtn.style.display = "none";
      updateComponentPositions();
      saveProjectState();
    }
  });
};

/**
 * Updates action parameters UI based on selected action type.
 */
const handleActionTypeChange = () => {
  const actionTypeSelect = document.getElementById("action-type");
  const actionParams = document.querySelector(".action-params");
  const actionUrlInput = document.getElementById("action-url");
  const actionCodeInput = document.getElementById("action-code");

  actionTypeSelect.addEventListener("change", function () {
    const actionType = this.value;
    const showParams = ["OpenUrl", "DebugLog", "CustomCode"].includes(
      actionType
    );

    actionParams.style.display = showParams ? "block" : "none";

    if (actionType === "CustomCode") {
      actionUrlInput.style.display = "none";
      actionCodeInput.style.display = "block";
      document.querySelector(".prompt-container").style.display = "block";
      actionCodeInput.placeholder = "// Enter your C# code here...";
    } else {
      actionUrlInput.style.display = "block";
      actionCodeInput.style.display = "none";
      document.querySelector(".prompt-container").style.display = "none";
      actionUrlInput.placeholder =
        actionType === "DebugLog" ? "Enter debug message..." : "https://...";
    }

    const removeActionBtn = document.getElementById("remove-action");
    if (actionType === "") {
      removeActionBtn.style.display = "none";
    }
  });
};

/**
 * Applies an action to the selected component.
 */
const handleApplyAction = () => {
  const actionTypeSelect = document.getElementById("action-type");
  const actionUrlInput = document.getElementById("action-url");
  const actionCodeInput = document.getElementById("action-code");
  const removeActionBtn = document.getElementById("remove-action");
  const applyActionBtn = document.getElementById("apply-action");

  applyActionBtn.addEventListener("click", () => {
    let selectedComponent = getSelectedComponent();
    if (!selectedComponent) {
      alert("Please select a component first");
      return;
    }

    const actionType = actionTypeSelect.value;
    if (!actionType) {
      alert("Please select an action type");
      return;
    }

    selectedComponent.dataset.actionType = actionType;

    if (actionType === "OpenUrl") {
      selectedComponent.dataset.actionUrl = actionUrlInput.value;
    } else if (actionType === "DebugLog") {
      selectedComponent.dataset.debugMessage = actionUrlInput.value;
    } else if (actionType === "CustomCode") {
      selectedComponent.dataset.customCode = actionCodeInput.value;
    }

    removeActionBtn.style.display = "inline-block";
    saveProjectState();
  });
};

/**
 * Removes the action settings from the selected component.
 */
const handleRemoveAction = () => {
  let selectedComponent = getSelectedComponent();
  const actionTypeSelect = document.getElementById("action-type");
  const actionUrlInput = document.getElementById("action-url");
  const actionCodeInput = document.getElementById("action-code");
  const actionParams = document.querySelector(".action-params");
  const removeActionBtn = document.getElementById("remove-action");

  removeActionBtn.addEventListener("click", () => {
    if (!selectedComponent) return;

    delete selectedComponent.dataset.actionType;
    delete selectedComponent.dataset.actionUrl;
    delete selectedComponent.dataset.debugMessage;
    delete selectedComponent.dataset.customCode;

    actionTypeSelect.value = "";
    actionUrlInput.value = "";
    actionCodeInput.value = "";
    actionParams.style.display = "none";
    removeActionBtn.style.display = "none";
    saveProjectState();
  });
};

/**
 * Main function to initialize all component interaction events.
 * @param {HTMLElement} dropArea
 */
const initComponentEvents = (dropArea) => {
  handleDropAreaClick(dropArea);
  handleClickOnDropArea(dropArea, setSelectedComponent);
  handleDeleteButton();
  handleActionTypeChange();
  handleApplyAction();
  handleRemoveAction();
};

export { initComponentEvents };
