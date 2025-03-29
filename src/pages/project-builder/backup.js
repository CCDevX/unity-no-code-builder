// import {
//   getAllProjects,
//   getCurrentProject,
// } from "../../common/javascript/helper/project-helper";
// import "./project-builder.scss";

// let currentProject;
// let projects;
// let dropArea;
// let selectedComponent = null;
// let isDragging = false;
// let draggedComponentType = null;
// let dropIndicator;

// const initProjectBuilder = () => {
//   //const currentProject = localStorage.getItem('currentProject');
//   // const projects = JSON.parse(localStorage.getItem('projects') || '[]' );
//   currentProject = getCurrentProject();
//   projects = getAllProjects();
//   dropArea = document.querySelector("#drop-area");
//   //Titre de la page
//   if (currentProject) {
//     const project = projects.find((p) => p.technicalName === currentProject);
//     if (project) {
//       document.querySelector("#main-project-title").textContent = project.name;
//       document.title = `${project.name} - Unity Builder`;
//       const projectTitleInput = document.querySelector("#project-title-input");
//       if (projectTitleInput) {
//         projectTitleInput.value = project.name;
//       }
//     }
//   }
//   //Load
//   loadProjectState();

//   // Ajouter la sauvegarde après chaque modification
//   const originalCreateComponent = createComponent;
//   createComponent = function (type, x, y) {
//     const component = originalCreateComponent(type, x, y);
//     saveProjectState();
//     return component;
//   };

//   const originalUpdateComponentPositions = updateComponentPositions;
//   updateComponentPositions = function () {
//     originalUpdateComponentPositions();
//     saveProjectState();
//   };

//   //add click handler for tabs

//   document.querySelectorAll(".tab-item").forEach((tab) => {
//     tab.addEventListener("click", (event) => {
//       const target = event.currentTarget.getAttribute("data-target");

//       document.querySelectorAll(".tab-item").forEach((t) => {
//         t.classList.remove("active");
//       });

//       document.querySelectorAll(".tab-pane").forEach((t) => {
//         t.classList.remove("active");
//         t.style.display = "none";
//       });

//       if (target) {
//         //Get elementByID ???
//         const targetElement = document.querySelector(target);
//         if (targetElement) {
//           targetElement.style.display = "block";
//           targetElement.classList.add("active");
//           event.currentTarget.classList.add("active");
//         }
//       }
//     });
//   });

//   //gestion du Drag & Drop
//   const componentItems = document.querySelectorAll(".component-item");
//   dropIndicator = document.querySelector("#drop-indicator");

//   // let isDragging = false;
//   // let draggedComponentType = null;

//   componentItems.forEach((item) => {
//     item.setAttribute("draggable", "true");
//     item.addEventListener("dragstart", handleDragStart);
//     item.addEventListener("mousedown", (event) => {
//       event.currentTarget.classList.add("component-grabbing");
//     });
//     item.addEventListener("mouseup", (event) => {
//       event.currentTarget.classList.remove("component-grabbing");
//     });
//   });
//   dropArea.addEventListener("dragover", (event) => {
//     event.preventDefault();
//     event.dataTransfer.dropEffect = "copy";
//     event.currentTarget.classList.add("drag-over");
//     showDropIndicator(event.clientX, event.clientY);
//   });
//   dropArea.addEventListener("dragleave", (event) => {
//     event.preventDefault();
//     event.currentTarget.classList.remove("drag-over");
//     hideDropIndicator();
//   });

//   dropArea.addEventListener("drop", (event) => {
//     event.preventDefault();
//     event.currentTarget.classList.remove("drag-over");
//     hideDropIndicator();

//     document.querySelectorAll(".component-item").forEach((item) => {
//       item.classList.remove("dragging");

//       const componentType = event.dataTransfer.getData("text/plain");

//       createComponent(componentType, event.clientX, event.clientY);
//       const emptyState = event.currentTarget.querySelector(".empty-state");
//       if (emptyState) {
//         emptyState.remove();
//       }
//     });
//   });
// };

// const loadProjectState = () => {
//   if (!currentProject) return;
//   const project = projects.find((p) => {
//     return p.technicalName === currentProject;
//   });

//   if (project && project.components) {
//     const emptyState = dropArea.querySelector(".empty-state");
//     if (emptyState) {
//       emptyState.remove();
//     }

//     project.components.forEach((compState) => {
//       let componentType = compState.type;
//       let componentContent = compState.content;
//       if (componentType === "preview") {
//         if (componentContent.includes("unity-text")) {
//           componentType = "text";
//         } else if (componentContent.includes("unity-btn")) {
//           componentType = "button";
//         } else if (componentContent.includes("unity-input")) {
//           componentType = "input";
//         } else if (componentContent.includes("unity-helpbox")) {
//           componentType = "helpbox";
//         }
//       }

