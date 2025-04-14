const toastContainer = document.querySelector("#toast-container");

/**
 * Displays a toast message with customizable type and auto-dismiss.
 * @param {string} message - The message to display in the toast.
 * @param {string} type - Type of toast: 'success', 'error', or 'info'.
 * @param {number} duration - Time in milliseconds before auto-dismiss.
 */
const showToast = (message, type = "info", duration = 3000) => {
  if (!toastContainer) return;

  // Create the toast element
  const toast = document.createElement("div");
  toast.classList.add("toast", `toast-${type}`);
  toast.innerHTML = `<span>${message}</span>`;

  // Add the toast to the container
  toastContainer.appendChild(toast);
  toastContainer.style.display = "flex"; // or "block", depending on your style

  // Animate and remove after duration
  setTimeout(() => {
    toast.classList.add("hide"); // fade-out animation
    setTimeout(() => {
      toast.remove();
      if (toastContainer.children.length === 0) {
        toastContainer.style.display = "none";
      }
    }, 300); // time for fade-out animation
  }, duration);
};

export { showToast };
