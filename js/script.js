
let employees = [
    { id: "0001", name: "Anika Vaccaro", designation: "Manager", department: "Operations", team: "Alpha", supervisor: "John Smith", tenure: "2 Yrs", profile: 95, shift: "Morning", city: "New York", avatar: "https://randomuser.me/api/portraits/women/68.jpg", role: "admin" },
    { id: "0002", name: "Chance Stanton", designation: "Team Lead", department: "IT", team: "Beta", supervisor: "Sarah Lee", tenure: "3 Yrs", profile: 78, shift: "Morning", city: "Austin", avatar: "https://randomuser.me/api/portraits/men/32.jpg", role: "editor" },
    { id: "0003", name: "Gretchen Lubin", designation: "HR Specialist", department: "HR", team: "Gamma", supervisor: "Mike Ross", tenure: "1 Yr", profile: 62, shift: "Evening", city: "Seattle", avatar: "https://randomuser.me/api/portraits/women/44.jpg", role: "viewer" },
    { id: "0004", name: "Marcus Chen", designation: "Analyst", department: "Finance", team: "Delta", supervisor: "Lisa Wong", tenure: "2 Yrs", profile: 88, shift: "Morning", city: "Chicago", avatar: "https://randomuser.me/api/portraits/men/22.jpg", role: "editor" },
    { id: "0005", name: "Sophia Rodriguez", designation: "Coordinator", department: "Operations", team: "Alpha", supervisor: "John Smith", tenure: "1 Yr", profile: 45, shift: "Night", city: "Miami", avatar: "https://randomuser.me/api/portraits/women/90.jpg", role: "viewer" }
];

let auditLog = [], currentFilters = { job: "", dept: "", team: "" };
let searchFilters = { name: "", designation: "", dept: "", minProfile: "" };
let editMode = false, employeeModal, permissionsModal, profileChart, deptChart;
let currentSection = "dashboard";

const isDark = () => document.body.classList.contains("dark");
const chartTextColor = () => isDark() ? "#94a3b8" : "#64748b";
const chartGridColor = () => isDark() ? "#334155" : "#e2e8f0";

function showToast(msg) {
    let t = document.createElement("div");
    t.className = "toast-msg";
    t.innerHTML = `<i class="fas fa-check-circle me-2" style="color:var(--success);"></i>${msg}`;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2500);
}

function addLog(a, d) {
    auditLog.unshift({ time: new Date().toLocaleString(), action: a, details: d });
    if (auditLog.length > 20) auditLog.pop();
}

function getSidebarFiltered() {
    return employees.filter(e =>
        (!currentFilters.job || e.designation.toLowerCase().includes(currentFilters.job.toLowerCase())) &&
        (!currentFilters.dept || e.department.toLowerCase().includes(currentFilters.dept.toLowerCase())) &&
        (!currentFilters.team || e.team.toLowerCase().includes(currentFilters.team.toLowerCase()))
    );
}

function getSearchFiltered() {
    return employees.filter(e =>
        (!searchFilters.name || e.name.toLowerCase().includes(searchFilters.name.toLowerCase())) &&
        (!searchFilters.designation || e.designation.toLowerCase().includes(searchFilters.designation.toLowerCase())) &&
        (!searchFilters.dept || e.department.toLowerCase().includes(searchFilters.dept.toLowerCase())) &&
        (!searchFilters.minProfile || e.profile >= parseInt(searchFilters.minProfile))
    );
}

function getProfileClass(p) { return p < 40 ? "low" : p < 70 ? "medium" : "high"; }

function renderProfile(p) {
    let c = getProfileClass(p);
    return `<div class="profile-cell"><div class="profile-bar ${c}"><div class="profile-fill" style="width:${p}%"></div></div><small class="text-muted">${p}%</small></div>`;
}

