// Sidebar Toggle Function
function toggleSidebar() {
  let sidebar = document.getElementById("sidebar");
  if (sidebar.style.width === "250px") {
    sidebar.style.width = "50px";
  } else {
    sidebar.style.width = "250px";
  }
}

// Dropdown Menu Toggle
function toggleDropdown(menuId) {
  let menu = document.getElementById(menuId);
  if (menu.style.display === "block") {
    menu.style.display = "none";
  } else {
    menu.style.display = "block";
  }
}

document
  .getElementById("openSidebar")
  .addEventListener("click", function () {
    document.getElementById("sidebar").classList.add("active");
  });

document
  .getElementById("backButton")
  .addEventListener("click", function () {
    document.getElementById("sidebar").classList.remove("active");
  });

document
  .getElementById("closeSidebar")
  .addEventListener("click", function () {
    document.getElementById("sidebar").classList.remove("active");
  });

document
  .getElementById("closeSidebar2")
  .addEventListener("click", function () {
    document.getElementById("sidebar").classList.remove("active");
  });
