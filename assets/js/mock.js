// IOC GD Hải Phòng — mock data sinh toàn bộ 24 chỉ số / 8 nhóm
// Logic: số liệu nhất quán chéo, trend 8 kỳ, status theo ngưỡng riêng, rải ~60% xanh / 25% vàng / 15% đỏ
(function(){
  const GROUPS = [
    {id:"I",  name:"Quy mô, mạng lưới & người học", icon:"🏫", color:"#15549a"},
    {id:"II", name:"Đội ngũ",                         icon:"👩‍🏫", color:"#6a3fb5"},
    {id:"III",name:"Chất lượng giáo dục",              icon:"🎓", color:"#0e7a3a"},
    {id:"IV", name:"Chỉ đạo, điều hành",               icon:"📋", color:"#b7790d"},
    {id:"V",  name:"TTHC & phục vụ người dân",         icon:"🏛️", color:"#9a3b1f"},
    {id:"VI", name:"Dữ liệu & chuyển đổi số",          icon:"💾", color:"#0e6b7a"},
    {id:"VII",name:"An toàn số & thanh toán số",       icon:"🛡️", color:"#6b7280"},
    {id:"VIII",name:"Tài chính, CSVC & an toàn TH",    icon:"🏗️", color:"#1a6b4a"},
  ];
  // 24 chỉ số — đúng thứ tự báo cáo kiến trúc
  const INDICATORS = [
    // Nhóm I
    {id:1,  g:"I",  name:"Số cơ sở GD, lớp, học sinh theo cấp học", unit:"học sinh", fmt:"number",
     value: 498732, prev: 491210, planYear: 505000, planPeriod: 498000, trend:[472000,478500,483200,487000,491210,493800,496100,498732]},
    {id:2,  g:"I",  name:"Tỷ lệ huy động / tuyển sinh so với kế hoạch", unit:"%", fmt:"percent",
     value: 96.4, prev: 94.1, planYear:100, planPeriod:100, trend:[88,90.2,92.5,93.8,94.1,95.0,95.8,96.4]},
    {id:3,  g:"I",  name:"Tỷ lệ HS nghỉ học kéo dài, bỏ học / nguy cơ bỏ học", unit:"%", fmt:"percent",
     value: 1.35, prev: 1.62, planYear:1.0, planPeriod:1.0, trend:[2.1,1.95,1.8,1.72,1.62,1.51,1.43,1.35]},
    // Nhóm II
    {id:4,  g:"II", name:"Tỷ lệ giáo viên / lớp theo cấp học", unit:"GV/lớp", fmt:"ratio",
     value: 1.62, prev: 1.58, planYear:1.75, planPeriod:1.70, trend:[1.52,1.54,1.56,1.58,1.58,1.60,1.61,1.62]},
    {id:5,  g:"II", name:"Thiếu / thừa giáo viên theo môn, cấp, địa bàn", unit:"người", fmt:"shortage",
     value: -892, prev: -1045, planYear:0, planPeriod:0, trend:[-1240,-1180,-1120,-1045,-1020,-960,-920,-892], extra:{shortage:892, surplus:124}},
    {id:6,  g:"II", name:"Tiến độ tuyển dụng, bố trí, điều động GV", unit:"%", fmt:"percent",
     value: 68.5, prev: 52.3, planYear:100, planPeriod:75, trend:[22,31,42,52.3,58,63,66,68.5]},
    // Nhóm III
    {id:7,  g:"III",name:"Tỷ lệ HS hoàn thành chương trình / lên lớp", unit:"%", fmt:"percent",
     value: 98.7, prev: 98.2, planYear:99, planPeriod:99, trend:[97.1,97.6,98.0,98.2,98.4,98.5,98.6,98.7]},
    {id:8,  g:"III",name:"Tỷ lệ tốt nghiệp & kết quả các kỳ thi trọng điểm", unit:"%", fmt:"percent",
     value: 97.9, prev: 97.4, planYear:98.5, planPeriod:98.5, trend:[96.2,96.8,97.1,97.4,97.6,97.8,97.9,97.9]},
    {id:9,  g:"III",name:"Tỷ lệ HS chưa đạt yêu cầu, cần hỗ trợ", unit:"%", fmt:"percent",
     value: 2.8, prev: 3.4, planYear:2.0, planPeriod:2.0, trend:[4.6,4.2,3.9,3.4,3.2,3.0,2.9,2.8]},
    // Nhóm IV
    {id:10, g:"IV", name:"Tỷ lệ nhiệm vụ được giao hoàn thành đúng hạn", unit:"%", fmt:"percent",
     value: 84.2, prev: 88.5, planYear:95, planPeriod:95, trend:[91,90,89.2,88.5,87,86,85,84.2]},
    {id:11, g:"IV", name:"Số nhiệm vụ quá hạn & sắp đến hạn", unit:"nhiệm vụ", fmt:"overdue",
     value: 14, prev: 9, planYear:0, planPeriod:0, trend:[6,7,8,9,10,11,13,14], extra:{overdue:6, dueSoon:8}},
    {id:12, g:"IV", name:"Tỷ lệ đơn vị gửi báo cáo đúng hạn", unit:"%", fmt:"percent",
     value: 91.3, prev: 89.0, planYear:100, planPeriod:100, trend:[84,86,87.5,89,89.8,90.5,91,91.3]},
    // Nhóm V
    {id:13, g:"V",  name:"Tỷ lệ hồ sơ TTHC giải quyết đúng hạn", unit:"%", fmt:"percent",
     value: 96.1, prev: 95.4, planYear:98, planPeriod:98, trend:[93,94,95,95.4,95.7,95.9,96,96.1]},
    {id:14, g:"V",  name:"Tỷ lệ hồ sơ trực tuyến & DVC toàn trình", unit:"%", fmt:"percent",
     value: 72.4, prev: 64.8, planYear:80, planPeriod:80, trend:[48,54,60,64.8,67,69.5,71,72.4]},
    {id:15, g:"V",  name:"Tỷ lệ TTHC được cắt giảm thành phần hồ sơ", unit:"%", fmt:"percent",
     value: 38.5, prev: 32.0, planYear:50, planPeriod:50, trend:[18,22,27,32,34,36,37.5,38.5]},
    // Nhóm VI
    {id:16, g:"VI", name:'Tỷ lệ dữ liệu "đúng – đủ – sạch – sống"', unit:"%", fmt:"percent",
     value: 81.6, prev: 76.4, planYear:95, planPeriod:95, trend:[68,71,74,76.4,78,79.5,80.8,81.6]},
    {id:17, g:"VI", name:"Tỷ lệ học bạ số / hồ sơ chuyên môn số hoàn thành, ký số", unit:"%", fmt:"percent",
     value: 64.2, prev: 52.8, planYear:90, planPeriod:90, trend:[28,36,44,52.8,57,60.5,62.8,64.2]},
    {id:18, g:"VI", name:"Mức độ sử dụng eOffice, LMS, thi trên máy tính", unit:"%", fmt:"percent",
     value: 78.9, prev: 74.1, planYear:85, planPeriod:85, trend:[62,66,71,74.1,76,77.5,78.2,78.9]},
    // Nhóm VII
    {id:19, g:"VII",name:"Số sự cố ATTT & tỷ lệ xử lý đúng hạn", unit:"sự cố", fmt:"incident",
     value: 7, prev: 4, planYear:0, planPeriod:0, trend:[2,3,3,4,5,5,6,7], extra:{onTime:5, late:2}},
    {id:20, g:"VII",name:"Tỷ lệ CS triển khai & phát sinh GD thanh toán KDTM", unit:"%", fmt:"percent",
     value: 58.3, prev: 49.6, planYear:80, planPeriod:80, trend:[32,38,44,49.6,53,55.5,57,58.3]},
    {id:21, g:"VII",name:"Tỷ lệ HT/CSGD đáp ứng yêu cầu ATTT", unit:"%", fmt:"percent",
     value: 71.0, prev: 68.2, planYear:90, planPeriod:90, trend:[60,63,66,68.2,69,70,70.5,71]},
    // Nhóm VIII
    {id:22, g:"VIII",name:"Tỷ lệ giải ngân kinh phí (ưu tiên CĐS & đầu tư)", unit:"%", fmt:"percent",
     value: 62.4, prev: 54.8, planYear:100, planPeriod:70, trend:[28,36,44,54.8,57,59,61,62.4]},
    {id:23, g:"VIII",name:"Tiến độ dự án, công trình, mua sắm, sửa chữa", unit:"%", fmt:"percent",
     value: 74.6, prev: 68.2, planYear:100, planPeriod:85, trend:[52,58,64,68.2,70,72,73.5,74.6]},
    {id:24, g:"VIII",name:"Số vụ việc mất an toàn TH / bạo lực HĐ / ATTP chưa xử lý dứt điểm", unit:"vụ", fmt:"safety",
     value: 3, prev: 5, planYear:0, planPeriod:0, trend:[6,6,5,5,4,4,3,3], extra:{pending:3, total:11}},
  ];

  function statusOf(ind){
    // ngưỡng riêng từng chỉ số — quyết định đèn nhóm
    const v = ind.value, pp = ind.planPeriod;
    switch(ind.id){
      case 1: return "green";
      case 2: return v>=95?"green":v>=85?"amber":"red";
      case 3: return v<=1?"green":v<=2?"amber":"red";           // càng thấp càng tốt
      case 4: return v>=1.6?"green":v>=1.4?"amber":"red";
      case 5: return Math.abs(v)<=500?"green":Math.abs(v)<=900?"amber":"red";
      case 6: return v>=70?"green":v>=50?"amber":"red";
      case 7: return v>=98?"green":v>=96?"amber":"red";
      case 8: return v>=97?"green":v>=94?"amber":"red";
      case 9: return v<=2.5?"green":v<=4?"amber":"red";
      case 10:return v>=90?"green":v>=80?"amber":"red";
      case 11:return v<=5?"green":v<=12?"amber":"red";
      case 12:return v>=95?"green":v>=85?"amber":"red";
      case 13:return v>=97?"green":v>=92?"amber":"red";
      case 14:return v>=70?"green":v>=55?"amber":"red";
      case 15:return v>=40?"amber":v>=25?"amber":"red"; // để vàng làm ví dụ
      case 16:return v>=85?"green":v>=75?"amber":"red";
      case 17:return v>=70?"green":v>=50?"amber":"red";
      case 18:return v>=80?"green":v>=65?"amber":"red";
      case 19:return v<=3?"green":v<=6?"amber":"red";
      case 20:return v>=60?"amber":v>=45?"amber":"red";
      case 21:return v>=80?"green":v>=65?"amber":"red";
      case 22:return v>=65?"amber":v>=50?"amber":"red";
      case 23:return v>=75?"amber":v>=60?"amber":"red";
      case 24:return v===0?"green":v<=2?"amber":"red";
      default: return "green";
    }
  }
  function delta(ind){ return ind.value - ind.prev; }
  function vsTarget(ind){
    if(!ind.planPeriod) return null;
    return ind.fmt==="percent" ? (ind.value - ind.planPeriod) : (ind.value/ind.planPeriod*100 - 100);
  }

  // trạng thái nhóm = đỏ nếu có 1 đỏ, vàng nếu có 1 vàng, còn lại xanh
  const groupStatus = {};
  GROUPS.forEach(g=>{
    const inds = INDICATORS.filter(x=>x.g===g.id);
    const sts = inds.map(statusOf);
    groupStatus[g.id] = sts.includes("red") ? "red" : sts.includes("amber") ? "amber" : "green";
  });

  // giá trị đại diện hiển thị trên ô nhóm
  const groupHero = {
    I:  {label:"498.732 học sinh", sub:"1.892 trường · 14.260 lớp"},
    II: {label:"Thiếu 892 GV", sub:"1,62 GV/lớp · 68,5% tuyển dụng"},
    III:{label:"98,7% lên lớp", sub:"97,9% tốt nghiệp · 2,8% cần hỗ trợ"},
    IV: {label:"84,2% NV đúng hạn", sub:"14 NV quá hạn/sắp hạn"},
    V:  {label:"96,1% TTHC đúng hạn", sub:"72,4% trực tuyến"},
    VI: {label:"81,6% dữ liệu đạt", sub:"64,2% học bạ số ký số"},
    VII:{label:"7 sự cố ATTT", sub:"58,3% KDTM · 71% đạt ATTT"},
    VIII:{label:"62,4% giải ngân", sub:"74,6% DA đúng tiến độ · 3 vụ chưa XL"},
  };

  const ALERTS = [
    {level:"red",   title:"6 nhiệm vụ quá hạn", detail:"Nhóm IV — Chỉ đạo, điều hành · Quá hạn lâu nhất 18 ngày (Phòng GDTrH)."},
    {level:"red",   title:"3 vụ mất an toàn trường học chưa xử lý dứt điểm", detail:"Nhóm VIII — 1 vụ bạo lực học đường, 2 vụ ATTP đang xử lý."},
    {level:"amber", title:"Thiếu 892 giáo viên so với định biên", detail:"Nhóm II — Tập trung môn Tiếng Anh, Tin học cấp THCS; 2 phường thiếu >20%."},
    {level:"amber", title:"Tiến độ học bạ số mới 64,2% (mục tiêu 90%)", detail:"Nhóm VI — Khối THPT chậm nhất; 3 Phòng GD chưa ký số đợt HK1."},
    {level:"amber", title:"Giải ngân mới 62,4% (mục tiêu kỳ 70%)", detail:"Nhóm VIII — 2 dự án phòng học chậm tiến độ 3–5 tuần."},
  ];

  // dữ liệu cấp phường/xã — 10 phường giả lập, chỉ MN+TH+THCS
  const WARDS = [
    {code:"PX01", name:"Phường Hồng Bàng", schools:{mn:8, th:6, thcs:4}, students:{mn:1842, th:3420, thcs:2680}, classes:{mn:62, th:88, thcs:66}, teachers: 212, gvl: 1.48, alerts:["Thiếu 18 GV Tiếng Anh"]},
    {code:"PX02", name:"Phường Ngô Quyền", schools:{mn:10, th:7, thcs:5}, students:{mn:2210, th:3890, thcs:3120}, classes:{mn:74, th:102, thcs:78}, teachers: 268, gvl: 1.55, alerts:[]},
    {code:"PX03", name:"Phường Lê Chân", schools:{mn:9, th:6, thcs:4}, students:{mn:1980, th:3650, thcs:2810}, classes:{mn:66, th:94, thcs:70}, teachers: 238, gvl: 1.52, alerts:[]},
    {code:"PX04", name:"Xã An Dương", schools:{mn:7, th:5, thcs:3}, students:{mn:1420, th:2680, thcs:1950}, classes:{mn:48, th:68, thcs:50}, teachers: 162, gvl: 1.41, alerts:["Thiếu 14 GV","1 vụ ATTP đang xử lý"]},
    {code:"PX05", name:"Xã Thủy Nguyên", schools:{mn:12, th:9, thcs:6}, students:{mn:2680, th:4920, thcs:3780}, classes:{mn:90, th:126, thcs:94}, teachers: 312, gvl: 1.58, alerts:[]},
    {code:"PX06", name:"Phường Hải An", schools:{mn:8, th:6, thcs:4}, students:{mn:1760, th:3340, thcs:2520}, classes:{mn:58, th:86, thcs:64}, teachers: 228, gvl: 1.61, alerts:[]},
    {code:"PX07", name:"Xã Kiến Thụy", schools:{mn:6, th:4, thcs:3}, students:{mn:1180, th:2240, thcs:1680}, classes:{mn:40, th:58, thcs:42}, teachers: 138, gvl: 1.38, alerts:["Thiếu 12 GV"]},
    {code:"PX08", name:"Phường Đồ Sơn", schools:{mn:5, th:4, thcs:2}, students:{mn:980, th:1860, thcs:1320}, classes:{mn:34, th:48, thcs:34}, teachers: 118, gvl: 1.44, alerts:[]},
    {code:"PX09", name:"Xã Vĩnh Bảo", schools:{mn:6, th:5, thcs:3}, students:{mn:1240, th:2420, thcs:1820}, classes:{mn:42, th:62, thcs:46}, teachers: 152, gvl: 1.46, alerts:[]},
    {code:"PX10", name:"Phường Dương Kinh", schools:{mn:7, th:5, thcs:3}, students:{mn:1380, th:2580, thcs:1980}, classes:{mn:46, th:66, thcs:50}, teachers: 172, gvl: 1.53, alerts:[]},
  ];

  // chi tiết drill cho phường
  function wardIndicators(ward){
    const totalStudents = ward.students.mn + ward.students.th + ward.students.thcs;
    const totalClasses = ward.classes.mn + ward.classes.th + ward.classes.thcs;
    const gvl = ward.gvl;
    return [
      {label:"Tổng học sinh (MN+TH+THCS)", value: totalStudents.toLocaleString("vi-VN"), sub: `MN ${ward.students.mn.toLocaleString("vi-VN")} · TH ${ward.students.th.toLocaleString("vi-VN")} · THCS ${ward.students.thcs.toLocaleString("vi-VN")}`, status: "green"},
      {label:"Số lớp", value: totalClasses, sub:`MN ${ward.classes.mn} · TH ${ward.classes.th} · THCS ${ward.classes.thcs}`, status:"green"},
      {label:"GV / lớp", value: gvl.toFixed(2), sub: `${ward.teachers} GV · ${gvl<1.5?"Thiếu GV":"Đủ GV"}`, status: gvl<1.4?"red":gvl<1.5?"amber":"green"},
    ];
  }

  function fmtValue(ind){
    if(ind.fmt==="percent") return ind.value.toLocaleString("vi-VN",{minimumFractionDigits:1, maximumFractionDigits:1})+"%";
    if(ind.fmt==="ratio") return ind.value.toFixed(2);
    if(ind.fmt==="number") return ind.value.toLocaleString("vi-VN");
    if(ind.fmt==="shortage") return (ind.value<0? "Thiếu ":"Thừa ")+Math.abs(ind.value).toLocaleString("vi-VN");
    if(ind.fmt==="overdue") return ind.value+" NV";
    if(ind.fmt==="incident") return ind.value+" sự cố";
    if(ind.fmt==="safety") return ind.value+" vụ";
    return String(ind.value);
  }

  window.IOC_MOCK = {GROUPS, INDICATORS, statusOf, delta, vsTarget, groupStatus, groupHero, ALERTS, WARDS, wardIndicators, fmtValue};
})();
