import "./project-builder.scss";
import "../../common/scss/component/_unity-components.scss";

(function () {
  function initBuilder() {
    const currentProject = localStorage.getItem("currentProject");
    const projects = JSON.parse(localStorage.getItem("projects") || "[]");
    const componentItems = document.querySelectorAll(".component-item");
    const dropArea = document.getElementById("drop-area");
    const dropIndicator = document.getElementById("drop-indicator");

    // Titre de la page
    if (currentProject) {
      const project = projects.find((p) => p.technicalName === currentProject);
      if (project) {
        document.getElementById("main-project-title").textContent =
          project.name;
        document.title = `${project.name} - Unity UI Builder`;

        const projectTitleInput = document.getElementById(
          "project-title-input"
        );
        if (projectTitleInput) {
          projectTitleInput.value = project.name;
        }
      }
    }

    // Charger l'état sauvegardé lors de l'initialisation
    

    // Chargement des données du projet après l'initialisation du dropArea
    loadProjectState();

    // Fonction pour sauvegarder l'état des composants
    function saveProjectState() {
      if (!currentProject) return;

      const components = [];
      dropArea.querySelectorAll(".preview-component").forEach((comp) => {
        // Extraire le vrai type en enlevant 'preview-' et '-component'
        const type = comp.className
          .split(" ")
          .find((cls) => cls.endsWith("-component"))
          ?.replace("-component", "")
          ?.replace("preview-", "");

        // Capture des propriétés spécifiques en fonction du type
        const properties = {};
        if (comp.classList.contains("selected")) {
          const boldInput = document.getElementById("element-bold");
          const textInput = document.getElementById("element-text");

          if (boldInput) properties.bold = boldInput.checked;
          if (textInput) properties.text = textInput.value;
        } else {
          // Récupérer les propriétés existantes
          properties.bold = comp.dataset.bold === "true";
          properties.text = comp.dataset.text || "";
        }

        const componentState = {
          type: type,
          content: comp.innerHTML,
          styles: {
            top: comp.style.top,
            left: comp.style.left,
            width: comp.style.width,
            height: comp.style.height,
          },
          properties: properties,
          actions: {
            type: comp.dataset.actionType || "",
            url: comp.dataset.actionUrl || "",
            debugMessage: comp.dataset.debugMessage || "",
            customCode: comp.dataset.customCode || "",
          },
        };
        components.push(componentState);
      });

      // Mettre à jour le projet dans le localStorage
      const projects = JSON.parse(localStorage.getItem("projects") || "[]");
      const projectIndex = projects.findIndex(
        (p) => p.technicalName === currentProject
      );

      if (projectIndex !== -1) {
        projects[projectIndex].components = components;
        localStorage.setItem("projects", JSON.stringify(projects));
      }
    }

    // Ajouter la sauvegarde après chaque modification
    const originalCreateComponent = createComponent;
    createComponent = function (type, x, y) {
      const component = originalCreateComponent(type, x, y);
      saveProjectState();
      return component;
    };

    const originalUpdateComponentPositions = updateComponentPositions;
    updateComponentPositions = function () {
      originalUpdateComponentPositions();
      saveProjectState();
    };

    // Add click handler for tabs
    document.querySelectorAll(".tab-item").forEach((tab) => {
      tab.addEventListener("click", function () {
        const target = this.getAttribute("data-target");

        document.querySelectorAll(".tab-item").forEach((t) => {
          t.classList.remove("active");
        });

        document.querySelectorAll(".tab-pane").forEach((t) => {
          t.classList.remove("active");
          t.style.display = "none";
        });

        if (target) {
          const targetElement = document.getElementById(target);
          if (targetElement) {
            targetElement.style.display = "block";
            targetElement.classList.add("active");
            this.classList.add("active");
          }
        }
      });
    });

    // Track drag state
    let isDragging = false;
    let draggedComponentType = null;

    componentItems.forEach((item) => {
      item.setAttribute("draggable", "true");
      item.addEventListener("dragstart", handleDragStart);
      item.addEventListener("mousedown", function () {
        this.classList.add("component-grabbing");
      });
      item.addEventListener("mouseup", function () {
        this.classList.remove("component-grabbing");
      });
    });

    function handleDragStart(e) {
      isDragging = true;
      draggedComponentType = this.getAttribute("data-component-type");
      e.dataTransfer.setData("text/plain", draggedComponentType);
      e.dataTransfer.effectAllowed = "copy";

      // Create a custom drag image if needed
      if (e.dataTransfer.setDragImage) {
        const dragIcon = this.cloneNode(true);
        dragIcon.style.opacity = "0.7";
        document.body.appendChild(dragIcon);
        e.dataTransfer.setDragImage(dragIcon, 50, 25);
        setTimeout(() => {
          document.body.removeChild(dragIcon);
        }, 0);
      }
    }

    // Handle drag events on the drop area
    dropArea.addEventListener("dragover", function (e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
      this.classList.add("drag-over");

      showDropIndicator(e.clientX, e.clientY);
    });

    dropArea.addEventListener("dragleave", function (e) {
      e.preventDefault();
      this.classList.remove("drag-over");
      hideDropIndicator();
    });

    dropArea.addEventListener("drop", function (e) {
      e.preventDefault();
      this.classList.remove("drag-over");
      hideDropIndicator();

      // S'assurer qu'aucun composant n'a la classe dragging
      document.querySelectorAll(".component-item").forEach((item) => {
        item.classList.remove("dragging");
      });

      const componentType = e.dataTransfer.getData("text/plain");

      createComponent(componentType, e.clientX, e.clientY);

      // Remove empty state if this is the first component
      const emptyState = this.querySelector(".empty-state");
      if (emptyState) {
        emptyState.remove();
      }
    });

    // Show drop indicator at specified position
    function showDropIndicator(clientX, clientY) {
      window.UIManager.showDropIndicator(
        dropIndicator,
        clientX,
        clientY,
        dropArea,
        draggedComponentType
      );
    }

    function hideDropIndicator() {
      window.UIManager.hideDropIndicator(dropIndicator);
    }

    function createComponent(type, x, y) {
      const preview = dropArea;
      const deleteBtn = document.getElementById("delete-component");

      const existingComponents = preview.querySelectorAll(".preview-component");
      let nextTop = 10; // Padding top

      existingComponents.forEach((comp) => {
        const rect = comp.getBoundingClientRect();
        const bottom = comp.offsetTop + rect.height;
        nextTop = Math.max(nextTop, bottom + 10);
      });

      const component = document.createElement("div");
      component.className = `preview-component ${type}-component`;
      component.style.position = "absolute";
      component.style.top = `${nextTop}px`;
      component.style.left = "10px";
      component.style.width = "calc(100% - 20px)";

      switch (type) {
        case "button":
          component.innerHTML = `<button class="unity-btn">Button</button>`;
          break;
        case "input":
          component.innerHTML = `<input type="text" class="form-control unity-input" placeholder="Input field">`;
          break;
        case "text":
          component.innerHTML = `<p class="unity-text">Text content</p>`;
          break;
        case "helpbox":
          component.innerHTML = `
                        <div class="unity-helpbox">
                            <i class="fas fa-exclamation-circle unity-helpbox-icon"></i>
                            <p class="unity-helpbox-text">Help text content</p>
                        </div>`;
          break;
        default:
          component.innerHTML = `<div>Component: ${type}</div>`;
      }

      makeComponentReorderable(component);

      // Supprimer l'ancien gestionnaire d'événement de sélection
      const innerElement = component.firstElementChild;
      if (innerElement) {
        component.removeEventListener("click", null);

        innerElement.addEventListener("click", function (e) {
          e.stopPropagation();

          document.querySelectorAll(".preview-component").forEach((comp) => {
            comp.classList.remove("selected");
          });

          const componentContainer = this.closest(".preview-component");
          componentContainer.classList.add("selected");
          selectedComponent = componentContainer;

          if (deleteBtn) deleteBtn.style.display = "flex";

          updateStyleEditor(componentContainer, type);
        });
      }

      preview.appendChild(component);

      component.classList.add("component-placed");
      setTimeout(() => {
        component.classList.remove("component-placed");
      }, 500);

      return component;
    }

    function updateStyleEditor(component, componentType) {
      const boldGroup = document.querySelector(
        ".form-group:has(#element-bold)"
      );
      const textGroup = document.querySelector(
        ".form-group:has(#element-text)"
      );

      boldGroup.classList.add("disabled");
      textGroup.classList.add("disabled");

      // Activer les contrôles en fonction du type exact
      switch (componentType) {
        case "text":
          boldGroup.classList.remove("disabled");
          textGroup.classList.remove("disabled");
          break;
        case "button":
        case "input":
        case "helpbox":
          textGroup.classList.remove("disabled");
          break;
      }

      const boldInput = document.getElementById("element-bold");
      const textInput = document.getElementById("element-text");

      if (boldInput) {
        boldInput.checked = component.dataset.bold === "true";
        boldInput.onchange = function () {
          component.dataset.bold = this.checked;
          // Appliquer le style bold si nécessaire
          const textElement = component.querySelector(
            ".unity-text, .unity-title"
          );
          if (textElement) {
            textElement.style.fontWeight = this.checked ? "bold" : "normal";
          }
          saveProjectState();
        };
      }

      if (textInput) {
        textInput.value = component.dataset.text || "";
        textInput.oninput = function () {
          component.dataset.text = this.value;
          // Mettre à jour le texte du composant
          const textElement = component.querySelector(
            ".unity-text, .unity-title, .unity-btn, .unity-input, .unity-checkbox-label, .unity-helpbox-text"
          );
          if (textElement) {
            textElement.textContent = this.value;
          }
          saveProjectState();
        };
      }

      // Mettre à jour l'éditeur d'actions
      actionTypeSelect.value = component.dataset.actionType || "";
      actionUrlInput.value = "";
      actionCodeInput.value = "";

      if (component.dataset.actionType === "CustomCode") {
        actionUrlInput.style.display = "none";
        actionCodeInput.style.display = "block";
        actionCodeInput.value = component.dataset.customCode || "";
      } else {
        actionUrlInput.style.display = "block";
        actionCodeInput.style.display = "none";
        actionUrlInput.value =
          component.dataset.actionType === "DebugLog"
            ? component.dataset.debugMessage
            : component.dataset.actionUrl || "";
      }

      actionParams.style.display =
        component.dataset.actionType === "OpenUrl" ||
        component.dataset.actionType === "DebugLog" ||
        component.dataset.actionType === "CustomCode"
          ? "block"
          : "none";

      if (component.dataset.actionType === "DebugLog") {
        actionUrlInput.placeholder = "Enter debug message...";
      } else if (component.dataset.actionType === "OpenUrl") {
        actionUrlInput.placeholder = "https://...";
      }

      removeActionBtn.style.display = component.dataset.actionType
        ? "inline-block"
        : "none";

      // Gérer la visibilité de l'onglet Actions
      const actionsTab = document.querySelector(
        '.tab-item[data-target="actions"]'
      );
      const actionsPane = document.getElementById("actions");

      // N'afficher l'onglet Actions que pour les boutons
      if (componentType === "button") {
        actionsTab.style.display = "block";
      } else {
        actionsTab.style.display = "none";
        // Si l'onglet Actions est actif mais qu'on sélectionne un non-bouton
        if (actionsPane.classList.contains("active")) {
          // Basculer vers l'onglet Properties
          document.querySelector('.tab-item[data-target="styles"]').click();
        }
      }
    }

    // Function to make component draggable within preview area
    function makeComponentReorderable(element) {
      let startY;
      let initialIndex;

      element.addEventListener("mousedown", startDrag);

      function startDrag(e) {
        e.preventDefault();
        startY = e.clientY;
        element.classList.add("dragging");
        initialIndex = getComponentIndex(element);

        document.addEventListener("mousemove", drag);
        document.addEventListener("mouseup", stopDrag);
      }

      function drag(e) {
        const deltaY = e.clientY - startY;
        const components = Array.from(
          dropArea.querySelectorAll(".preview-component")
        );
        const currentIndex = getComponentIndex(element);

        // Calculer la nouvelle position
        let newIndex = currentIndex;
        if (deltaY < 0 && currentIndex > 0) {
          const prevComponent = components[currentIndex - 1];
          if (e.clientY < prevComponent.getBoundingClientRect().bottom) {
            newIndex--;
          }
        } else if (deltaY > 0 && currentIndex < components.length - 1) {
          const nextComponent = components[currentIndex + 1];
          if (e.clientY > nextComponent.getBoundingClientRect().top) {
            newIndex++;
          }
        }

        if (newIndex !== currentIndex) {
          reorderComponents(element, newIndex);
          startY = e.clientY;
        }
      }

      function stopDrag() {
        element.classList.remove("dragging");
        document.removeEventListener("mousemove", drag);
        document.removeEventListener("mouseup", stopDrag);
        updateComponentPositions();
      }
    }

    function getComponentIndex(element) {
      return Array.from(
        dropArea.querySelectorAll(".preview-component")
      ).indexOf(element);
    }

    function reorderComponents(element, newIndex) {
      const components = Array.from(
        dropArea.querySelectorAll(".preview-component")
      );

      if (newIndex >= components.length) {
        dropArea.appendChild(element);
      } else {
        dropArea.insertBefore(element, components[newIndex]);
      }

      updateComponentPositions();
    }

    function updateComponentPositions() {
      const components = dropArea.querySelectorAll(".preview-component");
      let currentTop = 10;

      components.forEach((comp) => {
        comp.style.top = `${currentTop}px`;
        const height = comp.getBoundingClientRect().height;
        currentTop += height + 10;
      });

      // Mettre à jour la hauteur de la zone de dépôt
      if (components.length > 0) {
        dropArea.style.height = `${currentTop}px`;
      } else {
        dropArea.style.height = "500px"; // Hauteur minimale par défaut
      }
    }

    dropArea.addEventListener("click", function (e) {
      if (e.target === this) {
        document.querySelectorAll(".preview-component").forEach((comp) => {
          comp.classList.remove("selected");
        });
        selectedComponent = null;

        const deleteBtn = document.getElementById("delete-component");
        const actionsTab = document.querySelector(
          '.tab-item[data-target="actions"]'
        );
        const actionsPane = document.getElementById("actions");

        if (deleteBtn) deleteBtn.style.display = "none";
        if (actionsTab) actionsTab.style.display = "none";
        if (actionsPane && actionsPane.classList.contains("active")) {
          document.querySelector('.tab-item[data-target="styles"]').click();
        }
      }
    });

    // Ajouter la gestion du bouton de suppression
    const deleteBtn = document.getElementById("delete-component");
    let selectedComponent = null;

    // Ajouter l'événement de suppression
    deleteBtn.addEventListener("click", function () {
      if (
        selectedComponent &&
        confirm("Are you sure you want to delete this component?")
      ) {
        selectedComponent.remove();
        selectedComponent = null;
        deleteBtn.style.display = "none";
        updateComponentPositions();
        saveProjectState();
      }
    });

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

    // Gérer l'affichage des paramètres en fonction du type d'action
    actionTypeSelect.addEventListener("change", function () {
      const actionType = this.value;
      const showParams =
        actionType === "OpenUrl" ||
        actionType === "DebugLog" ||
        actionType === "CustomCode";
      actionParams.style.display = showParams ? "block" : "none";

      // Gérer l'affichage du champ approprié
      if (actionType === "CustomCode") {
        actionUrlInput.style.display = "none";
        actionCodeInput.style.display = "block";
        document.querySelector(".prompt-container").style.display = "block";
        actionCodeInput.placeholder = "// Enter your C# code here...";
      } else {
        actionUrlInput.style.display = "block";
        actionCodeInput.style.display = "none";
        document.querySelector(".prompt-container").style.display = "none";
        actionUrlInput.placeholder =
          actionType === "DebugLog" ? "Enter debug message..." : "https://...";
      }

      if (actionType === "") {
        removeActionBtn.style.display = "none";
      }
    });

    // Appliquer l'action au composant sélectionné
    applyActionBtn.addEventListener("click", function () {
      if (!selectedComponent) {
        alert("Please select a component first");
        return;
      }

      const actionType = actionTypeSelect.value;
      if (!actionType) {
        alert("Please select an action type");
        return;
      }

      // Sauvegarder l'action dans le dataset du composant sans ajouter d'écouteur
      selectedComponent.dataset.actionType = actionType;
      if (actionType === "OpenUrl") {
        selectedComponent.dataset.actionUrl = actionUrlInput.value;
      } else if (actionType === "DebugLog") {
        selectedComponent.dataset.debugMessage = actionUrlInput.value;
      } else if (actionType === "CustomCode") {
        selectedComponent.dataset.customCode = actionCodeInput.value;
      }

      removeActionBtn.style.display = "inline-block";
      saveProjectState();
    });

    // Supprimer l'action du composant sélectionné
    removeActionBtn.addEventListener("click", function () {
      if (!selectedComponent) return;

      delete selectedComponent.dataset.actionType;
      delete selectedComponent.dataset.actionUrl;
      delete selectedComponent.dataset.debugMessage;
      delete selectedComponent.dataset.customCode;

      actionTypeSelect.value = "";
      actionUrlInput.value = "";
      actionCodeInput.value = "";
      actionParams.style.display = "none";
      removeActionBtn.style.display = "none";
      saveProjectState();
    });

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
