const toastContainer = document.querySelector("#toast-container");

/**
 * Displays a toast message with customizable type and auto-dismiss.
 * @param {string} message - The message to display in the toast.
 * @param {string} type - Type of toast: 'success', 'error', or 'info'.
 * @param {number} duration - Time in milliseconds before auto-dismiss.
 */
const showToast = (message, type = "info", duration = 3000) => {
  if (!toastContainer) return;

  // Create toast
  const toast = document.createElement("div");
  toast.classList.add("toast", `toast-${type}`);
  toast.innerHTML = `<span>${message}</span>`;
  toastContainer.appendChild(toast);
  toastContainer.style.display = "flex";

  // Trigger fade-in
  void toast.offsetWidth; // Force reflow to restart CSS transition
  toast.classList.add("show");

  // Hide toast after duration
  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hide");
    setTimeout(() => {
      toast.remove();
      if (toastContainer.children.length === 0) {
        toastContainer.style.display = "none";
      }
    }, 300); // matches CSS transition time
  }, duration);
};

export { showToast };