function getRoleBadge(r) {
    let i = r === "admin" ? "<i class='fas fa-crown'></i>" : r === "editor" ? "<i class='fas fa-edit'></i>" : "<i class='fas fa-eye'></i>";
    return `<span class="role-badge role-${r}">${i} ${r.toUpperCase()}</span>`;
}

function renderEmployeeCell(e) {
    return `<div class="employee-cell"><img src="${e.avatar}" class="avatar" alt="${e.name}"><span>${e.name}</span></div>`;
}

function updateCharts() {
    let low = employees.filter(e => e.profile < 40).length;
    let mid = employees.filter(e => e.profile >= 40 && e.profile < 70).length;
    let high = employees.filter(e => e.profile >= 70).length;
    let deptMap = new Map();
    employees.forEach(e => deptMap.set(e.department, (deptMap.get(e.department) || 0) + 1));

    if (profileChart) profileChart.destroy();
    if (deptChart) deptChart.destroy();

    const legendColor = chartTextColor();

    profileChart = new Chart(document.getElementById('profileChart'), {
        type: 'doughnut',
        data: {
            labels: ['Low (<40%)', 'Medium (40-69%)', 'High (≥70%)'],
            datasets: [{
                data: [low, mid, high],
                backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
                borderWidth: 0,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { font: { size: 12, family: 'Inter' }, color: legendColor, padding: 16, usePointStyle: true }
                }
            }
        }
    });

    deptChart = new Chart(document.getElementById('deptChart'), {
        type: 'bar',
        data: {
            labels: Array.from(deptMap.keys()),
            datasets: [{
                label: 'Employees',
                data: Array.from(deptMap.values()),
                backgroundColor: isDark()
                    ? 'rgba(99, 102, 241, 0.7)'
                    : 'rgba(99, 102, 241, 0.85)',
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: legendColor, font: { size: 11 } }
                },
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1, color: legendColor, font: { size: 11 } },
                    grid: { color: chartGridColor() }
                }
            }
        }
    });
}

function renderStats() {
    let total = employees.length;
    let avg = Math.round(employees.reduce((a, b) => a + b.profile, 0) / total);
    let high = employees.filter(e => e.profile >= 80).length;
    let depts = new Set(employees.map(e => e.department)).size;

    const cards = [
        { icon: 'fa-users', color: 'primary', badge: '+12%', badgeClass: 'bg-success', value: total, label: 'Total Employees', accent: 'var(--primary)' },
        { icon: 'fa-chart-line', color: 'success', badge: 'Active', badgeClass: 'bg-info', value: avg + '%', label: 'Avg Profile', accent: 'var(--success)' },
        { icon: 'fa-trophy', color: 'warning', badge: null, value: high, label: 'High Performers', accent: 'var(--warning)' },
        { icon: 'fa-building', color: 'info', badge: null, value: depts, label: 'Departments', accent: 'var(--info)' }
    ];

    document.getElementById("statsCards").innerHTML = cards.map(c => `
        <div class="col-6 col-lg-3">
            <div class="stat-card" style="--card-accent: ${c.accent};">
                <div class="stat-card-header">
                    <div class="stat-card-icon ${c.color}"><i class="fas ${c.icon}"></i></div>
                    ${c.badge ? `<span class="stat-card-badge badge ${c.badgeClass} rounded-pill">${c.badge}</span>` : ''}
                </div>
                <h2>${c.value}</h2>
                <p class="stat-card-label">${c.label}</p>
            </div>
        </div>
    `).join('');

    updateCharts();
}

