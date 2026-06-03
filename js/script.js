
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

function showToast(msg) { let t=document.createElement("div"); t.className="toast-msg"; t.innerHTML=`<i class="fas fa-check-circle me-2" style="color:var(--success);"></i>${msg}`; document.body.appendChild(t); setTimeout(()=>t.remove(),2500); }
function addLog(a,d){ auditLog.unshift({time:new Date().toLocaleString(),action:a,details:d}); if(auditLog.length>20) auditLog.pop(); }
function getSidebarFiltered(){ return employees.filter(e=>(!currentFilters.job||e.designation.toLowerCase().includes(currentFilters.job.toLowerCase()))&&(!currentFilters.dept||e.department.toLowerCase().includes(currentFilters.dept.toLowerCase()))&&(!currentFilters.team||e.team.toLowerCase().includes(currentFilters.team.toLowerCase()))); }
function getSearchFiltered(){ return employees.filter(e=>(!searchFilters.name||e.name.toLowerCase().includes(searchFilters.name.toLowerCase()))&&(!searchFilters.designation||e.designation.toLowerCase().includes(searchFilters.designation.toLowerCase()))&&(!searchFilters.dept||e.department.toLowerCase().includes(searchFilters.dept.toLowerCase()))&&(!searchFilters.minProfile||e.profile>=parseInt(searchFilters.minProfile))); }
function getProfileClass(p){ return p<40?"low":p<70?"medium":"high"; }
function renderProfile(p){ let c=getProfileClass(p); return `<div class="profile-bar ${c}"><div class="profile-fill" style="width:${p}%"></div></div><small class="text-muted">${p}%</small>`; }
function getRoleBadge(r){ let i=r==="admin"?"<i class='fas fa-crown'></i>":r==="editor"?"<i class='fas fa-edit'></i>":"<i class='fas fa-eye'></i>"; return `<span class="role-badge role-${r}">${i} ${r.toUpperCase()}</span>`; }

function updateCharts(){
  let low=employees.filter(e=>e.profile<40).length,mid=employees.filter(e=>e.profile>=40&&e.profile<70).length,high=employees.filter(e=>e.profile>=70).length;
  let deptMap=new Map(); employees.forEach(e=>deptMap.set(e.department,(deptMap.get(e.department)||0)+1));
  if(profileChart) profileChart.destroy(); if(deptChart) deptChart.destroy();
  profileChart=new Chart(document.getElementById('profileChart'),{type:'doughnut',data:{labels:['Low (<40%)','Medium (40-69%)','High (≥70%)'],datasets:[{data:[low,mid,high],backgroundColor:['#ef4444','#f59e0b','#10b981'],borderWidth:0}]},options:{responsive:true,maintainAspectRatio:true,plugins:{legend:{position:'bottom',labels:{font:{size:11}}}}}});
  deptChart=new Chart(document.getElementById('deptChart'),{type:'bar',data:{labels:Array.from(deptMap.keys()),datasets:[{label:'Employees',data:Array.from(deptMap.values()),backgroundColor:'#4f46e5',borderRadius:8}]},options:{responsive:true,maintainAspectRatio:true,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,ticks:{stepSize:1}}}}});
}

function renderStats(){
  let total=employees.length,avg=Math.round(employees.reduce((a,b)=>a+b.profile,0)/total),high=employees.filter(e=>e.profile>=80).length;
  document.getElementById("statsCards").innerHTML=`<div class="col-md-3"><div class="stat-card"><div class="d-flex justify-content-between align-items-start"><i class="fas fa-users fs-1" style="color:var(--primary);"></i><span class="badge bg-success rounded-pill">+12%</span></div><h2 class="fw-bold mt-3 mb-1">${total}</h2><p class="text-muted mb-0">Total Employees</p></div></div><div class="col-md-3"><div class="stat-card"><div class="d-flex justify-content-between"><i class="fas fa-chart-line fs-1" style="color:var(--success);"></i><span class="badge bg-info rounded-pill">Active</span></div><h2 class="fw-bold mt-3 mb-1">${avg}%</h2><p class="text-muted mb-0">Avg Profile</p></div></div><div class="col-md-3"><div class="stat-card"><i class="fas fa-trophy fs-1" style="color:var(--warning);"></i><h2 class="fw-bold mt-3 mb-1">${high}</h2><p class="text-muted mb-0">High Performers</p></div></div><div class="col-md-3"><div class="stat-card"><i class="fas fa-building fs-1" style="color:var(--info);"></i><h2 class="fw-bold mt-3 mb-1">${new Set(employees.map(e=>e.department)).size}</h2><p class="text-muted mb-0">Departments</p></div></div>`;
  updateCharts();
}

