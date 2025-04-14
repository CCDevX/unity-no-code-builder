// Select DOM elements for page title and main content container
const pageTitle = document.querySelector("#page-title");
const pageContent = document.querySelector("#page-content");

/**
 * Displays a loading spinner while the page content is being fetched.
 */
const displayLoadingState = () => {
  pageContent.innerHTML =
    '<div class="loading"><i class="fa-solid fa-spinner"></i> Loading ... </div>';
};

/**
 * Fetches the HTML content of a specific page based on the provided name.
 * @param {string} pageName - The name of the page to fetch.
 * @returns {Promise<string>} - The raw HTML of the page.
 */
const fetchPageContent = async (pageName) => {
  const response = await fetch(`./pages/${pageName}/${pageName}.html`);

  // If the fetch fails, throw an error to be handled by the caller
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.text(); // Return HTML as string
};

/**
 * Dynamically imports the script associated with the current page.
 * This uses ES module dynamic import and assumes a standard structure.
 * @param {string} pageName - The name of the page whose script should be loaded.
 * @param {Object} pageConfig - Configuration object for all pages (used for flexibility).
 * @returns {Promise<Module>} - The imported JS module.
 */
const loadPageScripts = async (pageName, pageConfig) => {
  console.log("Loading script for page:", pageName);
  try {
    const module = await import(`@pages/${pageName}/${pageName}.js`);
    return module;
  } catch (error) {
    console.error(`Failed to load script for ${pageName}:`, error);
    throw error;
  }
};

/**
 * Highlights the active menu link based on the currently loaded page.
 * This function iterates through all sidebar links and toggles the "active" class
 * depending on whether the link's data-page matches the provided page name.
 *
 * @param {string} pageName - The name of the page to mark as active in the sidebar menu.
 */
const setActiveMenuLink = (pageName) => {
  document.querySelectorAll(".menu a").forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("data-page") === pageName) {
      link.classList.add("active");
    }
  });
};

/**
 * Loads a new page by:
 * 1. Displaying the loading state,
 * 2. Fetching the HTML,
 * 3. Injecting it into the DOM,
 * 4. Loading any associated scripts,
 * 5. Initializing page-specific logic via callback.
 *
 * @param {string} pageName - The name of the page to load.
 * @param {Object} pageConfig - Contains titles and script paths for each page.
 * @param {Function} initPageCallback - Function to initialize the page logic.
 * @param {Object} params - Optional parameters to pass to the init function.
 */
const loadPage = async (
  pageName,
  pageConfig,
  initPageCallback,
  params = {}
) => {
  // Show spinner while content is loading
  displayLoadingState();

  // Update the document title based on configuration or fallback
  pageTitle.textContent = pageConfig[pageName]?.title || "Dashboard";

  try {
    // Load the HTML content for the target page
    const html = await fetchPageContent(pageName);
    pageContent.innerHTML = html;

    console.log(
      `Loading page: ${pageName} with scripts: ${pageConfig[pageName]?.scripts}`
    );

    // Dynamically import any page-specific scripts
    const loadedScripts = await loadPageScripts(pageName, pageConfig);
    console.log(`All scripts loaded:`, loadedScripts);

    console.log(`Page ${pageName} is fully ready.`);

    // Run the page-specific initializer if provided
    initPageCallback(pageName, params);
  } catch (error) {
    // In case of error, display a fallback error message in the content area
    console.log(`Could not load page ${pageName}: ${error}`);
    pageContent.innerHTML = `<div class="error-container">
                                <h1>Error loading page</h1>
                                <button class="btn btn-primary" onclick="location.reload()">Reload</button>
                              </div>`;
  }
};

// Export the key functions to be used in other modules
export {
  displayLoadingState,
  fetchPageContent,
  loadPageScripts,
  loadPage,
  setActiveMenuLink,
};
