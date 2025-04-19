let isDragging = false;
let draggedComponentType = null;

/**
 * Initializes drag and drop behavior for the builder interface.
 * @param {HTMLElement} dropArea - The area where components are dropped.
 * @param {HTMLElement} dropIndicator - Visual indicator for drop position.
 * @param {Function} createComponent - Function to create a component at drop.
 */
const initDragAndDrop = (dropArea, dropIndicator, createComponent) => {
  const componentItems = document.querySelectorAll(".component-item");

  componentItems.forEach((item) => {
    item.setAttribute("draggable", "true");

    item.addEventListener("dragstart", handleDragStart);

    item.addEventListener("mousedown", () => {
      item.classList.add("component-grabbing");
    });

    item.addEventListener("mouseup", () => {
      item.classList.remove("component-grabbing");
    });
  });

  dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.classList.add("drag-over");
    e.dataTransfer.dropEffect = "copy";
    showDropIndicator(e.clientX, e.clientY, dropArea, dropIndicator);
  });

  dropArea.addEventListener("dragleave", (e) => {
    e.preventDefault();
    dropArea.classList.remove("drag-over");
    hideDropIndicator(dropIndicator);
  });

  dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropArea.classList.remove("drag-over");
    hideDropIndicator(dropIndicator);

    document
      .querySelectorAll(".component-item")
      .forEach((item) => item.classList.remove("dragging"));

    const componentType = e.dataTransfer.getData("text/plain");
    createComponent(componentType, e.clientX, e.clientY);

    const emptyState = dropArea.querySelector(".empty-state");
    if (emptyState) emptyState.remove();
  });
};

/**
 * Handles the start of a drag event.
 * @param {DragEvent} e - The drag event.
 */
const handleDragStart = (e) => {
  isDragging = true;
  const target = e.currentTarget;

  draggedComponentType = target.getAttribute("data-component-type");
  e.dataTransfer.setData("text/plain", draggedComponentType);
  e.dataTransfer.effectAllowed = "copy";

  if (e.dataTransfer.setDragImage) {
    const dragIcon = target.cloneNode(true);
    dragIcon.style.opacity = "0.7";
    document.body.appendChild(dragIcon);
    e.dataTransfer.setDragImage(dragIcon, 50, 25);
    setTimeout(() => {
      document.body.removeChild(dragIcon);
    }, 0);
  }
};

/**
 * Displays the drop indicator at the cursor position.
 */
const showDropIndicator = (clientX, clientY, dropArea, dropIndicator) => {
  const rect = dropArea.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  dropIndicator.style.left = `${x}px`;
  dropIndicator.style.top = `${y}px`;
  dropIndicator.className = "drop-indicator active";
};

/**
 * Hides the drop indicator.
 */
const hideDropIndicator = (dropIndicator) => {
  dropIndicator.classList.remove("active");
};

export { initDragAndDrop };
