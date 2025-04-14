/**
 * Retrieves a value from localStorage and parses it from JSON.
 * If the key doesn't exist or parsing fails, returns the default value.
 *
 * @param {string} key - The key to retrieve from localStorage.
 * @param {*} defaultValue - The fallback value to return if retrieval fails.
 * @returns {*} - The parsed value or the default value.
 */
const getFromStorage = (key, defaultValue = null) => {
  const raw = localStorage.getItem(key);
  try {
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (error) {
    console.error(`Error parsing localStorage key "${key}" : ${error}`);
    return defaultValue;
  }
};

/**
 * Saves a value to localStorage after serializing it to JSON.
 *
 * @param {string} key - The key under which the value should be stored.
 * @param {*} value - The value to store (will be stringified).
 */
const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}": ${error}`);
  }
};

/**
 * Removes a specific key from localStorage.
 *
 * @param {string} key - The key to remove from storage.
 */
const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}": ${error}`);
  }
};

/**
 * Clears all data from localStorage.
 * Use with caution – this will remove everything stored in localStorage.
 */
const clearStorage = () => {
  localStorage.clear();
};

export { getFromStorage, saveToStorage, removeFromStorage, clearStorage };
