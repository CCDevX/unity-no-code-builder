import {
  showModal,
  hideModal,
} from "../../../common/javascript/helper/modal-helper.js";

/**
 * Show a confirmation modal and return a Promise<boolean> based on user input.
 * @param {string} message - The message to show inside the modal
 * @returns {Promise<boolean>}
 */
export const showConfirmModal = async (message = "Are you sure?") => {
  await showModal("confirm-modal");

  return new Promise((resolve) => {
    const modal = document.querySelector("#confirm-modal");
    const modalOverlay = document.querySelector("#modal-overlay");
    const confirmBtn = document.querySelector("#confirm-action");
    const cancelBtn = document.querySelector("#cancel-confirm");
    const messageContainer = document.querySelector("#confirm-message");

    messageContainer.textContent = message;

    const close = () => {
      hideModal();
      modal.style.display = "none";
      modalOverlay.style.display = "none";
    };

    confirmBtn.onclick = () => {
      close();
      resolve(true);
    };

    cancelBtn.onclick = () => {
      close();
      resolve(false);
    };

    modalOverlay.onclick = () => {
      close();
      resolve(false);
    };
  });
};