//       const component = document.createElement("div");
//       component.className = `preview-component ${componentType}-component`;
//       component.innerHTML = compState.content;

//       if (compState.properties) {
//         component.dataset.bold = compState.properties.bold;
//         component.dataset.text = compState.properties.text;

//         const textElement = component.querySelector(
//           ".unity-text, .unity-title"
//         );

//         if (textElement && compState.properties.bold) {
//           textElement.style.fontWeight = "bold";
//         }

//         Object.assign(component.style, compState.styles);

//         if (compState.actions) {
//           component.dataset.actionType = compState.actions.type;
//           component.dataset.actionUrl = compState.actions.url;
//           component.dataset.debugMessage = compState.actions.debugMessage;
//           component.dataset.customCode = compState.actions.customCode;
//         }

//         makeComponentReordable(component);

//         const innerElement = component.firstElementChild;
//         if (innerElement) {
//           innerElement.addEventListener("click", (event) => {
//             event.stopPropagation();
//             document.querySelectorAll(".preview-component").forEach((comp) => {
//               comp.classList.remove("selected");
//             });

//             const componentContainer =
//               event.currentTarget.closest(".preview-component");
//             componentContainer.classList.add("selected");

//             selectedComponent = componentContainer;

//             const deleteBtn = document.querySelector("#delete-component");
//             if (deleteBtn) {
//               deleteBtn.style.display = "flex";
//             }

//             updateStyleEditor(componentContainer, componentType);
//           });
//         }
//       }
//       dropArea.appendChild(component);
//     });

//     updateComponentPositions();
//   }
// };

// const saveProjectState = () => {
//   if (!currentProject) return;

//   const components = [];

//   dropArea.querySelectorAll(".preview-component").forEach((comp) => {
//     const type = comp.className
//       .split(" ")
//       .find((cls) => cls.endsWith("-component"))
//       ?.replace("-component", "")
//       .replace("preview-", "");
//   });

//   const projectIndex = projects.findIndex(
//     (p) => p.technicalName === currentProject
//   );

//   if (projectIndex !== -1) {
//     projects[projectIndex].components = components;
//     localStorage.setItem("projects", JSON.stringify(projects));
//     const properties = {};
//     if (comp.classList.contains("selected")) {
//       const boldInput = document.querySelector("#element-bold");
//       const textInput = document.querySelector("#element-text");
//       if (boldInput) properties.bold = boldInput.checked;
//       if (textInput) properties.text = textInput.value;
//     } else {
//       properties.bold = comp.dataset.bold === "true";
//       properties.text = comp.dataset.text || "";
//     }
//     const componentState = {
//       type: type,
//       content: comp.innerHTML,
//       styles: {
//         top: comp.style.top,
//         left: comp.style.left,
//         width: comp.style.width,
//         height: comp.style.height,
//       },
//       properties: properties,
//       actions: {
//         type: comp.dataset.actionType || "",
//         url: comp.dataset.actionUrl || "",
//         debugMessage: comp.dataset.debugMessage || "",
//         customCode: comp.dataset.customCode || "",
//       },
//     };
//     components.push(componentState);
//   }
// };

// const handleDragStart = (event) => {
//   isDragging = true;
//   draggedComponentType = event.currentTarget.getAttribute(
//     "data-component-type"
//   );
//   event.dataTransfer.setData("text/plain", draggedComponentType);
//   event.dataTransfer.effectAllowed = "copy";

//   if (event.dataTransfer.setDragImage) {
//     const dragIcon = event.currentTarget.cloneNode(true);
//     dragIcon.style.opacity = 0.7;
//     document.body.appendChild(dragIcon);
//     event.dataTransfer.setDragImage(dragIcon, 50, 25);
//     setTimeout(() => {
//       document.body.removeChild(dragIcon);
//     }, 0);
//   }
// };

// const showDropIndicator = (clientX, clientY) => {
//   const rect = dropArea.getBoundingClientRect();
//   const x = clientX - rect.left;
//   const y = clientY - rect.top;
//   dropIndicator = document.querySelector("#drop-indicator");

//   dropIndicator.style.left = `${x}px`;
//   dropIndicator.style.top = `${y}px`;
//   dropIndicator.className = "drop-indicator active";
// };

// const hideDropIndicator = () => {
//   dropIndicator = document.querySelector("#drop-indicator");
//   dropIndicator.classList.remove("active");
// };

// const makeComponentReordable = () => {};

// let updateComponentPositions = () => {};

// let createComponent = () => {};

// const updateStyleEditor = () => {};

// export { initProjectBuilder };