function renderTables(){
  let sidebarFiltered=getSidebarFiltered(); renderStats();
  document.getElementById("dashboardTable").innerHTML=sidebarFiltered.map(e=>`<tr><td class="fw-semibold">${e.id}</td><td><img src="${e.avatar}" class="avatar"> ${e.name}</td><td>${e.designation}</td><td><span class="badge bg-light border px-3 py-1 rounded-pill">${e.department}</span></td><td>${e.team}</td><td>${e.supervisor}</td><td>${renderProfile(e.profile)}</td></td>`).join("");
  let searchFiltered=getSearchFiltered();
  document.getElementById("usersTable").innerHTML=searchFiltered.map(e=>`<tr><td class="fw-semibold">${e.id}</td><td><img src="${e.avatar}" class="avatar"> ${e.name}</td><td>${e.designation}</td><td>${e.department}</td><td>${e.team}</td><td>${renderProfile(e.profile)}</td><td>${getRoleBadge(e.role)}</td><td><div class="action-btns"><div class="action-btn edit" onclick="editEmployee('${e.id}')"><i class="fas fa-edit"></i></div><div class="action-btn delete" onclick="deleteEmployee('${e.id}')"><i class="fas fa-trash-alt"></i></div><div class="action-btn permission" onclick="openPermissionsForUser('${e.id}')"><i class="fas fa-shield-alt"></i></div></div></td></tr>`).join("");
}

