/**
 * Dynamically loads and displays a modal window based on the given type.
 * @param {string} modalType - The name of the modal file (without .html extension).
 */
// Ajouter cet import en haut du fichier
import { showToast } from "./toast-helper.js";

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
    const response = await fetch(
      `./pages/modals/${modalType}/${modalType}.html`
    );

    // If the response is not successful, throw an error
    if (!response.ok) {
      throw new Error(`Modal "${modalType}" not found (${response.status})`);
    }

    // Inject the fetched HTML into the modal container
    modalContainer.innerHTML = await response.text();

    // Display the modal container and overlay
    modalContainer.style.display = "block";
    modalOverlay.style.display = "block";

    // Allow closing the modal by clicking outside of it (on the overlay)
    modalOverlay.addEventListener("click", hideModal);
  } catch (error) {
    // Log the error for debugging
    console.error("Error loading modal:", error);

    // Show user-friendly error message
    showToast(`Impossible de charger la fenêtre "${modalType}"`, "error");

    // Make sure modal stays hidden if it failed to load
    hideModal();
  }
};

/**
 * Hides the modal and clears its content from the DOM.
 */
const hideModal = () => {
  if (modalContainer) {
    modalContainer.innerHTML = ""; // Remove modal content
    modalContainer.style.display = "none"; // Hide the modal container
  }

  if (modalOverlay) {
    modalOverlay.style.display = "none"; // Hide the overlay
  }
};

export { showModal, hideModal };
