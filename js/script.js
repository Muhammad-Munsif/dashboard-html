  <script>
    // ============ DATA ============
    let employees = [
      { id: "0001", name: "Anika Vaccaro", designation: "Manager", department: "Operations", team: "Super A", supervisor: "Kaylo Margo", tenure: "1 Yr", profile: 95, shift: "Morning", city: "NYC", avatar: "https://randomuser.me/api/portraits/women/68.jpg", role: "admin" },
      { id: "0002", name: "Chance Stanton", designation: "Department Head", department: "HR", team: "Super B", supervisor: "Ayson", tenure: "3 Yr", profile: 45, shift: "Evening", city: "Austin", avatar: "https://randomuser.me/api/portraits/men/32.jpg", role: "editor" },
      { id: "0003", name: "Gretchen Lubin", designation: "Team Lead", department: "Operations", team: "Super C", supervisor: "Ryan", tenure: "2 Yr", profile: 90, shift: "Morning", city: "Seattle", avatar: "https://randomuser.me/api/portraits/women/44.jpg", role: "editor" },
      { id: "0004", name: "Marcus Chen", designation: "Analyst", department: "Finance", team: "Alpha", supervisor: "Linda", tenure: "2 Yr", profile: 88, shift: "Morning", city: "SF", avatar: "https://randomuser.me/api/portraits/men/22.jpg", role: "viewer" },
      { id: "0005", name: "Sophia Rodriguez", designation: "HR Generalist", department: "HR", team: "Talent", supervisor: "Chance", tenure: "1 Yr", profile: 72, shift: "Morning", city: "LA", avatar: "https://randomuser.me/api/portraits/women/90.jpg", role: "viewer" }
    ];

    let auditLog = [];
    let filters = { jobTitle: "", department: "", team: "" };
    let editMode = false;
    let employeeModal, permissionsModal;

    // ============ HELPERS ============
    function showToast(msg) {
      let t = document.createElement("div");
      t.className = "toast-msg";
      t.innerHTML = `<i class="fas fa-check-circle text-success me-2"></i>${msg}`;
      document.body.appendChild(t);
      setTimeout(() => t.remove(), 2500);
    }

    function addLog(action, details) {
      auditLog.unshift({ time: new Date().toLocaleTimeString(), action, details });
    }

    function getFiltered() {
      return employees.filter(e => {
        if (filters.jobTitle && !e.designation.toLowerCase().includes(filters.jobTitle.toLowerCase())) return false;
        if (filters.department && !e.department.toLowerCase().includes(filters.department.toLowerCase())) return false;
        if (filters.team && !e.team.toLowerCase().includes(filters.team.toLowerCase())) return false;
        return true;
      });
    }

    function getProfileClass(p) {
      if (p < 40) return "low";
      if (p < 70) return "medium";
      return "high";
    }

    function renderProfile(p) {
      let cls = getProfileClass(p);
      return `<div class="profile-bar ${cls}" style="width:100px"><div class="bar-fill" style="width:${p}%"></div></div><small>${p}%</small>`;
    }

    function getRoleBadge(role) {
      let icons = { admin: '<i class="fas fa-crown"></i>', editor: '<i class="fas fa-edit"></i>', viewer: '<i class="fas fa-eye"></i>' };
      return `<span class="permission-badge">${icons[role]} ${role}</span>`;
    }

    // ============ RENDER ============
    function renderStatsAndCharts() {
      let total = employees.length;
      let avgProfile = Math.round(employees.reduce((a, b) => a + b.profile, 0) / total);
      let highPerf = employees.filter(e => e.profile >= 80).length;
      document.getElementById("statsCards").innerHTML = `
    <div class="card"><i class="fas fa-users fa-2x text-success"></i><h2 class="fw-bold mt-2">${total}</h2><p>Total Workforce</p></div>
    <div class="card"><i class="fas fa-chart-line fa-2x text-info"></i><h2 class="fw-bold mt-2">${avgProfile}%</h2><p>Avg Profile</p></div>
    <div class="card"><i class="fas fa-medal fa-2x text-warning"></i><h2 class="fw-bold mt-2">${highPerf}</h2><p>High Performers</p></div>
  `;

      let low = employees.filter(e => e.profile < 40).length;
      let mid = employees.filter(e => e.profile >= 40 && e.profile < 70).length;
      let high = employees.filter(e => e.profile >= 70).length;
      document.getElementById("profileDistChart").innerHTML = `
    <div><span class="text-danger">●</span> Low: ${low} (${Math.round(low / total * 100)}%)<div class="progress mt-1"><div class="progress-bar bg-danger" style="width:${low / total * 100}%"></div></div></div>
    <div class="mt-2"><span class="text-warning">●</span> Medium: ${mid} (${Math.round(mid / total * 100)}%)<div class="progress mt-1"><div class="progress-bar bg-warning" style="width:${mid / total * 100}%"></div></div></div>
    <div class="mt-2"><span class="text-success">●</span> High: ${high} (${Math.round(high / total * 100)}%)<div class="progress mt-1"><div class="progress-bar bg-success" style="width:${high / total * 100}%"></div></div></div>
  `;

      let deptMap = new Map();
      employees.forEach(e => deptMap.set(e.department, (deptMap.get(e.department) || 0) + 1));
      document.getElementById("deptChart").innerHTML = Array.from(deptMap.entries()).map(([dept, count]) => `
    <div class="d-flex justify-content-between"><span>${dept}</span><span>${count}</span></div>
    <div class="progress mb-2"><div class="progress-bar bg-info" style="width:${count / total * 100}%"></div></div>
  `).join('');
    }

    function renderTables() {
      let filtered = getFiltered();
      renderStatsAndCharts();

      document.getElementById("dashboardTableBody").innerHTML = filtered.map(e => `
    <tr><td>${e.id}</td><td><img src="${e.avatar}" class="avatar"> ${e.name}</td><td>${e.designation}</td><td>${e.department}</td><td>${e.team}</td><td>${e.supervisor}</td><td>${renderProfile(e.profile)}</td></tr>
  `).join("");

      document.getElementById("usersTableBody").innerHTML = filtered.map(e => `
    <tr><td>${e.id}</td><td><img src="${e.avatar}" class="avatar"> ${e.name}</td><td>${e.designation}</td><td>${e.department}</td><td>${e.team}</td><td>${renderProfile(e.profile)}</td><td>${getRoleBadge(e.role)}</td>
    <td class="action-icons"><i class="fas fa-edit text-primary" onclick="editEmployee('${e.id}')"></i> <i class="fas fa-trash-alt text-danger" onclick="deleteEmployee('${e.id}')"></i> <i class="fas fa-shield-alt" onclick="openPermissionsForUser('${e.id}')"></i></td></tr>
  `).join("");
    }

    // ============ CRUD ============
    function generateId() {
      let max = 0;
      employees.forEach(e => { let n = parseInt(e.id); if (n > max) max = n; });
      return String(max + 1).padStart(4, '0');
    }

    function openEmployeeModal(id = null) {
      editMode = !!id;
      document.getElementById("modalTitle").innerHTML = editMode ? "Edit Employee" : "Add Employee";
      if (id) {
        let emp = employees.find(e => e.id === id);
        if (emp) {
          document.getElementById("empId").value = emp.id;
          document.getElementById("empName").value = emp.name;
          document.getElementById("empDesignation").value = emp.designation;
          document.getElementById("empDepartment").value = emp.department;
          document.getElementById("empTeam").value = emp.team;
          document.getElementById("empSupervisor").value = emp.supervisor;
          document.getElementById("empTenure").value = emp.tenure;
          document.getElementById("empProfile").value = emp.profile;
          document.getElementById("empShift").value = emp.shift;
          document.getElementById("empCity").value = emp.city;
          document.getElementById("empAvatar").value = emp.avatar;
        }
      } else {
        document.getElementById("empId").value = generateId();
        document.getElementById("empName").value = "";
        document.getElementById("empDesignation").value = "";
        document.getElementById("empDepartment").value = "";
        document.getElementById("empTeam").value = "";
        document.getElementById("empSupervisor").value = "";
        document.getElementById("empTenure").value = "";
        document.getElementById("empProfile").value = 50;
        document.getElementById("empShift").value = "Morning";
        document.getElementById("empCity").value = "";
        document.getElementById("empAvatar").value = "https://randomuser.me/api/portraits/lego/1.jpg";
      }
      employeeModal.show();
    }

    function saveEmployee() {
      let id = document.getElementById("empId").value;
      let name = document.getElementById("empName").value.trim();
      if (!name) { alert("Name required"); return; }
      let profile = parseInt(document.getElementById("empProfile").value);
      if (isNaN(profile) || profile < 0 || profile > 100) { alert("Profile 0-100"); return; }

      let newEmp = {
        id: id, name: name, profile: profile,
        role: editMode ? employees.find(e => e.id === id)?.role || "viewer" : "viewer",
        designation: document.getElementById("empDesignation").value.trim() || "Staff",
        department: document.getElementById("empDepartment").value.trim() || "General",
        team: document.getElementById("empTeam").value.trim() || "Core",
        supervisor: document.getElementById("empSupervisor").value.trim() || "Admin",
        tenure: document.getElementById("empTenure").value.trim() || "0 Yr",
        shift: document.getElementById("empShift").value.trim() || "Morning",
        city: document.getElementById("empCity").value.trim() || "Unknown",
        avatar: document.getElementById("empAvatar").value.trim() || "https://randomuser.me/api/portraits/lego/1.jpg"
      };

      if (editMode) {
        let idx = employees.findIndex(e => e.id === id);
        if (idx !== -1) employees[idx] = newEmp;
        addLog("UPDATE", name);
      } else {
        if (employees.some(e => e.id === id)) { alert("Duplicate ID"); return; }
        employees.push(newEmp);
        addLog("CREATE", name);
      }
      renderTables();
      employeeModal.hide();
      showToast(`${editMode ? "Updated" : "Added"} ${name}`);
    }

    function deleteEmployee(id) {
      let emp = employees.find(e => e.id === id);
      if (confirm(`Delete ${emp?.name}?`)) {
        employees = employees.filter(e => e.id !== id);
        addLog("DELETE", emp?.name);
        renderTables();
        showToast(`Deleted ${emp?.name}`);
      }
    }

    function editEmployee(id) { openEmployeeModal(id); }

    // ============ PERMISSIONS ============
    function openPermissionsModal() {
      document.getElementById("permissionsList").innerHTML = employees.map(e => `
    <div class="d-flex justify-content-between border-bottom py-2">
      <span><strong>${e.name}</strong> (${e.id})</span>
      <span>${getRoleBadge(e.role)} 
        <button class="btn btn-sm btn-outline-secondary ms-2" onclick="assignRoleToId('${e.id}', 'editor')">Editor</button>
        <button class="btn btn-sm btn-outline-primary" onclick="assignRoleToId('${e.id}', 'admin')">Admin</button>
      </span>
    </div>
  `).join('');
      permissionsModal.show();
    }

    function assignRoleToId(empId, role) {
      let emp = employees.find(e => e.id === empId);
      if (emp) {
        emp.role = role;
        addLog("PERMISSION", `${emp.name} → ${role}`);
        renderTables();
        showToast(`${emp.name} is now ${role}`);
      }
    }

    function assignRole() {
      let empId = document.getElementById("assignRoleEmpId").value.trim();
      let role = document.getElementById("assignRoleSelect").value;
      let emp = employees.find(e => e.id === empId);
      if (!emp) { alert("Employee not found"); return; }
      emp.role = role;
      addLog("PERMISSION", `${emp.name} → ${role}`);
      renderTables();
      showToast(`${emp.name} role updated`);
      document.getElementById("assignRoleEmpId").value = "";
      permissionsModal.hide();
    }

    function openPermissionsForUser(id) {
      openPermissionsModal();
      setTimeout(() => { document.getElementById("assignRoleEmpId").value = id; }, 100);
    }

    // ============ FILTERS ============
    function applyFilters() {
      filters = {
        jobTitle: document.getElementById("filterJobTitle").value.trim(),
        department: document.getElementById("filterDepartment").value.trim(),
        team: document.getElementById("filterTeam").value.trim()
      };
      renderTables();
      closeFilterSidebar();
      showToast("Filters applied");
    }

    function resetFilters() {
      document.getElementById("filterJobTitle").value = "";
      document.getElementById("filterDepartment").value = "";
      document.getElementById("filterTeam").value = "";
      filters = { jobTitle: "", department: "", team: "" };
      renderTables();
      showToast("Filters reset");
    }

    // ============ UI FUNCTIONS ============
    function showSection(section) {
      document.getElementById("dashboardSection").style.display = section === "dashboard" ? "block" : "none";
      document.getElementById("usersSection").style.display = section === "users" ? "block" : "none";
      if (window.innerWidth <= 768) document.getElementById("sidebar").classList.remove("active");
    }

    function toggleDropdown(menuId) {
      let menu = document.getElementById(menuId);
      if (!menu) return;
      let visible = menu.style.display === "block";
      document.querySelectorAll(".submenu").forEach(s => s.style.display = "none");
      menu.style.display = visible ? "none" : "block";
    }

    function toggleSidebar() {
      document.getElementById("sidebar").classList.toggle("active");
    }

    function openFilterSidebar() {
      document.getElementById("filterSidebar").classList.add("active");
    }

    function closeFilterSidebar() {
      document.getElementById("filterSidebar").classList.remove("active");
    }

    function exportToCSV() {
      let filtered = getFiltered();
      let headers = ["ID", "Name", "Designation", "Department", "Team", "Profile%", "Role"];
      let rows = filtered.map(e => [e.id, e.name, e.designation, e.department, e.team, e.profile, e.role]);
      let csv = [headers, ...rows].map(r => r.join(",")).join("\n");
      let blob = new Blob([csv], { type: "text/csv" });
      let a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "employees.csv";
      a.click();
      showToast("Export complete");
    }

    function showAuditLog() {
      alert("Audit Log:\n" + auditLog.slice(0, 10).map(l => `${l.time} - ${l.action}: ${l.details}`).join("\n") || "No records");
    }

    function toggleDarkMode() {
      document.body.classList.toggle("dark");
      let isDark = document.body.classList.contains("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      let icon = document.querySelector("#themeToggleBtn i");
      icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
      showToast(isDark ? "Dark mode ON" : "Light mode ON");
    }

    function initDarkMode() {
      if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
        document.querySelector("#themeToggleBtn i").className = "fas fa-sun";
      }
    }

    // ============ INITIALIZATION ============
    document.getElementById("toggleSidebarBtn").addEventListener("click", toggleSidebar);
    document.getElementById("themeToggleBtn").addEventListener("click", toggleDarkMode);
    document.getElementById("applyFilterBtn").addEventListener("click", applyFilters);
    document.getElementById("resetFilterBtn").addEventListener("click", resetFilters);
    document.getElementById("saveEmployeeBtn").addEventListener("click", saveEmployee);
    document.getElementById("assignRoleBtn").addEventListener("click", assignRole);

    employeeModal = new bootstrap.Modal(document.getElementById("employeeModal"));
    permissionsModal = new bootstrap.Modal(document.getElementById("permissionsModal"));

    initDarkMode();
    renderTables();
    showSection("dashboard");

    // Expose global functions
    window.editEmployee = editEmployee;
    window.deleteEmployee = deleteEmployee;
    window.assignRoleToId = assignRoleToId;
    window.openPermissionsForUser = openPermissionsForUser;
    window.showSection = showSection;
    window.toggleDropdown = toggleDropdown;
    window.openFilterSidebar = openFilterSidebar;
    window.closeFilterSidebar = closeFilterSidebar;
    window.openEmployeeModal = openEmployeeModal;
    window.exportToCSV = exportToCSV;
    window.openPermissionsModal = openPermissionsModal;
    window.showAuditLog = showAuditLog;
  </script>