function generateId(){ let m=0; employees.forEach(e=>{let n=parseInt(e.id); if(n>m) m=n;}); return String(m+1).padStart(4,'0'); }
function openEmployeeModal(id=null){ editMode=!!id; document.getElementById("modalTitle").innerHTML=editMode?"<i class='fas fa-edit me-2'></i>Edit Employee":"<i class='fas fa-user-plus me-2'></i>Add Employee"; if(id){ let e=employees.find(e=>e.id===id); if(e){ document.getElementById("empId").value=e.id; document.getElementById("empName").value=e.name; document.getElementById("empDesignation").value=e.designation; document.getElementById("empDepartment").value=e.department; document.getElementById("empTeam").value=e.team; document.getElementById("empSupervisor").value=e.supervisor; document.getElementById("empTenure").value=e.tenure; document.getElementById("empProfile").value=e.profile; document.getElementById("empShift").value=e.shift; document.getElementById("empCity").value=e.city; document.getElementById("empAvatar").value=e.avatar; } } else { document.getElementById("empId").value=generateId(); ["empName","empDesignation","empDepartment","empTeam","empSupervisor","empTenure","empShift","empCity","empAvatar"].forEach(i=>{let el=document.getElementById(i); if(el) el.value="";}); document.getElementById("empProfile").value=50; document.getElementById("empAvatar").value="https://randomuser.me/api/portraits/lego/1.jpg"; } employeeModal.show(); }
function saveEmployee(){ let id=document.getElementById("empId").value, name=document.getElementById("empName").value.trim(); if(!name){ alert("Name required"); return; } let p=parseInt(document.getElementById("empProfile").value); if(isNaN(p)||p<0||p>100){ alert("Profile 0-100"); return; } let newEmp={id,name,profile:p,role:editMode?(employees.find(e=>e.id===id)?.role||"viewer"):"viewer",designation:document.getElementById("empDesignation").value.trim()||"Staff",department:document.getElementById("empDepartment").value.trim()||"General",team:document.getElementById("empTeam").value.trim()||"Core",supervisor:document.getElementById("empSupervisor").value.trim()||"Admin",tenure:document.getElementById("empTenure").value.trim()||"0 Yr",shift:document.getElementById("empShift").value.trim()||"Morning",city:document.getElementById("empCity").value.trim()||"Unknown",avatar:document.getElementById("empAvatar").value.trim()||"https://randomuser.me/api/portraits/lego/1.jpg"}; if(editMode){ let idx=employees.findIndex(e=>e.id===id); if(idx!==-1) employees[idx]=newEmp; addLog("UPDATE",name); } else { if(employees.some(e=>e.id===id)){ alert("Duplicate ID"); return; } employees.push(newEmp); addLog("CREATE",name); } renderTables(); employeeModal.hide(); showToast(`${editMode?"Updated":"Added"} ${name}`); }
function deleteEmployee(id){ let e=employees.find(e=>e.id===id); if(confirm(`Delete ${e?.name}?`)){ employees=employees.filter(e=>e.id!==id); addLog("DELETE",e?.name); renderTables(); showToast(`Deleted ${e?.name}`); } }
function editEmployee(id){ openEmployeeModal(id); }
function openPermissionsModal(){ renderPermissionsList(); permissionsModal.show(); }
function renderPermissionsList(){ document.getElementById("permissionsList").innerHTML=employees.map(e=>`<div class="d-flex justify-content-between align-items-center border-bottom py-2"><div><strong>${e.name}</strong> <span class="text-muted">(${e.id})</span></div><div>${getRoleBadge(e.role)} <button class="btn btn-sm btn-outline-secondary ms-2" onclick="assignRole('${e.id}','editor')">Editor</button><button class="btn btn-sm btn-outline-primary ms-1" onclick="assignRole('${e.id}','admin')">Admin</button></div></div>`).join(''); }
function assignRole(id,r){ let e=employees.find(e=>e.id===id); if(e){ e.role=r; addLog("PERMISSION",`${e.name} → ${r}`); renderTables(); if(document.getElementById("permissionsList")) renderPermissionsList(); showToast(`${e.name} is now ${r}`); } }
function assignRoleFromInput(){ let id=document.getElementById("assignEmpId").value.trim(), r=document.getElementById("assignRole").value, e=employees.find(e=>e.id===id); if(!e){ alert("Not found"); return; } e.role=r; addLog("PERMISSION",`${e.name} → ${r}`); renderTables(); showToast(`${e.name} role updated`); document.getElementById("assignEmpId").value=""; permissionsModal.hide(); }
function openPermissionsForUser(id){ openPermissionsModal(); setTimeout(()=>{document.getElementById("assignEmpId").value=id;},200); }
function applySidebarFilters(){ currentFilters={job:document.getElementById("filterJob").value.trim(),dept:document.getElementById("filterDept").value.trim(),team:document.getElementById("filterTeam").value.trim()}; renderTables(); closeFilterSidebar(); showToast("Filters applied"); }
function resetSidebarFilters(){ document.getElementById("filterJob").value=""; document.getElementById("filterDept").value=""; document.getElementById("filterTeam").value=""; currentFilters={job:"",dept:"",team:""}; renderTables(); showToast("Filters reset"); }
function updateSearchFilters(){ searchFilters={name:document.getElementById("searchName").value.trim(),designation:document.getElementById("searchDesignation").value.trim(),dept:document.getElementById("searchDept").value.trim(),minProfile:document.getElementById("searchMinProfile").value.trim()}; renderTables(); }
function clearSearchFilters(){ document.getElementById("searchName").value=""; document.getElementById("searchDesignation").value=""; document.getElementById("searchDept").value=""; document.getElementById("searchMinProfile").value=""; searchFilters={name:"",designation:"",dept:"",minProfile:""}; renderTables(); showToast("Filters cleared"); }
function exportToCSV(){ let f=getSearchFiltered(); let h=["ID","Name","Designation","Department","Team","Supervisor","Profile%","Shift","City","Role"]; let r=f.map(e=>[e.id,e.name,e.designation,e.department,e.team,e.supervisor,e.profile,e.shift,e.city,e.role]); let csv=[h,...r].map(r=>r.join(",")).join("\n"); let b=new Blob([csv],{type:"text/csv"}); let a=document.createElement("a"); a.href=URL.createObjectURL(b); a.download=`employees_${new Date().toISOString().slice(0,19)}.csv`; a.click(); showToast("Export complete"); }
function showSection(s){ document.getElementById("dashboardSection").style.display=s==="dashboard"?"block":"none"; document.getElementById("usersSection").style.display=s==="users"?"block":"none"; renderTables(); if(window.innerWidth<=992){ document.getElementById("sidebar").classList.remove("active"); document.getElementById("overlay").classList.remove("active"); } }
function toggleSubmenu(id){ let m=document.getElementById(id); if(m.style.display==="block") m.style.display="none"; else m.style.display="block"; }
function openFilterSidebar(){ document.getElementById("filterPanel").classList.add("active"); }
function closeFilterSidebar(){ document.getElementById("filterPanel").classList.remove("active"); }
function showAuditLog(){ alert(auditLog.length===0?"No actions":auditLog.slice(0,10).map(l=>`${l.time} - ${l.action}: ${l.details}`).join("\n")); }
function showHelp(){ alert("📘 NexusHR Help\n\n• Add employees using the Add button\n• Edit/Delete using action buttons\n• Use filters to search employees\n• Export data to CSV\n• Dark mode toggle in navbar\n• Roles: Admin, Editor, Viewer\n\nFor support: support@nexushr.com"); }
function toggleDarkMode(){ document.body.classList.toggle("dark"); let isDark=document.body.classList.contains("dark"); localStorage.setItem("theme",isDark?"dark":"light"); let btn=document.getElementById("darkModeBtn"); btn.innerHTML=isDark?'<i class="fas fa-sun"></i>':'<i class="fas fa-moon"></i>'; showToast(isDark?"Dark mode ON":"Light mode ON"); }
function initTheme(){ if(localStorage.getItem("theme")==="dark"){ document.body.classList.add("dark"); document.getElementById("darkModeBtn").innerHTML='<i class="fas fa-sun"></i>'; } }
function toggleSidebar(){ document.getElementById("sidebar").classList.toggle("active"); document.getElementById("overlay").classList.toggle("active"); }
function closeSidebar(){ document.getElementById("sidebar").classList.remove("active"); document.getElementById("overlay").classList.remove("active"); }