function renderTables() {
    let sidebarFiltered = getSidebarFiltered();
    renderStats();

    document.getElementById("dashboardTable").innerHTML = sidebarFiltered.map(e => `
        <tr>
            <td class="fw-semibold" data-label="ID">${e.id}</td>
            <td data-label="Employee">${renderEmployeeCell(e)}</td>
            <td data-label="Role">${e.designation}</td>
            <td data-label="Department"><span class="badge dept-badge rounded-pill">${e.department}</span></td>
            <td data-label="Team">${e.team}</td>
            <td data-label="Supervisor">${e.supervisor}</td>
            <td data-label="Profile">${renderProfile(e.profile)}</td>
        </tr>
    `).join("");

    let searchFiltered = getSearchFiltered();
    document.getElementById("usersTable").innerHTML = searchFiltered.map(e => `
        <tr>
            <td class="fw-semibold" data-label="ID">${e.id}</td>
            <td data-label="Name">${renderEmployeeCell(e)}</td>
            <td data-label="Designation">${e.designation}</td>
            <td data-label="Dept">${e.department}</td>
            <td data-label="Team">${e.team}</td>
            <td data-label="Profile">${renderProfile(e.profile)}</td>
            <td data-label="Role">${getRoleBadge(e.role)}</td>
            <td data-label="Actions">
                <div class="action-btns">
                    <div class="action-btn edit" onclick="editEmployee('${e.id}')" title="Edit"><i class="fas fa-edit"></i></div>
                    <div class="action-btn delete" onclick="deleteEmployee('${e.id}')" title="Delete"><i class="fas fa-trash-alt"></i></div>
                    <div class="action-btn permission" onclick="openPermissionsForUser('${e.id}')" title="Permissions"><i class="fas fa-shield-alt"></i></div>
                </div>
            </td>
        </tr>
    `).join("");
}

function generateId() {
    let m = 0;
    employees.forEach(e => { let n = parseInt(e.id); if (n > m) m = n; });
    return String(m + 1).padStart(4, '0');
}

function openEmployeeModal(id = null) {
    editMode = !!id;
    document.getElementById("modalTitle").innerHTML = editMode
        ? "<i class='fas fa-edit me-2'></i>Edit Employee"
        : "<i class='fas fa-user-plus me-2'></i>Add Employee";
    if (id) {
        let e = employees.find(e => e.id === id);
        if (e) {
            document.getElementById("empId").value = e.id;
            document.getElementById("empName").value = e.name;
            document.getElementById("empDesignation").value = e.designation;
            document.getElementById("empDepartment").value = e.department;
            document.getElementById("empTeam").value = e.team;
            document.getElementById("empSupervisor").value = e.supervisor;
            document.getElementById("empTenure").value = e.tenure;
            document.getElementById("empProfile").value = e.profile;
            document.getElementById("empShift").value = e.shift;
            document.getElementById("empCity").value = e.city;
            document.getElementById("empAvatar").value = e.avatar;
        }
    } else {
        document.getElementById("empId").value = generateId();
        ["empName", "empDesignation", "empDepartment", "empTeam", "empSupervisor", "empTenure", "empShift", "empCity", "empAvatar"].forEach(i => {
            let el = document.getElementById(i);
            if (el) el.value = "";
        });
        document.getElementById("empProfile").value = 50;
        document.getElementById("empAvatar").value = "https://randomuser.me/api/portraits/lego/1.jpg";
    }
    employeeModal.show();
}

