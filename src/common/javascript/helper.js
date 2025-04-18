/**
 * Gestionnaire d'indicateurs visuels UI
 */
const UIManager = {
  showDropIndicator(indicator, clientX, clientY, dropArea) {},

  hideDropIndicator(indicator) {},
};

/**
 * Génère du code C# via l'API Groq
 * @param {string} prompt - Le prompt utilisateur
 * @param {string} apiKey - La clé API Groq
 * @returns {Promise<string>} - Le code C# généré
 */
async function generateCSharpCode(prompt, apiKey) {
  const sysPrompt =
    "Tu dois écrire un code C# qui sera ajouté à l'intérieur d'une fonction dans un projet Unity. Respecte la demande de l'utilisateur. Tu dois UNIQUEMENT écrire du code C#, rien d'autre.";

  const jsonData = {
    model: "gemma2-9b-it",
    messages: [
      { role: "system", content: sysPrompt },
      {
        role: "user",
        content: prompt + ". Only write the c# code. Nothing else.",
      },
    ],
  };

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  let generatedCode = data.choices[0].message.content;

  // Nettoyer le code généré des balises csharp si présentes
  return generatedCode.replace(/```csharp\n?|\n?```/g, "").trim();
}

// Export functions
window.generateCSharpCode = generateCSharpCode;
window.UIManager = UIManager;
