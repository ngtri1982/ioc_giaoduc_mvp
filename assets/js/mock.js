// IOC Giáo dục Hải Phòng — dữ liệu mô phỏng cho Bảng điều hành Lãnh đạo Sở
// Nguồn cấu trúc: Cau_truc_du_lieu_IOC_Giao_duc_day_du.xlsx (iocgddanhmucchitieudieuhanh,
// nhiemvuchidaodieuhanh, baocaodinhkydonvi, thuchinsnncoquansovadonvi, thuchinguonthusunghiep,
// dautuxaydungsuachuacsgd...). 27 chỉ số / 9 nhóm, kỳ báo cáo Tháng 9/2025, so sánh 8 kỳ gần nhất.
(function(){
  const PERIOD_LABELS = ["T11/24","T12/24","T01/25","T02/25","T03/25","T04/25","T05/25","T09/25"];

  const GROUPS = [
    {id:"I",   name:"Quy mô, mạng lưới & người học",        icon:"🏫"},
    {id:"II",  name:"Đội ngũ",                                icon:"👩‍🏫"},
    {id:"III", name:"Chất lượng giáo dục",                    icon:"🎓"},
    {id:"IV",  name:"Chỉ đạo, điều hành",                     icon:"📋"},
    {id:"V",   name:"TTHC & phục vụ người dân",               icon:"🏛️"},
    {id:"VI",  name:"Dữ liệu & chuyển đổi số",                icon:"💾"},
    {id:"VII", name:"An toàn thông tin & thanh toán số",      icon:"🛡️"},
    {id:"VIII",name:"Tài chính, ngân sách",                   icon:"💰"},
    {id:"IX",  name:"Đầu tư, CSVC & an toàn trường học",      icon:"🏗️"},
  ];

  // Mỗi chỉ số: direction "higher"|"lower" = chiều tốt hơn; thresholds theo ngưỡng riêng.
  // useAbs: so ngưỡng theo trị tuyệt đối (số liệu có thể âm, vd thiếu/thừa).
  const INDICATORS = [
    // Nhóm I — Quy mô, mạng lưới & người học
    {id:1, g:"I", name:"Số cơ sở GD, lớp, học sinh theo cấp học", unit:"học sinh", fmt:"number",
     value:498732, prev:491210, planYear:505000, planPeriod:498000,
     trend:[472000,478500,483200,487000,491210,493800,496100,498732],
     direction:"higher", thresholds:{green:0, amber:0},
     note:"Tổng 1.892 trường, 14.260 lớp; quy mô tăng đều theo đà tuyển sinh đầu năm học."},
    {id:2, g:"I", name:"Tỷ lệ huy động / tuyển sinh so với kế hoạch", unit:"%", fmt:"percent",
     value:96.4, prev:94.1, planYear:100, planPeriod:100,
     trend:[88,90.2,92.5,93.8,94.1,95.0,95.8,96.4],
     direction:"higher", thresholds:{green:95, amber:85}},
    {id:3, g:"I", name:"Tỷ lệ HS nghỉ học kéo dài, bỏ học / nguy cơ bỏ học", unit:"%", fmt:"percent",
     value:0.95, prev:1.18, planYear:1.0, planPeriod:1.0,
     trend:[1.62,1.5,1.38,1.28,1.18,1.1,1.02,0.95],
     direction:"lower", thresholds:{green:1.0, amber:2.0}},
    // Nhóm II — Đội ngũ
    {id:4, g:"II", name:"Tỷ lệ giáo viên / lớp theo cấp học", unit:"GV/lớp", fmt:"ratio",
     value:1.62, prev:1.58, planYear:1.75, planPeriod:1.70,
     trend:[1.52,1.54,1.56,1.58,1.58,1.60,1.61,1.62],
     direction:"higher", thresholds:{green:1.6, amber:1.4}},
    {id:5, g:"II", name:"Thiếu / thừa giáo viên theo môn, cấp, địa bàn", unit:"người", fmt:"shortage",
     value:-892, prev:-1045, planYear:0, planPeriod:0,
     trend:[-1240,-1180,-1120,-1045,-1020,-960,-920,-892],
     direction:"lower", thresholds:{green:500, amber:900}, useAbs:true,
     extra:{shortage:892, surplus:124}},
    {id:6, g:"II", name:"Tiến độ tuyển dụng, bố trí, điều động GV", unit:"%", fmt:"percent",
     value:68.5, prev:52.3, planYear:100, planPeriod:75,
     trend:[22,31,42,52.3,58,63,66,68.5],
     direction:"higher", thresholds:{green:70, amber:50}},
    // Nhóm III — Chất lượng giáo dục
    {id:7, g:"III", name:"Tỷ lệ HS hoàn thành chương trình / lên lớp", unit:"%", fmt:"percent",
     value:98.7, prev:98.2, planYear:99, planPeriod:99,
     trend:[97.1,97.6,98.0,98.2,98.4,98.5,98.6,98.7],
     direction:"higher", thresholds:{green:98, amber:96}},
    {id:8, g:"III", name:"Tỷ lệ tốt nghiệp & kết quả các kỳ thi trọng điểm", unit:"%", fmt:"percent",
     value:97.9, prev:97.4, planYear:98.5, planPeriod:98.5,
     trend:[96.2,96.8,97.1,97.4,97.6,97.8,97.9,97.9],
     direction:"higher", thresholds:{green:97, amber:94}},
    {id:9, g:"III", name:"Tỷ lệ HS chưa đạt yêu cầu, cần hỗ trợ", unit:"%", fmt:"percent",
     value:2.8, prev:3.4, planYear:2.0, planPeriod:2.0,
     trend:[4.6,4.2,3.9,3.4,3.2,3.0,2.9,2.8],
     direction:"lower", thresholds:{green:3.0, amber:4.0}},
    // Nhóm IV — Chỉ đạo, điều hành
    {id:10, g:"IV", name:"Tỷ lệ nhiệm vụ được giao hoàn thành đúng hạn", unit:"%", fmt:"percent",
     value:84.2, prev:88.5, planYear:95, planPeriod:95,
     trend:[91,90,89.2,88.5,87,86,85,84.2],
     direction:"higher", thresholds:{green:90, amber:80}},
    {id:11, g:"IV", name:"Số nhiệm vụ quá hạn & sắp đến hạn", unit:"nhiệm vụ", fmt:"overdue",
     value:14, prev:9, planYear:0, planPeriod:0,
     trend:[6,7,8,9,10,11,13,14],
     direction:"lower", thresholds:{green:8, amber:16},
     extra:{overdue:6, dueSoon:8}},
    {id:12, g:"IV", name:"Tỷ lệ đơn vị gửi báo cáo đúng hạn", unit:"%", fmt:"percent",
     value:91.3, prev:89.0, planYear:100, planPeriod:100,
     trend:[84,86,87.5,89,89.8,90.5,91,91.3],
     direction:"higher", thresholds:{green:95, amber:85},
     extra:{totalUnits:42, onTime:38, late:4}},
    // Nhóm V — TTHC & phục vụ người dân
    {id:13, g:"V", name:"Tỷ lệ hồ sơ TTHC giải quyết đúng hạn", unit:"%", fmt:"percent",
     value:96.1, prev:95.4, planYear:98, planPeriod:98,
     trend:[93,94,95,95.4,95.7,95.9,96,96.1],
     direction:"higher", thresholds:{green:97, amber:92}},
    {id:14, g:"V", name:"Tỷ lệ hồ sơ trực tuyến & DVC toàn trình", unit:"%", fmt:"percent",
     value:72.4, prev:64.8, planYear:80, planPeriod:80,
     trend:[48,54,60,64.8,67,69.5,71,72.4],
     direction:"higher", thresholds:{green:70, amber:55}},
    {id:15, g:"V", name:"Tỷ lệ TTHC được cắt giảm thành phần hồ sơ", unit:"%", fmt:"percent",
     value:38.5, prev:32.0, planYear:50, planPeriod:50,
     trend:[18,22,27,32,34,36,37.5,38.5],
     direction:"higher", thresholds:{green:45, amber:25}},
    // Nhóm VI — Dữ liệu & chuyển đổi số
    {id:16, g:"VI", name:'Tỷ lệ dữ liệu "đúng – đủ – sạch – sống"', unit:"%", fmt:"percent",
     value:81.6, prev:76.4, planYear:95, planPeriod:95,
     trend:[68,71,74,76.4,78,79.5,80.8,81.6],
     direction:"higher", thresholds:{green:85, amber:75}},
    {id:17, g:"VI", name:"Tỷ lệ học bạ số / hồ sơ chuyên môn số hoàn thành, ký số", unit:"%", fmt:"percent",
     value:64.2, prev:52.8, planYear:90, planPeriod:90,
     trend:[28,36,44,52.8,57,60.5,62.8,64.2],
     direction:"higher", thresholds:{green:70, amber:50}},
    {id:18, g:"VI", name:"Mức độ sử dụng eOffice, LMS, thi trên máy tính", unit:"%", fmt:"percent",
     value:78.9, prev:74.1, planYear:85, planPeriod:85,
     trend:[62,66,71,74.1,76,77.5,78.2,78.9],
     direction:"higher", thresholds:{green:80, amber:65}},
    // Nhóm VII — An toàn thông tin & thanh toán số
    {id:19, g:"VII", name:"Số sự cố ATTT & tỷ lệ xử lý đúng hạn", unit:"sự cố", fmt:"incident",
     value:7, prev:4, planYear:0, planPeriod:0,
     trend:[2,3,3,4,5,5,6,7],
     direction:"lower", thresholds:{green:3, amber:7},
     extra:{onTime:5, late:2}},
    {id:20, g:"VII", name:"Tỷ lệ CS triển khai & phát sinh GD thanh toán KDTM", unit:"%", fmt:"percent",
     value:58.3, prev:49.6, planYear:80, planPeriod:80,
     trend:[32,38,44,49.6,53,55.5,57,58.3],
     direction:"higher", thresholds:{green:75, amber:45}},
    {id:21, g:"VII", name:"Tỷ lệ HT/CSGD đáp ứng yêu cầu ATTT", unit:"%", fmt:"percent",
     value:71.0, prev:68.2, planYear:90, planPeriod:90,
     trend:[60,63,66,68.2,69,70,70.5,71],
     direction:"higher", thresholds:{green:80, amber:65}},
    // Nhóm VIII — Tài chính, ngân sách
    {id:22, g:"VIII", name:"Tỷ lệ giải ngân kinh phí (ưu tiên CĐS & đầu tư)", unit:"%", fmt:"percent",
     value:62.4, prev:54.8, planYear:100, planPeriod:70,
     trend:[28,36,44,54.8,57,59,61,62.4],
     direction:"higher", thresholds:{green:75, amber:50}},
    {id:25, g:"VIII", name:"Tỷ lệ thực hiện dự toán NSNN so với dự toán giao", unit:"%", fmt:"percent",
     value:75.1, prev:69.8, planYear:100, planPeriod:78,
     trend:[58,62,66,69.8,71,73,74.2,75.1],
     direction:"higher", thresholds:{green:85, amber:65},
     extra:{soDonVi:42, tongDuToan:3850, chiThuongXuyen:3120, chiDauTu:520, boSung:145, chinhSachXH:68, tongQuyetToan:2890}},
    {id:26, g:"VIII", name:"Tỷ lệ thu, quyết toán nguồn thu sự nghiệp", unit:"%", fmt:"percent",
     value:69.5, prev:63.2, planYear:100, planPeriod:75,
     trend:[46,52,58,63.2,65,67,68.4,69.5],
     direction:"higher", thresholds:{green:85, amber:60},
     extra:{thu:285, quyetToan:198}},
    // Nhóm IX — Đầu tư, CSVC & an toàn trường học
    {id:23, g:"IX", name:"Tiến độ dự án, công trình, mua sắm, sửa chữa", unit:"%", fmt:"percent",
     value:74.6, prev:68.2, planYear:100, planPeriod:85,
     trend:[52,58,64,68.2,70,72,73.5,74.6],
     direction:"higher", thresholds:{green:90, amber:60}},
    {id:24, g:"IX", name:"Số vụ việc mất an toàn TH / bạo lực HĐ / ATTP chưa xử lý dứt điểm", unit:"vụ", fmt:"safety",
     value:3, prev:5, planYear:0, planPeriod:0,
     trend:[6,6,5,5,4,4,3,3],
     direction:"lower", thresholds:{green:0, amber:2},
     extra:{pending:3, total:11}},
    {id:27, g:"IX", name:"Tỷ lệ thực hiện kế hoạch đầu tư XD & sửa chữa CSGD", unit:"%", fmt:"percent",
     value:77.3, prev:68.0, planYear:100, planPeriod:70,
     trend:[42,50,58,64,68,71,74,77.3],
     direction:"higher", thresholds:{green:90, amber:70},
     extra:{soDuAn:34, tongMucDauTu:612, soCoSoSuaChua:58, keHoachCoSo:75, tongKinhPhiSuaChua:87}},
  ];

  function statusOf(ind){
    const v = ind.useAbs ? Math.abs(ind.value) : ind.value;
    const t = ind.thresholds;
    if(ind.direction === "lower"){
      return v <= t.green ? "green" : v <= t.amber ? "amber" : "red";
    }
    return v >= t.green ? "green" : v >= t.amber ? "amber" : "red";
  }
  function delta(ind){ return ind.value - ind.prev; }
  function vsTarget(ind){
    if(!ind.planPeriod) return null;
    return ind.fmt==="percent" ? (ind.value - ind.planPeriod) : (ind.value/ind.planPeriod*100 - 100);
  }

  // trạng thái nhóm = đỏ nếu có 1 đỏ, vàng nếu có 1 vàng, còn lại xanh
  const groupStatus = {};
  GROUPS.forEach(g=>{
    const sts = INDICATORS.filter(x=>x.g===g.id).map(statusOf);
    groupStatus[g.id] = sts.includes("red") ? "red" : sts.includes("amber") ? "amber" : "green";
  });

  const groupHero = {
    I:   {label:"498.732 học sinh", sub:"1.892 trường · 14.260 lớp"},
    II:  {label:"Thiếu 892 GV", sub:"1,62 GV/lớp · 68,5% tuyển dụng"},
    III: {label:"98,7% lên lớp", sub:"97,9% tốt nghiệp · 2,8% cần hỗ trợ"},
    IV:  {label:"84,2% NV đúng hạn", sub:"6 quá hạn · 8 sắp đến hạn"},
    V:   {label:"96,1% TTHC đúng hạn", sub:"72,4% trực tuyến"},
    VI:  {label:"81,6% dữ liệu đạt", sub:"64,2% học bạ số ký số"},
    VII: {label:"7 sự cố ATTT", sub:"58,3% KDTM · 71% CSGD đạt ATTT"},
    VIII:{label:"75,1% thực hiện dự toán", sub:"62,4% giải ngân · 69,5% nguồn thu SN"},
    IX:  {label:"77,3% KH đầu tư/sửa chữa", sub:"74,6% tiến độ DA · 3 vụ chưa xử lý"},
  };

  const GROUP_NOTES = {
    I:"Quy mô học sinh toàn ngành tiếp tục tăng theo đà tuyển sinh đầu năm học; tỷ lệ huy động vượt kế hoạch, tỷ lệ học sinh có nguy cơ bỏ học giảm còn dưới ngưỡng an toàn nhờ các giải pháp hỗ trợ hoàn cảnh khó khăn.",
    II:"Tỷ lệ giáo viên/lớp cải thiện nhẹ nhưng vẫn thiếu 892 người so với định biên, tập trung ở môn Tiếng Anh, Tin học cấp THCS; tiến độ tuyển dụng mới đạt 68,5% kế hoạch năm.",
    III:"Chất lượng giáo dục ổn định, tỷ lệ lên lớp và tốt nghiệp đều cao hơn cùng kỳ; tỷ lệ học sinh chưa đạt yêu cầu giảm dần nhờ các chương trình phụ đạo, hỗ trợ học tập.",
    IV:"Tỷ lệ nhiệm vụ hoàn thành đúng hạn đạt 84,2%, giảm nhẹ so với cùng kỳ do phát sinh 6 nhiệm vụ quá hạn cần đôn đốc; tỷ lệ đơn vị gửi báo cáo đúng hạn duy trì trên 91%.",
    V:"Cải cách thủ tục hành chính tiếp tục được đẩy mạnh, tỷ lệ hồ sơ trực tuyến và dịch vụ công toàn trình tăng đáng kể so với cùng kỳ; tỷ lệ cắt giảm thành phần hồ sơ bằng khai thác dữ liệu vẫn cần tăng tốc để đạt mục tiêu 50%.",
    VI:"Chuyển đổi số ngành giáo dục có chuyển biến tích cực nhưng học bạ số mới đạt 64,2% (mục tiêu 90%), khối THPT triển khai chậm nhất; chất lượng dữ liệu toàn ngành đạt 81,6%, tiệm cận ngưỡng tốt.",
    VII:"Ghi nhận 7 sự cố an toàn thông tin trong kỳ, 5/7 xử lý đúng hạn; tỷ lệ thanh toán không dùng tiền mặt tăng lên 58,3% nhưng chưa đạt mục tiêu 80%.",
    VIII:"Tiến độ thực hiện dự toán ngân sách nhà nước đạt 75,1% (2.890/3.850 tỷ đồng), thấp hơn kế hoạch kỳ 78%; nguồn thu sự nghiệp quyết toán đạt 69,5%, cần các đơn vị dự toán trực thuộc đẩy nhanh giải ngân, quyết toán trong quý IV.",
    IX:"58/75 cơ sở giáo dục được sửa chữa theo kế hoạch năm (77,3%), 34 dự án xây dựng đạt tổng mức đầu tư 612 tỷ đồng; còn 3 vụ việc mất an toàn trường học chưa xử lý dứt điểm cần chỉ đạo xử lý ngay.",
  };

  // ===== Cảnh báo điều hành (tổng hợp đa lĩnh vực, ưu tiên đỏ trước) =====
  const ALERTS = [
    {level:"red",   group:"IV", title:"6 nhiệm vụ chỉ đạo, điều hành quá hạn", detail:"Nhóm IV — Chỉ đạo, điều hành · Quá hạn lâu nhất 21 ngày (Phòng GDPT)."},
    {level:"red",   group:"IX", title:"3 vụ mất an toàn trường học chưa xử lý dứt điểm", detail:"Nhóm IX — 1 vụ bạo lực học đường, 2 vụ mất an toàn thực phẩm đang xử lý."},
    {level:"amber", group:"II", title:"Thiếu 892 giáo viên so với định biên", detail:"Nhóm II — Tập trung môn Tiếng Anh, Tin học cấp THCS; một số địa bàn thiếu trên 20%."},
    {level:"amber", group:"VI", title:"Học bạ số mới đạt 64,2% (mục tiêu 90%)", detail:"Nhóm VI — Khối THPT triển khai chậm nhất; 3 Phòng GD chưa ký số đợt học kỳ hè."},
    {level:"amber", group:"VIII",title:"Thực hiện dự toán NSNN đạt 75,1%, thấp hơn kế hoạch kỳ 78%", detail:"Nhóm VIII — 2.890/3.850 tỷ đồng; cần đôn đốc các đơn vị dự toán trực thuộc."},
    {level:"amber", group:"IX", title:"58/75 cơ sở giáo dục hoàn thành sửa chữa theo kế hoạch năm (77,3%)", detail:"Nhóm IX — Kinh phí sửa chữa đã chi 87 tỷ đồng; cần đẩy nhanh tiến độ quý IV."},
    {level:"amber", group:"VII",title:"7 sự cố an toàn thông tin trong kỳ, 2 sự cố xử lý quá hạn", detail:"Nhóm VII — 5/7 sự cố đã xử lý đúng hạn."},
    {level:"amber", group:"IV", title:"4/42 đơn vị chưa gửi báo cáo đúng hạn kỳ này", detail:"Nhóm IV — Tỷ lệ đơn vị báo cáo đúng hạn đạt 91,3%."},
  ];

  // ===== Nhiệm vụ chỉ đạo, điều hành (đối tượng nhiemvuchidaodieuhanh) =====
  const TASK_SUMMARY = {
    total:94, dungHan:64, treHan:6, dangThucHien:14, chuaThucHien:4, quaHan:6, sapDenHan:8,
    tyLeDungHan:84.2
  };
  const REPORT_SUMMARY = {totalUnits:42, onTime:38, late:4};

  const TASKS_OVERDUE = [
    {ten:"Triển khai học bạ số khối THPT năm học 2024–2025", donVi:"Phòng GDPT", han:"28/08/2025", soNgay:21},
    {ten:"Hoàn thiện hồ sơ đề nghị công nhận trường đạt chuẩn quốc gia đợt 2", donVi:"Phòng GDPT", han:"01/09/2025", soNgay:17},
    {ten:"Rà soát, bổ sung định biên giáo viên Tiếng Anh, Tin học cấp THCS", donVi:"Phòng Tổ chức – Cán bộ", han:"05/09/2025", soNgay:13},
    {ten:"Khắc phục lỗi đồng bộ dữ liệu học sinh lên CSDL ngành", donVi:"Phòng CĐS", han:"10/09/2025", soNgay:8},
    {ten:"Xử lý dứt điểm vụ mất an toàn thực phẩm tại Trường TH Đông Hải", donVi:"Văn phòng Sở", han:"12/09/2025", soNgay:6},
    {ten:"Nghiệm thu, quyết toán gói sửa chữa 12 phòng học quận Hồng Bàng", donVi:"Phòng KHTC", han:"15/09/2025", soNgay:3},
  ];
  const TASKS_DUE_SOON = [
    {ten:"Tổng hợp báo cáo kết quả năm học 2024–2025 gửi UBND thành phố", donVi:"Văn phòng Sở", han:"25/09/2025", soNgay:2},
    {ten:"Thẩm định dự toán sửa chữa 8 trường mầm non đợt 2", donVi:"Phòng KHTC", han:"27/09/2025", soNgay:4},
    {ten:"Hoàn thành ký số học bạ số học kỳ hè", donVi:"Phòng GDPT", han:"30/09/2025", soNgay:7},
    {ten:"Báo cáo kết quả đánh giá an toàn thông tin quý III", donVi:"Phòng CĐS", han:"30/09/2025", soNgay:7},
    {ten:"Rà soát chỉ tiêu tuyển dụng viên chức giáo dục đợt 2", donVi:"Phòng Tổ chức – Cán bộ", han:"02/10/2025", soNgay:9},
    {ten:"Giải ngân đợt 3 kinh phí sửa chữa cơ sở giáo dục", donVi:"Phòng KHTC", han:"05/10/2025", soNgay:12},
    {ten:"Cập nhật danh sách học sinh diện chính sách học kỳ I", donVi:"Phòng GDPT", han:"06/10/2025", soNgay:13},
    {ten:"Kiểm tra chất lượng dữ liệu định kỳ quý III", donVi:"Phòng CĐS", han:"07/10/2025", soNgay:14},
  ];

  // ===== Tài chính, ngân sách & đầu tư (đối tượng mới bổ sung) =====
  const FINANCE = {
    nsnn:{soDonVi:42, tongDuToan:3850, chiThuongXuyen:3120, chiDauTu:520, boSung:145, chinhSachXH:68, tongQuyetToan:2890, tyLeThucHien:75.1,
          trend:[58,62,66,69.8,71,73,74.2,75.1]},
    nguonThuSuNghiep:{thu:285, quyetToan:198, tyLe:69.5, trend:[46,52,58,63.2,65,67,68.4,69.5]},
    dauTu:{soDuAn:34, tongMucDauTu:612, soCoSoSuaChua:58, keHoachCoSo:75, tyLeSuaChua:77.3, tongKinhPhiSuaChua:87,
           trend:[42,50,58,64,68,71,74,77.3]},
  };

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
  function fmtTy(n){ return n.toLocaleString("vi-VN")+" tỷ đồng"; }

  window.IOC_MOCK = {
    PERIOD_LABELS, GROUPS, INDICATORS, statusOf, delta, vsTarget, groupStatus, groupHero, GROUP_NOTES,
    ALERTS, TASK_SUMMARY, REPORT_SUMMARY, TASKS_OVERDUE, TASKS_DUE_SOON, FINANCE, fmtValue, fmtTy
  };
})();
