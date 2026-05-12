
(function () {
  let employeesData = [
    { id: "0001", name: "Anika Vaccaro", designation: "Manager", department: "Operations", team: "Super A", supervisor: "Kaylo Margo", tenure: "1 Yr, 2 Mo", profile: 95, shift: "Morning", city: "New York", state: "NY", religion: "Christian", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
    { id: "0002", name: "Chance Stanton", designation: "Department Head", department: "HR", team: "Super B", supervisor: "Ayson Westervelt", tenure: "3 Yr, 6 Mo", profile: 45, shift: "Evening", city: "Austin", state: "TX", religion: "Buddhism", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    { id: "0003", name: "Gretchen Lubin", designation: "Team Lead", department: "Operations", team: "Super C", supervisor: "Ryan Vaccaro", tenure: "2 Yr", profile: 90, shift: "Morning", city: "Seattle", state: "WA", religion: "Christian", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    { id: "0004", name: "Roger Westervelt", designation: "VOB Specialist", department: "Operations", team: "Super D", supervisor: "Anika Gold", tenure: "1 Yr, 2 Mo", profile: 93, shift: "Night", city: "Chicago", state: "IL", religion: "Jewish", avatar: "https://randomuser.me/api/portraits/men/45.jpg" },
    { id: "0005", name: "Tatiana Dias", designation: "Account Manager", department: "Operations", team: "Super E", supervisor: "Angel Levin", tenure: "1 Yr, 1 Mo", profile: 15, shift: "Morning", city: "Miami", state: "FL", religion: "Catholic", avatar: "https://randomuser.me/api/portraits/women/29.jpg" },
    { id: "0006", name: "Marcus Chen", designation: "Senior Analyst", department: "Finance", team: "Alpha", supervisor: "Linda Wu", tenure: "2 Yr, 4 Mo", profile: 88, shift: "Morning", city: "San Francisco", state: "CA", religion: "Atheist", avatar: "https://randomuser.me/api/portraits/men/22.jpg" },
    { id: "0007", name: "Sophia Rodriguez", designation: "HR Generalist", department: "HR", team: "Talent Squad", supervisor: "Chance Stanton", tenure: "1 Yr", profile: 72, shift: "Evening", city: "Los Angeles", state: "CA", religion: "Christian", avatar: "https://randomuser.me/api/portraits/women/90.jpg" },
    { id: "0008", name: "James Okafor", designation: "IT Support", department: "Technology", team: "TechOps", supervisor: "Rita Blake", tenure: "6 Mo", profile: 60, shift: "Night", city: "Houston", state: "TX", religion: "Muslim", avatar: "https://randomuser.me/api/portraits/men/55.jpg" },
    { id: "0009", name: "Elena Park", designation: "Product Owner", department: "Product", team: "Innovate", supervisor: "Marcus Chen", tenure: "8 Mo", profile: 82, shift: "Morning", city: "Seattle", state: "WA", religion: "None", avatar: "https://randomuser.me/api/portraits/women/12.jpg" }
  ];

  let currentFilters = { jobTitle: "", team: "", department: "", shift: "", city: "", state: "", religion: "" };
  let employeeModalInstance = null;
  let isEditMode = false;

  function getFilteredEmployees() {
    return employeesData.filter(emp => {
      if (currentFilters.jobTitle && !emp.designation.toLowerCase().includes(currentFilters.jobTitle.toLowerCase())) return false;
      if (currentFilters.team && !emp.team.toLowerCase().includes(currentFilters.team.toLowerCase())) return false;
      if (currentFilters.department && !emp.department.toLowerCase().includes(currentFilters.department.toLowerCase())) return false;
      if (currentFilters.shift && !emp.shift.toLowerCase().includes(currentFilters.shift.toLowerCase())) return false;
      if (currentFilters.city && !emp.city.toLowerCase().includes(currentFilters.city.toLowerCase())) return false;
      if (currentFilters.state && !emp.state.toLowerCase().includes(currentFilters.state.toLowerCase())) return false;
      if (currentFilters.religion && !emp.religion.toLowerCase().includes(currentFilters.religion.toLowerCase())) return false;
      return true;
    });
  }
  function getProfileClass(p) { return p < 40 ? "low" : (p < 70 ? "medium" : "high"); }
  function renderProfileWidget(p) { const cls = getProfileClass(p); return `<div class="profile-bar ${cls}"><div class="bar-fill" style="width:${p}%"></div></div><div class="d-flex justify-content-between"><span class="small fw-semibold">${p}%</span><span class="small text-muted">complete</span></div>`; }
  function updateStatsAndCharts() {
    const filtered = getFilteredEmployees();
    const total = employeesData.length;
    const avgProfile = total ? Math.round(employeesData.reduce((s, e) => s + e.profile, 0) / total) : 0;
    document.getElementById("statsCards").innerHTML = `
        <div class="dashboard-card"><h3>${total}</h3><p><i class="fas fa-users"></i> Total workforce</p></div>
        <div class="dashboard-card"><h3>${filtered.length}</h3><p><i class="fas fa-eye"></i> Showing (filtered)</p></div>
        <div class="dashboard-card"><h3>${avgProfile}%</h3><p><i class="fas fa-chart-line"></i> Avg. completion</p></div>
        <div class="dashboard-card"><h3>${employeesData.filter(e => e.profile >= 80).length}</h3><p><i class="fas fa-star"></i> High performers</p></div>
      `;
    // Profile Distribution
    const low = employeesData.filter(e => e.profile < 40).length;
    const medium = employeesData.filter(e => e.profile >= 40 && e.profile < 70).length;
    const high = employeesData.filter(e => e.profile >= 70).length;
    const totalAll = employeesData.length;
    document.getElementById("profileDistChart").innerHTML = `
        <div class="mb-2"><span class="badge-soft-dist me-2">🔴 Low (<40%)</span> ${low} (${Math.round(low / totalAll * 100)}%) <div class="progress mt-1" style="height:6px"><div class="progress-bar bg-danger" style="width:${(low / totalAll * 100)}%"></div></div></div>
        <div class="mb-2"><span class="badge-soft-dist me-2">🟡 Medium (40-69%)</span> ${medium} (${Math.round(medium / totalAll * 100)}%) <div class="progress mt-1"><div class="progress-bar bg-warning" style="width:${(medium / totalAll * 100)}%"></div></div></div>
        <div><span class="badge-soft-dist me-2">🟢 High (≥70%)</span> ${high} (${Math.round(high / totalAll * 100)}%) <div class="progress mt-1"><div class="progress-bar bg-success" style="width:${(high / totalAll * 100)}%"></div></div></div>
      `;
    // Top locations (city counts)
    const cityCount = new Map();
    employeesData.forEach(e => { cityCount.set(e.city, (cityCount.get(e.city) || 0) + 1); });
    const sortedCities = Array.from(cityCount.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3);
    document.getElementById("topLocationsList").innerHTML = sortedCities.map(([city, cnt]) => `<div class="d-flex justify-content-between"><span><i class="fas fa-city me-1"></i>${city}</span><span class="badge bg-secondary rounded-pill">${cnt}</span></div>`).join('') || `<span class="text-muted">No data</span>`;
  }
  function renderTables() {
    const filtered = getFilteredEmployees();
    updateStatsAndCharts();
    const dashBody = document.getElementById("dashboardTableBody");
    if (dashBody) dashBody.innerHTML = filtered.map(emp => `<tr><td class="fw-semibold">${emp.id}</td><td><img src="${emp.avatar}" class="avatar" onerror="this.src='https://randomuser.me/api/portraits/lego/1.jpg'"> ${emp.name}</td><td>${emp.designation}</td><td><span class="badge bg-light text-dark px-3 py-1 rounded-pill">${emp.department}</span></td><td>${emp.team}</td><td>${emp.supervisor}</td><td><i class="far fa-clock me-1"></i>${emp.tenure}</td><td style="min-width:110px">${renderProfileWidget(emp.profile)}</td></tr>`).join("");
    const usersBody = document.getElementById("usersTableBody");
    if (usersBody) usersBody.innerHTML = filtered.map(emp => `<tr><td class="fw-semibold">${emp.id}</td><td><img src="${emp.avatar}" class="avatar"> ${emp.name}</td><td>${emp.designation}</td><td>${emp.department}</td><td>${emp.team}</td><td>${emp.supervisor}</td><td>${emp.tenure}</td><td>${renderProfileWidget(emp.profile)}</td><td class="action-icons"><i class="fas fa-edit text-primary" onclick="app.editEmployee('${emp.id}')" title="Edit"></i> <i class="fas fa-trash-alt text-danger" onclick="app.deleteEmployee('${emp.id}')" title="Delete"></i></td></tr>`).join("");
  }
  function generateNextId() { let max = 0; employeesData.forEach(e => { let num = parseInt(e.id, 10); if (!isNaN(num) && num > max) max = num; }); return String(max + 1).padStart(4, '0'); }
  function openEmployeeModal(empId = null) {
    isEditMode = !!empId;
    document.getElementById("modalTitle").innerHTML = isEditMode ? '<i class="fas fa-pen me-2"></i>Edit Employee' : '<i class="fas fa-user-plus me-2"></i>Add New Employee';
    if (isEditMode) {
      const emp = employeesData.find(e => e.id === empId);
      if (emp) { Object.keys(emp).forEach(k => { let el = document.getElementById(`emp${k.charAt(0).toUpperCase() + k.slice(1)}`); if (el) el.value = emp[k]; }); }
    } else {
      document.getElementById("empId").value = generateNextId();
      ["empName", "empDesignation", "empDepartment", "empTeam", "empSupervisor", "empTenure", "empShift", "empCity", "empState", "empReligion", "empAvatar"].forEach(id => { let el = document.getElementById(id); if (el && id !== "empAvatar") el.value = ""; else if (id === "empAvatar") el.value = "https://randomuser.me/api/portraits/lego/1.jpg"; });
      document.getElementById("empProfile").value = 50;
    }
    employeeModalInstance.show();
  }
  function saveEmployee() {
    const id = document.getElementById("empId").value.trim();
    const name = document.getElementById("empName").value.trim();
    if (!name) return alert("Employee name required");
    const profile = parseInt(document.getElementById("empProfile").value, 10);
    if (isNaN(profile) || profile < 0 || profile > 100) return alert("Profile 0-100");
    const newEmp = {
      id, name, profile,
      designation: document.getElementById("empDesignation").value.trim() || "Staff",
      department: document.getElementById("empDepartment").value.trim() || "General",
      team: document.getElementById("empTeam").value.trim() || "Core",
      supervisor: document.getElementById("empSupervisor").value.trim() || "Admin",
      tenure: document.getElementById("empTenure").value.trim() || "0 Yr",
      shift: document.getElementById("empShift").value.trim() || "Morning",
      city: document.getElementById("empCity").value.trim() || "Unknown",
      state: document.getElementById("empState").value.trim() || "NA",
      religion: document.getElementById("empReligion").value.trim() || "Other",
      avatar: document.getElementById("empAvatar").value.trim() || "https://randomuser.me/api/portraits/lego/1.jpg"
    };
    if (isEditMode) {
      let idx = employeesData.findIndex(e => e.id === id);
      if (idx !== -1) employeesData[idx] = newEmp;
      else alert("not found");
    } else {
      if (employeesData.some(e => e.id === id)) return alert("Duplicate ID");
      employeesData.push(newEmp);
    }
    renderTables();
    employeeModalInstance.hide();
  }
  function deleteEmployee(id) { if (confirm("Delete this employee?")) { employeesData = employeesData.filter(e => e.id !== id); renderTables(); } }
  function exportToCSV() {
    const filtered = getFilteredEmployees();
    const headers = ["ID", "Name", "Designation", "Department", "Team", "Supervisor", "Tenure", "Profile%", "Shift", "City", "State"];
    const rows = filtered.map(e => [e.id, e.name, e.designation, e.department, e.team, e.supervisor, e.tenure, e.profile, e.shift, e.city, e.state]);
    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "employees_export.csv"; link.click(); URL.revokeObjectURL(link.href);
  }
  function applyFiltersFromUI() {
    currentFilters = {
      jobTitle: document.getElementById("filterJobTitle").value.trim(),
      team: document.getElementById("filterTeam").value.trim(),
      department: document.getElementById("filterDepartment").value.trim(),
      shift: document.getElementById("filterShift").value.trim(),
      city: document.getElementById("filterCity").value.trim(),
      state: document.getElementById("filterState").value.trim(),
      religion: document.getElementById("filterReligion").value.trim()
    };
    renderTables(); app.closeFilterSidebar();
  }
  function resetFilters() {
    ["filterJobTitle", "filterTeam", "filterDepartment", "filterShift", "filterCity", "filterState", "filterReligion"].forEach(id => document.getElementById(id).value = "");
    currentFilters = { jobTitle: "", team: "", department: "", shift: "", city: "", state: "", religion: "" };
    renderTables();
  }
  window.app = {
    showSection(section) { document.getElementById("dashboardSection").style.display = section === "dashboard" ? "block" : "none"; document.getElementById("usersSection").style.display = section === "users" ? "block" : "none"; renderTables(); if (window.innerWidth <= 768) document.getElementById("sidebar").classList.remove("active"); },
    toggleDropdown(menuId) { if (document.getElementById("sidebar").classList.contains("collapsed") && window.innerWidth > 768) return; const m = document.getElementById(menuId); if (!m) return; const vis = m.style.display === "block"; document.querySelectorAll(".submenu").forEach(s => s.style.display = "none"); if (!vis) m.style.display = "block"; },
    openFilterSidebar() { document.getElementById("filterSidebar").classList.add("active"); },
    closeFilterSidebar() { document.getElementById("filterSidebar").classList.remove("active"); },
    alertFeature(msg) { alert(`✨ ${msg} (demo)`); },
    openEmployeeModal: (id = null) => openEmployeeModal(id),
    editEmployee: (id) => openEmployeeModal(id),
    deleteEmployee: (id) => deleteEmployee(id),
    exportToCSV: () => exportToCSV()
  };
  function toggleSidebarDesktop() {
    const sidebar = document.getElementById("sidebar"), main = document.getElementById("mainContainer");
    if (window.innerWidth <= 768) { sidebar.classList.toggle("active"); main.style.marginLeft = sidebar.classList.contains("active") ? "280px" : "0px"; }
    else { sidebar.classList.toggle("collapsed"); main.style.marginLeft = sidebar.classList.contains("collapsed") ? "88px" : "280px"; if (sidebar.classList.contains("collapsed")) document.querySelectorAll(".submenu").forEach(s => s.style.display = "none"); }
  }
  document.getElementById("toggleSidebarBtn").addEventListener("click", toggleSidebarDesktop);
  document.getElementById("applyFilterBtn").addEventListener("click", applyFiltersFromUI);
  document.getElementById("resetFilterBtn").addEventListener("click", () => { resetFilters(); app.closeFilterSidebar(); });
  document.getElementById("saveEmployeeBtn").addEventListener("click", saveEmployee);
  window.addEventListener("resize", () => { if (window.innerWidth > 768) { document.getElementById("sidebar").classList.remove("active"); if (!document.getElementById("sidebar").classList.contains("collapsed")) document.getElementById("mainContainer").style.marginLeft = "280px"; else document.getElementById("mainContainer").style.marginLeft = "88px"; } else { document.getElementById("mainContainer").style.marginLeft = "0px"; } });
  document.addEventListener("click", (e) => { if (window.innerWidth <= 768 && !document.getElementById("sidebar").contains(e.target) && !e.target.closest(".toggle-btn")) document.getElementById("sidebar").classList.remove("active"); });
  employeeModalInstance = new bootstrap.Modal(document.getElementById("employeeModal"));
  renderTables(); app.showSection("dashboard"); if (window.innerWidth > 768) document.getElementById("mainContainer").style.marginLeft = "280px";
})();
