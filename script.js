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
