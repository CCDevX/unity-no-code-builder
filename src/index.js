import "./index.scss";

import { loadPage } from "./common/javascript/helper/navigation-helper.js";
import { initPage } from "./common/javascript/helper/page-init.js";
import { pageConfig } from "./common/javascript/config/page-config.js";

const sidebar = document.querySelector("#sidebar");
const closeSidebarBtn = document.querySelector("#close-sidebar");
const toggleSidebarBtn = document.querySelector("#toggle-sidebar");
const menuLinks = document.querySelectorAll(".menu a");

document.addEventListener("DOMContentLoaded", (event) => {
  initializeSidebar();
  loadPage("home", pageConfig, initPage);
});

const initializeSidebar = () => {
  toggleSidebarBtn.addEventListener("click", toggleSidebar);

  closeSidebarBtn.addEventListener("click", closeSidebar);

  document.addEventListener("click", (event) => {
    const isClickInside =
      sidebar.contains(event.target) || toggleSidebarBtn.contains(event.target);
    if (!isClickInside && sidebar.classList.contains("active")) {
      closeSidebar();
    }
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", handleMenuClick);
  });
};

const toggleSidebar = () => sidebar.classList.toggle("active");
const closeSidebar = () => sidebar.classList.remove("active");

const handleMenuClick = (event) => {
  event.preventDefault();
  menuLinks.forEach((item) => item.classList.remove("active"));
  event.currentTarget.classList.add("active");

  loadPage(event.currentTarget.getAttribute("data-page"), pageConfig, initPage);
  if (window.innerWidth <= 768) {
    closeSidebar();
  }
};

const initProjectBuilder = (params) => {};
