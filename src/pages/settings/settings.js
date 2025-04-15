import "./settings.scss";

import { showToast } from "../../common/javascript/helper/toast-helper.js";

let storedApiKey;

/**
 * Initializes the Settings page
 * - Loads the saved API key if it exists
 * - Allows saving a new API key with basic validation
 */
const initSettingsPage = () => {
  const apiKeyInput = document.querySelector("#groq-api-key");
  const saveButton = document.querySelector("#save-key");

  // Load existing API key and display it in masked format
  if (localStorage.getItem("groqApiKey")) {
    storedApiKey = localStorage.getItem("groqApiKey");
    apiKeyInput.value = maskApiKey(storedApiKey);
  }

  // Handle save button click
  saveButton.addEventListener("click", () => {
    try {
      const apiKey = apiKeyInput.value.trim();

      // Basic validation: empty input or masked value
      if (!apiKey || apiKey.includes("*")) {
        showToast("Please enter a valid API key.", "error");
        return;
      }

      // Avoid saving the same key again
      if (apiKey === storedApiKey) {
        showToast("This API key is already saved.", "info");
        return;
      }

      // Save and mask the key
      localStorage.setItem("groqApiKey", apiKey);
      storedApiKey = apiKey;
      apiKeyInput.value = maskApiKey(storedApiKey);
      showToast("Groq API key saved successfully!", "success");
    } catch (error) {
      console.error("Error while saving the API key:", error);
      showToast("An error occurred while saving the API key.", "error");
    }
  });
};

/**
 * Masks an API key for display (shows first 6 characters, hides the rest)
 * @param {string} apiKey - The API key to mask
 * @returns {string} - Masked API key
 */
const maskApiKey = (apiKey) => {
  const visible = apiKey.substring(0, 6);
  const hidden = "*".repeat(apiKey.length - 6);
  return `${visible}${hidden}`;
};

export { initSettingsPage };
