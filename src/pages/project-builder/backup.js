import "./project-builder.scss";
import "../../common/scss/component/_unity-components.scss";

(function () {
  function initBuilder() {
    const dropArea = document.getElementById("drop-area");

    // Masquer le bouton de suppression lors d'un clic sur la zone de drop
    dropArea.addEventListener("click", function (e) {
      if (e.target === this) {
        document.querySelectorAll(".preview-component").forEach((comp) => {
          comp.classList.remove("selected");
        });
        selectedComponent = null;

        const deleteBtn = document.getElementById("delete-component");
        if (deleteBtn) {
          deleteBtn.style.display = "none";
        }
      }
    });

    // Ajouter la gestion des actions
    const actionTypeSelect = document.getElementById("action-type");
    const actionParams = document.querySelector(".action-params");
    const actionUrlInput = document.getElementById("action-url");
    const applyActionBtn = document.getElementById("apply-action");
    const removeActionBtn = document.getElementById("remove-action");
    const actionCodeInput = document.getElementById("action-code");

    // Ajouter la gestion du bouton de génération de code
    document
      .getElementById("generate-code")
      .addEventListener("click", async function () {
        const prompt = document.getElementById("code-prompt").value;
        const apiKey = localStorage.getItem("groqApiKey");

        if (!apiKey) {
          alert("Please configure your Groq API key in settings");
          return;
        }

        if (!prompt) {
          alert("Please enter a prompt");
          return;
        }

        // Afficher un indicateur de chargement
        this.disabled = true;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

        try {
          const generatedCode = await window.generateCSharpCode(prompt, apiKey);
          document.getElementById("action-code").value = generatedCode;
        } catch (error) {
          console.error("Error generating code:", error);
          alert("An error occurred while generating the code");
        } finally {
          // Restaurer le bouton
          this.disabled = false;
          this.innerHTML = "Generate";
        }
      });

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
