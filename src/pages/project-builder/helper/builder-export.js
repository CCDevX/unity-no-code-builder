/**
 * Initializes the export button by attaching the exportProject function.
 * If the button or export function is not yet available, it retries after 100ms.
 */
const initExportButton = () => {
  const exportButton = document.getElementById("export-project");

  if (exportButton && window.exportProject) {
    exportButton.addEventListener("click", window.exportProject);
  } else {
    setTimeout(initExportButton, 100);
  }
};

export { initExportButton };

// Exposer la fonction globalement
exportProject = function () {
  const currentProject = localStorage.getItem("currentProject");
  if (!currentProject) {
    console.error("No project currently open");
    return;
  }

  const projects = JSON.parse(localStorage.getItem("projects") || "[]");
  const project = projects.find((p) => p.technicalName === currentProject);

  if (!project) {
    console.error("Project not found");
    return;
  }

  // Détecter le vrai type à partir du contenu HTML des composants
  function getComponentRealType(comp) {
    if (comp.content.includes("unity-text")) return "text";
    if (comp.content.includes("unity-btn")) return "button";
    if (comp.content.includes("unity-input")) return "input";
    if (comp.content.includes("unity-helpbox")) return "helpbox";
    return null;
  }

  // Générer le nom de la classe à partir du nom du projet
  const className = project.name.replace(/\s+/g, "") + "EditorWindow";

  // Début du code C#
  let codeContent = `using UnityEngine;
using UnityEditor;

public class ${className} : EditorWindow
{
    // Variables pour stocker les états
    private Vector2 scrollPosition;
    private GUIStyle titleStyle;
`;

  // Déclarer les variables pour chaque composant
  project.components.forEach((comp, index) => {
    const realType = getComponentRealType(comp);
    switch (realType) {
      case "input":
        codeContent += `    private string inputField${index} = "${
          comp.properties?.text || ""
        }";\n`;
        break;
    }
  });

  // Ajouter le MenuItem
  codeContent += `
    [MenuItem("Window/${project.name}")]
    public static void ShowWindow()
    {
        GetWindow<${className}>("${project.name}");
    }

    private void OnGUI()
    {
        // Initialisation du style du titre
        if (titleStyle == null)
        {
            titleStyle = new GUIStyle(EditorStyles.largeLabel);
            titleStyle.fontStyle = FontStyle.Bold;
        }

        scrollPosition = EditorGUILayout.BeginScrollView(scrollPosition);
        EditorGUILayout.Space(10);
`;

  // Générer le code pour chaque composant
  project.components.forEach((comp, index) => {
    const realType = getComponentRealType(comp);
    switch (realType) {
      case "text":
        codeContent += `        EditorGUILayout.LabelField("${
          comp.properties?.text || "Text"
        }", ${
          comp.properties?.bold
            ? "EditorStyles.boldLabel"
            : "EditorStyles.label"
        });\n`;
        break;
      case "input":
        codeContent += `        inputField${index} = EditorGUILayout.TextField("${
          comp.properties?.text || "Input"
        }", inputField${index});\n`;
        break;
      case "button":
        codeContent += `        if (GUILayout.Button("${
          comp.properties?.text || "Button"
        }")) {\n`;
        if (comp.actions?.type) {
          switch (comp.actions.type) {
            case "DebugLog":
              codeContent += `            Debug.Log("${
                comp.actions.debugMessage || ""
              }");\n`;
              break;
            case "OpenUrl":
              codeContent += `            Application.OpenURL("${
                comp.actions.url || ""
              }");\n`;
              break;
            case "CustomCode":
              codeContent += `            ${comp.actions.customCode || ""}\n`;
              break;
          }
        }
        codeContent += `        }\n`;
        break;
      case "helpbox":
        codeContent += `        EditorGUILayout.HelpBox("${
          comp.properties?.text || "Help"
        }", MessageType.Info);\n`;
        break;
    }
  });

  // Fermer le scrollview et la classe
  codeContent += `        EditorGUILayout.EndScrollView();
    }
}`;

  console.log("Generated C# Code:");
  console.log(codeContent);

  // Créer et télécharger le fichier
  const fileName = `${className}.cs`;
  const blob = new Blob([codeContent], { type: "text/plain;charset=utf-8" });

  // Créer un lien temporaire pour le téléchargement
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = fileName;

  // Ajouter le lien au document, cliquer dessus, puis le supprimer
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);

  // Libérer l'URL
  setTimeout(() => {
    URL.revokeObjectURL(downloadLink.href);
  }, 100);
};