document.addEventListener("DOMContentLoaded",function(){
  document.getElementById("mobileSidebarToggle").addEventListener("click",toggleSidebar);
  document.getElementById("overlay").addEventListener("click",closeSidebar);
  document.getElementById("darkModeBtn").addEventListener("click",toggleDarkMode);
  document.getElementById("applyFiltersBtn").addEventListener("click",applySidebarFilters);
  document.getElementById("resetFiltersBtn").addEventListener("click",resetSidebarFilters);
  document.getElementById("saveEmpBtn").addEventListener("click",saveEmployee);
  document.getElementById("assignRoleBtn").addEventListener("click",assignRoleFromInput);
  document.getElementById("clearFiltersBtn").addEventListener("click",clearSearchFilters);
  document.getElementById("searchName").addEventListener("input",updateSearchFilters);
  document.getElementById("searchDesignation").addEventListener("input",updateSearchFilters);
  document.getElementById("searchDept").addEventListener("input",updateSearchFilters);
  document.getElementById("searchMinProfile").addEventListener("input",updateSearchFilters);
  employeeModal=new bootstrap.Modal(document.getElementById("employeeModal"));
  permissionsModal=new bootstrap.Modal(document.getElementById("permissionsModal"));
  initTheme(); renderTables(); showSection("dashboard");
});