function saveEmployee() {
    let id = document.getElementById("empId").value;
    let name = document.getElementById("empName").value.trim();
    if (!name) { alert("Name required"); return; }
    let p = parseInt(document.getElementById("empProfile").value);
    if (isNaN(p) || p < 0 || p > 100) { alert("Profile 0-100"); return; }
    let newEmp = {
        id, name, profile: p,
        role: editMode ? (employees.find(e => e.id === id)?.role || "viewer") : "viewer",
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
    let e = employees.find(e => e.id === id);
    if (confirm(`Delete ${e?.name}?`)) {
        employees = employees.filter(e => e.id !== id);
        addLog("DELETE", e?.name);
        renderTables();
        showToast(`Deleted ${e?.name}`);
    }
}

function editEmployee(id) { openEmployeeModal(id); }

function openPermissionsModal() { renderPermissionsList(); permissionsModal.show(); }

function renderPermissionsList() {
    document.getElementById("permissionsList").innerHTML = employees.map(e => `
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 border-bottom py-2">
            <div><strong>${e.name}</strong> <span class="text-muted">(${e.id})</span></div>
            <div class="d-flex align-items-center flex-wrap gap-1">
                ${getRoleBadge(e.role)}
                <button class="btn btn-sm btn-outline-secondary" onclick="assignRole('${e.id}','editor')">Editor</button>
                <button class="btn btn-sm btn-outline-primary" onclick="assignRole('${e.id}','admin')">Admin</button>
            </div>
        </div>
    `).join('');
}

function assignRole(id, r) {
    let e = employees.find(e => e.id === id);
    if (e) {
        e.role = r;
        addLog("PERMISSION", `${e.name} → ${r}`);
        renderTables();
        if (document.getElementById("permissionsList")) renderPermissionsList();
        showToast(`${e.name} is now ${r}`);
    }
}

function assignRoleFromInput() {
    let id = document.getElementById("assignEmpId").value.trim();
    let r = document.getElementById("assignRole").value;
    let e = employees.find(e => e.id === id);
    if (!e) { alert("Not found"); return; }
    e.role = r;
    addLog("PERMISSION", `${e.name} → ${r}`);
    renderTables();
    showToast(`${e.name} role updated`);
    document.getElementById("assignEmpId").value = "";
    permissionsModal.hide();
}

function openPermissionsForUser(id) {
    openPermissionsModal();
    setTimeout(() => { document.getElementById("assignEmpId").value = id; }, 200);
}

function applySidebarFilters() {
    currentFilters = {
        job: document.getElementById("filterJob").value.trim(),
        dept: document.getElementById("filterDept").value.trim(),
        team: document.getElementById("filterTeam").value.trim()
    };
    renderTables();
    closeFilterSidebar();
    showToast("Filters applied");
}

function resetSidebarFilters() {
    document.getElementById("filterJob").value = "";
    document.getElementById("filterDept").value = "";
    document.getElementById("filterTeam").value = "";
    currentFilters = { job: "", dept: "", team: "" };
    renderTables();
    showToast("Filters reset");
}

function updateSearchFilters() {
    searchFilters = {
        name: document.getElementById("searchName").value.trim(),
        designation: document.getElementById("searchDesignation").value.trim(),
        dept: document.getElementById("searchDept").value.trim(),
        minProfile: document.getElementById("searchMinProfile").value.trim()
    };
    renderTables();
}

function clearSearchFilters() {
    document.getElementById("searchName").value = "";
    document.getElementById("searchDesignation").value = "";
    document.getElementById("searchDept").value = "";
    document.getElementById("searchMinProfile").value = "";
    searchFilters = { name: "", designation: "", dept: "", minProfile: "" };
    renderTables();
    showToast("Filters cleared");
}

function exportToCSV() {
    let f = getSearchFiltered();
    let h = ["ID", "Name", "Designation", "Department", "Team", "Supervisor", "Profile%", "Shift", "City", "Role"];
    let r = f.map(e => [e.id, e.name, e.designation, e.department, e.team, e.supervisor, e.profile, e.shift, e.city, e.role]);
    let csv = [h, ...r].map(r => r.join(",")).join("\n");
    let b = new Blob([csv], { type: "text/csv" });
    let a = document.createElement("a");
    a.href = URL.createObjectURL(b);
    a.download = `employees_${new Date().toISOString().slice(0, 19)}.csv`;
    a.click();
    showToast("Export complete");
}

function setActiveNav(section) {
    document.querySelectorAll('.nav-item[data-section]').forEach(el => {
        el.classList.toggle('active', el.dataset.section === section);
    });
    document.querySelectorAll('.submenu li[data-section]').forEach(el => {
        el.classList.toggle('active', el.dataset.section === section);
    });
    if (section === 'users') {
        let submenu = document.getElementById('usersSubmenu');
        let arrow = document.getElementById('usersArrow');
        submenu.classList.add('open');
        submenu.style.display = 'block';
        if (arrow) arrow.classList.add('open');
    }
}

function showSection(s) {
    currentSection = s;
    document.getElementById("dashboardSection").style.display = s === "dashboard" ? "block" : "none";
    document.getElementById("usersSection").style.display = s === "users" ? "block" : "none";
    setActiveNav(s);
    renderTables();
    if (window.innerWidth <= 992) closeSidebar();
}

function toggleSubmenu(id) {
    let m = document.getElementById(id);
    let arrow = document.getElementById('usersArrow');
    let isOpen = m.classList.contains('open');
    if (isOpen) {
        m.classList.remove('open');
        m.style.display = "none";
        if (arrow) arrow.classList.remove('open');
    } else {
        m.classList.add('open');
        m.style.display = "block";
        if (arrow) arrow.classList.add('open');
    }
}

function openFilterSidebar() { document.getElementById("filterPanel").classList.add("active"); }
function closeFilterSidebar() { document.getElementById("filterPanel").classList.remove("active"); }

function showAuditLog() {
    alert(auditLog.length === 0 ? "No actions recorded yet." : auditLog.slice(0, 10).map(l => `${l.time} - ${l.action}: ${l.details}`).join("\n"));
}

function showHelp() {
    alert("📘 NexusHR Help\n\n• Add employees using the Add button\n• Edit/Delete using action buttons\n• Use filters to search employees\n• Export data to CSV\n• Dark mode toggle in navbar\n• Roles: Admin, Editor, Viewer\n\nFor support: support@nexushr.com");
}

function toggleDarkMode() {
    document.body.classList.toggle("dark");
    let dark = document.body.classList.contains("dark");
    localStorage.setItem("theme", dark ? "dark" : "light");
    document.getElementById("darkModeBtn").innerHTML = dark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    document.querySelector('meta[name="theme-color"]').content = dark ? '#0f172a' : '#6366f1';
    updateCharts();
    showToast(dark ? "Dark mode enabled" : "Light mode enabled");
}

function initTheme() {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
        document.getElementById("darkModeBtn").innerHTML = '<i class="fas fa-sun"></i>';
        document.querySelector('meta[name="theme-color"]').content = '#0f172a';
    }
}

