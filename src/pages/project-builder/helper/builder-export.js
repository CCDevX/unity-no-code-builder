import {
  getCurrentProject,
  getProjectByTechnicalName,
} from "../../../common/javascript/helper/project-helper";

/**
 * Initializes the export button by attaching the exportProject function.
 * If the button is not yet available, it retries after 100ms.
 */
const initExportButton = () => {
  const exportButton = document.getElementById("export-project");

  if (exportButton) {
    console.log("init button : ", exportButton);
    exportButton.addEventListener("click", exportProject);
  } else {
    setTimeout(initExportButton, 100);
  }
};

/**
 * Deduces the real component type based on its HTML content.
 * @param {Object} comp - The saved component object
 * @returns {string|null} The real type ('text', 'button', 'input', 'helpbox') or null
 */
const getComponentRealType = (comp) => {
  if (comp.content.includes("unity-text")) return "text";
  if (comp.content.includes("unity-btn")) return "button";
  if (comp.content.includes("unity-input")) return "input";
  if (comp.content.includes("unity-helpbox")) return "helpbox";
  return null;
};

/**
 * Exports the current project as a C# EditorWindow script for Unity.
 * Reads the saved project from localStorage and generates a .cs file
 * based on the components and their properties/actions.
 */
const exportProject = () => {
  const currentProject = getCurrentProject();
  if (!currentProject) {
    console.error("No project currently open");
    return;
  }

  const project = getProjectByTechnicalName(currentProject);
  if (!project) {
    console.error("Project not found : ", project);
    return;
  }

  const className = project.name.replace(/\s+/g, "") + "EditorWindow";

  // Start building the C# file content
  let codeContent = `using UnityEngine;
using UnityEditor;

public class ${className} : EditorWindow
{
    private Vector2 scrollPosition;
    private GUIStyle titleStyle;
`;

  // Declare variables for inputs
  project.components.forEach((comp, index) => {
    if (getComponentRealType(comp) === "input") {
      codeContent += `    private string inputField${index} = "${
        comp.properties?.text || ""
      }";\n`;
    }
  });

  // Add Unity MenuItem and window initialization
  codeContent += `
    [MenuItem("Window/${project.name}")]
    public static void ShowWindow()
    {
        GetWindow<${className}>("${project.name}");
    }

    private void OnGUI()
    {
        if (titleStyle == null)
        {
            titleStyle = new GUIStyle(EditorStyles.largeLabel);
            titleStyle.fontStyle = FontStyle.Bold;
        }

        scrollPosition = EditorGUILayout.BeginScrollView(scrollPosition);
        EditorGUILayout.Space(10);
`;

  // Loop through components and generate UI
  project.components.forEach((comp, index) => {
    const type = getComponentRealType(comp);

    switch (type) {
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
        switch (comp.actions?.type) {
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
        codeContent += `        }\n`;
        break;
      case "helpbox":
        codeContent += `        EditorGUILayout.HelpBox("${
          comp.properties?.text || "Help"
        }", MessageType.Info);\n`;
        break;
    }
  });

  // Close scroll view and class
  codeContent += `        EditorGUILayout.EndScrollView();
    }
}`;

  // Create and trigger download
  const fileName = `${className}.cs`;
  const blob = new Blob([codeContent], { type: "text/plain;charset=utf-8" });
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = fileName;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);

  setTimeout(() => URL.revokeObjectURL(downloadLink.href), 100);
};

export { initExportButton };
