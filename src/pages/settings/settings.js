const apiKeyInput = document.querySelector(".graq-api-key");
const saveButton = document.querySelector(".save-key");
let storedApiKey;

if (localStorage.getItem("groqApiKey")) {
  storedApiKey = localStorage.getItem("groqApiKey");
  apiKeyInput.value = maskApiKey(storedApiKey);
}

saveButton.addEventListener("click", () => {
  try {
    const apiKey = apiKeyInput.value.trim();

    if (!apiKey || apiKey.includes("*")) {
      alert("Please enter a valid API key");
      return;
    } else if (inputValue === storedApiKey) {
      alert("This API key is already saved.");
      return;
    } else {
      localStorage.setItem("groqApiKey", apiKey);
      storedApiKey = apiKey;
      apiKeyInput.value = maskApiKey(storedApiKey);
      alert("Groq API key saved successfully !");
    }
  } catch (error) {
    console.error("Error while saving : ", error);
    alert("Error while saving the API key");
  }
});

const maskApiKey = (apiKey) => {
  const visible = apiKey.substring(0, 6);
  const hidden = "*".repeat(apiKey.length - 6);
  return `${visible}${hidden}`;
};
