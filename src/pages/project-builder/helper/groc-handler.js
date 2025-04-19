/**
 * Initializes the event listener for the "Generate Code" button.
 * Handles prompt validation, API key check, and UI feedback during generation.
 */
const initGroqHandler = () => {
  const generateBtn = document.getElementById("generate-code");
  const promptInput = document.getElementById("code-prompt");
  const codeOutput = document.getElementById("action-code");

  if (!generateBtn || !promptInput || !codeOutput) return;

  generateBtn.addEventListener("click", async function () {
    const prompt = promptInput.value;
    const apiKey = localStorage.getItem("groqApiKey");

    if (!apiKey) {
      alert("Please configure your Groq API key in settings");
      return;
    }

    if (!prompt) {
      alert("Please enter a prompt");
      return;
    }

    // Show loading state
    this.disabled = true;
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

    try {
      const generatedCode = await generateCSharpCode(prompt, apiKey);
      codeOutput.value = generatedCode;
    } catch (error) {
      console.error("Error generating code:", error);
      alert("An error occurred while generating the code");
    } finally {
      // Reset button
      this.disabled = false;
      this.innerHTML = "Generate";
    }
  });
};

/**
 * Calls the Groq API to generate C# code based on the user's prompt.
 * @param {string} prompt - The user's input.
 * @param {string} apiKey - The Groq API key from localStorage.
 * @returns {Promise<string>} - The generated C# code.
 */
const generateCSharpCode = async (prompt, apiKey) => {
  const sysPrompt =
    "Tu dois écrire un code C# qui sera ajouté à l'intérieur d'une fonction dans un projet Unity. Respecte la demande de l'utilisateur. Tu dois UNIQUEMENT écrire du code C#, rien d'autre.";

  const jsonData = {
    model: "gemma2-9b-it",
    messages: [
      { role: "system", content: sysPrompt },
      {
        role: "user",
        content: prompt + ". Only write the C# code. Nothing else.",
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

  // Clean up markdown syntax if present
  return generatedCode.replace(/```csharp\n?|\n?```/g, "").trim();
};

export { initGroqHandler };
