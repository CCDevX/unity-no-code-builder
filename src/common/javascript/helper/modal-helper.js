// Select DOM elements for the modal container and overlay
const modalContainer = document.querySelector("#modal-container");
const modalOverlay = document.querySelector("#modal-overlay");

/**
 * Dynamically loads and displays a modal window based on the given type.
 * @param {string} modalType - The name of the modal file (without .html extension).
 */
const showModal = async (modalType) => {
  try {
    // Fetch the modal HTML content from the appropriate file
    const response = await fetch(`./pages/modals/${modalType}.html`);

    // If the response is not successful, throw an error
    if (!response.ok) throw new Error("Modal not found");

    // Inject the fetched HTML into the modal container
    modalContainer.innerHTML = await response.text();

    // Display the modal container and overlay
    modalContainer.style.display = "block";
    modalOverlay.style.display = "block";

    // Allow closing the modal by clicking outside of it (on the overlay)
    modalOverlay.addEventListener("click", hideModal);
  } catch (error) {
    // Log any error that occurred while loading the modal
    console.error("Error loading modal:", error);
  }
};

/**
 * Hides the modal and clears its content from the DOM.
 */
const hideModal = () => {
  modalContainer.innerHTML = ""; // Remove modal content
  modalContainer.style.display = "none"; // Hide the modal container
  modalOverlay.style.display = "none"; // Hide the overlay
};

export { showModal, hideModal };
