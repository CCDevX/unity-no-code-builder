const pageTitle = document.querySelector("#page-title");
const pageContent = document.querySelector("#page-content");

const displayLoadingState = () => {
  pageContent.innerHTML =
    '<div class="loading"><i class="fa-solid fa-spinner"></i> Loading ... </div>';
};

const clearOldScripts = () => {
  document.querySelectorAll("script[data-page-script]").forEach((script) => {
    script.remove();
  });
};

const fetchPageContent = async (pageName) => {
  const response = await fetch(`./pages/${pageName}/${pageName}.html`);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.text();
};

const loadPageScripts = async (pageName, pageConfig) => {
  const scripts = pageConfig[pageName]?.scripts || [];

  if (scripts.length === 0) {
    console.log(`No scripts to load for page: ${pageName}`);
    return "No scripts loaded";
  }

  console.log(`Loading scripts for page: ${pageName}`);

  return Promise.all(
    scripts.map(
      (scriptSrc) =>
        new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = scriptSrc;
          script.setAttribute("data-page-script", "");
          script.async = true; // Chargement en arrière-plan
          document.body.appendChild(script);

          script.onload = () => {
            console.log(`Script loaded: ${scriptSrc}`);
            resolve(scriptSrc); // Renvoie le script chargé
          };

          script.onerror = () => {
            console.error(`Script failed to load: ${scriptSrc}`);
            reject(new Error(`Failed to load script: ${scriptSrc}`));
          };
        })
    )
  );
};

const loadPage = async (
  pageName,
  pageConfig,
  initPageCallback,
  params = {}
) => {
  displayLoadingState();

  pageTitle.textContent = pageConfig[pageName]?.title || "Dashboard";

  clearOldScripts();

  try {
    const html = await fetchPageContent(pageName);
    pageContent.innerHTML = html;
    console.log(
      `Loading page: ${pageName} with scripts: ${pageConfig[pageName]?.scripts}`
    );

    const loadedScripts = await loadPageScripts(pageName, pageConfig);
    console.log(`All scripts loaded:`, loadedScripts);

    console.log(`Page ${pageName} is fully ready.`);
    initPageCallback(pageName, params);
  } catch (error) {
    console.log(`Could note load page ${pageName} : ${error}`);
    pageContent.innerHTML = `<div class="error-container">
                                <h1><Error loading page/h1>
                                <button class="btn btn-primary" onclick="location.reload()" >Reload</button>
                                </div>`;
  }
};

export {
  displayLoadingState,
  clearOldScripts,
  fetchPageContent,
  loadPageScripts,
  loadPage,
};
