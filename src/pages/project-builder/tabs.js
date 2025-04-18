/**
 * Initializes tab switching behavior for elements with .tab-item and .tab-pane.
 */
const initTabs = () => {
  document.querySelectorAll(".tab-item").forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-target");

      // Désactiver l’onglet actif
      const currentActiveTab = document.querySelector(".tab-item.active");
      if (currentActiveTab) currentActiveTab.classList.remove("active");

      const currentActivePane = document.querySelector(".tab-pane.active");
      if (currentActivePane) {
        currentActivePane.classList.remove("active");
        currentActivePane.style.display = "none";
      }

      // Activer l’onglet cliqué
      if (target) {
        const targetElement = document.getElementById(target);
        if (targetElement) {
          tab.classList.add("active");
          targetElement.style.display = "block";
          targetElement.classList.add("active");
        }
      }
    });
  });
};

export { initTabs };
