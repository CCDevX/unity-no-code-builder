import "./project-builder.scss";
import "../../common/scss/component/_unity-components.scss";

(function () {
  function initBuilder() {
    function initExportButton() {
      const exportButton = document.getElementById("export-project");
      if (exportButton && window.exportProject) {
        exportButton.addEventListener("click", window.exportProject);
      } else {
        setTimeout(initExportButton, 100);
      }
    }

    initExportButton();
  }

  // Execute immediately or wait for DOMContentLoaded if document not ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBuilder);
  } else {
    initBuilder();
  }
})();
