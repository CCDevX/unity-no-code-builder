const modalContainer = document.querySelector("#modal-container");
const modalOverlay = document.querySelector("#modal-overlay");

export const showModal = async (modalType) => {
  try {
    const response = await fetch(`./pages/modals/${modalType}.html`);
    if (!response.ok) throw new Error("Modal not found");

    modalContainer.innerHTML = await response.text();
    modalContainer.style.display = "block";
    modalOverlay.style.display = "block";

    /*  document
      .querySelector(".close-modal")?.addEventListener("click", hideModal); */

    modalOverlay.addEventListener("click", hideModal);
  } catch (error) {
    console.error("Error loading modal:", error);
  }
};

// Fonction pour cacher le modal
export const hideModal = () => {
  modalContainer.innerHTML = "";
  modalContainer.style.display = "none";
  modalOverlay.style.display = "none";
};
