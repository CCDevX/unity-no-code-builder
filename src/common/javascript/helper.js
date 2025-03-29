/**
 * Gestionnaire d'indicateurs visuels UI
 */
const UIManager = {
  showDropIndicator(indicator, clientX, clientY, dropArea) {
    // Supprimer le paramètre componentType qui n'est plus utilisé
    const rect = dropArea.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    indicator.style.left = `${x}px`;
    indicator.style.top = `${y}px`;
    indicator.className = "drop-indicator active";
  },

  hideDropIndicator(indicator) {
    indicator.classList.remove("active");
  },
};

// Export functions
window.UIManager = UIManager;
