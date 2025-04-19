import { createComponent } from "./component-manager";
import { saveProjectState } from "./state-manager";

/**
 * Hook that wraps the createComponent function to trigger saveProjectState after creation.
 * @param {Function} createComponent - The base createComponent function
 * @param {Function} saveProjectState - The function to call after creation
 * @returns {Function} A new createComponent function with auto-save
 */
const useAutoSaveOnCreate = () => {
  return (type, x, y) => {
    const component = createComponent(type, x, y);
    saveProjectState();
    return component;
  };
};

/**
 * Hook that wraps the updateComponentPositions function to trigger saveProjectState after update.
 * @param {Function} updateComponentPositions - The base function to update positions
 * @param {Function} saveProjectState - The function to call after update
 * @returns {Function} A new updateComponentPositions function with auto-save
 */
const useAutoSaveOnUpdate = (updateComponentPositions) => {
  return () => {
    updateComponentPositions();
    saveProjectState();
  };
};

export { useAutoSaveOnCreate, useAutoSaveOnUpdate };
