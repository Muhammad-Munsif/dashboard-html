
(function () {
  let employeesData = [
    { id: "0001", name: "Anika Vaccaro", designation: "Manager", department: "Operations", team: "Super A", supervisor: "Kaylo Margo", tenure: "1 Yr, 2 Mo", profile: 95, shift: "Morning", city: "New York", salary: 85000, avatar: "https://randomuser.me/api/portraits/women/68.jpg", role: "admin" },
    { id: "0002", name: "Chance Stanton", designation: "Department Head", department: "HR", team: "Super B", supervisor: "Ayson Westervelt", tenure: "3 Yr, 6 Mo", profile: 45, shift: "Evening", city: "Austin", salary: 75000, avatar: "https://randomuser.me/api/portraits/men/32.jpg", role: "editor" },
    { id: "0003", name: "Gretchen Lubin", designation: "Team Lead", department: "Operations", team: "Super C", supervisor: "Ryan Vaccaro", tenure: "2 Yr", profile: 90, shift: "Morning", city: "Seattle", salary: 72000, avatar: "https://randomuser.me/api/portraits/women/44.jpg", role: "editor" },
    { id: "0004", name: "Roger Westervelt", designation: "VOB Specialist", department: "Operations", team: "Super D", supervisor: "Anika Gold", tenure: "1 Yr, 2 Mo", profile: 93, shift: "Night", city: "Chicago", salary: 65000, avatar: "https://randomuser.me/api/portraits/men/45.jpg", role: "viewer" },
    { id: "0005", name: "Tatiana Dias", designation: "Account Manager", department: "Operations", team: "Super E", supervisor: "Angel Levin", tenure: "1 Yr, 1 Mo", profile: 15, shift: "Morning", city: "Miami", salary: 68000, avatar: "https://randomuser.me/api/portraits/women/29.jpg", role: "viewer" },
    { id: "0006", name: "Marcus Chen", designation: "Senior Analyst", department: "Finance", team: "Alpha", supervisor: "Linda Wu", tenure: "2 Yr, 4 Mo", profile: 88, shift: "Morning", city: "San Francisco", salary: 82000, avatar: "https://randomuser.me/api/portraits/men/22.jpg", role: "editor" },
    { id: "0007", name: "Sophia Rodriguez", designation: "HR Generalist", department: "HR", team: "Talent Squad", supervisor: "Chance Stanton", tenure: "1 Yr", profile: 72, shift: "Evening", city: "Los Angeles", salary: 62000, avatar: "https://randomuser.me/api/portraits/women/90.jpg", role: "viewer" },
    { id: "0008", name: "James Okafor", designation: "IT Support", department: "Technology", team: "TechOps", supervisor: "Rita Blake", tenure: "6 Mo", profile: 60, shift: "Night", city: "Houston", salary: 58000, avatar: "https://randomuser.me/api/portraits/men/55.jpg", role: "viewer" },
    { id: "0009", name: "Elena Park", designation: "Product Owner", department: "Product", team: "Innovate", supervisor: "Marcus Chen", tenure: "8 Mo", profile: 82, shift: "Morning", city: "Seattle", salary: 90000, avatar: "https://randomuser.me/api/portraits/women/12.jpg", role: "editor" }
  ];

  let auditLog = []; let currentFilters = { jobTitle: "", department: "", team: "", city: "" };
  let employeeModalInstance = null, permissionsModalInstance = null, isEditMode = false;

  function addLog(action, details) { auditLog.unshift({ timestamp: new Date().toLocaleString(), action, details }); if (auditLog.length > 20) auditLog.pop(); }
  function getFiltered() { return employeesData.filter(e => (!currentFilters.jobTitle || e.designation.toLowerCase().includes(currentFilters.jobTitle.toLowerCase())) && (!currentFilters.department || e.department.toLowerCase().includes(currentFilters.department.toLowerCase())) && (!currentFilters.team || e.team.toLowerCase().includes(currentFilters.team.toLowerCase())) && (!currentFilters.city || e.city.toLowerCase().includes(currentFilters.city.toLowerCase()))); }
  function profileClass(p) { return p < 40 ? "low" : p < 70 ? "medium" : "high"; }
  function renderProfile(p) { let cls = profileClass(p); return `<div class="profile-bar ${cls}"><div class="bar-fill" style="width:${p}%"></div></div><div class="d-flex justify-content-between mt-1"><span class="small fw-bold">${p}%</span></div>`; }
  function getRoleBadge(role) { const icons = { admin: '<i class="fas fa-crown"></i>', editor: '<i class="fas fa-edit"></i>', viewer: '<i class="fas fa-eye"></i>' }; return `<span class="permission-badge">${icons[role] || icons.viewer} ${role.toUpperCase()}</span>`; }

  function renderCardsAndStats() {
    const filtered = getFiltered(), total = employeesData.length, avg = Math.round(employeesData.reduce((a, b) => a + b.profile, 0) / total);
    const avgSalary = Math.round(employeesData.reduce((a, b) => a + (b.salary || 0), 0) / total);
    document.getElementById("statsCards").innerHTML = `<div class="dashboard-card"><i class="fas fa-users card-icon"></i><h3>${total}</h3><p>Total workforce</p><span class="trend-badge"><i class="fas fa-chart-line"></i> +12% growth</span></div><div class="dashboard-card"><i class="fas fa-dollar-sign card-icon"></i><h3>$${(avgSalary / 1000).toFixed(0)}k</h3><p>Avg Salary</p><span class="trend-badge"><i class="fas fa-arrow-up"></i> competitive</span></div><div class="dashboard-card"><i class="fas fa-chart-simple card-icon"></i><h3>${avg}%</h3><p>Avg profile</p><span class="trend-badge"><i class="fas fa-arrow-up"></i> engaged</span></div><div class="dashboard-card"><i class="fas fa-medal card-icon"></i><h3>${employeesData.filter(e => e.profile >= 80).length}</h3><p>High performers</p><span class="trend-badge"><i class="fas fa-star"></i> top talent</span></div>`;

    const low = employeesData.filter(e => e.profile < 40).length, mid = employeesData.filter(e => e.profile >= 40 && e.profile < 70).length, high = employeesData.filter(e => e.profile >= 70).length, tot = employeesData.length;
    document.getElementById("profileDistChart").innerHTML = `<div class="mb-2"><i class="fas fa-chart-line text-danger me-2"></i>Low (<40%): ${low} (${Math.round(low / tot * 100)}%)<div class="progress mt-1" style="height:6px"><div class="progress-bar bg-danger" style="width:${low / tot * 100}%"></div></div></div><div class="mb-2"><i class="fas fa-chart-line text-warning me-2"></i>Medium (40-69%): ${mid} (${Math.round(mid / tot * 100)}%)<div class="progress mt-1"><div class="progress-bar bg-warning" style="width:${mid / tot * 100}%"></div></div></div><div><i class="fas fa-chart-line text-success me-2"></i>High (≥70%): ${high} (${Math.round(high / tot * 100)}%)<div class="progress mt-1"><div class="progress-bar bg-success" style="width:${high / tot * 100}%"></div></div></div>`;

    const deptMap = new Map(); employeesData.forEach(e => deptMap.set(e.department, (deptMap.get(e.department) || 0) + 1));
    document.getElementById("deptChart").innerHTML = Array.from(deptMap.entries()).map(([dept, count]) => `<div class="d-flex justify-content-between align-items-center mb-2"><span><i class="fas fa-building me-2"></i>${dept}</span><span class="badge bg-secondary rounded-pill">${count} (${Math.round(count / tot * 100)}%)</span></div><div class="progress mb-3" style="height:4px"><div class="progress-bar bg-info" style="width:${count / tot * 100}%"></div></div>`).join('');
  }

  function renderTables() {
    const filtered = getFiltered(); renderCardsAndStats();
    document.getElementById("dashboardTableBody").innerHTML = filtered.map(e => `<tr><td class="fw-semibold">${e.id}</td><td><img src="${e.avatar}" class="avatar" onerror="this.src='https://randomuser.me/api/portraits/lego/1.jpg'"> ${e.name}</td><td>${e.designation}</td><td><span class="badge bg-light border px-3">${e.department}</span></td><td>${e.team}</td><td>${e.supervisor}</td><td><i class="far fa-calendar-alt me-1"></i>${e.tenure}</td><td>${renderProfile(e.profile)}</td></tr>`).join("");
    document.getElementById("usersTableBody").innerHTML = filtered.map(e => `<tr><td class="fw-semibold">${e.id}</td><td><img src="${e.avatar}" class="avatar"> ${e.name}</td><td>${e.designation}</td><td>${e.department}</td><td>${e.team}</td><td>${e.supervisor}</td><td>${e.tenure}</td><td>${renderProfile(e.profile)}</td><td>${getRoleBadge(e.role)}</td><td class="action-icons"><i class="fas fa-edit text-primary" onclick="app.editEmployee('${e.id}')" title="Edit"></i> <i class="fas fa-trash-alt text-danger" onclick="app.deleteEmployee('${e.id}')" title="Delete"></i> <i class="fas fa-shield-alt" onclick="app.openPermissionsForUser('${e.id}')" title="Permissions"></i></td></tr>`).join("");
  }

  function genId() { let max = 0; employeesData.forEach(e => { let n = parseInt(e.id); if (!isNaN(n) && n > max) max = n; }); return String(max + 1).padStart(4, '0'); }
  function openModal(id = null) {
    isEditMode = !!id;
    document.getElementById("modalTitle").innerHTML = isEditMode ? '<i class="fas fa-pen-fancy"></i> Edit Employee' : '<i class="fas fa-user-plus"></i> Add Employee';
    if (id) { let emp = employeesData.find(e => e.id === id); if (emp) { document.getElementById("empId").value = emp.id; document.getElementById("empName").value = emp.name; document.getElementById("empDesignation").value = emp.designation; document.getElementById("empDepartment").value = emp.department; document.getElementById("empTeam").value = emp.team; document.getElementById("empSupervisor").value = emp.supervisor; document.getElementById("empTenure").value = emp.tenure; document.getElementById("empProfile").value = emp.profile; document.getElementById("empShift").value = emp.shift; document.getElementById("empCity").value = emp.city; document.getElementById("empAvatar").value = emp.avatar; } }
    else { document.getElementById("empId").value = genId();["empName", "empDesignation", "empDepartment", "empTeam", "empSupervisor", "empTenure", "empShift", "empCity", "empAvatar"].forEach(i => { let el = document.getElementById(i); if (el) el.value = ""; }); document.getElementById("empProfile").value = 50; document.getElementById("empAvatar").value = "https://randomuser.me/api/portraits/lego/1.jpg"; }
    employeeModalInstance.show();
  }
  function saveEmployee() {
    let id = document.getElementById("empId").value, name = document.getElementById("empName").value.trim();
    if (!name) { alert("Employee name required"); return; }
    let profile = parseInt(document.getElementById("empProfile").value);
    if (isNaN(profile) || profile < 0 || profile > 100) { alert("Profile 0-100"); return; }
    let newEmp = { id, name, profile, role: isEditMode ? (employeesData.find(e => e.id === id)?.role || "viewer") : "viewer", designation: document.getElementById("empDesignation").value.trim() || "Staff", department: document.getElementById("empDepartment").value.trim() || "General", team: document.getElementById("empTeam").value.trim() || "Core", supervisor: document.getElementById("empSupervisor").value.trim() || "Admin", tenure: document.getElementById("empTenure").value.trim() || "0 Yr", shift: document.getElementById("empShift").value.trim() || "Morning", city: document.getElementById("empCity").value.trim() || "Unknown", salary: 60000, avatar: document.getElementById("empAvatar").value.trim() || "https://randomuser.me/api/portraits/lego/1.jpg" };
    if (isEditMode) { let idx = employeesData.findIndex(e => e.id === id); if (idx !== -1) { employeesData[idx] = newEmp; addLog("UPDATE", `Employee ${name} (${id}) updated`); } }
    else { if (employeesData.some(e => e.id === id)) { alert("Duplicate ID"); return; } employeesData.push(newEmp); addLog("CREATE", `Employee ${name} (${id}) added`); }
    renderTables(); employeeModalInstance.hide(); showToast(`✅ ${isEditMode ? 'Updated' : 'Added'} ${name}`);
  }
  function deleteEmployee(id) { let emp = employeesData.find(e => e.id === id); if (confirm(`⚠️ Permanently delete ${emp?.name}?`)) { employeesData = employeesData.filter(e => e.id !== id); addLog("DELETE", `Employee ${emp?.name} (${id}) removed`); renderTables(); showToast(`🗑️ Deleted ${emp?.name}`); } }
  function assignRoleToUser() { let empId = document.getElementById("assignRoleEmpId").value.trim(); let newRole = document.getElementById("assignRoleSelect").value; let emp = employeesData.find(e => e.id === empId); if (!emp) { alert("Employee ID not found"); return; } emp.role = newRole; addLog("PERMISSION", `Role changed for ${emp.name} to ${newRole.toUpperCase()}`); renderTables(); showToast(`🔒 ${emp.name} role updated`); document.getElementById("assignRoleEmpId").value = ""; if (permissionsModalInstance) permissionsModalInstance.hide(); }
  function openPermissionsModalGlobal() { renderPermissionsList(); permissionsModalInstance.show(); }
  function renderPermissionsList() { document.getElementById("permissionsList").innerHTML = employeesData.map(e => `<div class="d-flex justify-content-between align-items-center mb-2 p-2 border rounded"><div><strong>${e.name}</strong> <span class="text-muted">(${e.id})</span></div><div>${getRoleBadge(e.role)} <button class="btn btn-sm btn-outline-secondary ms-2" onclick="app.assignRoleToId('${e.id}', 'editor')">Editor</button> <button class="btn btn-sm btn-outline-primary" onclick="app.assignRoleToId('${e.id}', 'admin')">Admin</button></div></div>`).join(''); }
  function assignRoleToId(empId, role) { let emp = employeesData.find(e => e.id === empId); if (emp) { emp.role = role; addLog("PERMISSION", `Role changed for ${emp.name} to ${role}`); renderTables(); renderPermissionsList(); showToast(`🛡️ ${emp.name} now ${role.toUpperCase()}`); } }
  function showAuditLog() { alert("📋 Audit Log (last 10 actions):\n" + auditLog.slice(0, 10).map(l => `${l.timestamp} - ${l.action}: ${l.details}`).join("\n") || "No actions recorded"); }
  function exportCSV() { let filtered = getFiltered(); let headers = ["ID", "Name", "Designation", "Department", "Team", "Supervisor", "Tenure", "Profile%", "Shift", "City", "Role"]; let rows = filtered.map(e => [e.id, e.name, e.designation, e.department, e.team, e.supervisor, e.tenure, e.profile, e.shift, e.city, e.role]); let csv = [headers, ...rows].map(r => r.join(",")).join("\n"); let blob = new Blob([csv], { type: "text/csv" }); let a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "employees_export.csv"; a.click(); showToast("📁 Export complete"); }
  function applyFilters() { currentFilters = { jobTitle: document.getElementById("filterJobTitle").value.trim(), department: document.getElementById("filterDepartment").value.trim(), team: document.getElementById("filterTeam").value.trim(), city: document.getElementById("filterCity").value.trim() }; renderTables(); closeFilterSidebar(); showToast("🔍 Filters applied"); }
  function resetFilters() { ["filterJobTitle", "filterDepartment", "filterTeam", "filterCity"].forEach(id => document.getElementById(id).value = ""); currentFilters = { jobTitle: "", department: "", team: "", city: "" }; renderTables(); showToast("🔄 Filters reset"); }
  function showToast(msg) { let toast = document.createElement("div"); toast.className = "toast-notify"; toast.innerHTML = `<i class="fas fa-info-circle me-2"></i>${msg}`; document.body.appendChild(toast); setTimeout(() => toast.remove(), 2500); }
  function openFilterSidebar() { document.getElementById("filterSidebar").classList.add("active"); }
  function closeFilterSidebar() { document.getElementById("filterSidebar").classList.remove("active"); }
  function openPermissionsForUser(id) { openPermissionsModalGlobal(); setTimeout(() => { document.getElementById("assignRoleEmpId").value = id; }, 100); }
  function showHRReport() { showToast("📊 HR Report: " + employeesData.length + " employees | Avg Salary: $" + Math.round(employeesData.reduce((a, b) => a + (b.salary || 0), 0) / employeesData.length).toLocaleString()); }
  function showRetentionChart() { showToast("📈 Retention Rate: 92% - Above industry average"); }
  function showDepartmentStats() { showToast("🏢 Top Department: Operations with " + employeesData.filter(e => e.department === "Operations").length + " employees"); }
  function showSalaryInsights() { showToast("💰 Salary Range: $58k - $90k | Avg: $" + Math.round(employeesData.reduce((a, b) => a + (b.salary || 0), 0) / employeesData.length).toLocaleString()); }
  function showHelp() { alert("📘 NexusHR Help\n\n• Add/Edit/Delete employees using action icons\n• Use filters to refine employee list\n• Dark mode toggle in top-right\n• Permission roles: Admin, Editor, Viewer\n• Export data to CSV format\n• Audit log tracks all changes\n\nFor support: support@nexushr.com"); }

  window.app = {
    showSection(s) { document.getElementById("dashboardSection").style.display = s === "dashboard" ? "block" : "none"; document.getElementById("usersSection").style.display = s === "users" ? "block" : "none"; renderTables(); if (window.innerWidth <= 768) document.getElementById("sidebar").classList.remove("active"); },
    toggleDropdown(m) { if (document.getElementById("sidebar").classList.contains("collapsed") && window.innerWidth > 768) return; let menu = document.getElementById(m); if (!menu) return; let vis = menu.style.display === "block"; document.querySelectorAll(".submenu").forEach(s => s.style.display = "none"); if (!vis) menu.style.display = "block"; },
    openFilterSidebar, closeFilterSidebar, alertFeature: (msg) => showToast(`✨ ${msg}`),
    openEmployeeModal: (id = null) => openModal(id), editEmployee: (id) => openModal(id), deleteEmployee: (id) => deleteEmployee(id), exportToCSV: () => exportCSV(),
    openPermissionsModal: () => openPermissionsModalGlobal(), openPermissionsForUser: (id) => openPermissionsForUser(id), assignRole: () => assignRoleToUser(), assignRoleToId: (id, role) => assignRoleToId(id, role),
    showAuditLog: () => showAuditLog(), showToast: (msg) => showToast(msg),
    openHRReport: () => showHRReport(), showRetentionChart: () => showRetentionChart(), showDepartmentStats: () => showDepartmentStats(), showSalaryInsights: () => showSalaryInsights(), showHelp: () => showHelp()
  };

  function toggleSidebar() { let s = document.getElementById("sidebar"), m = document.getElementById("mainContainer"); if (window.innerWidth <= 768) { s.classList.toggle("active"); m.style.marginLeft = s.classList.contains("active") ? "280px" : "0px"; } else { s.classList.toggle("collapsed"); m.style.marginLeft = s.classList.contains("collapsed") ? "88px" : "280px"; if (s.classList.contains("collapsed")) document.querySelectorAll(".submenu").forEach(sub => sub.style.display = "none"); } }

  // Dark Mode Toggle
  function initDarkMode() { const savedTheme = localStorage.getItem('theme'); if (savedTheme === 'dark') { document.body.classList.add('dark'); document.getElementById('themeToggleBtn').innerHTML = '<i class="fas fa-sun"></i> <span>Light Mode</span>'; } }
  function toggleDarkMode() { document.body.classList.toggle('dark'); const isDark = document.body.classList.contains('dark'); localStorage.setItem('theme', isDark ? 'dark' : 'light'); const btn = document.getElementById('themeToggleBtn'); if (isDark) { btn.innerHTML = '<i class="fas fa-sun"></i> <span>Light Mode</span>'; } else { btn.innerHTML = '<i class="fas fa-moon"></i> <span>Dark Mode</span>'; } showToast(isDark ? '🌙 Dark mode enabled' : '☀️ Light mode enabled'); }

  document.getElementById("toggleSidebarBtn").addEventListener("click", toggleSidebar);
  document.getElementById("themeToggleBtn").addEventListener("click", toggleDarkMode);
  document.getElementById("applyFilterBtn").addEventListener("click", applyFilters);
  document.getElementById("resetFilterBtn").addEventListener("click", () => { resetFilters(); closeFilterSidebar(); });
  document.getElementById("saveEmployeeBtn").addEventListener("click", saveEmployee);
  window.addEventListener("resize", () => { if (window.innerWidth > 768) { document.getElementById("sidebar").classList.remove("active"); let s = document.getElementById("sidebar"), m = document.getElementById("mainContainer"); m.style.marginLeft = s.classList.contains("collapsed") ? "88px" : "280px"; } else document.getElementById("mainContainer").style.marginLeft = "0px"; });
  document.addEventListener("click", (e) => { if (window.innerWidth <= 768 && !document.getElementById("sidebar").contains(e.target) && !e.target.closest(".toggle-btn")) document.getElementById("sidebar").classList.remove("active"); });

  employeeModalInstance = new bootstrap.Modal(document.getElementById("employeeModal"));
  permissionsModalInstance = new bootstrap.Modal(document.getElementById("permissionsModal"));
  initDarkMode(); renderTables(); app.showSection("dashboard"); if (window.innerWidth > 768) document.getElementById("mainContainer").style.marginLeft = "280px";
})();
