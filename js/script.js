   function assignRoleFromInput() {
      let empId = document.getElementById("assignEmpId").value.trim();
      let newRole = document.getElementById("assignRole").value;
      let emp = employees.find(e => e.id === empId);
      if (!emp) { alert("Employee not found!"); return; }
      emp.role = newRole;
      addLog("PERMISSION", `${emp.name} → ${newRole}`);
      renderTables();
      showToast(`${emp.name} role updated to ${newRole}`);
      document.getElementById("assignEmpId").value = "";
      permissionsModal.hide();
    }

    function openPermissionsForUser(id) {
      openPermissionsModal();
      setTimeout(() => { document.getElementById("assignEmpId").value = id; }, 200);
    }

    // ==================== FILTERS & EXPORT ====================
    function applyFilters() {
      currentFilters = {
        job: document.getElementById("filterJob").value.trim(),
        dept: document.getElementById("filterDept").value.trim(),
        team: document.getElementById("filterTeam").value.trim()
      };
      renderTables();
      closeFilterSidebar();
      showToast("Filters applied");
    }

    function resetFilters() {
      document.getElementById("filterJob").value = "";
      document.getElementById("filterDept").value = "";
      document.getElementById("filterTeam").value = "";
      currentFilters = { job: "", dept: "", team: "" };
      renderTables();
      showToast("Filters reset");
    }

    function exportToCSV() {
      let filtered = getFilteredEmployees();
      let headers = ["ID", "Name", "Designation", "Department", "Team", "Supervisor", "Profile%", "Shift", "City", "Role"];
      let rows = filtered.map(e => [e.id, e.name, e.designation, e.department, e.team, e.supervisor, e.profile, e.shift, e.city, e.role]);
      let csv = [headers, ...rows].map(r => r.join(",")).join("\n");
      let blob = new Blob([csv], { type: "text/csv" });
      let a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "employees_export.csv";
      a.click();
      showToast("Export complete");
    }

    // ==================== UI FUNCTIONS ====================
    function showSection(section) {
      document.getElementById("dashboardSection").style.display = section === "dashboard" ? "block" : "none";
      document.getElementById("usersSection").style.display = section === "users" ? "block" : "none";
      if (window.innerWidth <= 768) document.getElementById("sidebar").classList.remove("active");
    }

    function toggleSubmenu(menuId) {
      let menu = document.getElementById(menuId);
      if (menu.style.display === "block") menu.style.display = "none";
      else menu.style.display = "block";
    }

    function toggleSidebar() {
      document.getElementById("sidebar").classList.toggle("active");
    }

    function openFilterSidebar() { document.getElementById("filterPanel").classList.add("active"); }
    function closeFilterSidebar() { document.getElementById("filterPanel").classList.remove("active"); }

    function showAuditLog() {
      if (auditLog.length === 0) alert("No actions recorded yet.");
      else alert("📋 AUDIT LOG (Last 10 actions):\n\n" + auditLog.slice(0, 10).map(l => `${l.time} - ${l.action}: ${l.details}`).join("\n"));
    }

    function toggleDarkMode() {
      document.body.classList.toggle("dark-mode");
      let isDark = document.body.classList.contains("dark-mode");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      let btn = document.getElementById("darkModeBtn");
      btn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
      showToast(isDark ? "Dark mode ON" : "Light mode ON");
    }

    function initTheme() {
      if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        document.getElementById("darkModeBtn").innerHTML = '<i class="fas fa-sun"></i>';
      }
    }

    // ==================== EVENT LISTENERS & INIT ====================
    document.getElementById("toggleSidebarBtn").addEventListener("click", toggleSidebar);
    document.getElementById("darkModeBtn").addEventListener("click", toggleDarkMode);
    document.getElementById("applyFiltersBtn").addEventListener("click", applyFilters);
    document.getElementById("resetFiltersBtn").addEventListener("click", resetFilters);
    document.getElementById("saveEmpBtn").addEventListener("click", saveEmployee);
    document.getElementById("assignRoleBtn").addEventListener("click", assignRoleFromInput);

    employeeModal = new bootstrap.Modal(document.getElementById("employeeModal"));
    permissionsModal = new bootstrap.Modal(document.getElementById("permissionsModal"));

    initTheme();
    renderTables();
    showSection("dashboard");

    // Make functions global for HTML onclick
    window.editEmployee = editEmployee;
    window.deleteEmployee = deleteEmployee;
    window.assignRole = assignRole;
    window.openPermissionsForUser = openPermissionsForUser;
    window.showSection = showSection;
    window.toggleSubmenu = toggleSubmenu;
    window.openEmployeeModal = openEmployeeModal;
    window.openFilterSidebar = openFilterSidebar;
    window.closeFilterSidebar = closeFilterSidebar;
    window.exportToCSV = exportToCSV;
    window.openPermissionsModal = openPermissionsModal;
    window.showAuditLog = showAuditLog;