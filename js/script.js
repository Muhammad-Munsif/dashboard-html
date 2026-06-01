
// ==================== DATA ====================
let employees = [
  { id: "0001", name: "Anika Vaccaro", designation: "Manager", department: "Operations", team: "Alpha", supervisor: "John Smith", tenure: "2 Yrs", profile: 95, shift: "Morning", city: "New York", avatar: "https://randomuser.me/api/portraits/women/68.jpg", role: "admin" },
  { id: "0002", name: "Chance Stanton", designation: "Team Lead", department: "IT", team: "Beta", supervisor: "Sarah Lee", tenure: "3 Yrs", profile: 78, shift: "Morning", city: "Austin", avatar: "https://randomuser.me/api/portraits/men/32.jpg", role: "editor" },
  { id: "0003", name: "Gretchen Lubin", designation: "HR Specialist", department: "HR", team: "Gamma", supervisor: "Mike Ross", tenure: "1 Yr", profile: 62, shift: "Evening", city: "Seattle", avatar: "https://randomuser.me/api/portraits/women/44.jpg", role: "viewer" },
  { id: "0004", name: "Marcus Chen", designation: "Analyst", department: "Finance", team: "Delta", supervisor: "Lisa Wong", tenure: "2 Yrs", profile: 88, shift: "Morning", city: "Chicago", avatar: "https://randomuser.me/api/portraits/men/22.jpg", role: "editor" },
  { id: "0005", name: "Sophia Rodriguez", designation: "Coordinator", department: "Operations", team: "Alpha", supervisor: "John Smith", tenure: "1 Yr", profile: 45, shift: "Night", city: "Miami", avatar: "https://randomuser.me/api/portraits/women/90.jpg", role: "viewer" }
];

let auditLog = [];
let currentFilters = { job: "", dept: "", team: "" };
let tableFilters = { name: "", designation: "", dept: "", team: "", minProfile: "" };
let editMode = false;
let employeeModal, permissionsModal;
let profileChart, deptChart;

