(function(){
  const M = window.IOC_MOCK;
  if(!M) return;

  const PALETTE = {
    blue:"#1a6ab5", teal:"#0e8a7a", violet:"#6a3fb5", amber:"#c58a00",
    green:"#0e7a3a", red:"#d64545", navy:"#0b1e3a", gray:"#8ea0bf"
  };
  function statusColor(s){ return s==="green"?PALETTE.green : s==="amber"?PALETTE.amber : PALETTE.red; }
  function statusLabel(s){ return s==="green"?"Tốt":s==="amber"?"Cảnh báo":"Nguy cơ"; }
  function badge(s,t){ const cls=s==="green"?"badge-green":s==="amber"?"badge-amber":s==="red"?"badge-red":"badge-gray"; return `<span class="badge ${cls}">${t}</span>`; }

  function fmt(ind){ return M.fmtValue(ind); }
  function deltaBadge(ind){
    const d = M.delta(ind);
    const lowerBetter = ["shortage","overdue","incident","safety"].includes(ind.fmt);
    if(d===0) return `<span style="color:var(--faint)">—</span>`;
    if(lowerBetter){
      return d<0 ? `<span class="trend">↓ ${Math.abs(d).toLocaleString("vi-VN")} tốt hơn</span>` : `<span class="trend down">↑ +${d.toLocaleString("vi-VN")}</span>`;
    }
    return d>0 ? `<span class="trend">↑ +${d.toLocaleString("vi-VN",{minimumFractionDigits:1,maximumFractionDigits:1})}</span>` : `<span class="trend down">↓ ${d.toLocaleString("vi-VN",{minimumFractionDigits:1,maximumFractionDigits:1})}</span>`;
  }

  // Chart.js defaults
  function styleCharts(){
    if(!window.Chart) return;
    Chart.defaults.font.family = "Inter, system-ui, sans-serif";
    Chart.defaults.font.size = 11;
    Chart.defaults.color = "#6b7a94";
    Chart.defaults.borderColor = "#e6ebf2";
  }

  // destroy previous charts on element
  const registry = new Map();
  function getChart(id){ return registry.get(id); }
  function putChart(id, chart){ const old=registry.get(id); if(old) old.destroy(); registry.set(id, chart); }
  function destroyAll(){ registry.forEach(c=>c.destroy()); registry.clear(); }

  // KPI strip with mini sparkline
  function renderKpiStrip(container){
    if(!container) return;
    const kpis = [
      {k:"Tổng học sinh toàn TP", v:"498.732", s:"1.892 trường · 14.260 lớp", st:"green", trend:M.INDICATORS[0].trend, color:PALETTE.blue},
      {k:"Tỷ lệ GV / lớp", v:"1,62", s:"Thiếu 892 GV · Tuyển dụng 68,5%", st:"amber", trend:M.INDICATORS[3].trend, color:PALETTE.violet},
      {k:"Tỷ lệ lên lớp", v:"98,7%", s:"Tốt nghiệp 97,9% · Cần hỗ trợ 2,8%", st:"green", trend:M.INDICATORS[6].trend, color:PALETTE.green},
      {k:"Nhiệm vụ đúng hạn", v:"84,2%", s:"14 NV quá hạn/sắp hạn", st:"amber", trend:M.INDICATORS[9].trend, color:PALETTE.amber},
    ];
    container.innerHTML = kpis.map((k,i)=>`
      <div class="kpi-card ${k.st}">
        <div style="display:flex;align-items:center;gap:8px"><span class="k">${k.k}</span><span style="margin-left:auto">${badge(k.st,statusLabel(k.st))}</span></div>
        <div class="v">${k.v}</div>
        <div class="s">${k.s}</div>
        <div class="chart-mini"><canvas id="kpiSpark${i}"></canvas></div>
      </div>`).join("");
    setTimeout(()=>{
      kpis.forEach((k,i)=>{
        const el=document.getElementById(`kpiSpark${i}`);
        if(!el || !window.Chart) return;
        styleCharts();
        putChart(`kpiSpark${i}`, new Chart(el, {
          type:"line",
          data:{labels:k.trend.map((_,j)=>`K${j+1}`), datasets:[{data:k.trend, borderColor:k.color, backgroundColor:k.color+"14", fill:true, tension:.4, pointRadius:0, borderWidth:1.8}]},
          options:{responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}, tooltip:{enabled:true}}, scales:{x:{display:false}, y:{display:false}}}
        }));
      });
    }, 30);
  }

  function renderAlertStrip(container, filterIds){
    if(!container) return;
    let alerts = M.ALERTS;
    if(filterIds){
      alerts = alerts.filter(a=>{
        const g = a.detail.match(/Nhóm\s([IVX]+)/)?.[1] || "";
        return filterIds.includes(g);
      });
    }
    if(alerts.length===0){
      container.innerHTML = `<h3>⚡ Việc cần hành động</h3><p style="font-size:12.5px;color:var(--muted);margin:6px 0 0">Không có cảnh báo trong phạm vi này — mọi chỉ số đang ở mức tốt.</p>`;
      return;
    }
    container.innerHTML = `<h3>⚡ Việc cần hành động ngay</h3><div class="alert-list">`+
      alerts.map(a=>`<div class="alert-item"><span class="dot ${a.level}"></span><div><b>${a.title}</b><br><span style="font-size:11.5px;color:var(--muted)">${a.detail}</span></div><span style="margin-left:auto;flex-shrink:0">${badge(a.level,statusLabel(a.level))}</span></div>`).join("")+
      `</div>`;
  }

  function renderGroupsGrid(container, onClick){
    if(!container) return;
    container.innerHTML = M.GROUPS.map(g=>{
      const st=M.groupStatus[g.id];
      const hero=M.groupHero[g.id];
      return `<div class="group-card" data-group="${g.id}" role="button" tabindex="0">
        <div class="g-head">
          <span class="g-icon" style="background:${g.color}14;color:${g.color}">${g.icon}</span>
          <div><div class="g-title">Nhóm ${g.id} · ${g.name}</div><div class="g-sub">3 chỉ số</div></div>
          <span style="margin-left:auto">${badge(st,statusLabel(st))}</span>
        </div>
        <div class="g-value">${hero.label}</div>
        <div class="g-note">${hero.sub}</div>
        <div class="g-foot"><span style="font-size:11px;color:${statusColor(st)}">● ${statusLabel(st)}</span></div>
        <div class="status-bar ${st}"></div>
      </div>`;
    }).join("");
    container.querySelectorAll(".group-card").forEach(el=>{
      el.addEventListener("click", ()=> onClick(el.dataset.group));
      el.addEventListener("keydown", e=>{ if(e.key==="Enter") onClick(el.dataset.group); });
    });
  }

  function renderIndicatorTable(container, groupId){
    if(!container) return;
    const g=M.GROUPS.find(x=>x.id===groupId);
    const inds=M.INDICATORS.filter(x=>x.g===groupId);
    container.innerHTML = `
      <div class="card">
        <div class="card-hd">
          <h3>Nhóm ${g.id} — ${g.name}</h3>
          <p>3 chỉ số · ${g.id==="I"||g.id==="II"?"Cập nhật tháng":"Cập nhật tuần"}</p>
          <span style="margin-left:auto">${badge(M.groupStatus[g.id], statusLabel(M.groupStatus[g.id]))}</span>
        </div>
        <div style="overflow:auto">
        <table class="table">
          <thead><tr><th>#</th><th>Chỉ số</th><th>Kỳ này</th><th>So cùng kỳ</th><th>So KH kỳ</th><th>Trạng thái</th></tr></thead>
          <tbody>
            ${inds.map(ind=>{
              const st=M.statusOf(ind);
              const vs=M.vsTarget(ind);
              const lowerBetter=["shortage","overdue","incident","safety"].includes(ind.fmt);
              const vsText = vs===null || lowerBetter ? "—" : (vs>=0?`+${vs.toFixed(1)}%`:`${vs.toFixed(1)}%`);
              const vsCls = vsText==="—"?"":(vs>=0?"trend":"trend down");
              return `<tr>
                <td class="mono">${ind.id}</td>
                <td><b>${ind.name}</b><br><span style="font-size:11px;color:var(--faint)">${ind.unit}</span></td>
                <td style="font-weight:800;white-space:nowrap">${fmt(ind)}</td>
                <td>${deltaBadge(ind)}</td>
                <td class="${vsCls}" style="white-space:nowrap">${vsText}</td>
                <td>${badge(st,statusLabel(st))}</td>
              </tr>`;
            }).join("")}
          </tbody>
        </table>
        </div>
      </div>`;
  }

  // Charts for Lãnh đạo Sở
  function renderLeaderCharts(){
    if(!window.Chart) return;
    styleCharts();
    const labels = ["T11/24","T12/24","T01/25","T02/25","T03/25","T04/25","T05/25","T09/25"];

    // 1) Quy mô — total students trend
    const c1=document.getElementById("chartQuyMo");
    if(c1){
      putChart("chartQuyMo", new Chart(c1,{
        type:"line",
        data:{
          labels,
          datasets:[
            {label:"Tổng HS", data:M.INDICATORS[0].trend, borderColor:PALETTE.blue, backgroundColor:PALETTE.blue+"18", fill:true, tension:.38, pointRadius:3, pointBackgroundColor:PALETTE.blue},
            {label:"Tỷ lệ huy động (%)", data:M.INDICATORS[1].trend, borderColor:PALETTE.teal, backgroundColor:"transparent", fill:false, tension:.38, pointRadius:3, yAxisID:"y1"}
          ]
        },
        options:{
          responsive:true, maintainAspectRatio:false,
          interaction:{mode:"index", intersect:false},
          plugins:{legend:{position:"bottom", labels:{usePointStyle:true, boxWidth:8}}},
          scales:{
            y:{beginAtZero:false, grid:{color:"#f0f2f6"}, ticks:{callback:v=>Number(v).toLocaleString("vi-VN")}},
            y1:{position:"right", min:80, max:100, grid:{display:false}, ticks:{callback:v=>v+"%"}},
            x:{grid:{display:false}}
          }
        }
      }));
    }

    // 2) Đội ngũ — GV/lớp + thiếu GV
    const c2=document.getElementById("chartDoiNgu");
    if(c2){
      const gvl = M.INDICATORS[3].trend;
      const shortage = M.INDICATORS[4].trend.map(v=>Math.abs(v));
      putChart("chartDoiNgu", new Chart(c2,{
        type:"bar",
        data:{
          labels,
          datasets:[
            {type:"bar", label:"Thiếu GV", data:shortage, backgroundColor:PALETTE.amber+"cc", borderRadius:6, yAxisID:"y"},
            {type:"line", label:"GV/lớp", data:gvl, borderColor:PALETTE.violet, backgroundColor:"transparent", tension:.38, pointRadius:3, yAxisID:"y1"}
          ]
        },
        options:{
          responsive:true, maintainAspectRatio:false,
          plugins:{legend:{position:"bottom", labels:{usePointStyle:true, boxWidth:8}}},
          scales:{
            y:{beginAtZero:true, grid:{color:"#f0f2f6"}, title:{display:true, text:"Thiếu (người)"}},
            y1:{position:"right", min:1.4, max:1.8, grid:{display:false}, title:{display:true, text:"GV/lớp"}},
            x:{grid:{display:false}}
          }
        }
      }));
    }

    // 3) Chất lượng — 3 lines
    const c3=document.getElementById("chartChatLuong");
    if(c3){
      putChart("chartChatLuong", new Chart(c3,{
        type:"line",
        data:{
          labels,
          datasets:[
            {label:"Lên lớp %", data:M.INDICATORS[6].trend, borderColor:PALETTE.green, backgroundColor:PALETTE.green+"14", fill:true, tension:.38, pointRadius:2},
            {label:"Tốt nghiệp %", data:M.INDICATORS[7].trend, borderColor:PALETTE.blue, backgroundColor:"transparent", fill:false, tension:.38, pointRadius:2},
            {label:"Chưa đạt %", data:M.INDICATORS[8].trend, borderColor:PALETTE.red, backgroundColor:"transparent", fill:false, tension:.38, pointRadius:2}
          ]
        },
        options:{
          responsive:true, maintainAspectRatio:false,
          plugins:{legend:{position:"bottom", labels:{usePointStyle:true, boxWidth:8}}},
          scales:{y:{min:0, max:100, grid:{color:"#f0f2f6"}, ticks:{callback:v=>v+"%"}}, x:{grid:{display:false}}}
        }
      }));
    }

    // 4) TTHC
    const c4=document.getElementById("chartTTHC");
    if(c4){
      putChart("chartTTHC", new Chart(c4,{
        type:"bar",
        data:{
          labels,
          datasets:[
            {label:"Đúng hạn %", data:M.INDICATORS[12].trend, backgroundColor:PALETTE.teal+"cc", borderRadius:6},
            {label:"Trực tuyến %", data:M.INDICATORS[13].trend, backgroundColor:PALETTE.blue+"cc", borderRadius:6},
            {label:"Cắt giảm %", data:M.INDICATORS[14].trend, backgroundColor:PALETTE.amber+"cc", borderRadius:6}
          ]
        },
        options:{
          responsive:true, maintainAspectRatio:false,
          plugins:{legend:{position:"bottom", labels:{usePointStyle:true, boxWidth:8}}},
          scales:{y:{min:0,max:100, grid:{color:"#f0f2f6"}, ticks:{callback:v=>v+"%"}}, x:{grid:{display:false}}}
        }
      }));
    }

    // 5) CĐS — stacked-like but grouped
    const c5=document.getElementById("chartCDS");
    if(c5){
      putChart("chartCDS", new Chart(c5,{
        type:"bar",
        data:{
          labels,
          datasets:[
            {label:"Dữ liệu đạt %", data:M.INDICATORS[15].trend, backgroundColor:"#0e8a7a", borderRadius:6},
            {label:"Học bạ số ký số %", data:M.INDICATORS[16].trend, backgroundColor:"#1a6ab5", borderRadius:6},
            {label:"Sử dụng nền tảng %", data:M.INDICATORS[17].trend, backgroundColor:"#6a3fb5", borderRadius:6}
          ]
        },
        options:{
          responsive:true, maintainAspectRatio:false,
          plugins:{legend:{position:"bottom", labels:{usePointStyle:true, boxWidth:8}}},
          scales:{y:{min:0,max:100, grid:{color:"#f0f2f6"}, ticks:{callback:v=>v+"%"}}, x:{grid:{display:false}}}
        }
      }));
    }

    // 6) ATTT
    const c6=document.getElementById("chartATTT");
    if(c6){
      putChart("chartATTT", new Chart(c6,{
        type:"doughnut",
        data:{
          labels:["Đúng hạn","Quá hạn","Chưa xử lý"],
          datasets:[{data:[5,2,0], backgroundColor:[PALETTE.green, PALETTE.amber, PALETTE.red], borderWidth:0, hoverOffset:6}]
        },
        options:{
          responsive:true, maintainAspectRatio:false, cutout:"62%",
          plugins:{legend:{position:"bottom", labels:{usePointStyle:true, boxWidth:10}}, title:{display:true, text:"7 sự cố · 71,4% đúng hạn", color:"#12233f", font:{weight:"700"}}}
        }
      }));
      // second small bar for KDTM trend inside same card — separate canvas if present
      const c6b=document.getElementById("chartKDTM");
      if(c6b){
        putChart("chartKDTM", new Chart(c6b,{
          type:"line",
          data:{labels, datasets:[{label:"KDTM %", data:M.INDICATORS[19].trend, borderColor:PALETTE.teal, backgroundColor:PALETTE.teal+"18", fill:true, tension:.38, pointRadius:2}]},
          options:{responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{y:{min:0,max:80, grid:{color:"#f0f2f6"}, ticks:{callback:v=>v+"%"}}, x:{grid:{display:false}}}}
        }));
      }
    }

    // 7) Tài chính & CSVC
    const c7=document.getElementById("chartTaiChinh");
    if(c7){
      putChart("chartTaiChinh", new Chart(c7,{
        type:"bar",
        data:{
          labels,
          datasets:[
            {label:"Giải ngân %", data:M.INDICATORS[21].trend, backgroundColor:PALETTE.amber+"cc", borderRadius:6},
            {label:"Tiến độ DA %", data:M.INDICATORS[22].trend, backgroundColor:PALETTE.green+"cc", borderRadius:6}
          ]
        },
        options:{
          responsive:true, maintainAspectRatio:false,
          plugins:{legend:{position:"bottom", labels:{usePointStyle:true, boxWidth:8}}},
          scales:{y:{min:0,max:100, grid:{color:"#f0f2f6"}, ticks:{callback:v=>v+"%"}}, x:{grid:{display:false}}}
        }
      }));
    }

    // Donut CSVC + an toàn
    const c8=document.getElementById("chartCSVC");
    if(c8){
      putChart("chartCSVC", new Chart(c8,{
        type:"doughnut",
        data:{labels:["Đã xử lý","Chưa xử lý"], datasets:[{data:[8,3], backgroundColor:[PALETTE.green, PALETTE.red], borderWidth:0, hoverOffset:6}]},
        options:{responsive:true, maintainAspectRatio:false, cutout:"62%", plugins:{legend:{position:"bottom", labels:{usePointStyle:true, boxWidth:10}}, title:{display:true, text:"11 vụ · 3 chưa xử lý", color:"#12233f", font:{weight:"700"}}}}
      }));
    }

    // Ward compare bar
    const cw=document.getElementById("chartWardCompare");
    if(cw && M.WARDS){
      const labelsW = M.WARDS.map(w=>w.name.replace("Phường ","P.").replace("Xã ","X."));
      const gvl = M.WARDS.map(w=>w.gvl);
      const colors = gvl.map(v=> v<1.4?PALETTE.red : v<1.5?PALETTE.amber : PALETTE.green);
      putChart("chartWardCompare", new Chart(cw,{
        type:"bar",
        data:{labels:labelsW, datasets:[{label:"GV/lớp", data:gvl, backgroundColor:colors, borderRadius:8}]},
        options:{
          indexAxis:"y",
          responsive:true, maintainAspectRatio:false,
          plugins:{legend:{display:false}},
          scales:{x:{min:1.2,max:1.8, grid:{color:"#f0f2f6"}, ticks:{callback:v=>Number(v).toFixed(2)}}, y:{grid:{display:false}}}
        }
      }));
    }
  }

  function openGroupModal(groupId){
    const modal=document.getElementById("groupModal");
    const body=document.getElementById("modalBody");
    const title=document.getElementById("modalTitle");
    if(!modal||!body) return;
    const g=M.GROUPS.find(x=>x.id===groupId);
    const inds=M.INDICATORS.filter(x=>x.g===groupId);
    title.textContent=`Nhóm ${g.id} — ${g.name}`;
    body.innerHTML = `
      <div style="height:260px;margin-bottom:12px"><canvas id="modalChart"></canvas></div>
      <table class="table">
        <thead><tr><th>#</th><th>Chỉ số</th><th>Kỳ này</th><th>So cùng kỳ</th><th>Trạng thái</th></tr></thead>
        <tbody>
          ${inds.map(ind=>`<tr><td class="mono">${ind.id}</td><td><b>${ind.name}</b><div style="font-size:11px;color:var(--faint)">${ind.unit}</div></td><td style="font-weight:800">${fmt(ind)}</td><td>${deltaBadge(ind)}</td><td>${badge(M.statusOf(ind), statusLabel(M.statusOf(ind)))}</td></tr>`).join("")}
        </tbody>
      </table>
      
    `;
    modal.classList.add("open");
    setTimeout(()=>{
      const el=document.getElementById("modalChart");
      if(!el || !window.Chart) return;
      styleCharts();
      const labels=["T11/24","T12/24","T01/25","T02/25","T03/25","T04/25","T05/25","T09/25"];
      const colors=[PALETTE.blue, PALETTE.teal, PALETTE.violet, PALETTE.amber, PALETTE.green];
      const datasets = inds.map((ind,i)=>({
        label: `#${ind.id} ${ind.name.slice(0,22)}…`,
        data: ind.trend,
        borderColor: colors[i%colors.length],
        backgroundColor: colors[i%colors.length]+"14",
        fill: i===0,
        tension:.38, pointRadius:2, borderWidth:1.8
      }));
      putChart("modalChart", new Chart(el,{
        type:"line",
        data:{labels, datasets},
        options:{responsive:true, maintainAspectRatio:false, interaction:{mode:"index", intersect:false}, plugins:{legend:{position:"bottom", labels:{usePointStyle:true, boxWidth:8, font:{size:10}}}}, scales:{x:{grid:{display:false}}, y:{grid:{color:"#f0f2f6"}}}}
      }));
    }, 40);
  }
  function closeModal(){
    const m=document.getElementById("groupModal");
    if(m) m.classList.remove("open");
  }

  const DEPT_TABS = [
    {id:"all", label:"Tất cả nhóm", groups:["I","II","III","IV","V","VI","VII","VIII"]},
    {id:"tochuc", label:"Tổ chức – Cán bộ", groups:["II"]},
    {id:"caphoc", label:"GDPT (cấp học)", groups:["I","III"]},
    {id:"khtc", label:"KHTC", groups:["VIII"]},
    {id:"cntt", label:"CĐS / CNTT", groups:["VI","VII"]},
    {id:"vanphong", label:"Văn phòng (CĐĐH+TTHC)", groups:["IV","V"]},
  ];

  function initLeader(){
    renderKpiStrip(document.getElementById("kpiStrip"));
    renderAlertStrip(document.getElementById("alertStrip"));
    renderGroupsGrid(document.getElementById("groupsGrid"), (gid)=>{
      renderIndicatorTable(document.getElementById("groupDetail"), gid);
      openGroupModal(gid);
      document.getElementById("groupDetail")?.scrollIntoView({behavior:"smooth", block:"start"});
    });
    renderIndicatorTable(document.getElementById("groupDetail"), M.GROUPS[0].id);
    // delay charts until DOM + Chart loaded
    setTimeout(renderLeaderCharts, 120);
    document.getElementById("closeModal")?.addEventListener("click", closeModal);
    document.getElementById("groupModal")?.addEventListener("click", e=>{ if(e.target.id==="groupModal") closeModal(); });
    document.addEventListener("keydown", e=>{ if(e.key==="Escape") closeModal(); });
  }

  function initDept(){
    renderAlertStrip(document.getElementById("alertStrip"));
    const grid=document.getElementById("groupsGrid");
    const detail=document.getElementById("groupDetail");
    const tabsEl=document.getElementById("deptTabs");
    function applyTab(tabId){
      const cfg=DEPT_TABS.find(x=>x.id===tabId);
      const filtered=M.GROUPS.filter(g=> cfg.groups.includes(g.id));
      // render grid filtered
      if(grid){
        grid.innerHTML = filtered.map(g=>{
          const st=M.groupStatus[g.id]; const hero=M.groupHero[g.id];
          return `<div class="group-card" data-group="${g.id}" role="button" tabindex="0">
            <div class="g-head"><span class="g-icon" style="background:${g.color}14;color:${g.color}">${g.icon}</span>
            <div><div class="g-title">Nhóm ${g.id} · ${g.name}</div><div class="g-sub">3 chỉ số</div></div>
            <span style="margin-left:auto">${badge(st,statusLabel(st))}</span></div>
            <div class="g-value">${hero.label}</div><div class="g-note">${hero.sub}</div>
            <div class="status-bar ${st}"></div></div>`;
        }).join("");
        grid.querySelectorAll(".group-card").forEach(el=>{
          el.addEventListener("click", ()=>{ if(detail) renderIndicatorTable(detail, el.dataset.group); openGroupModal(el.dataset.group); });
        });
        if(detail && filtered.length) renderIndicatorTable(detail, filtered[0].id);
      }
      // filter alerts
      const alertBox=document.getElementById("alertStrip");
      if(alertBox){
        if(tabId==="all") renderAlertStrip(alertBox);
        else renderAlertStrip(alertBox, cfg.groups);
      }
      tabsEl.querySelectorAll(".tab").forEach(b=> b.classList.toggle("active", b.dataset.tab===tabId));
    }
    if(tabsEl){
      tabsEl.innerHTML = DEPT_TABS.map(t=>`<button class="tab ${t.id==="all"?"active":""}" data-tab="${t.id}">${t.label}</button>`).join("");
      tabsEl.querySelectorAll(".tab").forEach(b=> b.addEventListener("click", ()=> applyTab(b.dataset.tab)));
      applyTab("all");
    } else if(grid){
      renderGroupsGrid(grid, (gid)=>{ if(detail) renderIndicatorTable(detail,gid); openGroupModal(gid); });
    }
    if(detail && !detail.innerHTML) renderIndicatorTable(detail, M.GROUPS[0].id);
    document.getElementById("closeModal")?.addEventListener("click", closeModal);
    document.getElementById("groupModal")?.addEventListener("click", e=>{ if(e.target.id==="groupModal") closeModal(); });
    document.addEventListener("keydown", e=>{ if(e.key==="Escape") closeModal(); });
  }

  function initWard(){
    const sel=document.getElementById("wardSelect");
    const kpi=document.getElementById("wardKpi");
    const groups=document.getElementById("wardGroups");
    const alerts=document.getElementById("wardAlerts");
    if(sel && M.WARDS){
      sel.innerHTML = M.WARDS.map(w=>`<option value="${w.code}">${w.name}</option>`).join("");
      function renderWard(code){
        const w=M.WARDS.find(x=>x.code===code) || M.WARDS[0];
        const totalHS=w.students.mn+w.students.th+w.students.thcs;
        const totalClass=w.classes.mn+w.classes.th+w.classes.thcs;
        const totalSch=w.schools.mn+w.schools.th+w.schools.thcs;
        if(kpi){
          kpi.innerHTML = `
            <div class="kpi-card ${w.gvl<1.4?"red":w.gvl<1.5?"amber":"green"}"><div class="k">Tổng HS (MN+TH+THCS)</div><div class="v">${totalHS.toLocaleString("vi-VN")}</div><div class="s">MN ${w.students.mn.toLocaleString("vi-VN")} · TH ${w.students.th.toLocaleString("vi-VN")} · THCS ${w.students.thcs.toLocaleString("vi-VN")}</div></div>
            <div class="kpi-card"><div class="k">Trường / Lớp</div><div class="v">${totalSch} / ${totalClass}</div><div class="s">MN ${w.schools.mn} · TH ${w.schools.th} · THCS ${w.schools.thcs}</div></div>
            <div class="kpi-card ${w.gvl<1.4?"red":w.gvl<1.5?"amber":"green"}"><div class="k">GV / lớp</div><div class="v">${w.gvl.toFixed(2)}</div><div class="s">${w.teachers} GV · ${w.gvl<1.5?'<span style="color:var(--red);font-weight:800">Thiếu GV</span>':'Đủ GV'}</div></div>
            <div class="kpi-card"><div class="k">Địa bàn</div><div class="v" style="font-size:16px">${w.name}</div><div class="s">Chỉ MN, TH, THCS</div></div>`;
        }
        if(groups){
          const items=[
            {label:`${totalHS.toLocaleString("vi-VN")} HS`, sub:`${totalClass} lớp · ${totalSch} trường`, st:"green", title:"Quy mô"},
            {label:`${w.gvl.toFixed(2)} GV/lớp`, sub:`${w.teachers} GV`, st: w.gvl<1.4?"red":w.gvl<1.5?"amber":"green", title:"Đội ngũ"},
            {label:"98,1% lên lớp", sub:"TH 98,4% · THCS 97,6%", st:"green", title:"Chất lượng"},
            {label:"Kiên cố 92%", sub:"Cần sửa 3 phòng", st:"amber", title:"CSVC"},
            {label: w.alerts.some(a=>a.includes("ATTP"))?"1 vụ ATTP":"Không có vụ việc", sub: w.alerts.some(a=>a.includes("ATTP"))?"Đang xử lý":"An toàn TH", st: w.alerts.some(a=>a.includes("ATTP"))?"amber":"green", title:"An toàn"},
          ];
          groups.innerHTML = items.map(it=>`<div class="card" style="padding:14px"><div style="display:flex;align-items:center;gap:8px"><b style="font-size:13px">${it.title}</b><span style="margin-left:auto">${badge(it.st,statusLabel(it.st))}</span></div><div style="font-size:18px;font-weight:900;margin:6px 0 2px">${it.label}</div><div style="font-size:11.5px;color:var(--muted)">${it.sub}</div><div class="status-bar ${it.st}"></div></div>`).join("");
        }
        if(alerts){
          alerts.innerHTML = w.alerts.length===0 ? `<p style="font-size:12.5px;color:var(--muted);margin:0">Không có cảnh báo trên địa bàn này.</p>` : w.alerts.map(t=>`<div class="alert-item"><span class="dot amber"></span><div><b>${t}</b><br><span style="font-size:11.5px;color:var(--muted)">${w.name}</span></div></div>`).join("");
        }
      }
      sel.addEventListener("change", ()=> renderWard(sel.value));
      renderWard(sel.value);
    }
    setTimeout(renderLeaderCharts, 200);
  }

  window.MVP2 = {initLeader, initDept, initWard, renderLeaderCharts, openGroupModal, closeModal};
})();
