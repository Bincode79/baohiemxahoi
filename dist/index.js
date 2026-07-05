"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
const host = process.env.HOST || "0.0.0.0";
const publicPath = path_1.default.join(__dirname, "../public");
app.use(express_1.default.static(publicPath));
app.use(express_1.default.json());
// ===== DATA =====
const provinces = [
    { code: "01", name: "Hà Nội" },
    { code: "02", name: "TP. Hồ Chí Minh" },
    { code: "03", name: "Hải Phòng" },
    { code: "04", name: "Đà Nẵng" },
    { code: "05", name: "Cần Thơ" },
    { code: "06", name: "An Giang" },
    { code: "07", name: "Bà Rịa - Vũng Tàu" },
    { code: "08", name: "Bắc Giang" },
    { code: "09", name: "Bắc Kạn" },
    { code: "10", name: "Bạc Liêu" },
    { code: "11", name: "Bắc Ninh" },
    { code: "12", name: "Bến Tre" },
    { code: "13", name: "Bình Định" },
    { code: "14", name: "Bình Dương" },
    { code: "15", name: "Bình Phước" },
    { code: "16", name: "Bình Thuận" },
    { code: "17", name: "Cà Mau" },
    { code: "18", name: "Cao Bằng" },
    { code: "19", name: "Đắk Lắk" },
    { code: "20", name: "Đắk Nông" },
    { code: "21", name: "Điện Biên" },
    { code: "22", name: "Đồng Nai" },
    { code: "23", name: "Đồng Tháp" },
    { code: "24", name: "Gia Lai" },
    { code: "25", name: "Hà Giang" },
    { code: "26", name: "Hà Nam" },
    { code: "27", name: "Hà Tĩnh" },
    { code: "28", name: "Hải Dương" },
    { code: "29", name: "Hậu Giang" },
    { code: "30", name: "Hòa Bình" },
    { code: "31", name: "Hưng Yên" },
    { code: "32", name: "Khánh Hòa" },
    { code: "33", name: "Kiên Giang" },
    { code: "34", name: "Kon Tum" },
    { code: "35", name: "Lai Châu" },
    { code: "36", name: "Lâm Đồng" },
    { code: "37", name: "Lạng Sơn" },
    { code: "38", name: "Lào Cai" },
    { code: "39", name: "Long An" },
    { code: "40", name: "Nam Định" },
    { code: "41", name: "Nghệ An" },
    { code: "42", name: "Ninh Bình" },
    { code: "43", name: "Ninh Thuận" },
    { code: "44", name: "Phú Thọ" },
    { code: "45", name: "Phú Yên" },
    { code: "46", name: "Quảng Bình" },
    { code: "47", name: "Quảng Nam" },
    { code: "48", name: "Quảng Ngãi" },
    { code: "49", name: "Quảng Ninh" },
    { code: "50", name: "Quảng Trị" },
    { code: "51", name: "Sóc Trăng" },
    { code: "52", name: "Sơn La" },
    { code: "53", name: "Tây Ninh" },
    { code: "54", name: "Thái Bình" },
    { code: "55", name: "Thái Nguyên" },
    { code: "56", name: "Thanh Hóa" },
    { code: "57", name: "Thừa Thiên Huế" },
    { code: "58", name: "Tiền Giang" },
    { code: "59", name: "Trà Vinh" },
    { code: "60", name: "Tuyên Quang" },
    { code: "61", name: "Vĩnh Long" },
    { code: "62", name: "Vĩnh Phúc" },
    { code: "63", name: "Yên Bái" },
];
const wardsByProvince = {
    "01": [
        { code: "001", name: "Ba Đình", level: "Quận" },
        { code: "002", name: "Hoàn Kiếm", level: "Quận" },
        { code: "003", name: "Hai Bà Trưng", level: "Quận" },
        { code: "004", name: "Đống Đa", level: "Quận" },
        { code: "005", name: "Cầu Giấy", level: "Quận" },
        { code: "006", name: "Thanh Xuân", level: "Quận" },
        { code: "007", name: "Hoàng Mai", level: "Quận" },
        { code: "008", name: "Long Biên", level: "Quận" },
        { code: "009", name: "Nam Từ Liêm", level: "Quận" },
        { code: "010", name: "Bắc Từ Liêm", level: "Quận" },
        { code: "011", name: "Hà Đông", level: "Quận" },
        { code: "012", name: "Sơn Tây", level: "Thị xã" },
        { code: "013", name: "Ba Vì", level: "Huyện" },
        { code: "014", name: "Chương Mỹ", level: "Huyện" },
        { code: "015", name: "Đan Phượng", level: "Huyện" },
        { code: "016", name: "Đông Anh", level: "Huyện" },
        { code: "017", name: "Gia Lâm", level: "Huyện" },
        { code: "018", name: "Hoài Đức", level: "Huyện" },
        { code: "019", name: "Mê Linh", level: "Huyện" },
        { code: "020", name: "Mỹ Đức", level: "Huyện" },
        { code: "021", name: "Phú Xuyên", level: "Huyện" },
        { code: "022", name: "Phúc Thọ", level: "Huyện" },
        { code: "023", name: "Quốc Oai", level: "Huyện" },
        { code: "024", name: "Sóc Sơn", level: "Huyện" },
        { code: "025", name: "Thạch Thất", level: "Huyện" },
        { code: "026", name: "Thanh Oai", level: "Huyện" },
        { code: "027", name: "Thanh Trì", level: "Huyện" },
        { code: "028", name: "Thường Tín", level: "Huyện" },
        { code: "029", name: "Ứng Hòa", level: "Huyện" },
        { code: "030", name: "Tây Hồ", level: "Quận" },
    ],
    "02": [
        { code: "031", name: "Quận 1", level: "Quận" },
        { code: "032", name: "Quận 2", level: "Quận" },
        { code: "033", name: "Quận 3", level: "Quận" },
        { code: "034", name: "Quận 4", level: "Quận" },
        { code: "035", name: "Quận 5", level: "Quận" },
        { code: "036", name: "Quận 6", level: "Quận" },
        { code: "037", name: "Quận 7", level: "Quận" },
        { code: "038", name: "Quận 8", level: "Quận" },
        { code: "039", name: "Quận 9", level: "Quận" },
        { code: "040", name: "Quận 10", level: "Quận" },
        { code: "041", name: "Quận 11", level: "Quận" },
        { code: "042", name: "Quận 12", level: "Quận" },
        { code: "043", name: "Bình Tân", level: "Quận" },
        { code: "044", name: "Bình Thạnh", level: "Quận" },
        { code: "045", name: "Gò Vấp", level: "Quận" },
        { code: "046", name: "Phú Nhuận", level: "Quận" },
        { code: "047", name: "Tân Bình", level: "Quận" },
        { code: "048", name: "Tân Phú", level: "Quận" },
        { code: "049", name: "Thủ Đức", level: "Thành phố" },
        { code: "050", name: "Củ Chi", level: "Huyện" },
        { code: "051", name: "Hóc Môn", level: "Huyện" },
        { code: "052", name: "Bình Chánh", level: "Huyện" },
        { code: "053", name: "Nhà Bè", level: "Huyện" },
        { code: "054", name: "Cần Giờ", level: "Huyện" },
    ],
};
const agencies = [
    {
        id: "BHXH_VN",
        code: "BHXHVN",
        name: "Bảo hiểm xã hội Việt Nam",
        parentId: null,
        hasChild: true,
    },
    {
        id: "BHXH_HN",
        code: "BHXHHN",
        name: "BHXH Thành phố Hà Nội",
        parentId: "BHXH_VN",
        hasChild: true,
    },
    {
        id: "BHXH_HCM",
        code: "BHXHHCM",
        name: "BHXH Thành phố Hồ Chí Minh",
        parentId: "BHXH_VN",
        hasChild: true,
    },
    {
        id: "BHXH_HP",
        code: "BHXHHP",
        name: "BHXH Thành phố Hải Phòng",
        parentId: "BHXH_VN",
        hasChild: true,
    },
    {
        id: "BHXH_DN",
        code: "BHXHDN",
        name: "BHXH Thành phố Đà Nẵng",
        parentId: "BHXH_VN",
        hasChild: true,
    },
    {
        id: "BHXH_CT",
        code: "BHXHCT",
        name: "BHXH Thành phố Cần Thơ",
        parentId: "BHXH_VN",
        hasChild: true,
    },
    {
        id: "BHXH_HN_CG",
        code: "BHXHHN-CG",
        name: "BHXH Quận Cầu Giấy",
        parentId: "BHXH_HN",
        hasChild: false,
    },
    {
        id: "BHXH_HN_DĐ",
        code: "BHXHHN-DĐ",
        name: "BHXH Quận Đống Đa",
        parentId: "BHXH_HN",
        hasChild: false,
    },
    {
        id: "BHXH_HN_HK",
        code: "BHXHHN-HK",
        name: "BHXH Quận Hoàn Kiếm",
        parentId: "BHXH_HN",
        hasChild: false,
    },
    {
        id: "BHXH_HN_TX",
        code: "BHXHHN-TX",
        name: "BHXH Quận Thanh Xuân",
        parentId: "BHXH_HN",
        hasChild: false,
    },
    {
        id: "BHXH_HN_HBT",
        code: "BHXHHN-HBT",
        name: "BHXH Quận Hai Bà Trưng",
        parentId: "BHXH_HN",
        hasChild: false,
    },
    {
        id: "BHXH_HCM_Q1",
        code: "BHXHHCM-Q1",
        name: "BHXH Quận 1",
        parentId: "BHXH_HCM",
        hasChild: false,
    },
    {
        id: "BHXH_HCM_Q7",
        code: "BHXHHCM-Q7",
        name: "BHXH Quận 7",
        parentId: "BHXH_HCM",
        hasChild: false,
    },
    {
        id: "BHXH_HCM_TD",
        code: "BHXHHCM-TD",
        name: "BHXH Thành phố Thủ Đức",
        parentId: "BHXH_HCM",
        hasChild: false,
    },
    {
        id: "BHXH_AG",
        code: "BHXHAG",
        name: "BHXH tỉnh An Giang",
        parentId: "BHXH_VN",
        hasChild: false,
    },
    {
        id: "BHXH_BG",
        code: "BHXHBG",
        name: "BHXH tỉnh Bắc Giang",
        parentId: "BHXH_VN",
        hasChild: false,
    },
    {
        id: "BHXH_BN",
        code: "BHXHBN",
        name: "BHXH tỉnh Bắc Ninh",
        parentId: "BHXH_VN",
        hasChild: false,
    },
    {
        id: "BHXH_BD",
        code: "BHXHBD",
        name: "BHXH tỉnh Bình Dương",
        parentId: "BHXH_VN",
        hasChild: true,
    },
    {
        id: "BHXH_BD_TP",
        code: "BHXHBD-TP",
        name: "BHXH Thành phố Thủ Dầu Một",
        parentId: "BHXH_BD",
        hasChild: false,
    },
    {
        id: "BHXH_BD_DAN",
        code: "BHXHBD-DAN",
        name: "BHXH Huyện Dầu Tiếng",
        parentId: "BHXH_BD",
        hasChild: false,
    },
    {
        id: "BHXH_DN",
        code: "BHXHDNAI",
        name: "BHXH tỉnh Đồng Nai",
        parentId: "BHXH_VN",
        hasChild: false,
    },
    {
        id: "BHXH_NA",
        code: "BHXHNA",
        name: "BHXH tỉnh Nghệ An",
        parentId: "BHXH_VN",
        hasChild: false,
    },
    {
        id: "BHXH_TH",
        code: "BHXHTH",
        name: "BHXH tỉnh Thanh Hóa",
        parentId: "BHXH_VN",
        hasChild: false,
    },
    {
        id: "BHXH_HUE",
        code: "BHXHHUE",
        name: "BHXH tỉnh Thừa Thiên Huế",
        parentId: "BHXH_VN",
        hasChild: false,
    },
];
// Mock registered users
const registeredUsers = [
    {
        id: 1,
        fullName: "Nguyễn Văn An",
        bhxhCode: "0123456789",
        cccd: "001099001234",
        phone: "0912345678",
        email: "nguyenvanan@email.com",
        accountType: "individual",
        status: "approved",
        registeredAt: "2026-06-15 08:30:00",
        province: "Hà Nội",
        ward: "Cầu Giấy",
    },
    {
        id: 2,
        fullName: "Trần Thị Bình",
        bhxhCode: "0123456790",
        cccd: "002099001235",
        phone: "0987654321",
        email: "tranthibinh@email.com",
        accountType: "individual",
        status: "pending",
        registeredAt: "2026-07-01 09:15:00",
        province: "TP. Hồ Chí Minh",
        ward: "Quận 1",
    },
    {
        id: 3,
        fullName: "Công ty TNHH Sản xuất ABC",
        bhxhCode: "0123456791",
        cccd: "030099001236",
        phone: "02412345678",
        email: "abc@company.com",
        accountType: "organization",
        status: "approved",
        registeredAt: "2026-06-20 10:00:00",
        province: "Bình Dương",
        ward: "Thủ Dầu Một",
    },
    {
        id: 4,
        fullName: "Lê Văn Cường",
        bhxhCode: "0123456792",
        cccd: "004099001237",
        phone: "0933123456",
        email: "levancuong@email.com",
        accountType: "individual",
        status: "rejected",
        registeredAt: "2026-06-25 14:20:00",
        province: "Đà Nẵng",
        ward: "Hải Châu",
    },
    {
        id: 5,
        fullName: "Phạm Thị Dung",
        bhxhCode: "0123456793",
        cccd: "005099001238",
        phone: "0977456123",
        email: "phamthidung@email.com",
        accountType: "individual",
        status: "pending",
        registeredAt: "2026-07-02 11:30:00",
        province: "Hải Phòng",
        ward: "Hồng Bàng",
    },
    {
        id: 6,
        fullName: "Doanh nghiệp Tư nhân XYZ",
        bhxhCode: "0123456794",
        cccd: "060099001239",
        phone: "0255123456",
        email: "xyz@company.com",
        accountType: "organization",
        status: "approved",
        registeredAt: "2026-06-10 08:00:00",
        province: "Đồng Nai",
        ward: "Biên Hòa",
    },
    {
        id: 7,
        fullName: "Hoàng Văn Em",
        bhxhCode: "0123456795",
        cccd: "007099001240",
        phone: "0968123456",
        email: "hoangvanem@email.com",
        accountType: "individual",
        status: "pending",
        registeredAt: "2026-07-03 15:45:00",
        province: "Cần Thơ",
        ward: "Ninh Kiều",
    },
    {
        id: 8,
        fullName: "Vũ Thị Phương",
        bhxhCode: "0123456796",
        cccd: "008099001241",
        phone: "0944223344",
        email: "vuthiphuong@email.com",
        accountType: "individual",
        status: "approved",
        registeredAt: "2026-06-28 09:10:00",
        province: "Bắc Ninh",
        ward: "Từ Sơn",
    },
];
// ===== API ROUTES =====
app.get("/api/Provinces", (_req, res) => {
    res.json(provinces);
});
app.get("/api/Wards", (req, res) => {
    const provinceCode = req.query.provinceCode;
    if (!provinceCode || !wardsByProvince[provinceCode]) {
        return res.json([]);
    }
    res.json(wardsByProvince[provinceCode]);
});
app.get("/api/Agencies", (req, res) => {
    const parentId = req.query.parentId;
    if (parentId === undefined || parentId === null) {
        res.json(agencies.filter((a) => a.parentId === null));
    }
    else {
        res.json(agencies.filter((a) => a.parentId === parentId));
    }
});
// ===== APPOINTMENTS STORE =====
const appointments = [
    {
        id: 1,
        fullName: "Nguyễn Văn An",
        phone: "0912345678",
        email: "nguyenvanan@email.com",
        bhxhCode: "0123456789",
        date: "2026-07-10",
        timeSlot: "08:30 - 09:30",
        service: "kekhai",
        note: "Cần tư vấn thủ tục kê khai BHXH cho nhân viên mới",
        status: "confirmed",
        createdAt: "2026-07-05 10:30:00",
    },
    {
        id: 2,
        fullName: "Trần Thị Bình",
        phone: "0987654321",
        email: "tranthibinh@email.com",
        bhxhCode: "0123456790",
        date: "2026-07-11",
        timeSlot: "14:30 - 15:30",
        service: "huong-dan",
        note: "Hướng dẫn nộp hồ sơ điện tử",
        status: "pending",
        createdAt: "2026-07-05 14:20:00",
    },
];
// ===== REGISTER =====
let nextUserId = 9;
// ===== ADMIN API =====
app.get("/api/admin/users", (_req, res) => {
    res.json(registeredUsers);
});
app.get("/api/admin/users/:id", (req, res) => {
    const user = registeredUsers.find((u) => u.id === parseInt(req.params.id));
    if (!user)
        return res.status(404).json({ error: "Not found" });
    res.json(user);
});
app.put("/api/admin/users/:id/status", (req, res) => {
    const user = registeredUsers.find((u) => u.id === parseInt(req.params.id));
    if (!user)
        return res.status(404).json({ error: "Not found" });
    user.status = req.body.status;
    res.json({ success: true, user });
});
app.get("/api/admin/stats", (_req, res) => {
    const total = registeredUsers.length;
    const approved = registeredUsers.filter((u) => u.status === "approved").length;
    const pending = registeredUsers.filter((u) => u.status === "pending").length;
    const rejected = registeredUsers.filter((u) => u.status === "rejected").length;
    const individual = registeredUsers.filter((u) => u.accountType === "individual").length;
    const org = registeredUsers.filter((u) => u.accountType === "organization").length;
    res.json({ total, approved, pending, rejected, individual, org });
});
app.get("/api/admin/dashboard", (_req, res) => {
    res.json({
        stats: {
            totalUsers: 12584,
            activeUsers: 10231,
            pendingApprovals: 347,
            todayRegistrations: 28,
            totalSubmissions: 10585112,
            processedSubmissions: 10311515,
        },
        recentActivity: [
            { time: "14:32", text: "Nguyễn Văn An đăng ký tài khoản thành công", type: "success" },
            { time: "14:15", text: "Công ty TNHH ABC gửi hồ sơ kê khai", type: "info" },
            { time: "13:50", text: "Trần Thị Bình cần xác thực CCCD", type: "warning" },
            { time: "13:20", text: "Lê Văn Cường bị từ chối hồ sơ", type: "error" },
            { time: "12:45", text: "Phạm Thị Dung hoàn tất đăng ký", type: "success" },
            { time: "12:10", text: "Doanh nghiệp XYZ nộp báo cáo BHXH", type: "info" },
            { time: "11:30", text: "Cập nhật thông tin người lao động mới", type: "info" },
        ],
        registrationsByMonth: [
            { month: "T1", count: 180 },
            { month: "T2", count: 220 },
            { month: "T3", count: 280 },
            { month: "T4", count: 350 },
            { month: "T5", count: 410 },
            { month: "T6", count: 520 },
        ],
    });
});
// ===== REGISTER API =====
app.post("/api/register", (req, res) => {
    const body = req.body;
    const newUser = {
        id: nextUserId++,
        fullName: body.FullName || "",
        bhxhCode: body.BhxhCode || "",
        cccd: body.IdNumber || "",
        phone: body.Phone || "",
        email: body.Email || "",
        accountType: body.AccountType || "individual",
        status: "pending",
        registeredAt: new Date().toISOString().replace("T", " ").substring(0, 19),
        province: body.Province || "",
        ward: body.Ward || "",
        street: body.Street || "",
        gender: body.Gender || "",
        ethnicity: body.Ethnicity || "",
        birthDate: body.BirthDate || "",
        paymentMethod: body.PaymentMethod || "transfer",
        bankName: body.BankName || "",
        bankAccountName: body.BankAccountName || "",
        bankAccountNumber: body.BankAccountNumber || "",
        registrationLocation: body.RegistrationLocation || "portal",
        receivingAgency: body.ReceivingAgency || "",
    };
    registeredUsers.push(newUser);
    res.json({ success: true, user: newUser, message: "Đăng ký thành công! Hồ sơ của bạn đang chờ xét duyệt." });
});
// ===== APPOINTMENTS API =====
let nextApptId = 3;
app.get("/api/appointments", (_req, res) => {
    const pending = appointments.filter((a) => a.status === "pending").length;
    const confirmed = appointments.filter((a) => a.status === "confirmed").length;
    const cancelled = appointments.filter((a) => a.status === "cancelled").length;
    res.json({ appointments, stats: { total: appointments.length, pending, confirmed, cancelled } });
});
app.post("/api/appointments", (req, res) => {
    const body = req.body;
    const newAppt = {
        id: nextApptId++,
        fullName: body.fullName || "",
        phone: body.phone || "",
        email: body.email || "",
        bhxhCode: body.bhxhCode || "",
        date: body.date || "",
        timeSlot: body.timeSlot || "",
        service: body.service || "",
        note: body.note || "",
        status: "pending",
        createdAt: new Date().toISOString().replace("T", " ").substring(0, 19),
    };
    appointments.push(newAppt);
    res.json({ success: true, appointment: newAppt, message: "Yêu cầu đặt lịch đã được ghi nhận!" });
});
app.put("/api/appointments/:id/status", (req, res) => {
    const appt = appointments.find((a) => a.id === parseInt(req.params.id));
    if (!appt)
        return res.status(404).json({ error: "Not found" });
    appt.status = req.body.status;
    res.json({ success: true, appointment: appt });
});
// ===== AGENCY TREE =====
app.get("/api/Agencies/tree", (_req, res) => {
    res.json(agencies);
});
// ===== CHAT API =====
const chatConversations = [
    {
        id: 1,
        userName: "Nguyễn Văn An",
        idCard: "079099001234",
        phone: "0912345678",
        status: "active",
        unread: 1,
        createdAt: "2026-07-05 09:00:00",
        messages: [
            { from: "user", text: "Chào bạn, tôi cần hỗ trợ về thủ tục đăng ký BHXH điện tử", time: "09:00" },
            { from: "admin", text: "Chào anh/chị! Anh/chị vui lòng cho tôi biết mã số BHXH để kiểm tra ạ.", time: "09:02" },
            { from: "user", text: "Mã số BHXH của tôi là 0123456789", time: "09:05" },
        ],
    },
];
let nextChatId = 2;
app.get("/api/chat/conversations", (_req, res) => {
    res.json(chatConversations);
});
app.post("/api/chat/messages", (req, res) => {
    const { userName, idCard, phone, text } = req.body;
    if (!text)
        return res.status(400).json({ error: "Nội dung tin nhắn không được để trống" });
    let conv = chatConversations.find((c) => c.idCard === idCard && c.status === "active");
    if (!conv) {
        conv = {
            id: nextChatId++,
            userName: userName || "Khách",
            idCard: idCard || "",
            phone: phone || "",
            status: "active",
            unread: 0,
            createdAt: new Date().toISOString().replace("T", " ").substring(0, 19),
            messages: [],
        };
        chatConversations.push(conv);
    }
    else {
        if (phone)
            conv.phone = phone;
        if (idCard)
            conv.idCard = idCard;
    }
    const now = new Date();
    const time = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
    conv.messages.push({ from: "user", text, time });
    // Auto-reply
    setTimeout(() => {
        const replyTime = new Date();
        const rt = String(replyTime.getHours()).padStart(2, "0") + ":" + String(replyTime.getMinutes()).padStart(2, "0");
        const autoReplies = [
            "Cảm ơn bạn đã liên hệ! Bộ phận hỗ trợ sẽ phản hồi trong thời gian sớm nhất.",
            "Chúng tôi đã ghi nhận yêu cầu của bạn. Vui lòng chờ trong giây lát.",
            "Thông tin của bạn đã được gửi đến bộ phận chăm sóc khách hàng.",
        ];
        conv.messages.push({
            from: "admin",
            text: autoReplies[Math.floor(Math.random() * autoReplies.length)],
            time: rt,
        });
    }, 1500);
    res.json({ success: true, conversation: conv });
});
app.post("/api/chat/admin/reply", (req, res) => {
    const { conversationId, text } = req.body;
    const conv = chatConversations.find((c) => c.id === conversationId);
    if (!conv)
        return res.status(404).json({ error: "Không tìm thấy hội thoại" });
    const now = new Date();
    const time = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
    conv.messages.push({ from: "admin", text, time });
    conv.unread = 0;
    res.json({ success: true, conversation: conv });
});
app.put("/api/chat/conversations/:id/status", (req, res) => {
    const conv = chatConversations.find((c) => c.id === parseInt(req.params.id));
    if (!conv)
        return res.status(404).json({ error: "Not found" });
    conv.status = req.body.status || "closed";
    res.json({ success: true });
});
// ===== ADMIN AUTH =====
const ADMIN_USER = "admin";
const ADMIN_PASS = "REDACTED";
let adminToken = null;
app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER && password === ADMIN_PASS) {
        adminToken = "tok_" + Math.random().toString(36).substring(2) + Date.now().toString(36);
        res.json({ success: true, token: adminToken });
    }
    else {
        res.status(401).json({ success: false, error: "Sai tên đăng nhập hoặc mật khẩu!" });
    }
});
app.post("/api/admin/logout", (_req, res) => {
    adminToken = null;
    res.json({ success: true });
});
app.get("/api/admin/check", (req, res) => {
    const token = req.headers.authorization;
    if (token === "Bearer " + adminToken) {
        res.json({ authenticated: true });
    }
    else {
        res.json({ authenticated: false });
    }
});
function adminAuth(req, res, next) {
    const token = req.headers.authorization;
    if (token === "Bearer " + adminToken) {
        next();
    }
    else {
        res.status(401).json({ authenticated: false, error: "Unauthorized" });
    }
}
// Protect admin API routes (excluding login/check/logout)
app.use(["/api/admin/users", "/api/admin/stats", "/api/admin/dashboard", "/api/chat", "/api/appointments"], adminAuth);
// ===== PAGE ROUTES =====
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(publicPath, "index.html"));
});
app.get("/admin", (req, res) => {
    res.sendFile(path_1.default.join(publicPath, "admin.html"));
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map