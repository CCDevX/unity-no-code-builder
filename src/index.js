// Import global styles
import "./index.scss";

// Import navigation and initialization logic
import { loadPage } from "./common/javascript/helper/navigation-helper.js";
import { initPage } from "./common/javascript/helper/page-init.js";
import { pageConfig } from "./common/javascript/config/page-config.js";

// DOM references
const sidebar = document.querySelector("#sidebar");
const closeSidebarBtn = document.querySelector("#close-sidebar");
const toggleSidebarBtn = document.querySelector("#toggle-sidebar");
const menuLinks = document.querySelectorAll(".menu a");

// Sidebar toggle handler
const toggleSidebar = () => sidebar.classList.toggle("active");

// Sidebar close handler
const closeSidebar = () => sidebar.classList.remove("active");

// Wait for the DOM to be fully loaded before initializing the app
document.addEventListener("DOMContentLoaded", () => {
  initializeSidebar(); // Set up all sidebar-related event listeners
  loadPage("home", pageConfig, initPage); // Load the default home page on initial load
});

/**
 * Initializes the sidebar toggle, close, and menu link click events.
 */
const initializeSidebar = () => {
  // Toggle sidebar on mobile when toggle button is clicked
  toggleSidebarBtn.addEventListener("click", toggleSidebar);

  // Close sidebar when close button is clicked (visible only on mobile)
  closeSidebarBtn.addEventListener("click", closeSidebar);

  // Close sidebar when clicking outside of it (only if open)
  document.addEventListener("click", (event) => {
    const isClickInside =
      sidebar.contains(event.target) || toggleSidebarBtn.contains(event.target);
    if (!isClickInside && sidebar.classList.contains("active")) {
      closeSidebar();
    }
  });

  // Handle menu link clicks (navigation + UI state)
  menuLinks.forEach((link) => {
    link.addEventListener("click", handleMenuClick);
  });
};

/**
 * Handles navigation logic when a sidebar menu item is clicked.
 * - Prevents default anchor behavior.
 * - Marks clicked link as active.
 * - Loads the corresponding page dynamically.
 * - Closes sidebar on small screens for better UX.
 */
const handleMenuClick = (event) => {
  event.preventDefault();

  // Remove 'active' class from all links, then highlight the current one
  menuLinks.forEach((item) => item.classList.remove("active"));
  event.currentTarget.classList.add("active");

  // Load the selected page dynamically
  const pageName = event.currentTarget.getAttribute("data-page");
  loadPage(pageName, pageConfig, initPage);

  // Automatically close the sidebar on small screens
  if (window.innerWidth <= 768) {
    closeSidebar();
  }
};
