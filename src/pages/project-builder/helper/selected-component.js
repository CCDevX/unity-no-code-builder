let selectedComponent = null;

const setSelectedComponent = (component) => {
  selectedComponent = component;
};

const getSelectedComponent = () => selectedComponent;

export { setSelectedComponent, getSelectedComponent };
