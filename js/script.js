<script>
  (function(){
    // ----- enriched employees dataset with extra fields for filtering
    const employeesData = [
      { id:"0001", name:"Anika Vaccaro", designation:"Manager", department:"Operations", team:"Super A", supervisor:"Kaylo Margo", tenure:"1 Yr, 2 Mo", profile:95, shift:"Morning", city:"New York", state:"NY", religion:"Christian", avatar:"https://randomuser.me/api/portraits/women/68.jpg" },
      { id:"0002", name:"Chance Stanton", designation:"Department Head", department:"HR", team:"Super B", supervisor:"Ayson Westervelt", tenure:"3 Yr, 6 Mo", profile:45, shift:"Evening", city:"Austin", state:"TX", religion:"Buddhism", avatar:"https://randomuser.me/api/portraits/men/32.jpg" },
      { id:"0003", name:"Gretchen Lubin", designation:"Team Lead", department:"Operations", team:"Super C", supervisor:"Ryan Vaccaro", tenure:"2 Yr", profile:90, shift:"Morning", city:"Seattle", state:"WA", religion:"Christian", avatar:"https://randomuser.me/api/portraits/women/44.jpg" },
      { id:"0004", name:"Roger Westervelt", designation:"VOB Specialist", department:"Operations", team:"Super D", supervisor:"Anika Gold", tenure:"1 Yr, 2 Mo", profile:93, shift:"Night", city:"Chicago", state:"IL", religion:"Jewish", avatar:"https://randomuser.me/api/portraits/men/45.jpg" },
      { id:"0005", name:"Tatiana Dias", designation:"Account Manager", department:"Operations", team:"Super E", supervisor:"Angel Levin", tenure:"1 Yr, 1 Mo", profile:15, shift:"Morning", city:"Miami", state:"FL", religion:"Catholic", avatar:"https://randomuser.me/api/portraits/women/29.jpg" },
      { id:"0006", name:"Marcus Chen", designation:"Senior Analyst", department:"Finance", team:"Alpha", supervisor:"Linda Wu", tenure:"2 Yr, 4 Mo", profile:88, shift:"Morning", city:"San Francisco", state:"CA", religion:"Atheist", avatar:"https://randomuser.me/api/portraits/men/22.jpg" },
      { id:"0007", name:"Sophia Rodriguez", designation:"HR Generalist", department:"HR", team:"Talent Squad", supervisor:"Chance Stanton", tenure:"1 Yr", profile:72, shift:"Evening", city:"Los Angeles", state:"CA", religion:"Christian", avatar:"https://randomuser.me/api/portraits/women/90.jpg" },
      { id:"0008", name:"James Okafor", designation:"IT Support", department:"Technology", team:"TechOps", supervisor:"Rita Blake", tenure:"6 Mo", profile:60, shift:"Night", city:"Houston", state:"TX", religion:"Muslim", avatar:"https://randomuser.me/api/portraits/men/55.jpg" },
      { id:"0009", name:"Elena Park", designation:"Product Owner", department:"Product", team:"Innovate", supervisor:"Marcus Chen", tenure:"8 Mo", profile:82, shift:"Morning", city:"Seattle", state:"WA", religion:"None", avatar:"https://randomuser.me/api/portraits/women/12.jpg" }
    ];

    let currentFilters = { jobTitle:"", team:"", department:"", shift:"", city:"", state:"", religion:"" };
    let activeSection = "dashboard";

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

    function getProfileClass(percent) {
      if (percent < 40) return "low";
      if (percent < 70) return "medium";
      return "high";
    }

    function renderProfileWidget(percent) {
      const cls = getProfileClass(percent);
      return `<div class="profile-bar ${cls}"><div class="bar-fill" style="width: ${percent}%;"></div></div><div class="d-flex justify-content-between align-items-center"><span class="small fw-semibold">${percent}%</span><span class="small text-muted">complete</span></div>`;
    }

    function updateStatsCards(filteredCount) {
      const total = employeesData.length;
      const activeToday = filteredCount > 0 ? Math.min(filteredCount + 3, total) : 8;
      const avgProfile = Math.round(employeesData.reduce((s, e) => s + e.profile, 0) / total);
      const newThisMonth = 4;
      const statsHtml = `
        <div class="dashboard-card"><h3>${total}</h3><p><i class="fas fa-users me-1 text-primary"></i> Total workforce</p></div>
        <div class="dashboard-card"><h3>${activeToday}</h3><p><i class="fas fa-user-check text-success me-1"></i> Active (filtered)</p></div>
        <div class="dashboard-card"><h3>${avgProfile}%</h3><p><i class="fas fa-chart-simple me-1"></i> Avg. completion</p></div>
        <div class="dashboard-card"><h3>${newThisMonth}</h3><p><i class="fas fa-calendar-plus me-1"></i> New hires</p></div>
      `;
      document.getElementById("statsCards").innerHTML = statsHtml;
    }

    function renderTables() {
      const filtered = getFilteredEmployees();
      updateStatsCards(filtered.length);

      // Dashboard table
      const dashBody = document.getElementById("dashboardTableBody");
      if (dashBody) {
        dashBody.innerHTML = filtered.map(emp => `
          <tr>
            <td class="fw-semibold">${emp.id}</td>
            <td><img src="${emp.avatar}" class="avatar" onerror="this.src='https://randomuser.me/api/portraits/lego/1.jpg'" alt=""> ${emp.name}</td>
            <td>${emp.designation}</td>
            <td><span class="badge bg-light text-dark px-3 py-1 rounded-pill">${emp.department}</span></td>
            <td>${emp.team}</td>
            <td>${emp.supervisor}</td>
            <td><i class="far fa-clock me-1 text-secondary"></i>${emp.tenure}</td>
            <td style="min-width:110px">${renderProfileWidget(emp.profile)}</td>
          </tr>
        `).join("");
      }

      const usersBody = document.getElementById("usersTableBody");
      if (usersBody) {
        usersBody.innerHTML = filtered.map(emp => `
          <tr>
            <td class="fw-semibold">${emp.id}</td>
            <td><img src="${emp.avatar}" class="avatar" onerror="this.src='https://randomuser.me/api/portraits/lego/1.jpg'"> ${emp.name}</td>
            <td>${emp.designation}</td>
            <td>${emp.department}</td>
            <td>${emp.team}</td>
            <td>${emp.supervisor}</td>
            <td>${emp.tenure}</td>
            <td>${renderProfileWidget(emp.profile)}</td>
            <td><button class="btn btn-sm btn-outline-primary rounded-pill px-3" onclick="app.alertFeature('✏️ Editing ${emp.name}')"><i class="fas fa-pen"></i> Edit</button></td>
          </tr>
        `).join("");
      }
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
      renderTables();
      app.closeFilterSidebar();
    }

    function resetFilters() {
      document.getElementById("filterJobTitle").value = "";
      document.getElementById("filterTeam").value = "";
      document.getElementById("filterDepartment").value = "";
      document.getElementById("filterShift").value = "";
      document.getElementById("filterCity").value = "";
      document.getElementById("filterState").value = "";
      document.getElementById("filterReligion").value = "";
      currentFilters = { jobTitle:"", team:"", department:"", shift:"", city:"", state:"", religion:"" };
      renderTables();
    }

    // Global app object
    window.app = {
      showSection(section) {
        activeSection = section;
        const dashDiv = document.getElementById("dashboardSection");
        const usersDiv = document.getElementById("usersSection");
        if (section === "dashboard") {
          dashDiv.style.display = "block";
          usersDiv.style.display = "none";
        } else {
          dashDiv.style.display = "none";
          usersDiv.style.display = "block";
        }
        renderTables();
        if (window.innerWidth <= 768) document.getElementById("sidebar").classList.remove("active");
      },
      toggleDropdown(menuId) {
        const sidebar = document.getElementById("sidebar");
        if (sidebar.classList.contains("collapsed") && window.innerWidth > 768) return;
        const menu = document.getElementById(menuId);
        if (!menu) return;
        const isVisible = menu.style.display === "block";
        document.querySelectorAll(".submenu").forEach(sub => sub.style.display = "none");
        if (!isVisible) menu.style.display = "block";
      },
      openFilterSidebar() {
        document.getElementById("filterSidebar").classList.add("active");
      },
      closeFilterSidebar() {
        document.getElementById("filterSidebar").classList.remove("active");
      },
      alertFeature(msg) {
        alert(`✨ ${msg} (interactive demo)`);
      }
    };

    // sidebar toggle
    function toggleSidebarDesktop() {
      const sidebar = document.getElementById("sidebar");
      const main = document.getElementById("mainContainer");
      if (window.innerWidth <= 768) {
        sidebar.classList.toggle("active");
        main.style.marginLeft = sidebar.classList.contains("active") ? "280px" : "0px";
      } else {
        sidebar.classList.toggle("collapsed");
        const isCollapsed = sidebar.classList.contains("collapsed");
        main.style.marginLeft = isCollapsed ? "88px" : "280px";
        if (isCollapsed) document.querySelectorAll(".submenu").forEach(sub => sub.style.display = "none");
      }
    }

    document.getElementById("toggleSidebarBtn").addEventListener("click", toggleSidebarDesktop);
    document.getElementById("applyFilterBtn").addEventListener("click", applyFiltersFromUI);
    document.getElementById("resetFilterBtn").addEventListener("click", () => { resetFilters(); app.closeFilterSidebar(); });
    window.addEventListener("resize", () => {
      const sidebar = document.getElementById("sidebar");
      const main = document.getElementById("mainContainer");
      if (window.innerWidth > 768) {
        sidebar.classList.remove("active");
        if (!sidebar.classList.contains("collapsed")) main.style.marginLeft = "280px";
        else main.style.marginLeft = "88px";
      } else {
        main.style.marginLeft = "0px";
      }
    });
    document.addEventListener("click", (e) => {
      const sidebar = document.getElementById("sidebar");
      if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !e.target.closest(".toggle-btn")) {
        sidebar.classList.remove("active");
      }
    });
    // initial
    renderTables();
    app.showSection("dashboard");
    if (window.innerWidth > 768) document.getElementById("mainContainer").style.marginLeft = "280px";
  })();
</scri