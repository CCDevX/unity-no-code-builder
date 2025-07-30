// Import global styles
import "./index.scss";

// Import navigation and initialization logic
import {
  loadPage,
  setActiveMenuLink,
} from "./common/javascript/helper/navigation-helper.js";
import { initPage } from "./common/javascript/helper/page-init.js";
import { pageConfig } from "./common/javascript/config/page-config.js";

// DOM references
const sidebar = document.querySelector("#sidebar");
const sidebarOverlay = document.querySelector("#sidebar-overlay");
const closeSidebarBtn = document.querySelector("#close-sidebar");
const toggleSidebarBtn = document.querySelector("#toggle-sidebar");
const menuLinks = document.querySelectorAll(".menu a");

// Sidebar toggle handler
const toggleSidebar = () => {
  const isActive = sidebar.classList.contains("active");

  if (isActive) {
    closeSidebar();
  } else {
    openSidebar();
  }
};

// Sidebar open handler
const openSidebar = () => {
  sidebar.classList.add("active");
  sidebarOverlay.classList.add("active");
  document.body.style.overflow = "hidden"; // Prevent scrolling when sidebar is open
};

// Sidebar close handler
const closeSidebar = () => {
  sidebar.classList.remove("active");
  sidebarOverlay.classList.remove("active");
  document.body.style.overflow = ""; // Restore scrolling
};

// Wait for the DOM to be fully loaded before initializing the app
document.addEventListener("DOMContentLoaded", () => {
  initializeSidebar(); // Set up all sidebar-related event listeners
  loadPage("home", pageConfig, initPage); // Load the default home page on initial load
});

/**
 * Initializes the sidebar toggle, close, and menu link click events.
 */
const initializeSidebar = () => {
  // Toggle sidebar when toggle button is clicked
  toggleSidebarBtn.addEventListener("click", toggleSidebar);

  // Close sidebar when close button is clicked
  closeSidebarBtn.addEventListener("click", closeSidebar);

  // Close sidebar when clicking on the overlay
  sidebarOverlay.addEventListener("click", closeSidebar);

  // Close sidebar when clicking outside of it (only if open)
  document.addEventListener("click", (event) => {
    const isClickInside =
      sidebar.contains(event.target) ||
      toggleSidebarBtn.contains(event.target) ||
      sidebarOverlay.contains(event.target);

    if (!isClickInside && sidebar.classList.contains("active")) {
      closeSidebar();
    }
  });

  // Close sidebar on Escape key press
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && sidebar.classList.contains("active")) {
      closeSidebar();
    }
  });

  // Handle menu link clicks (navigation + UI state)
  menuLinks.forEach((link) => {
    link.addEventListener("click", handleMenuClick);
  });

  // Handle window resize - close sidebar if window becomes very small to avoid issues
  window.addEventListener("resize", () => {
    if (window.innerWidth < 480 && sidebar.classList.contains("active")) {
      closeSidebar();
    }
  });
};

/**
 * Handles navigation logic when a sidebar menu item is clicked.
 * - Prevents default anchor behavior.
 * - Marks clicked link as active.
 * - Loads the corresponding page dynamically.
 * - Automatically closes sidebar after navigation for better UX.
 */
const handleMenuClick = (event) => {
  event.preventDefault();

  // Load the selected page dynamically
  const pageName = event.currentTarget.getAttribute("data-page");

  setActiveMenuLink(pageName);
  loadPage(pageName, pageConfig, initPage);

  // Automatically close the sidebar after navigation for better UX
  closeSidebar();
};