function showToast(msg) {
  let toast = document.createElement("div");
  toast.className = "toast-msg";
  toast.innerHTML = `<i class="fas fa-check-circle text-success me-2"></i>${msg}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

function addLog(action, details) {
  auditLog.unshift({ time: new Date().toLocaleString(), action, details });
  if (auditLog.length > 20) auditLog.pop();
}

function getSidebarFilteredEmployees() {
  return employees.filter(emp => {
    if (currentFilters.job && !emp.designation.toLowerCase().includes(currentFilters.job.toLowerCase())) return false;
    if (currentFilters.dept && !emp.department.toLowerCase().includes(currentFilters.dept.toLowerCase())) return false;
    if (currentFilters.team && !emp.team.toLowerCase().includes(currentFilters.team.toLowerCase())) return false;
    return true;
  });
}

function getTableFilteredEmployees() {
  return employees.filter(emp => {
    if (tableFilters.name && !emp.name.toLowerCase().includes(tableFilters.name.toLowerCase())) return false;
    if (tableFilters.designation && !emp.designation.toLowerCase().includes(tableFilters.designation.toLowerCase())) return false;
    if (tableFilters.dept && !emp.department.toLowerCase().includes(tableFilters.dept.toLowerCase())) return false;
    if (tableFilters.team && !emp.team.toLowerCase().includes(tableFilters.team.toLowerCase())) return false;
    if (tableFilters.minProfile && emp.profile < parseInt(tableFilters.minProfile)) return false;
    return true;
  });
}

function getProfileClass(percent) { return percent < 40 ? "low" : percent < 70 ? "medium" : "high"; }
function renderProfile(percent) { let cls = getProfileClass(percent); return `<div class="profile-bar ${cls}"><div class="profile-fill" style="width:${percent}%"></div></div><small class="text-muted">${percent}%</small>`; }
function getRoleBadge(role) { let icon = role === "admin" ? "<i class='fas fa-crown'></i>" : (role === "editor" ? "<i class='fas fa-edit'></i>" : "<i class='fas fa-eye'></i>"); return `<span class="role-badge">${icon} ${role.toUpperCase()}</span>`; }

function updateCharts() {
  let low = employees.filter(e => e.profile < 40).length, mid = employees.filter(e => e.profile >= 40 && e.profile < 70).length, high = employees.filter(e => e.profile >= 70).length;
  let deptMap = new Map(); employees.forEach(e => deptMap.set(e.department, (deptMap.get(e.department) || 0) + 1));
  if (profileChart) profileChart.destroy();
  if (deptChart) deptChart.destroy();
  profileChart = new Chart(document.getElementById('profileChartCanvas'), { type: 'doughnut', data: { labels: ['Low (<40%)', 'Medium (40-69%)', 'High (≥70%)'], datasets: [{ data: [low, mid, high], backgroundColor: ['#ef4444', '#f59e0b', '#10b981'] }] }, options: { responsive: true, maintainAspectRatio: true } });
  deptChart = new Chart(document.getElementById('deptChartCanvas'), { type: 'bar', data: { labels: Array.from(deptMap.keys()), datasets: [{ label: 'Employees', data: Array.from(deptMap.values()), backgroundColor: '#3b82f6', borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false } } } });
}

function renderStats() {
  let total = employees.length, avgProfile = Math.round(employees.reduce((a, b) => a + b.profile, 0) / total), highPerf = employees.filter(e => e.profile >= 80).length;
  document.getElementById("statsCards").innerHTML = `<div class="col-md-4"><div class="stat-card"><i class="fas fa-users fa-2x text-primary"></i><h2 class="fw-bold mt-2">${total}</h2><p class="text-muted">Total Employees</p></div></div><div class="col-md-4"><div class="stat-card"><i class="fas fa-chart-line fa-2x text-success"></i><h2 class="fw-bold mt-2">${avgProfile}%</h2><p class="text-muted">Avg Profile</p></div></div><div class="col-md-4"><div class="stat-card"><i class="fas fa-trophy fa-2x text-warning"></i><h2 class="fw-bold mt-2">${highPerf}</h2><p class="text-muted">High Performers</p></div></div>`;
  updateCharts();
}

function renderTables() {
  let sidebarFiltered = getSidebarFilteredEmployees();
  renderStats();
  document.getElementById("dashboardTable").innerHTML = sidebarFiltered.map(emp => `<tr><td class="fw-semibold">${emp.id}</td><td><img src="${emp.avatar}" class="avatar" onerror="this.src='https://randomuser.me/api/portraits/lego/1.jpg'"> ${emp.name}</td><td>${emp.designation}</td><td>${emp.department}</td><td>${emp.team}</td><td>${emp.supervisor}</td><td>${renderProfile(emp.profile)}</td></tr>`).join("");
  let tableFiltered = getTableFilteredEmployees();
  document.getElementById("usersTable").innerHTML = tableFiltered.map(emp => `<tr><td class="fw-semibold">${emp.id}</td><td><img src="${emp.avatar}" class="avatar"> ${emp.name}</td><td>${emp.designation}</td><td>${emp.department}</td><td>${emp.team}</td><td>${renderProfile(emp.profile)}</td><td>${getRoleBadge(emp.role)}</td><td class="action-icons"><i class="fas fa-edit text-primary" onclick="editEmployee('${emp.id}')" title="Edit"></i> <i class="fas fa-trash-alt text-danger" onclick="deleteEmployee('${emp.id}')" title="Delete"></i> <i class="fas fa-shield-alt" onclick="openPermissionsForUser('${emp.id}')" title="Permissions"></i></td></tr>`).join("");
}

function generateId() { let max = 0; employees.forEach(e => { let n = parseInt(e.id); if (n > max) max = n; }); return String(max + 1).padStart(4, '0'); }
function openEmployeeModal(id = null) {
  editMode = !!id;
  document.getElementById("modalTitle").innerHTML = editMode ? "<i class='fas fa-edit me-2'></i>Edit Employee" : "<i class='fas fa-user-plus me-2'></i>Add Employee";
  if (id) { let emp = employees.find(e => e.id === id); if (emp) { document.getElementById("empId").value = emp.id; document.getElementById("empName").value = emp.name; document.getElementById("empDesignation").value = emp.designation; document.getElementById("empDepartment").value = emp.department; document.getElementById("empTeam").value = emp.team; document.getElementById("empSupervisor").value = emp.supervisor; document.getElementById("empTenure").value = emp.tenure; document.getElementById("empProfile").value = emp.profile; document.getElementById("empShift").value = emp.shift; document.getElementById("empCity").value = emp.city; document.getElementById("empAvatar").value = emp.avatar; } }
  else { document.getElementById("empId").value = generateId(); document.getElementById("empName").value = ""; document.getElementById("empDesignation").value = ""; document.getElementById("empDepartment").value = ""; document.getElementById("empTeam").value = ""; document.getElementById("empSupervisor").value = ""; document.getElementById("empTenure").value = ""; document.getElementById("empProfile").value = 50; document.getElementById("empShift").value = "Morning"; document.getElementById("empCity").value = ""; document.getElementById("empAvatar").value = "https://randomuser.me/api/portraits/lego/1.jpg"; }
  employeeModal.show();
}
function saveEmployee() {
  let id = document.getElementById("empId").value, name = document.getElementById("empName").value.trim();
  if (!name) { alert("Name is required!"); return; }
  let profile = parseInt(document.getElementById("empProfile").value);
  if (isNaN(profile) || profile < 0 || profile > 100) { alert("Profile must be 0-100"); return; }
  let newEmp = { id, name, profile, role: editMode ? (employees.find(e => e.id === id)?.role || "viewer") : "viewer", designation: document.getElementById("empDesignation").value.trim() || "Staff", department: document.getElementById("empDepartment").value.trim() || "General", team: document.getElementById("empTeam").value.trim() || "Core", supervisor: document.getElementById("empSupervisor").value.trim() || "Admin", tenure: document.getElementById("empTenure").value.trim() || "0 Yr", shift: document.getElementById("empShift").value.trim() || "Morning", city: document.getElementById("empCity").value.trim() || "Unknown", avatar: document.getElementById("empAvatar").value.trim() || "https://randomuser.me/api/portraits/lego/1.jpg" };
  if (editMode) { let idx = employees.findIndex(e => e.id === id); if (idx !== -1) employees[idx] = newEmp; addLog("UPDATE", `${name}`); }
  else { if (employees.some(e => e.id === id)) { alert("Duplicate ID!"); return; } employees.push(newEmp); addLog("CREATE", `${name}`); }
  renderTables(); employeeModal.hide(); showToast(`${editMode ? "Updated" : "Added"} ${name}`);
}
function deleteEmployee(id) { let emp = employees.find(e => e.id === id); if (confirm(`Delete ${emp?.name} permanently?`)) { employees = employees.filter(e => e.id !== id); addLog("DELETE", `${emp?.name}`); renderTables(); showToast(`Deleted ${emp?.name}`); } }
function editEmployee(id) { openEmployeeModal(id); }
function openPermissionsModal() { renderPermissionsList(); permissionsModal.show(); }
function renderPermissionsList() { document.getElementById("permissionsList").innerHTML = employees.map(emp => `<div class="d-flex justify-content-between align-items-center border-bottom py-2"><div><strong>${emp.name}</strong> <small class="text-muted">(${emp.id})</small></div><div>${getRoleBadge(emp.role)} <button class="btn btn-sm btn-outline-secondary ms-2" onclick="assignRole('${emp.id}', 'editor')">Editor</button><button class="btn btn-sm btn-outline-primary ms-1" onclick="assignRole('${emp.id}', 'admin')">Admin</button></div></div>`).join(''); }
function assignRole(empId, newRole) { let emp = employees.find(e => e.id === empId); if (emp) { emp.role = newRole; addLog("PERMISSION", `${emp.name} → ${newRole}`); renderTables(); if (document.getElementById("permissionsList")) renderPermissionsList(); showToast(`${emp.name} is now ${newRole}`); } }
function assignRoleFromInput() { let empId = document.getElementById("assignEmpId").value.trim(), newRole = document.getElementById("assignRole").value, emp = employees.find(e => e.id === empId); if (!emp) { alert("Employee not found!"); return; } emp.role = newRole; addLog("PERMISSION", `${emp.name} → ${newRole}`); renderTables(); showToast(`${emp.name} role updated to ${newRole}`); document.getElementById("assignEmpId").value = ""; permissionsModal.hide(); }
function openPermissionsForUser(id) { openPermissionsModal(); setTimeout(() => { document.getElementById("assignEmpId").value = id; }, 200); }
function applySidebarFilters() { currentFilters = { job: document.getElementById("filterJob").value.trim(), dept: document.getElementById("filterDept").value.trim(), team: document.getElementById("filterTeam").value.trim() }; renderTables(); closeFilterSidebar(); showToast("Filters applied"); }
function resetSidebarFilters() { document.getElementById("filterJob").value = ""; document.getElementById("filterDept").value = ""; document.getElementById("filterTeam").value = ""; currentFilters = { job: "", dept: "", team: "" }; renderTables(); showToast("Filters reset"); }
function updateTableFilters() { tableFilters = { name: document.getElementById("tableSearchName").value.trim(), designation: document.getElementById("tableSearchDesignation").value.trim(), dept: document.getElementById("tableSearchDept").value.trim(), team: document.getElementById("tableSearchTeam").value.trim(), minProfile: document.getElementById("tableSearchMinProfile").value.trim() }; renderTables(); }
function clearTableFilters() { document.getElementById("tableSearchName").value = ""; document.getElementById("tableSearchDesignation").value = ""; document.getElementById("tableSearchDept").value = ""; document.getElementById("tableSearchTeam").value = ""; document.getElementById("tableSearchMinProfile").value = ""; tableFilters = { name: "", designation: "", dept: "", team: "", minProfile: "" }; renderTables(); showToast("Table filters cleared"); }
function exportToCSV() { let filtered = getTableFilteredEmployees(); let headers = ["ID", "Name", "Designation", "Department", "Team", "Supervisor", "Profile%", "Shift", "City", "Role"]; let rows = filtered.map(e => [e.id, e.name, e.designation, e.department, e.team, e.supervisor, e.profile, e.shift, e.city, e.role]); let csv = [headers, ...rows].map(r => r.join(",")).join("\n"); let blob = new Blob([csv], { type: "text/csv" }); let a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "employees_export.csv"; a.click(); showToast("Export complete"); }
function showSection(section) { document.getElementById("dashboardSection").style.display = section === "dashboard" ? "block" : "none"; document.getElementById("usersSection").style.display = section === "users" ? "block" : "none"; renderTables(); if (window.innerWidth <= 992) { document.getElementById("sidebar").classList.remove("active"); document.getElementById("sidebarOverlay").classList.remove("active"); } }
function toggleSubmenu(menuId) { let menu = document.getElementById(menuId); if (menu.style.display === "block") menu.style.display = "none"; else menu.style.display = "block"; }
function openFilterSidebar() { document.getElementById("filterPanel").classList.add("active"); }
function closeFilterSidebar() { document.getElementById("filterPanel").classList.remove("active"); }
function showAuditLog() { if (auditLog.length === 0) alert("No actions recorded yet."); else alert("📋 AUDIT LOG (Last 10 actions):\n\n" + auditLog.slice(0, 10).map(l => `${l.time} - ${l.action}: ${l.details}`).join("\n")); }
function toggleDarkMode() { document.body.classList.toggle("dark-mode"); let isDark = document.body.classList.contains("dark-mode"); localStorage.setItem("theme", isDark ? "dark" : "light"); let btn = document.getElementById("darkModeBtn"); btn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>'; showToast(isDark ? "Dark mode ON" : "Light mode ON"); }
function initTheme() { if (localStorage.getItem("theme") === "dark") { document.body.classList.add("dark-mode"); document.getElementById("darkModeBtn").innerHTML = '<i class="fas fa-sun"></i>'; } }
function toggleSidebar() { document.getElementById("sidebar").classList.toggle("active"); document.getElementById("sidebarOverlay").classList.toggle("active"); }
function closeSidebarOnOverlay() { document.getElementById("sidebar").classList.remove("active"); document.getElementById("sidebarOverlay").classList.remove("active"); }

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("mobileSidebarToggle").addEventListener("click", toggleSidebar);
  document.getElementById("sidebarOverlay").addEventListener("click", closeSidebarOnOverlay);
  document.getElementById("darkModeBtn").addEventListener("click", toggleDarkMode);
  document.getElementById("applyFiltersBtn").addEventListener("click", applySidebarFilters);
  document.getElementById("resetFiltersBtn").addEventListener("click", resetSidebarFilters);
  document.getElementById("saveEmpBtn").addEventListener("click", saveEmployee);
  document.getElementById("assignRoleBtn").addEventListener("click", assignRoleFromInput);
  document.getElementById("clearTableFiltersBtn").addEventListener("click", clearTableFilters);
  document.getElementById("tableSearchName").addEventListener("input", updateTableFilters);
  document.getElementById("tableSearchDesignation").addEventListener("input", updateTableFilters);
  document.getElementById("tableSearchDept").addEventListener("input", updateTableFilters);
  document.getElementById("tableSearchTeam").addEventListener("input", updateTableFilters);
  document.getElementById("tableSearchMinProfile").addEventListener("input", updateTableFilters);
  employeeModal = new bootstrap.Modal(document.getElementById("employeeModal"));
  permissionsModal = new bootstrap.Modal(document.getElementById("permissionsModal"));
  initTheme(); renderTables(); showSection("dashboard");
});
