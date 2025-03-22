const getFromStorage = (key, defaultValue = null) => {
  const raw = localStorage.getItem(key);
  try {
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (error) {
    console.error(`Error parsing localStorage key "${key}" : ${error}`);
    return defaultValue;
  }
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}": : ${error}`);
  }
};

const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing to localStorage key "${key}": : ${error}`);
  }
};

const clearStorage = () => {
  localStorage.clear();
};

export { getFromStorage, saveToStorage, removeFromStorage, clearStorage };