function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("active");
    document.getElementById("overlay").classList.toggle("active");
}

function closeSidebar() {
    document.getElementById("sidebar").classList.remove("active");
    document.getElementById("overlay").classList.remove("active");
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("mobileSidebarToggle").addEventListener("click", toggleSidebar);
    document.getElementById("sidebarClose").addEventListener("click", closeSidebar);
    document.getElementById("overlay").addEventListener("click", closeSidebar);
    document.getElementById("darkModeBtn").addEventListener("click", toggleDarkMode);
    document.getElementById("applyFiltersBtn").addEventListener("click", applySidebarFilters);
    document.getElementById("resetFiltersBtn").addEventListener("click", resetSidebarFilters);
    document.getElementById("saveEmpBtn").addEventListener("click", saveEmployee);
    document.getElementById("assignRoleBtn").addEventListener("click", assignRoleFromInput);
    document.getElementById("clearFiltersBtn").addEventListener("click", clearSearchFilters);
    document.getElementById("searchName").addEventListener("input", updateSearchFilters);
    document.getElementById("searchDesignation").addEventListener("input", updateSearchFilters);
    document.getElementById("searchDept").addEventListener("input", updateSearchFilters);
    document.getElementById("searchMinProfile").addEventListener("input", updateSearchFilters);

    employeeModal = new bootstrap.Modal(document.getElementById("employeeModal"));
    permissionsModal = new bootstrap.Modal(document.getElementById("permissionsModal"));

    initTheme();
    renderTables();
    showSection("dashboard");

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (profileChart) profileChart.resize();
            if (deptChart) deptChart.resize();
        }, 150);
    });
});
