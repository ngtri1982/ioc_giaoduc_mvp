(function(){
  const M = window.IOC_MOCK;
  if(!M) return;

  // Bảng màu tối giản: xanh dương (chính), xanh ngọc (phụ) + 3 màu trạng thái. Không dùng thêm màu khác.
  const PALETTE = {
    blue:"#1a6ab5", teal:"#0e8a7a",
    green:"#0e7a3a", amber:"#c58a00", red:"#d64545",
    navy:"#0b1e3a", gray:"#8ea0bf"
  };
  function statusColor(s){ return s==="green"?PALETTE.green : s==="amber"?PALETTE.amber : PALETTE.red; }
  function statusLabel(s){ return s==="green"?"Tốt":s==="amber"?"Cảnh báo":"Nguy cơ"; }
  function badge(s,t){ const cls=s==="green"?"badge-green":s==="amber"?"badge-amber":s==="red"?"badge-red":"badge-gray"; return `<span class="badge ${cls}">${t}</span>`; }

  function fmt(ind){ return M.fmtValue(ind); }
  function deltaBadge(ind){
    const d = M.delta(ind);
    if(Math.abs(d) < 0.0001) return `<span style="color:var(--faint)">—</span>`;
    const good = ind.direction==="lower" ? d<0 : d>0;
    const arrow = d<0 ? "↓" : "↑";
    const txt = ind.fmt==="percent" ? Math.abs(d).toLocaleString("vi-VN",{minimumFractionDigits:1,maximumFractionDigits:1}) : Math.abs(d).toLocaleString("vi-VN");
    return `<span class="trend ${good?'':'down'}">${arrow} ${txt}</span>`;
  }

  function styleCharts(){
    if(!window.Chart) return;
    Chart.defaults.font.family = "Inter, system-ui, sans-serif";
    Chart.defaults.font.size = 11.5;
    Chart.defaults.color = "#6b7a94";
    Chart.defaults.borderColor = "#e6ebf2";
  }

  const registry = new Map();
  function putChart(id, chart){ const old=registry.get(id); if(old) old.destroy(); registry.set(id, chart); }

  // ---------- KPI strip ----------
  function renderKpiStrip(container){
    if(!container) return;
    const byId = id => M.INDICATORS.find(x=>x.id===id);
    const kpis = [
      {k:"Tổng học sinh toàn TP", v:"498.732", s:"1.892 trường · 14.260 lớp", st:"green", trend:byId(1).trend, color:PALETTE.blue},
      {k:"Nhiệm vụ hoàn thành đúng hạn", v:"84,2%", s:"6 quá hạn · 8 sắp đến hạn", st:"amber", trend:byId(10).trend, color:PALETTE.amber},
      {k:"Chất lượng giáo dục (lên lớp)", v:"98,7%", s:"Tốt nghiệp 97,9% · Cần hỗ trợ 2,8%", st:"green", trend:byId(7).trend, color:PALETTE.green},
      {k:"Thực hiện dự toán NSNN", v:"75,1%", s:"2.890 / 3.850 tỷ đồng", st:"amber", trend:byId(25).trend, color:PALETTE.teal},
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

  // ---------- Cảnh báo điều hành ----------
  function renderAlertStrip(container){
    if(!container) return;
    const alerts = M.ALERTS;
    const nRed = alerts.filter(a=>a.level==="red").length;
    const nAmber = alerts.filter(a=>a.level==="amber").length;
    container.innerHTML = `<h3>⚡ Cảnh báo điều hành — cần lãnh đạo Sở chỉ đạo (${nRed} nguy cơ · ${nAmber} cảnh báo)</h3><div class="alert-list">`+
      alerts.map(a=>`<div class="alert-item" data-group="${a.group}"><span class="dot ${a.level}"></span><div><b>${a.title}</b><br><span style="font-size:12px;color:var(--muted)">${a.detail}</span></div><span style="margin-left:auto;flex-shrink:0">${badge(a.level,statusLabel(a.level))}</span></div>`).join("")+
      `</div>`;
    container.querySelectorAll(".alert-item").forEach(el=>{
      el.style.cursor = "pointer";
      el.addEventListener("click", ()=> openGroupModal(el.dataset.group));
    });
  }

  // ---------- Tổng hợp & cảnh báo nhiệm vụ ----------
  function renderTaskSummary(container){
    if(!container) return;
    const t = M.TASK_SUMMARY, r = M.REPORT_SUMMARY;
    const tiles = [
      {label:"Tổng nhiệm vụ trong kỳ", v:t.total, st:"gray"},
      {label:"Hoàn thành đúng hạn", v:t.dungHan, st:"green"},
      {label:"Hoàn thành trễ hạn", v:t.treHan, st:"amber"},
      {label:"Đang thực hiện", v:t.dangThucHien, st:"gray"},
      {label:"Chưa thực hiện", v:t.chuaThucHien, st:"gray"},
      {label:"Quá hạn — cần đôn đốc", v:t.quaHan, st:"red"},
    ];
    container.innerHTML = `
      <div class="card">
        <div class="card-hd">
          <h3>📋 Tổng hợp nhiệm vụ chỉ đạo, điều hành</h3>
          <p>Tỷ lệ đúng hạn ${t.tyLeDungHan.toLocaleString("vi-VN",{minimumFractionDigits:1})}% · Báo cáo định kỳ: ${r.onTime}/${r.totalUnits} đơn vị đúng hạn (${(r.onTime/r.totalUnits*100).toFixed(1)}%)</p>
        </div>
        <div class="card-bd">
          <div class="task-tiles">
            ${tiles.map(x=>`<div class="task-tile ${x.st}"><div class="tt-v">${x.v}</div><div class="tt-l">${x.label}</div></div>`).join("")}
          </div>
          <div class="task-grid">
            <div class="chart-box h-220"><canvas id="chartTaskStatus"></canvas></div>
            <div>
              <div class="task-warn-hd"><span class="dot red"></span><b>Cảnh báo nhiệm vụ quá hạn (${M.TASKS_OVERDUE.length})</b></div>
              <div class="task-warn-list">
                ${M.TASKS_OVERDUE.map(x=>`<div class="task-warn-item red"><div><div class="tw-main">${x.ten}</div><div class="tw-sub">${x.donVi} · Hạn ${x.han}</div></div><span class="tw-days red">Quá hạn ${x.soNgay} ngày</span></div>`).join("")}
              </div>
            </div>
          </div>
          <div class="task-warn-hd" style="margin-top:14px"><span class="dot amber"></span><b>Sắp đến hạn trong 14 ngày tới (${M.TASKS_DUE_SOON.length})</b></div>
          <div class="task-warn-list two-col">
            ${M.TASKS_DUE_SOON.map(x=>`<div class="task-warn-item amber"><div><div class="tw-main">${x.ten}</div><div class="tw-sub">${x.donVi} · Hạn ${x.han}</div></div><span class="tw-days amber">Còn ${x.soNgay} ngày</span></div>`).join("")}
          </div>
        </div>
      </div>`;
    setTimeout(()=>{
      const el = document.getElementById("chartTaskStatus");
      if(!el || !window.Chart) return;
      styleCharts();
      putChart("chartTaskStatus", new Chart(el, {
        type:"doughnut",
        data:{
          labels:["Đúng hạn","Trễ hạn","Đang thực hiện","Chưa thực hiện","Quá hạn"],
          datasets:[{data:[t.dungHan,t.treHan,t.dangThucHien,t.chuaThucHien,t.quaHan],
            backgroundColor:[PALETTE.green, "#e0a53a", PALETTE.blue, PALETTE.gray, PALETTE.red], borderWidth:0, hoverOffset:6}]
        },
        options:{responsive:true, maintainAspectRatio:false, cutout:"60%",
          plugins:{legend:{position:"bottom", labels:{usePointStyle:true, boxWidth:9, font:{size:11}}},
            title:{display:true, text:`${t.total} nhiệm vụ trong kỳ`, color:"#12233f", font:{weight:"700", size:12}}}}
      }));
    }, 40);
  }

  // ---------- Lưới 9 nhóm chỉ số ----------
  function renderGroupsGrid(container, onClick){
    if(!container) return;
    container.innerHTML = M.GROUPS.map(g=>{
      const st=M.groupStatus[g.id];
      const hero=M.groupHero[g.id];
      const n = M.INDICATORS.filter(x=>x.g===g.id).length;
      return `<div class="group-card" data-group="${g.id}" role="button" tabindex="0">
        <div class="g-head">
          <span class="g-icon">${g.icon}</span>
          <div><div class="g-title">Nhóm ${g.id} · ${g.name}</div><div class="g-sub">${n} chỉ số</div></div>
        </div>
        <div class="g-value">${hero.label}</div>
        <div class="g-note">${hero.sub}</div>
        <div class="g-foot">${badge(st,statusLabel(st))}</div>
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
          <p>${inds.length} chỉ số</p>
          <span style="margin-left:auto">${badge(M.groupStatus[g.id], statusLabel(M.groupStatus[g.id]))}</span>
        </div>
        <div style="overflow:auto">
        <table class="table">
          <thead><tr><th>#</th><th>Chỉ số</th><th>Kỳ này</th><th>So cùng kỳ</th><th>So KH kỳ</th><th>Trạng thái</th></tr></thead>
          <tbody>
            ${inds.map(ind=>{
              const st=M.statusOf(ind);
              const vs=M.vsTarget(ind);
              const hideVs=["shortage","overdue","incident","safety"].includes(ind.fmt);
              const vsText = vs===null || hideVs ? "—" : (vs>=0?`+${vs.toFixed(1)}%`:`${vs.toFixed(1)}%`);
              const isGood = ind.direction==="lower" ? vs<=0 : vs>=0;
              const vsCls = vsText==="—"?"":(isGood?"trend":"trend down");
              return `<tr>
                <td class="mono">${ind.id}</td>
                <td><b>${ind.name}</b><br><span style="font-size:11.5px;color:var(--faint)">${ind.unit}</span></td>
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

  // ---------- Biểu đồ trực quan hóa theo nhóm ----------
  function renderCharts(){
    if(!window.Chart) return;
    styleCharts();
    const labels = M.PERIOD_LABELS;
    const byId = id => M.INDICATORS.find(x=>x.id===id);

    // Nhóm I — Quy mô
    const c1=document.getElementById("chartQuyMo");
    if(c1){
      putChart("chartQuyMo", new Chart(c1,{
        type:"line",
        data:{labels, datasets:[
          {label:"Tổng HS", data:byId(1).trend, borderColor:PALETTE.blue, backgroundColor:PALETTE.blue+"18", fill:true, tension:.38, pointRadius:3, pointBackgroundColor:PALETTE.blue},
          {label:"Tỷ lệ huy động (%)", data:byId(2).trend, borderColor:PALETTE.teal, backgroundColor:"transparent", fill:false, tension:.38, pointRadius:3, yAxisID:"y1"}
        ]},
        options:{responsive:true, maintainAspectRatio:false, interaction:{mode:"index", intersect:false},
          plugins:{legend:{position:"bottom", labels:{usePointStyle:true, boxWidth:8}}},
          scales:{y:{beginAtZero:false, grid:{color:"#f0f2f6"}, ticks:{callback:v=>Number(v).toLocaleString("vi-VN")}},
            y1:{position:"right", min:80, max:100, grid:{display:false}, ticks:{callback:v=>v+"%"}}, x:{grid:{display:false}}}}
      }));
    }

    // Nhóm II — Đội ngũ
    const c2=document.getElementById("chartDoiNgu");
    if(c2){
      const shortage = byId(5).trend.map(v=>Math.abs(v));
      putChart("chartDoiNgu", new Chart(c2,{
        type:"bar",
        data:{labels, datasets:[
          {type:"bar", label:"Thiếu GV", data:shortage, backgroundColor:PALETTE.amber+"cc", borderRadius:6, yAxisID:"y"},
          {type:"line", label:"GV/lớp", data:byId(4).trend, borderColor:PALETTE.blue, backgroundColor:"transparent", tension:.38, pointRadius:3, yAxisID:"y1"}
        ]},
        options:{responsive:true, maintainAspectRatio:false,
          plugins:{legend:{position:"bottom", labels:{usePointStyle:true, boxWidth:8}}},
          scales:{y:{beginAtZero:true, grid:{color:"#f0f2f6"}, title:{display:true, text:"Thiếu (người)"}},
            y1:{position:"right", min:1.4, max:1.8, grid:{display:false}, title:{display:true, text:"GV/lớp"}}, x:{grid:{display:false}}}}
      }));
    }

    // Nhóm III — Chất lượng
    const c3=document.getElementById("chartChatLuong");
    if(c3){
      putChart("chartChatLuong", new Chart(c3,{
        type:"line",
        data:{labels, datasets:[
          {label:"Lên lớp %", data:byId(7).trend, borderColor:PALETTE.green, backgroundColor:PALETTE.green+"14", fill:true, tension:.38, pointRadius:2},
          {label:"Tốt nghiệp %", data:byId(8).trend, borderColor:PALETTE.blue, backgroundColor:"transparent", fill:false, tension:.38, pointRadius:2},
          {label:"Chưa đạt %", data:byId(9).trend, borderColor:PALETTE.red, backgroundColor:"transparent", fill:false, tension:.38, pointRadius:2}
        ]},
        options:{responsive:true, maintainAspectRatio:false,
          plugins:{legend:{position:"bottom", labels:{usePointStyle:true, boxWidth:8}}},
          scales:{y:{min:0, max:100, grid:{color:"#f0f2f6"}, ticks:{callback:v=>v+"%"}}, x:{grid:{display:false}}}}
      }));
    }

    // Nhóm V — TTHC
    const c4=document.getElementById("chartTTHC");
    if(c4){
      putChart("chartTTHC", new Chart(c4,{
        type:"bar",
        data:{labels, datasets:[
          {label:"Đúng hạn %", data:byId(13).trend, backgroundColor:PALETTE.teal+"cc", borderRadius:6},
          {label:"Trực tuyến %", data:byId(14).trend, backgroundColor:PALETTE.blue+"cc", borderRadius:6},
          {label:"Cắt giảm %", data:byId(15).trend, backgroundColor:PALETTE.amber+"cc", borderRadius:6}
        ]},
        options:{responsive:true, maintainAspectRatio:false,
          plugins:{legend:{position:"bottom", labels:{usePointStyle:true, boxWidth:8}}},
          scales:{y:{min:0,max:100, grid:{color:"#f0f2f6"}, ticks:{callback:v=>v+"%"}}, x:{grid:{display:false}}}}
      }));
    }

    // Nhóm VI — CĐS
    const c5=document.getElementById("chartCDS");
    if(c5){
      putChart("chartCDS", new Chart(c5,{
        type:"bar",
        data:{labels, datasets:[
          {label:"Dữ liệu đạt %", data:byId(16).trend, backgroundColor:PALETTE.teal, borderRadius:6},
          {label:"Học bạ số ký số %", data:byId(17).trend, backgroundColor:PALETTE.blue, borderRadius:6},
          {label:"Sử dụng nền tảng %", data:byId(18).trend, backgroundColor:PALETTE.navy, borderRadius:6}
        ]},
        options:{responsive:true, maintainAspectRatio:false,
          plugins:{legend:{position:"bottom", labels:{usePointStyle:true, boxWidth:8}}},
          scales:{y:{min:0,max:100, grid:{color:"#f0f2f6"}, ticks:{callback:v=>v+"%"}}, x:{grid:{display:false}}}}
      }));
    }

    // Nhóm VII — ATTT + KDTM
    const c6=document.getElementById("chartATTT");
    if(c6){
      putChart("chartATTT", new Chart(c6,{
        type:"doughnut",
        data:{labels:["Đúng hạn","Quá hạn"], datasets:[{data:[5,2], backgroundColor:[PALETTE.green, PALETTE.red], borderWidth:0, hoverOffset:6}]},
        options:{responsive:true, maintainAspectRatio:false, cutout:"62%",
          plugins:{legend:{position:"bottom", labels:{usePointStyle:true, boxWidth:10}}, title:{display:true, text:"7 sự cố ATTT", color:"#12233f", font:{weight:"700"}}}}
      }));
    }
    const c6b=document.getElementById("chartKDTM");
    if(c6b){
      putChart("chartKDTM", new Chart(c6b,{
        type:"line",
        data:{labels, datasets:[{label:"KDTM %", data:byId(20).trend, borderColor:PALETTE.teal, backgroundColor:PALETTE.teal+"18", fill:true, tension:.38, pointRadius:2}]},
        options:{responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false},
          title:{display:true, text:"Thanh toán không dùng tiền mặt (%)", color:"#12233f", font:{weight:"700", size:11.5}}},
          scales:{y:{min:0,max:80, grid:{color:"#f0f2f6"}, ticks:{callback:v=>v+"%"}}, x:{grid:{display:false}}}}
      }));
    }

    // Nhóm VIII — Tài chính, ngân sách
    const c7=document.getElementById("chartTaiChinhNS");
    if(c7){
      putChart("chartTaiChinhNS", new Chart(c7,{
        type:"bar",
        data:{labels, datasets:[
          {label:"Giải ngân kinh phí %", data:byId(22).trend, backgroundColor:PALETTE.amber+"cc", borderRadius:6},
          {label:"Thực hiện dự toán NSNN %", data:byId(25).trend, backgroundColor:PALETTE.blue, borderRadius:6},
          {label:"Quyết toán nguồn thu SN %", data:byId(26).trend, backgroundColor:PALETTE.teal, borderRadius:6}
        ]},
        options:{responsive:true, maintainAspectRatio:false,
          plugins:{legend:{position:"bottom", labels:{usePointStyle:true, boxWidth:8}}},
          scales:{y:{min:0,max:100, grid:{color:"#f0f2f6"}, ticks:{callback:v=>v+"%"}}, x:{grid:{display:false}}}}
      }));
    }

    // Nhóm IX — Đầu tư, CSVC & an toàn
    const c8=document.getElementById("chartDauTuCSVC");
    if(c8){
      putChart("chartDauTuCSVC", new Chart(c8,{
        type:"bar",
        data:{labels, datasets:[
          {label:"Tiến độ dự án %", data:byId(23).trend, backgroundColor:PALETTE.green+"cc", borderRadius:6},
          {label:"KH đầu tư/sửa chữa CSGD %", data:byId(27).trend, backgroundColor:PALETTE.blue, borderRadius:6}
        ]},
        options:{responsive:true, maintainAspectRatio:false,
          plugins:{legend:{position:"bottom", labels:{usePointStyle:true, boxWidth:8}}},
          scales:{y:{min:0,max:100, grid:{color:"#f0f2f6"}, ticks:{callback:v=>v+"%"}}, x:{grid:{display:false}}}}
      }));
    }
    const c9=document.getElementById("chartAnToanTH");
    if(c9){
      putChart("chartAnToanTH", new Chart(c9,{
        type:"doughnut",
        data:{labels:["Đã xử lý","Chưa xử lý"], datasets:[{data:[8,3], backgroundColor:[PALETTE.green, PALETTE.red], borderWidth:0, hoverOffset:6}]},
        options:{responsive:true, maintainAspectRatio:false, cutout:"62%",
          plugins:{legend:{position:"bottom", labels:{usePointStyle:true, boxWidth:10}}, title:{display:true, text:"11 vụ việc mất an toàn TH", color:"#12233f", font:{weight:"700", size:11.5}}}}
      }));
    }
  }

  // ---------- Modal chi tiết nhóm ----------
  function openGroupModal(groupId){
    const modal=document.getElementById("groupModal");
    const body=document.getElementById("modalBody");
    const title=document.getElementById("modalTitle");
    if(!modal||!body) return;
    const g=M.GROUPS.find(x=>x.id===groupId);
    const inds=M.INDICATORS.filter(x=>x.g===groupId);
    title.textContent=`Nhóm ${g.id} — ${g.name}`;
    body.innerHTML = `
      <div class="note-box">📝 <b>Thuyết minh:</b> ${M.GROUP_NOTES[groupId]}</div>
      <div style="height:240px;margin-bottom:12px"><canvas id="modalChart"></canvas></div>
      <table class="table">
        <thead><tr><th>#</th><th>Chỉ số</th><th>Kỳ này</th><th>So cùng kỳ</th><th>Trạng thái</th></tr></thead>
        <tbody>
          ${inds.map(ind=>`<tr><td class="mono">${ind.id}</td><td><b>${ind.name}</b><div style="font-size:11.5px;color:var(--faint)">${ind.unit}</div></td><td style="font-weight:800">${fmt(ind)}</td><td>${deltaBadge(ind)}</td><td>${badge(M.statusOf(ind), statusLabel(M.statusOf(ind)))}</td></tr>`).join("")}
        </tbody>
      </table>
    `;
    modal.classList.add("open");
    setTimeout(()=>{
      const el=document.getElementById("modalChart");
      if(!el || !window.Chart) return;
      styleCharts();
      const colors=[PALETTE.blue, PALETTE.teal, PALETTE.green];
      const datasets = inds.map((ind,i)=>({
        label:`#${ind.id} ${ind.name.slice(0,26)}…`, data:ind.trend,
        borderColor:colors[i%colors.length], backgroundColor:colors[i%colors.length]+"14",
        fill:i===0, tension:.38, pointRadius:2, borderWidth:1.8
      }));
      putChart("modalChart", new Chart(el,{
        type:"line", data:{labels:M.PERIOD_LABELS, datasets},
        options:{responsive:true, maintainAspectRatio:false, interaction:{mode:"index", intersect:false},
          plugins:{legend:{position:"bottom", labels:{usePointStyle:true, boxWidth:8, font:{size:10.5}}}},
          scales:{x:{grid:{display:false}}, y:{grid:{color:"#f0f2f6"}}}}
      }));
    }, 40);
  }
  function closeModal(){
    const m=document.getElementById("groupModal");
    if(m) m.classList.remove("open");
  }

  function init(){
    renderKpiStrip(document.getElementById("kpiStrip"));
    renderAlertStrip(document.getElementById("alertStrip"));
    renderTaskSummary(document.getElementById("taskSummary"));
    renderGroupsGrid(document.getElementById("groupsGrid"), (gid)=>{
      renderIndicatorTable(document.getElementById("groupDetail"), gid);
      openGroupModal(gid);
      document.getElementById("groupDetail")?.scrollIntoView({behavior:"smooth", block:"start"});
    });
    renderIndicatorTable(document.getElementById("groupDetail"), M.GROUPS[0].id);
    setTimeout(renderCharts, 120);
    document.getElementById("closeModal")?.addEventListener("click", closeModal);
    document.getElementById("groupModal")?.addEventListener("click", e=>{ if(e.target.id==="groupModal") closeModal(); });
    document.addEventListener("keydown", e=>{ if(e.key==="Escape") closeModal(); });
  }

  window.MVP2 = {init};
})();
