// Sidebar Toggle Function
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const mainContainer = document.getElementById("mainContainer");

  if (window.innerWidth <= 768) {
    // Mobile behavior
    sidebar.classList.toggle("active");
  } else {
    // Desktop behavior - collapse/expand
    sidebar.classList.toggle("collapsed");
    if (sidebar.classList.contains("collapsed")) {
      mainContainer.style.marginLeft = "60px";
    } else {
      mainContainer.style.marginLeft = "250px";
    }
  }
}

// Dropdown Menu Toggle
function toggleDropdown(menuId) {
  const menu = document.getElementById(menuId);
  const sidebar = document.getElementById("sidebar");

  if (!sidebar.classList.contains("collapsed")) {
    if (menu.style.display === "block") {
      menu.style.display = "none";
    } else {
      // Close other open dropdowns
      document.querySelectorAll(".submenu").forEach((sub) => {
        if (sub.id !== menuId) {
          sub.style.display = "none";
        }
      });
      menu.style.display = "block";
    }
  }
}

// Section Navigation
function showSection(sectionName) {
  // Hide all sections
  document.getElementById("dashboardSection").style.display = "none";
  document.getElementById("usersSection").style.display = "none";

  // Show selected section
  if (sectionName === "dashboard") {
    document.getElementById("dashboardSection").style.display = "block";
  } else if (sectionName === "users") {
    document.getElementById("usersSection").style.display = "block";
  }

  // Close sidebar on mobile after selection
  if (window.innerWidth <= 768) {
    document.getElementById("sidebar").classList.remove("active");
  }
}

// Filter Sidebar Functions
function openFilterSidebar() {
  document.getElementById("filterSidebar").classList.add("active");
}

function closeFilterSidebar() {
  document.getElementById("filterSidebar").classList.remove("active");
}

// Close sidebar when clicking outside on mobile
document.addEventListener("click", function (event) {
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.querySelector(".toggle-btn");

  if (
    window.innerWidth <= 768 &&
    !sidebar.contains(event.target) &&
    !toggleBtn.contains(event.target) &&
    sidebar.classList.contains("active")
  ) {
    sidebar.classList.remove("active");
  }
});

// Handle window resize
window.addEventListener("resize", function () {
  const sidebar = document.getElementById("sidebar");
  const mainContainer = document.getElementById("mainContainer");

  if (window.innerWidth > 768) {
    sidebar.classList.remove("active");
    if (!sidebar.classList.contains("collapsed")) {
      mainContainer.style.marginLeft = "250px";
    }
  } else {
    mainContainer.style.marginLeft = "0";
  }
});

// Initialize dashboard as default view
showSection("dashboard");
