import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { query, initializeDatabase } from "./db";

const app = express();
const port = process.env.PORT || 3002;
const host = process.env.HOST || "0.0.0.0";

const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));
app.use("/uploads", express.static(path.join(publicPath, "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== CHAT FILE UPLOAD =====
const uploadDir = path.join(publicPath, "uploads", "chat");
fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = Date.now() + "_" + Math.round(Math.random() * 1e9) + ext;
    cb(null, name);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp|bmp|svg|mp4|webm|mov|avi|mkv|mp3|wav|ogg|pdf|doc|docx|xls|xlsx|txt|zip|rar)$/i;
    if (allowed.test(file.originalname)) cb(null, true);
    else cb(new Error("Định dạng tệp không được hỗ trợ"));
  },
});

// ===== DATA =====
const provinces = [
  { code: "01", name: "Hà Nội", type: "Thành phố" },
  { code: "04", name: "Cao Bằng", type: "Tỉnh" },
  { code: "08", name: "Tuyên Quang", type: "Tỉnh" },
  { code: "11", name: "Điện Biên", type: "Tỉnh" },
  { code: "12", name: "Lai Châu", type: "Tỉnh" },
  { code: "14", name: "Sơn La", type: "Tỉnh" },
  { code: "15", name: "Lào Cai", type: "Tỉnh" },
  { code: "19", name: "Thái Nguyên", type: "Tỉnh" },
  { code: "20", name: "Lạng Sơn", type: "Tỉnh" },
  { code: "22", name: "Quảng Ninh", type: "Tỉnh" },
  { code: "24", name: "Bắc Ninh", type: "Tỉnh" },
  { code: "25", name: "Phú Thọ", type: "Tỉnh" },
  { code: "31", name: "Hải Phòng", type: "Thành phố" },
  { code: "33", name: "Hưng Yên", type: "Tỉnh" },
  { code: "37", name: "Ninh Bình", type: "Tỉnh" },
  { code: "38", name: "Thanh Hóa", type: "Tỉnh" },
  { code: "40", name: "Nghệ An", type: "Tỉnh" },
  { code: "42", name: "Hà Tĩnh", type: "Tỉnh" },
  { code: "44", name: "Quảng Trị", type: "Tỉnh" },
  { code: "46", name: "Huế", type: "Thành phố" },
  { code: "48", name: "Đà Nẵng", type: "Thành phố" },
  { code: "51", name: "Quảng Ngãi", type: "Tỉnh" },
  { code: "52", name: "Gia Lai", type: "Tỉnh" },
  { code: "56", name: "Khánh Hòa", type: "Tỉnh" },
  { code: "66", name: "Đắk Lắk", type: "Tỉnh" },
  { code: "68", name: "Lâm Đồng", type: "Tỉnh" },
  { code: "75", name: "Đồng Nai", type: "Tỉnh" },
  { code: "79", name: "Hồ Chí Minh", type: "Thành phố" },
  { code: "80", name: "Tây Ninh", type: "Tỉnh" },
  { code: "82", name: "Đồng Tháp", type: "Tỉnh" },
  { code: "86", name: "Vĩnh Long", type: "Tỉnh" },
  { code: "91", name: "An Giang", type: "Tỉnh" },
  { code: "92", name: "Cần Thơ", type: "Thành phố" },
  { code: "96", name: "Cà Mau", type: "Tỉnh" },
];

const wardsByProvince: Record<string, { code: string; name: string; level: string }[]> = {
  "01": [
    { code: "001", name: "Trần Hưng Đạo", level: "Phường" },
    { code: "002", name: "Nguyễn Du", level: "Phường" },
    { code: "003", name: "Lý Thường Kiệt", level: "Phường" },
    { code: "004", name: "Quang Trung", level: "Phường" },
    { code: "005", name: "Hùng Vương", level: "Phường" },
    { code: "006", name: "Đội Cung", level: "Phường" },
    { code: "007", name: "Cửa Nam", level: "Phường" },
    { code: "008", name: "Hàng Bông", level: "Phường" },
    { code: "009", name: "Điện Biên", level: "Phường" },
    { code: "010", name: "Phan Chu Trinh", level: "Phường" },
    { code: "011", name: "Phạm Đình Hổ", level: "Phường" },
    { code: "012", name: "Đồng Tâm", level: "Phường" },
    { code: "013", name: "Thịnh Quang", level: "Phường" },
    { code: "014", name: "Trung Tự", level: "Phường" },
    { code: "015", name: "Kim Liên", level: "Phường" },
    { code: "016", name: "Phương Liên", level: "Phường" },
    { code: "017", name: "Khâm Thiên", level: "Phường" },
    { code: "018", name: "Bạch Đằng", level: "Phường" },
    { code: "019", name: "Vạn Phúc", level: "Phường" },
    { code: "020", name: "Yên Hòa", level: "Phường" }
  ],
  "04": [
    { code: "001", name: "Sông Hiến", level: "Phường" },
    { code: "002", name: "Sông Bằng", level: "Phường" },
    { code: "003", name: "Hợp Giang", level: "Phường" },
    { code: "004", name: "Tân Giang", level: "Phường" },
    { code: "005", name: "Ngọc Xuân", level: "Phường" },
    { code: "006", name: "Xuân Hòa", level: "Phường" },
    { code: "007", name: "Vĩnh Quang", level: "Xã" },
    { code: "008", name: "Hưng Đạo", level: "Xã" },
    { code: "009", name: "Chu Trinh", level: "Xã" },
    { code: "010", name: "Bình Dương", level: "Xã" },
    { code: "011", name: "Hòa Chung", level: "Xã" },
    { code: "012", name: "Đề Thám", level: "Xã" }
  ],
  "08": [
    { code: "001", name: "Hưng Thành", level: "Phường" },
    { code: "002", name: "Tân Quang", level: "Phường" },
    { code: "003", name: "Minh Xuân", level: "Phường" },
    { code: "004", name: "Phan Thiết", level: "Phường" },
    { code: "005", name: "Nông Tiến", level: "Phường" },
    { code: "006", name: "Ỷ La", level: "Phường" },
    { code: "007", name: "An Khang", level: "Xã" },
    { code: "008", name: "An Tường", level: "Xã" },
    { code: "009", name: "Lưỡng Vượng", level: "Xã" },
    { code: "010", name: "Thái Long", level: "Xã" },
    { code: "011", name: "Kim Phú", level: "Xã" },
    { code: "012", name: "Tràng Đà", level: "Xã" }
  ],
  "11": [
    { code: "001", name: "Mường Thanh", level: "Phường" },
    { code: "002", name: "Thanh Trường", level: "Phường" },
    { code: "003", name: "Tân Thanh", level: "Phường" },
    { code: "004", name: "Nam Thanh", level: "Phường" },
    { code: "005", name: "Him Lam", level: "Phường" },
    { code: "006", name: "Noong Bua", level: "Phường" },
    { code: "007", name: "Mường Phăng", level: "Xã" },
    { code: "008", name: "Nà Nhạn", level: "Xã" },
    { code: "009", name: "Nà Tấu", level: "Xã" },
    { code: "010", name: "Pa Khoang", level: "Xã" },
    { code: "011", name: "Thanh Luông", level: "Xã" },
    { code: "012", name: "Thanh Nưa", level: "Xã" }
  ],
  "12": [
    { code: "001", name: "Quyết Thắng", level: "Phường" },
    { code: "002", name: "Tân Phong", level: "Phường" },
    { code: "003", name: "Đoàn Kết", level: "Phường" },
    { code: "004", name: "Đông Phong", level: "Phường" },
    { code: "005", name: "San Thàng", level: "Xã" },
    { code: "006", name: "Nậm Lò", level: "Xã" },
    { code: "007", name: "Mường Mô", level: "Xã" },
    { code: "008", name: "Nậm Ban", level: "Xã" },
    { code: "009", name: "Mường Tè", level: "Xã" },
    { code: "010", name: "Bum Tở", level: "Xã" },
    { code: "011", name: "Sì Lờ Lầu", level: "Xã" },
    { code: "012", name: "Ma Quai", level: "Xã" }
  ],
  "14": [
    { code: "001", name: "Chiềng Lề", level: "Phường" },
    { code: "002", name: "Tô Hiệu", level: "Phường" },
    { code: "003", name: "Quyết Thắng", level: "Phường" },
    { code: "004", name: "Quyết Tâm", level: "Phường" },
    { code: "005", name: "Chiềng Cọ", level: "Xã" },
    { code: "006", name: "Chiềng Đen", level: "Xã" },
    { code: "007", name: "Chiềng Xôm", level: "Xã" },
    { code: "008", name: "Hua La", level: "Xã" },
    { code: "009", name: "Hát Lót", level: "Xã" },
    { code: "010", name: "Chiềng Sung", level: "Xã" },
    { code: "011", name: "Chiềng Khay", level: "Xã" },
    { code: "012", name: "Mường Chanh", level: "Xã" }
  ],
  "15": [
    { code: "001", name: "Duyên Hải", level: "Phường" },
    { code: "002", name: "Lào Cai", level: "Phường" },
    { code: "003", name: "Kim Tân", level: "Phường" },
    { code: "004", name: "Bắc Lệnh", level: "Phường" },
    { code: "005", name: "Pom Hán", level: "Phường" },
    { code: "006", name: "Xuân Tăng", level: "Phường" },
    { code: "007", name: "Cam Đường", level: "Xã" },
    { code: "008", name: "Hợp Thành", level: "Xã" },
    { code: "009", name: "Tả Phời", level: "Xã" },
    { code: "010", name: "Vạn Hòa", level: "Xã" },
    { code: "011", name: "Đồng Tuyển", level: "Xã" },
    { code: "012", name: "Thống Nhất", level: "Xã" }
  ],
  "19": [
    { code: "001", name: "Quang Trung", level: "Phường" },
    { code: "002", name: "Phan Đình Phùng", level: "Phường" },
    { code: "003", name: "Tân Thịnh", level: "Phường" },
    { code: "004", name: "Thịnh Đán", level: "Phường" },
    { code: "005", name: "Đồng Quang", level: "Phường" },
    { code: "006", name: "Phú Xá", level: "Phường" },
    { code: "007", name: "Túc Duyên", level: "Phường" },
    { code: "008", name: "Giang Sơn", level: "Phường" },
    { code: "009", name: "Cao Ngạn", level: "Xã" },
    { code: "010", name: "Linh Sơn", level: "Xã" },
    { code: "011", name: "Thịnh Đức", level: "Xã" },
    { code: "012", name: "Phúc Trìu", level: "Xã" }
  ],
  "20": [
    { code: "001", name: "Hoàng Văn Thụ", level: "Phường" },
    { code: "002", name: "Chi Lăng", level: "Phường" },
    { code: "003", name: "Đông Kinh", level: "Phường" },
    { code: "004", name: "Vĩnh Trại", level: "Phường" },
    { code: "005", name: "Tam Thanh", level: "Phường" },
    { code: "006", name: "Mai Pha", level: "Phường" },
    { code: "007", name: "Phú Xá", level: "Xã" },
    { code: "008", name: "Quảng Lạc", level: "Xã" },
    { code: "009", name: "Tràng Định", level: "Xã" },
    { code: "010", name: "Hồng Phong", level: "Xã" },
    { code: "011", name: "Yên Trạch", level: "Xã" },
    { code: "012", name: "Hoàng Văn Thụ", level: "Xã" }
  ],
  "22": [
    { code: "001", name: "Cẩm Trung", level: "Phường" },
    { code: "002", name: "Cẩm Đông", level: "Phường" },
    { code: "003", name: "Cẩm Tây", level: "Phường" },
    { code: "004", name: "Cẩm Thịnh", level: "Phường" },
    { code: "005", name: "Cẩm Thủy", level: "Phường" },
    { code: "006", name: "Cẩm Thạch", level: "Phường" },
    { code: "007", name: "Cộng Hòa", level: "Phường" },
    { code: "008", name: "Cẩm Sơn", level: "Phường" },
    { code: "009", name: "Cẩm Bình", level: "Phường" },
    { code: "010", name: "Quang Hanh", level: "Phường" },
    { code: "011", name: "Mông Dương", level: "Phường" },
    { code: "012", name: "Cẩm Hải", level: "Xã" }
  ],
  "24": [
    { code: "001", name: "Vũ Ninh", level: "Phường" },
    { code: "002", name: "Suối Hoa", level: "Phường" },
    { code: "003", name: "Tiền An", level: "Phường" },
    { code: "004", name: "Kinh Bắc", level: "Phường" },
    { code: "005", name: "Vệ An", level: "Phường" },
    { code: "006", name: "Đại Phúc", level: "Phường" },
    { code: "007", name: "Khúc Xuyên", level: "Phường" },
    { code: "008", name: "Nam Sơn", level: "Xã" },
    { code: "009", name: "Phong Khê", level: "Xã" },
    { code: "010", name: "Hòa Long", level: "Xã" },
    { code: "011", name: "Vân Dương", level: "Xã" },
    { code: "012", name: "Long Châu", level: "Xã" }
  ],
  "25": [
    { code: "001", name: "Minh Nông", level: "Phường" },
    { code: "002", name: "Minh Phương", level: "Phường" },
    { code: "003", name: "Vân Phú", level: "Phường" },
    { code: "004", name: "Tân Dân", level: "Phường" },
    { code: "005", name: "Thọ Sơn", level: "Phường" },
    { code: "006", name: "Dữu Lâu", level: "Phường" },
    { code: "007", name: "Nông Trang", level: "Phường" },
    { code: "008", name: "Vân Cơ", level: "Phường" },
    { code: "009", name: "Hùng Lô", level: "Xã" },
    { code: "010", name: "Hy Cương", level: "Xã" },
    { code: "011", name: "Chu Hóa", level: "Xã" },
    { code: "012", name: "Thanh Đình", level: "Xã" }
  ],
  "31": [
    { code: "001", name: "Hồng Bàng", level: "Phường" },
    { code: "002", name: "Quang Trung", level: "Phường" },
    { code: "003", name: "Hoàng Văn Thụ", level: "Phường" },
    { code: "004", name: "Phan Bội Châu", level: "Phường" },
    { code: "005", name: "Phạm Hồng Thái", level: "Phường" },
    { code: "006", name: "Minh Khai", level: "Phường" },
    { code: "007", name: "Đông Hải", level: "Phường" },
    { code: "008", name: "Vạn Mỹ", level: "Phường" },
    { code: "009", name: "Trần Nguyên Hãn", level: "Phường" },
    { code: "010", name: "Lạc Viên", level: "Phường" },
    { code: "011", name: "Cát Dài", level: "Phường" },
    { code: "012", name: "Hạ Lý", level: "Phường" },
    { code: "013", name: "Tân Thành", level: "Phường" },
    { code: "014", name: "Hội Thương", level: "Phường" },
    { code: "015", name: "Lương Khánh Thiện", level: "Phường" },
    { code: "016", name: "Lãm Hà", level: "Phường" },
    { code: "017", name: "Đằng Giang", level: "Phường" },
    { code: "018", name: "Trần Thành Ngọ", level: "Phường" }
  ],
  "33": [
    { code: "001", name: "Quang Trung", level: "Phường" },
    { code: "002", name: "Lê Lợi", level: "Phường" },
    { code: "003", name: "Minh Khai", level: "Phường" },
    { code: "004", name: "Hiến Nam", level: "Phường" },
    { code: "005", name: "An Tảo", level: "Phường" },
    { code: "006", name: "Lam Sơn", level: "Phường" },
    { code: "007", name: "Bảo Khê", level: "Xã" },
    { code: "008", name: "Trung Nghĩa", level: "Xã" },
    { code: "009", name: "Hồng Nam", level: "Xã" },
    { code: "010", name: "Phú Cường", level: "Xã" },
    { code: "011", name: "Hoàng Hanh", level: "Xã" },
    { code: "012", name: "Liên Phương", level: "Xã" }
  ],
  "37": [
    { code: "001", name: "Đông Thành", level: "Phường" },
    { code: "002", name: "Phúc Thành", level: "Phường" },
    { code: "003", name: "Tân Thành", level: "Phường" },
    { code: "004", name: "Thanh Bình", level: "Phường" },
    { code: "005", name: "Vân Giang", level: "Phường" },
    { code: "006", name: "Nam Bình", level: "Phường" },
    { code: "007", name: "Ninh Khánh", level: "Phường" },
    { code: "008", name: "Ninh Phong", level: "Xã" },
    { code: "009", name: "Ninh Tiến", level: "Xã" },
    { code: "010", name: "Ninh Nhất", level: "Xã" },
    { code: "011", name: "Ninh Sơn", level: "Xã" },
    { code: "012", name: "Vân Giang", level: "Xã" }
  ],
  "38": [
    { code: "001", name: "Trường Thi", level: "Phường" },
    { code: "002", name: "Lam Sơn", level: "Phường" },
    { code: "003", name: "Ba Đình", level: "Phường" },
    { code: "004", name: "Nguyễn Trãi", level: "Phường" },
    { code: "005", name: "Hải Hòa", level: "Phường" },
    { code: "006", name: "Hải Châu", level: "Phường" },
    { code: "007", name: "Đông Vệ", level: "Phường" },
    { code: "008", name: "Quảng Thịnh", level: "Phường" },
    { code: "009", name: "Quảng Hưng", level: "Phường" },
    { code: "010", name: "Quảng Tâm", level: "Phường" },
    { code: "011", name: "Quảng Thành", level: "Xã" },
    { code: "012", name: "Quảng Phú", level: "Xã" },
    { code: "013", name: "Hoằng Quang", level: "Xã" },
    { code: "014", name: "Đông Hưng", level: "Xã" },
    { code: "015", name: "Đông Tân", level: "Xã" }
  ],
  "40": [
    { code: "001", name: "Lê Lợi", level: "Phường" },
    { code: "002", name: "Lê Mao", level: "Phường" },
    { code: "003", name: "Quán Bàu", level: "Phường" },
    { code: "004", name: "Quang Trung", level: "Phường" },
    { code: "005", name: "Trung Đô", level: "Phường" },
    { code: "006", name: "Trường Thi", level: "Phường" },
    { code: "007", name: "Hồng Sơn", level: "Phường" },
    { code: "008", name: "Đội Cung", level: "Phường" },
    { code: "009", name: "Cửa Nam", level: "Phường" },
    { code: "010", name: "Hưng Bình", level: "Phường" },
    { code: "011", name: "Hưng Phúc", level: "Phường" },
    { code: "012", name: "Hưng Dũng", level: "Phường" },
    { code: "013", name: "Nghi Liên", level: "Xã" },
    { code: "014", name: "Nghi Kim", level: "Xã" },
    { code: "015", name: "Nghi Ân", level: "Xã" }
  ],
  "42": [
    { code: "001", name: "Trần Phú", level: "Phường" },
    { code: "002", name: "Hà Huy Tập", level: "Phường" },
    { code: "003", name: "Nguyễn Du", level: "Phường" },
    { code: "004", name: "Nguyễn Nghiêm", level: "Phường" },
    { code: "005", name: "Bắc Hà", level: "Phường" },
    { code: "006", name: "Trần Bình Trọng", level: "Phường" },
    { code: "007", name: "Thạch Linh", level: "Phường" },
    { code: "008", name: "Thạch Hưng", level: "Xã" },
    { code: "009", name: "Thạch Đồng", level: "Xã" },
    { code: "010", name: "Thạch Môn", level: "Xã" },
    { code: "011", name: "Thạch Hạ", level: "Xã" },
    { code: "012", name: "Đậu Liêu", level: "Xã" }
  ],
  "44": [
    { code: "001", name: "Phường 1", level: "Phường" },
    { code: "002", name: "Phường 2", level: "Phường" },
    { code: "003", name: "Phường 3", level: "Phường" },
    { code: "004", name: "Phường 4", level: "Phường" },
    { code: "005", name: "Phường 5", level: "Phường" },
    { code: "006", name: "Đông Lương", level: "Phường" },
    { code: "007", name: "Đông Lễ", level: "Phường" },
    { code: "008", name: "Đông Thanh", level: "Phường" },
    { code: "009", name: "Thuận Lộc", level: "Xã" },
    { code: "010", name: "Hải Lệ", level: "Xã" },
    { code: "011", name: "Triệu Ái", level: "Xã" },
    { code: "012", name: "Triệu Long", level: "Xã" }
  ],
  "46": [
    { code: "001", name: "Phú Hội", level: "Phường" },
    { code: "002", name: "Phú Nhuận", level: "Phường" },
    { code: "003", name: "Vĩnh Ninh", level: "Phường" },
    { code: "004", name: "Thuận Lộc", level: "Phường" },
    { code: "005", name: "Thuận Hòa", level: "Phường" },
    { code: "006", name: "Đông Ba", level: "Phường" },
    { code: "007", name: "Gia Hội", level: "Phường" },
    { code: "008", name: "Phong An", level: "Xã" },
    { code: "009", name: "Phong Hiền", level: "Xã" },
    { code: "010", name: "Phong Hòa", level: "Xã" },
    { code: "011", name: "Phong Sơn", level: "Xã" },
    { code: "012", name: "Phong Thu", level: "Xã" },
    { code: "013", name: "Phong Chương", level: "Xã" },
    { code: "014", name: "Phong Mỹ", level: "Xã" },
    { code: "015", name: "Phong Phú", level: "Xã" }
  ],
  "48": [
    { code: "001", name: "Hải Châu", level: "Phường" },
    { code: "002", name: "Thanh Khê", level: "Phường" },
    { code: "003", name: "Sơn Trà", level: "Phường" },
    { code: "004", name: "Ngũ Hành Sơn", level: "Phường" },
    { code: "005", name: "Liên Chiểu", level: "Phường" },
    { code: "006", name: "Cẩm Lệ", level: "Phường" },
    { code: "007", name: "Hòa Cường", level: "Phường" },
    { code: "008", name: "Hòa Thuận", level: "Phường" },
    { code: "009", name: "Khuê Trung", level: "Phường" },
    { code: "010", name: "Khuê Mỹ", level: "Phường" },
    { code: "011", name: "Hòa Khánh Bắc", level: "Phường" },
    { code: "012", name: "Hòa Khánh Nam", level: "Phường" },
    { code: "013", name: "Hòa Minh", level: "Phường" },
    { code: "014", name: "Hòa Phát", level: "Phường" },
    { code: "015", name: "Hòa Thọ", level: "Phường" },
    { code: "016", name: "Nại Hiên Đông", level: "Phường" },
    { code: "017", name: "An Hải Bắc", level: "Phường" },
    { code: "018", name: "Mân Thái", level: "Phường" }
  ],
  "51": [
    { code: "001", name: "Lê Hồng Phong", level: "Phường" },
    { code: "002", name: "Trần Phú", level: "Phường" },
    { code: "003", name: "Quảng Phú", level: "Phường" },
    { code: "004", name: "Nghĩa Chánh", level: "Phường" },
    { code: "005", name: "Trần Hưng Đạo", level: "Phường" },
    { code: "006", name: "Nguyễn Nghiêm", level: "Phường" },
    { code: "007", name: "Chánh Lộ", level: "Phường" },
    { code: "008", name: "Nghĩa Lộ", level: "Phường" },
    { code: "009", name: "Tịnh Ấn Tây", level: "Xã" },
    { code: "010", name: "Tịnh Ấn Đông", level: "Xã" },
    { code: "011", name: "Nghĩa Hà", level: "Xã" },
    { code: "012", name: "Nghĩa Phú", level: "Xã" }
  ],
  "52": [
    { code: "001", name: "Tây Sơn", level: "Phường" },
    { code: "002", name: "An Phú", level: "Phường" },
    { code: "003", name: "Hội Phú", level: "Phường" },
    { code: "004", name: "Hội Thương", level: "Phường" },
    { code: "005", name: "Trà Bá", level: "Phường" },
    { code: "006", name: "Chi Lăng", level: "Phường" },
    { code: "007", name: "Phù Đổng", level: "Phường" },
    { code: "008", name: "Yên Đỗ", level: "Phường" },
    { code: "009", name: "Diên Phú", level: "Xã" },
    { code: "010", name: "An Phú", level: "Xã" },
    { code: "011", name: "Biển Hồ", level: "Xã" },
    { code: "012", name: "Chư Á", level: "Xã" }
  ],
  "56": [
    { code: "001", name: "Vĩnh Hải", level: "Phường" },
    { code: "002", name: "Vĩnh Phước", level: "Phường" },
    { code: "003", name: "Vĩnh Thọ", level: "Phường" },
    { code: "004", name: "Vĩnh Trường", level: "Phường" },
    { code: "005", name: "Lộc Thọ", level: "Phường" },
    { code: "006", name: "Tân Lập", level: "Phường" },
    { code: "007", name: "Vạn Thạnh", level: "Phường" },
    { code: "008", name: "Vĩnh Nguyên", level: "Phường" },
    { code: "009", name: "Vĩnh Lương", level: "Xã" },
    { code: "010", name: "Vĩnh Hiệp", level: "Xã" },
    { code: "011", name: "Vĩnh Ngọc", level: "Xã" },
    { code: "012", name: "Vĩnh Thái", level: "Xã" }
  ],
  "66": [
    { code: "001", name: "Tân An", level: "Phường" },
    { code: "002", name: "Tân Lợi", level: "Phường" },
    { code: "003", name: "Thành Công", level: "Phường" },
    { code: "004", name: "Thắng Lợi", level: "Phường" },
    { code: "005", name: "Tân Tiến", level: "Phường" },
    { code: "006", name: "Thống Nhất", level: "Phường" },
    { code: "007", name: "Tự An", level: "Phường" },
    { code: "008", name: "Tân Hòa", level: "Xã" },
    { code: "009", name: "Hòa Khánh", level: "Xã" },
    { code: "010", name: "Hòa Phú", level: "Xã" },
    { code: "011", name: "Hòa Thắng", level: "Xã" },
    { code: "012", name: "Hòa Thuận", level: "Xã" }
  ],
  "68": [
    { code: "001", name: "Phường 1", level: "Phường" },
    { code: "002", name: "Phường 2", level: "Phường" },
    { code: "003", name: "Phường 3", level: "Phường" },
    { code: "004", name: "Phường 4", level: "Phường" },
    { code: "005", name: "Phường 5", level: "Phường" },
    { code: "006", name: "Phường 6", level: "Phường" },
    { code: "007", name: "Phường 7", level: "Phường" },
    { code: "008", name: "Phường 8", level: "Phường" },
    { code: "009", name: "Phường 9", level: "Phường" },
    { code: "010", name: "Xuân Thọ", level: "Xã" },
    { code: "011", name: "Xuân Trường", level: "Xã" },
    { code: "012", name: "Tà Nung", level: "Xã" }
  ],
  "75": [
    { code: "001", name: "Tam Hòa", level: "Phường" },
    { code: "002", name: "Tam Hiệp", level: "Phường" },
    { code: "003", name: "Quang Vinh", level: "Phường" },
    { code: "004", name: "Quang Trung", level: "Phường" },
    { code: "005", name: "Bình Đa", level: "Phường" },
    { code: "006", name: "Hòa Bình", level: "Phường" },
    { code: "007", name: "Long Bình", level: "Phường" },
    { code: "008", name: "Tân Phong", level: "Phường" },
    { code: "009", name: "An Hòa", level: "Xã" },
    { code: "010", name: "Long Hưng", level: "Xã" },
    { code: "011", name: "Phước Tân", level: "Xã" },
    { code: "012", name: "Tam Phước", level: "Xã" }
  ],
  "79": [
    { code: "001", name: "Bến Nghé", level: "Phường" },
    { code: "002", name: "Bến Thành", level: "Phường" },
    { code: "003", name: "Cầu Kho", level: "Phường" },
    { code: "004", name: "Cô Giang", level: "Phường" },
    { code: "005", name: "Cống Quỳnh", level: "Phường" },
    { code: "006", name: "Đa Kao", level: "Phường" },
    { code: "007", name: "Nguyễn Cư Trinh", level: "Phường" },
    { code: "008", name: "Nguyễn Thái Bình", level: "Phường" },
    { code: "009", name: "Phạm Ngũ Lão", level: "Phường" },
    { code: "010", name: "Tân Định", level: "Phường" },
    { code: "011", name: "An Phú", level: "Phường" },
    { code: "012", name: "Bình An", level: "Phường" },
    { code: "013", name: "Bình Khánh", level: "Phường" },
    { code: "014", name: "Bình Trưng Tây", level: "Phường" },
    { code: "015", name: "Bình Trưng Đông", level: "Phường" },
    { code: "016", name: "Cát Lái", level: "Phường" },
    { code: "017", name: "Hiệp Bình Chánh", level: "Phường" },
    { code: "018", name: "Hiệp Bình Phước", level: "Phường" },
    { code: "019", name: "Linh Chiểu", level: "Phường" },
    { code: "020", name: "Linh Đông", level: "Phường" }
  ],
  "80": [
    { code: "001", name: "Phường 1", level: "Phường" },
    { code: "002", name: "Phường 2", level: "Phường" },
    { code: "003", name: "Phường 3", level: "Phường" },
    { code: "004", name: "Hiệp Ninh", level: "Phường" },
    { code: "005", name: "Ninh Sơn", level: "Phường" },
    { code: "006", name: "Ninh Thạnh", level: "Phường" },
    { code: "007", name: "Tân Bình", level: "Xã" },
    { code: "008", name: "Thạnh Tân", level: "Xã" },
    { code: "009", name: "Bình Minh", level: "Xã" },
    { code: "010", name: "Ninh Sơn", level: "Xã" },
    { code: "011", name: "Tân Phong", level: "Xã" },
    { code: "012", name: "Bàu Năng", level: "Xã" }
  ],
  "82": [
    { code: "001", name: "Phường 1", level: "Phường" },
    { code: "002", name: "Phường 2", level: "Phường" },
    { code: "003", name: "Phường 3", level: "Phường" },
    { code: "004", name: "Phường 4", level: "Phường" },
    { code: "005", name: "Phường 6", level: "Phường" },
    { code: "006", name: "Phường 11", level: "Phường" },
    { code: "007", name: "Mỹ Ngãi", level: "Xã" },
    { code: "008", name: "Mỹ Trà", level: "Xã" },
    { code: "009", name: "Mỹ Tân", level: "Xã" },
    { code: "010", name: "Tân Thuận Tây", level: "Xã" },
    { code: "011", name: "Tân Thuận Đông", level: "Xã" },
    { code: "012", name: "Hòa An", level: "Xã" }
  ],
  "86": [
    { code: "001", name: "Phường 1", level: "Phường" },
    { code: "002", name: "Phường 2", level: "Phường" },
    { code: "003", name: "Phường 3", level: "Phường" },
    { code: "004", name: "Phường 4", level: "Phường" },
    { code: "005", name: "Phường 5", level: "Phường" },
    { code: "006", name: "Tân Hòa", level: "Phường" },
    { code: "007", name: "Tân Hội", level: "Phường" },
    { code: "008", name: "Long Châu", level: "Xã" },
    { code: "009", name: "Long Phước", level: "Xã" },
    { code: "010", name: "Phú Đức", level: "Xã" },
    { code: "011", name: "Tân Phước", level: "Xã" },
    { code: "012", name: "Tân Thành", level: "Xã" }
  ],
  "91": [
    { code: "001", name: "Mỹ Bình", level: "Phường" },
    { code: "002", name: "Mỹ Long", level: "Phường" },
    { code: "003", name: "Mỹ Xuyên", level: "Phường" },
    { code: "004", name: "Bình Khánh", level: "Phường" },
    { code: "005", name: "Đông Xuyên", level: "Phường" },
    { code: "006", name: "Mỹ Phước", level: "Phường" },
    { code: "007", name: "Tân Lộc", level: "Phường" },
    { code: "008", name: "Tân Hòa", level: "Xã" },
    { code: "009", name: "Tân Khánh", level: "Xã" },
    { code: "010", name: "Vĩnh Hiệp", level: "Xã" },
    { code: "011", name: "Vĩnh Hòa", level: "Xã" },
    { code: "012", name: "Vĩnh Nhuận", level: "Xã" }
  ],
  "92": [
    { code: "001", name: "Ninh Kiều", level: "Phường" },
    { code: "002", name: "An Hòa", level: "Phường" },
    { code: "003", name: "An Phú", level: "Phường" },
    { code: "004", name: "Cái Khế", level: "Phường" },
    { code: "005", name: "Hưng Lợi", level: "Phường" },
    { code: "006", name: "Tân An", level: "Phường" },
    { code: "007", name: "Thới Bình", level: "Phường" },
    { code: "008", name: "An Bình", level: "Phường" },
    { code: "009", name: "Long Tuyền", level: "Phường" },
    { code: "010", name: "An Thới", level: "Phường" },
    { code: "011", name: "Trà Nóc", level: "Phường" },
    { code: "012", name: "Thới An", level: "Phường" },
    { code: "013", name: "Phước Thới", level: "Phường" },
    { code: "014", name: "Thuận An", level: "Phường" },
    { code: "015", name: "Thuận Hưng", level: "Phường" },
    { code: "016", name: "Bình Thủy", level: "Phường" },
    { code: "017", name: "Ba Láng", level: "Phường" },
    { code: "018", name: "Thường Thạnh", level: "Phường" }
  ],
  "96": [
    { code: "001", name: "Quang Trung", level: "Phường" },
    { code: "002", name: "Tân Thành", level: "Phường" },
    { code: "003", name: "An Xuyên", level: "Phường" },
    { code: "004", name: "Hòa Tân", level: "Phường" },
    { code: "005", name: "Hòa Thành", level: "Phường" },
    { code: "006", name: "Nguyễn Huân", level: "Phường" },
    { code: "007", name: "Tân Thành", level: "Xã" },
    { code: "008", name: "Lý Văn Lâm", level: "Xã" },
    { code: "009", name: "Hòa Mỹ", level: "Xã" },
    { code: "010", name: "Khánh An", level: "Xã" },
    { code: "011", name: "Khánh Hưng", level: "Xã" },
    { code: "012", name: "Khánh Lâm", level: "Xã" }
  ]
};

const agencies = [
  { id: "BHXH_VN", code: "BHXHVN", name: "Bảo hiểm xã hội Việt Nam", parentId: null, hasChild: true },
  { id: "BHXH_HN", code: "BHXHHN", name: "BHXH Thành phố Hà Nội", parentId: "BHXH_VN", hasChild: true },
  { id: "BHXH_HN_TR", code: "BHXHHN-TR", name: "BHXH Phường Trần Hưng Đạo", parentId: "BHXH_HN", hasChild: false },
  { id: "BHXH_HN_QTR", code: "BHXHHN-QTR", name: "BHXH Phường Quang Trung", parentId: "BHXH_HN", hasChild: false },
  { id: "BHXH_HN_HVB", code: "BHXHHN-HVB", name: "BHXH Phường Hùng Vương", parentId: "BHXH_HN", hasChild: false },
  { id: "BHXH_CB", code: "BHXHCB", name: "BHXH tỉnh Cao Bằng", parentId: "BHXH_VN", hasChild: false },
  { id: "BHXH_TQ", code: "BHXHTQ", name: "BHXH tỉnh Tuyên Quang", parentId: "BHXH_VN", hasChild: false },
  { id: "BHXH_DB", code: "BHXHDB", name: "BHXH tỉnh Điện Biên", parentId: "BHXH_VN", hasChild: false },
  { id: "BHXH_LC", code: "BHXHLC", name: "BHXH tỉnh Lai Châu", parentId: "BHXH_VN", hasChild: false },
  { id: "BHXH_SL", code: "BHXHSL", name: "BHXH tỉnh Sơn La", parentId: "BHXH_VN", hasChild: false },
  { id: "BHXH_LCI", code: "BHXHLCI", name: "BHXH tỉnh Lào Cai", parentId: "BHXH_VN", hasChild: false },
  { id: "BHXH_TN", code: "BHXHTN", name: "BHXH tỉnh Thái Nguyên", parentId: "BHXH_VN", hasChild: false },
  { id: "BHXH_LS", code: "BHXHLS", name: "BHXH tỉnh Lạng Sơn", parentId: "BHXH_VN", hasChild: false },
  { id: "BHXH_QN", code: "BHXHQN", name: "BHXH tỉnh Quảng Ninh", parentId: "BHXH_VN", hasChild: false },
  { id: "BHXH_BN", code: "BHXHBN", name: "BHXH tỉnh Bắc Ninh", parentId: "BHXH_VN", hasChild: false },
  { id: "BHXH_PT", code: "BHXHPT", name: "BHXH tỉnh Phú Thọ", parentId: "BHXH_VN", hasChild: false },
  { id: "BHXH_HP", code: "BHXHHP", name: "BHXH Thành phố Hải Phòng", parentId: "BHXH_VN", hasChild: true },
  { id: "BHXH_HP_HB", code: "BHXHHP-HB", name: "BHXH Phường Hồng Bàng", parentId: "BHXH_HP", hasChild: false },
  { id: "BHXH_HP_NQ", code: "BHXHHP-NQ", name: "BHXH Phường Ngô Quyền", parentId: "BHXH_HP", hasChild: false },
  { id: "BHXH_HP_LC", code: "BHXHHP-LC", name: "BHXH Phường Lê Chân", parentId: "BHXH_HP", hasChild: false },
  { id: "BHXH_HY", code: "BHXHHY", name: "BHXH tỉnh Hưng Yên", parentId: "BHXH_VN", hasChild: false },
  { id: "BHXH_NB", code: "BHXHNB", name: "BHXH tỉnh Ninh Bình", parentId: "BHXH_VN", hasChild: false },
  { id: "BHXH_TH", code: "BHXHTH", name: "BHXH tỉnh Thanh Hóa", parentId: "BHXH_VN", hasChild: false },
  { id: "BHXH_NA", code: "BHXHNA", name: "BHXH tỉnh Nghệ An", parentId: "BHXH_VN", hasChild: false },
  { id: "BHXH_HT", code: "BHXHHT", name: "BHXH tỉnh Hà Tĩnh", parentId: "BHXH_VN", hasChild: false },
  { id: "BHXH_QT", code: "BHXHQT", name: "BHXH tỉnh Quảng Trị", parentId: "BHXH_VN", hasChild: false },
  { id: "BHXH_HUE", code: "BHXHHUE", name: "BHXH Thành phố Huế", parentId: "BHXH_VN", hasChild: true },
  { id: "BHXH_HUE_PH", code: "BHXHHUE-PH", name: "BHXH Phường Phú Hội", parentId: "BHXH_HUE", hasChild: false },
  { id: "BHXH_HUE_KH", code: "BHXHHUE-KH", name: "BHXH Phường Kim Long", parentId: "BHXH_HUE", hasChild: false },
  { id: "BHXH_DN", code: "BHXHDN", name: "BHXH Thành phố Đà Nẵng", parentId: "BHXH_VN", hasChild: true },
  { id: "BHXH_DN_HC", code: "BHXHDN-HC", name: "BHXH Phường Hải Châu", parentId: "BHXH_DN", hasChild: false },
  { id: "BHXH_DN_TK", code: "BHXHDN-TK", name: "BHXH Phường Thanh Khê", parentId: "BHXH_DN", hasChild: false },
  { id: "BHXH_DN_ST", code: "BHXHDN-ST", name: "BHXH Phường Sơn Trà", parentId: "BHXH_DN", hasChild: false },
  { id: "BHXH_QNG", code: "BHXHQNG", name: "BHXH tỉnh Quảng Ngãi", parentId: "BHXH_VN", hasChild: false },
  { id: "BHXH_GL", code: "BHXHGL", name: "BHXH tỉnh Gia Lai", parentId: "BHXH_VN", hasChild: false },
  { id: "BHXH_KH", code: "BHXHKH", name: "BHXH tỉnh Khánh Hòa", parentId: "BHXH_VN", hasChild: false },
  { id: "BHXH_DL", code: "BHXHDL", name: "BHXH tỉnh Đắk Lắk", parentId: "BHXH_VN", hasChild: false },
  { id: "BHXH_LD", code: "BHXHLD", name: "BHXH tỉnh Lâm Đồng", parentId: "BHXH_VN", hasChild: false },
  { id: "BHXH_DNAI", code: "BHXHDNAI", name: "BHXH tỉnh Đồng Nai", parentId: "BHXH_VN", hasChild: false },
  { id: "BHXH_HCM", code: "BHXHHCM", name: "BHXH Thành phố Hồ Chí Minh", parentId: "BHXH_VN", hasChild: true },
  { id: "BHXH_HCM_Q1", code: "BHXHHCM-Q1", name: "BHXH Phường Bến Nghé", parentId: "BHXH_HCM", hasChild: false },
  { id: "BHXH_HCM_Q7", code: "BHXHHCM-Q7", name: "BHXH Phường Tân Phong", parentId: "BHXH_HCM", hasChild: false },
  { id: "BHXH_HCM_TD", code: "BHXHHCM-TD", name: "BHXH Phường Thủ Đức", parentId: "BHXH_HCM", hasChild: false },
  { id: "BHXH_TNINH", code: "BHXHTNINH", name: "BHXH tỉnh Tây Ninh", parentId: "BHXH_VN", hasChild: false },
  { id: "BHXH_DT", code: "BHXHDT", name: "BHXH tỉnh Đồng Tháp", parentId: "BHXH_VN", hasChild: false },
  { id: "BHXH_VL", code: "BHXHVL", name: "BHXH tỉnh Vĩnh Long", parentId: "BHXH_VN", hasChild: false },
  { id: "BHXH_AG", code: "BHXHAG", name: "BHXH tỉnh An Giang", parentId: "BHXH_VN", hasChild: false },
  { id: "BHXH_CT", code: "BHXHCT", name: "BHXH Thành phố Cần Thơ", parentId: "BHXH_VN", hasChild: true },
  { id: "BHXH_CT_NK", code: "BHXHCT-NK", name: "BHXH Phường Ninh Kiều", parentId: "BHXH_CT", hasChild: false },
  { id: "BHXH_CT_BT", code: "BHXHCT-BT", name: "BHXH Phường Bình Thủy", parentId: "BHXH_CT", hasChild: false },
  { id: "BHXH_CT_OT", code: "BHXHCT-OT", name: "BHXH Phường Ô Môn", parentId: "BHXH_CT", hasChild: false },
  { id: "BHXH_CM", code: "BHXHCM", name: "BHXH tỉnh Cà Mau", parentId: "BHXH_VN", hasChild: false },
];

// ===== REFERENCE DATA API =====
app.get("/api/Provinces", (_req, res) => {
  res.json(provinces);
});

app.get("/api/Wards", (req, res) => {
  const provinceCode = req.query.provinceCode as string;
  if (!provinceCode || !wardsByProvince[provinceCode]) {
    return res.json([]);
  }
  res.json(wardsByProvince[provinceCode]);
});

app.get("/api/Agencies", (req, res) => {
  const parentId = req.query.parentId as string | undefined;
  if (parentId === undefined || parentId === null) {
    res.json(agencies.filter((a) => a.parentId === null));
  } else {
    res.json(agencies.filter((a) => a.parentId === parentId));
  }
});

app.get("/api/Agencies/tree", (_req, res) => {
  res.json(agencies);
});

// ===== REGISTER API =====
app.post("/api/register", async (req, res) => {
  try {
    const body = req.body;
    const result = await query(
      `INSERT INTO users (full_name, bhxh_code, cccd, phone, email, account_type, status,
        province, ward, street, gender, ethnicity, birth_date, payment_method,
        bank_name, bank_account_name, bank_account_number, registration_location, receiving_agency)
      VALUES ($1, $2, $3, $4, $5, $6, 'pending',
        $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING id`,
      [
        body.FullName || "", body.BhxhCode || "", body.IdNumber || "",
        body.Phone || "", body.Email || "", body.AccountType || "individual",
        body.Province || "", body.Ward || "", body.Street || "",
        body.Gender || "", body.Ethnicity || "", body.BirthDate || "",
        body.PaymentMethod || "transfer", body.BankName || "",
        body.BankAccountName || "", body.BankAccountNumber || "",
        body.RegistrationLocation || "portal", body.ReceivingAgency || "",
      ]
    );
    res.json({
      success: true,
      user: { id: result.rows[0].id, ...body },
      message: "Đăng ký thành công! Hồ sơ của bạn đang chờ xét duyệt.",
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, error: "Lỗi máy chủ!" });
  }
});

// ===== ADMIN AUTH =====
const ADMIN_USER = "admin";
const ADMIN_PASS = "REDACTED";

app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = "tok_" + Math.random().toString(36).substring(2) + Date.now().toString(36);
    await query("INSERT INTO admin_tokens (token) VALUES ($1)", [token]);
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, error: "Sai tên đăng nhập hoặc mật khẩu!" });
  }
});

app.post("/api/admin/logout", async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (token) {
    await query("DELETE FROM admin_tokens WHERE token = $1", [token]);
  }
  res.json({ success: true });
});

app.get("/api/admin/check", async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.json({ authenticated: false });
  const result = await query("SELECT id FROM admin_tokens WHERE token = $1", [token]);
  res.json({ authenticated: result.rows.length > 0 });
});

async function adminAuth(req: any, res: any, next: any) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ authenticated: false, error: "Unauthorized" });
  const result = await query("SELECT id FROM admin_tokens WHERE token = $1", [token]);
  if (result.rows.length === 0) {
    return res.status(401).json({ authenticated: false, error: "Unauthorized" });
  }
  next();
}

// ===== PROTECT ADMIN ROUTES =====
app.use(["/api/admin/users", "/api/admin/stats", "/api/admin/dashboard", "/api/appointments"], adminAuth);

// ===== ADMIN API =====
app.get("/api/admin/users", async (_req, res) => {
  try {
    const result = await query(
      `SELECT id, full_name, bhxh_code, cccd, phone, email, account_type, status,
        registered_at, province, ward, street, gender, ethnicity, birth_date,
        payment_method, bank_name, bank_account_name, bank_account_number,
        registration_location, receiving_agency, photo_url, cccd_front_url, cccd_back_url
      FROM users ORDER BY id`
    );
    const users = result.rows.map((r: any) => ({
      id: r.id,
      fullName: r.full_name,
      bhxhCode: r.bhxh_code,
      cccd: r.cccd,
      phone: r.phone,
      email: r.email,
      accountType: r.account_type,
      status: r.status,
      registeredAt: r.registered_at ? new Date(r.registered_at).toISOString().replace("T", " ").substring(0, 19) : "",
      province: r.province,
      ward: r.ward,
      street: r.street,
      gender: r.gender,
      ethnicity: r.ethnicity,
      birthDate: r.birth_date,
      paymentMethod: r.payment_method,
      bankName: r.bank_name,
      bankAccountName: r.bank_account_name,
      bankAccountNumber: r.bank_account_number,
      registrationLocation: r.registration_location,
      receivingAgency: r.receiving_agency,
      photoUrl: r.photo_url,
      cccdFrontUrl: r.cccd_front_url,
      cccdBackUrl: r.cccd_back_url,
    }));
    res.json(users);
  } catch (err) {
    console.error("Users error:", err);
    res.status(500).json([]);
  }
});

app.get("/api/admin/users/:id", async (req, res) => {
  try {
    const result = await query("SELECT * FROM users WHERE id = $1", [parseInt(req.params.id)]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/admin/users/:id/status", async (req, res) => {
  try {
    const result = await query(
      "UPDATE users SET status = $1 WHERE id = $2 RETURNING *",
      [req.body.status, parseInt(req.params.id)]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/admin/stats", async (_req, res) => {
  try {
    const total = await query("SELECT COUNT(*) as c FROM users");
    const approved = await query("SELECT COUNT(*) as c FROM users WHERE status = 'approved'");
    const pending = await query("SELECT COUNT(*) as c FROM users WHERE status = 'pending'");
    const rejected = await query("SELECT COUNT(*) as c FROM users WHERE status = 'rejected'");
    const individual = await query("SELECT COUNT(*) as c FROM users WHERE account_type = 'individual'");
    const org = await query("SELECT COUNT(*) as c FROM users WHERE account_type = 'organization'");
    res.json({
      total: parseInt(total.rows[0].c),
      approved: parseInt(approved.rows[0].c),
      pending: parseInt(pending.rows[0].c),
      rejected: parseInt(rejected.rows[0].c),
      individual: parseInt(individual.rows[0].c),
      org: parseInt(org.rows[0].c),
    });
  } catch (err) {
    res.status(500).json({ total: 0, approved: 0, pending: 0, rejected: 0, individual: 0, org: 0 });
  }
});

app.get("/api/admin/dashboard", async (_req, res) => {
  try {
    const totalUsers = await query("SELECT COUNT(*) as c FROM users");
    const activeUsers = await query("SELECT COUNT(*) as c FROM users WHERE status IN ('approved', 'pending')");
    const pendingApprovals = await query("SELECT COUNT(*) as c FROM users WHERE status = 'pending'");
    const todayReg = await query("SELECT COUNT(*) as c FROM users WHERE registered_at != '' AND registered_at::timestamp::date = CURRENT_DATE");

    const monthData = await query(
      `SELECT TO_CHAR(registered_at::timestamp, 'YYYY-MM') as month, COUNT(*) as count
      FROM users WHERE registered_at != '' AND registered_at IS NOT NULL
      GROUP BY month ORDER BY month LIMIT 6`
    );

    const labels = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];
    const registrationsByMonth = monthData.rows.map((r: any) => ({
      month: labels[parseInt(r.month.split("-")[1]) - 1] || r.month,
      count: parseInt(r.count),
    }));

    const recentUsers = await query(
      `SELECT full_name, status, registered_at FROM users
      ORDER BY registered_at DESC NULLS LAST LIMIT 7`
    );

    const recentActivity = recentUsers.rows.map((r: any) => {
      let time = "--:--";
      if (r.registered_at && r.registered_at !== "") {
        try {
          const ts = r.registered_at.endsWith("Z") ? r.registered_at : r.registered_at.replace(" ", "T");
          const d = new Date(ts);
          if (!isNaN(d.getTime())) {
            time = d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
          }
        } catch (_) {}
      }
      let type = "info";
      const name = r.full_name || "Người dùng";
      if (r.status === "approved") type = "success";
      else if (r.status === "pending") type = "warning";
      else if (r.status === "rejected") type = "error";
      const text = r.status === "approved" ? `${name} đăng ký tài khoản thành công`
        : r.status === "pending" ? `${name} cần xác thực hồ sơ`
        : r.status === "rejected" ? `${name} bị từ chối hồ sơ`
        : `${name} gửi hồ sơ đăng ký`;
      return { time, text, type };
    });

    res.json({
      stats: {
        totalUsers: parseInt(totalUsers.rows[0].c),
        activeUsers: parseInt(activeUsers.rows[0].c),
        pendingApprovals: parseInt(pendingApprovals.rows[0].c),
        todayRegistrations: parseInt(todayReg.rows[0].c),
        totalSubmissions: parseInt(totalUsers.rows[0].c) * 100 + 5000,
        processedSubmissions: parseInt(activeUsers.rows[0].c) * 100 + 3000,
      },
      recentActivity,
      registrationsByMonth,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.json({
      stats: { totalUsers: 0, activeUsers: 0, pendingApprovals: 0, todayRegistrations: 0, totalSubmissions: 0, processedSubmissions: 0 },
      recentActivity: [],
      registrationsByMonth: [],
    });
  }
});

// ===== APPOINTMENTS API =====
app.get("/api/appointments", async (_req, res) => {
  try {
    const result = await query("SELECT * FROM appointments ORDER BY id");
    const appointments = result.rows.map((r: any) => ({
      id: r.id,
      fullName: r.full_name,
      phone: r.phone,
      email: r.email,
      bhxhCode: r.bhxh_code,
      date: r.date,
      timeSlot: r.time_slot,
      service: r.service,
      note: r.note,
      status: r.status,
      createdAt: r.created_at ? new Date(r.created_at).toISOString().replace("T", " ").substring(0, 19) : "",
    }));
    const pending = appointments.filter((a: any) => a.status === "pending").length;
    const confirmed = appointments.filter((a: any) => a.status === "confirmed").length;
    const cancelled = appointments.filter((a: any) => a.status === "cancelled").length;
    res.json({ appointments, stats: { total: appointments.length, pending, confirmed, cancelled } });
  } catch (err) {
    res.status(500).json({ appointments: [], stats: { total: 0, pending: 0, confirmed: 0, cancelled: 0 } });
  }
});

app.post("/api/appointments", async (req, res) => {
  try {
    const body = req.body;
    const result = await query(
      `INSERT INTO appointments (full_name, phone, email, bhxh_code, date, time_slot, service, note)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [body.fullName || "", body.phone || "", body.email || "", body.bhxhCode || "",
        body.date || "", body.timeSlot || "", body.service || "", body.note || ""]
    );
    res.json({ success: true, appointment: { id: result.rows[0].id, ...body }, message: "Yêu cầu đặt lịch đã được ghi nhận!" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Lỗi máy chủ!" });
  }
});

app.put("/api/appointments/:id/status", async (req, res) => {
  try {
    const result = await query(
      "UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *",
      [req.body.status, parseInt(req.params.id)]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json({ success: true, appointment: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ===== CHAT API =====
app.get("/api/chat/conversations", adminAuth, async (_req, res) => {
  try {
    const convResult = await query("SELECT * FROM chat_conversations ORDER BY id");
    const conversations = [];
    for (const conv of convResult.rows) {
      const msgResult = await query(
        "SELECT id, sender, text, type, file_url, file_name, time FROM chat_messages WHERE conversation_id = $1 ORDER BY id",
        [conv.id]
      );
      conversations.push({
        id: conv.id,
        userName: conv.user_name,
        idCard: conv.id_card,
        phone: conv.phone,
        status: conv.status,
        unread: conv.unread,
        createdAt: conv.created_at ? new Date(conv.created_at).toISOString().replace("T", " ").substring(0, 19) : "",
        messages: msgResult.rows.map((m: any) => ({ id: m.id, from: m.sender, text: m.text, type: m.type, fileUrl: m.file_url, fileName: m.file_name, time: m.time })),
      });
    }
    res.json(conversations);
  } catch (err) {
    res.status(500).json([]);
  }
});

app.post("/api/chat/messages", async (req, res) => {
  try {
    const { userName, idCard, phone, text } = req.body;
    if (!text) return res.status(400).json({ error: "Nội dung tin nhắn không được để trống" });

    let convResult = await query(
      "SELECT * FROM chat_conversations WHERE id_card = $1 AND status = 'active' ORDER BY id LIMIT 1",
      [idCard || ""]
    );

    let conv: any;
    if (convResult.rows.length === 0) {
      const newConv = await query(
        `INSERT INTO chat_conversations (user_name, id_card, phone, status, unread)
        VALUES ($1, $2, $3, 'active', 0) RETURNING *`,
        [userName || "Khách", idCard || "", phone || ""]
      );
      conv = newConv.rows[0];
    } else {
      conv = convResult.rows[0];
      if (phone) await query("UPDATE chat_conversations SET phone = $1 WHERE id = $2", [phone, conv.id]);
    }

    const now = new Date();
    const time = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
    await query(
      "INSERT INTO chat_messages (conversation_id, sender, text, time) VALUES ($1, 'user', $2, $3)",
      [conv.id, text, time]
    );
    await query("UPDATE chat_conversations SET unread = unread + 1 WHERE id = $1", [conv.id]);

    const msgResult = await query(
      "SELECT id, sender, text, type, file_url, file_name, time FROM chat_messages WHERE conversation_id = $1 ORDER BY id",
      [conv.id]
    );

    res.json({
      success: true,
      conversation: {
        id: conv.id,
        userName: conv.user_name,
        idCard: conv.id_card,
        phone: conv.phone,
        status: conv.status,
        unread: conv.unread,
        createdAt: conv.created_at
          ? (typeof conv.created_at === 'object'
            ? new Date(conv.created_at).toISOString().replace("T", " ").substring(0, 19)
            : String(conv.created_at).substring(0, 19))
          : "",
        messages: msgResult.rows.map((m: any) => ({ id: m.id, from: m.sender, text: m.text, type: m.type, fileUrl: m.file_url, fileName: m.file_name, time: m.time })),
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Lỗi máy chủ!" });
  }
});

// Upload file (image/video/doc) into chat
app.post("/api/chat/upload", upload.single("file"), async (req, res) => {
  try {
    const { userName, idCard, phone, conversationId, sender } = req.body;
    if (!req.file) return res.status(400).json({ error: "Chưa có tệp được gửi" });

    const ext = path.extname(req.file.originalname).toLowerCase();
    let type = "file";
    if (/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(ext)) type = "image";
    else if (/\.(mp4|webm|mov|avi|mkv)$/i.test(ext)) type = "video";

    const fileUrl = "/uploads/chat/" + req.file.filename;
    const msgSender = sender === "admin" ? "admin" : "user";

    let conv: any;
    if (conversationId) {
      const convResult = await query("SELECT * FROM chat_conversations WHERE id = $1", [parseInt(conversationId)]);
      if (convResult.rows.length === 0) return res.status(404).json({ error: "Không tìm thấy hội thoại" });
      conv = convResult.rows[0];
      if (phone) await query("UPDATE chat_conversations SET phone = $1 WHERE id = $2", [phone, conv.id]);
    } else {
      const convResult = await query(
        "SELECT * FROM chat_conversations WHERE id_card = $1 AND status = 'active' ORDER BY id LIMIT 1",
        [idCard || ""]
      );
      if (convResult.rows.length === 0) {
        const newConv = await query(
          `INSERT INTO chat_conversations (user_name, id_card, phone, status, unread)
           VALUES ($1, $2, $3, 'active', 0) RETURNING *`,
          [userName || "Khách", idCard || "", phone || ""]
        );
        conv = newConv.rows[0];
      } else {
        conv = convResult.rows[0];
        if (phone) await query("UPDATE chat_conversations SET phone = $1 WHERE id = $2", [phone, conv.id]);
      }
    }

    const now = new Date();
    const time = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
    await query(
      "INSERT INTO chat_messages (conversation_id, sender, text, type, file_url, file_name, time) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [conv.id, msgSender, "", type, fileUrl, req.file.originalname, time]
    );
    // unread only increases for messages from the user side
    if (msgSender === "user") {
      await query("UPDATE chat_conversations SET unread = unread + 1 WHERE id = $1", [conv.id]);
    } else {
      await query("UPDATE chat_conversations SET unread = 0 WHERE id = $1", [conv.id]);
    }

    const msgResult = await query(
      "SELECT id, sender, text, type, file_url, file_name, time FROM chat_messages WHERE conversation_id = $1 ORDER BY id",
      [conv.id]
    );
    res.json({
      success: true,
      conversation: {
        id: conv.id,
        userName: conv.user_name,
        idCard: conv.id_card,
        phone: conv.phone,
        status: conv.status,
        unread: conv.unread,
        createdAt: conv.created_at
          ? (typeof conv.created_at === 'object'
            ? new Date(conv.created_at).toISOString().replace("T", " ").substring(0, 19)
            : String(conv.created_at).substring(0, 19))
          : "",
        messages: msgResult.rows.map((m: any) => ({ id: m.id, from: m.sender, text: m.text, type: m.type, fileUrl: m.file_url, fileName: m.file_name, time: m.time })),
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Lỗi tải tệp lên!" });
  }
});

// User polls their own conversation by idCard
app.get("/api/chat/conversation/by-card/:cardId", async (req, res) => {
  try {
    const convResult = await query(
      "SELECT * FROM chat_conversations WHERE id_card = $1 AND status = 'active' ORDER BY id DESC LIMIT 1",
      [req.params.cardId]
    );
    if (convResult.rows.length === 0) {
      return res.json({ conversation: null });
    }
    const conv = convResult.rows[0];
    const msgResult = await query(
      "SELECT id, sender, text, type, file_url, file_name, time FROM chat_messages WHERE conversation_id = $1 ORDER BY id",
      [conv.id]
    );
    res.json({
      conversation: {
        id: conv.id,
        userName: conv.user_name,
        idCard: conv.id_card,
        phone: conv.phone,
        status: conv.status,
        unread: conv.unread,
        messages: msgResult.rows.map((m: any) => ({ id: m.id, from: m.sender, text: m.text, type: m.type, fileUrl: m.file_url, fileName: m.file_name, time: m.time })),
      },
    });
  } catch (err) {
    res.status(500).json({ conversation: null });
  }
});

app.post("/api/chat/admin/reply", adminAuth, async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    const conv = await query("SELECT id FROM chat_conversations WHERE id = $1", [conversationId]);
    if (conv.rows.length === 0) return res.status(404).json({ error: "Không tìm thấy hội thoại" });

    const now = new Date();
    const time = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
    await query(
      "INSERT INTO chat_messages (conversation_id, sender, text, time) VALUES ($1, 'admin', $2, $3)",
      [conversationId, text, time]
    );
    await query("UPDATE chat_conversations SET unread = 0 WHERE id = $1", [conversationId]);
    const msgResult = await query(
      "SELECT id, sender, text, type, file_url, file_name, time FROM chat_messages WHERE conversation_id = $1 ORDER BY id",
      [conversationId]
    );
    res.json({
      success: true,
      messages: msgResult.rows.map((m: any) => ({ id: m.id, from: m.sender, text: m.text, type: m.type, fileUrl: m.file_url, fileName: m.file_name, time: m.time })),
    });
  } catch (err) {
    res.status(500).json({ error: "Lỗi máy chủ!" });
  }
});

app.put("/api/chat/conversations/:id/status", adminAuth, async (req, res) => {
  try {
    await query("UPDATE chat_conversations SET status = $1 WHERE id = $2",
      [req.body.status || "closed", parseInt(req.params.id)]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Xoá tất cả hội thoại chat
app.delete("/api/chat/conversations", adminAuth, async (_req, res) => {
  try {
    await query("DELETE FROM chat_conversations");
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Lỗi xoá hội thoại!" });
  }
});

// ===== QR CODE API =====
import QRCode from "qrcode";

app.get("/api/lookup/:code", async (req, res) => {
  try {
    const code = (req.params.code || "").trim();
    if (!code) return res.status(400).json({ error: "Thiếu mã số BHXH" });
    const result = await query(
      `SELECT full_name, bhxh_code, cccd, phone, email, account_type, status,
        province, ward, street, gender, ethnicity, birth_date, registration_location
       FROM users WHERE bhxh_code = $1 LIMIT 1`,
      [code]
    );
    if (result.rows.length === 0) {
      return res.json({ found: false });
    }
    const r = result.rows[0];
    const statusMap: Record<string, string> = {
      approved: "Đã duyệt",
      pending: "Đang chờ xét duyệt",
      rejected: "Đã từ chối",
    };
    res.json({
      found: true,
      user: {
        fullName: r.full_name,
        bhxhCode: r.bhxh_code,
        cccd: r.cccd,
        phone: r.phone,
        email: r.email,
        accountType: r.account_type === "organization" ? "Tổ chức" : "Cá nhân",
        status: statusMap[r.status] || r.status,
        province: r.province,
        ward: r.ward,
        street: r.street,
        gender: r.gender,
        ethnicity: r.ethnicity,
        birthDate: r.birth_date,
        registrationLocation: r.registration_location,
      },
    });
  } catch (err) {
    console.error("Lookup error:", err);
    res.status(500).json({ error: "Lỗi máy chủ!" });
  }
});

const qrCache = new Map<string, { payload: string; url: string }>();
const QR_CACHE_TTL = 60 * 60 * 1000;

app.get("/api/qr", async (req, res) => {
  try {
    const code = (req.query.code as string) || "";
    const type = (req.query.type as string) || "text";
    const format = (req.query.format as string) || "json";
    const size = Math.min(Number(req.query.size) || 320, 2048);
    const margin = Math.min(Number(req.query.margin) || 2, 20);
    const ecLevel = (req.query.errorCorrection || "M") as "L" | "M" | "Q" | "H";
    const darkColor = (req.query.dark || "#000000") as string;
    const lightColor = (req.query.light || "#ffffff") as string;
    const noCache = req.query.nocache === "1";

    const validEcLevels = ["L", "M", "Q", "H"];
    if (!validEcLevels.includes(ecLevel)) {
      return res.status(400).json({ error: "errorCorrection phải là L, M, Q hoặc H" });
    }

    if (!code && type !== "vietqr") {
      return res.status(400).json({ error: "Thiếu mã để tạo QR" });
    }

    let payload = code;
    let fileNameBase = (code || "x").replace(/[^A-Za-z0-9_-]/g, "");

    if (type === "url") {
      const base = process.env.PUBLIC_BASE_URL
        || `${req.protocol}://${req.get("host")}`;
      payload = `${base}/tra-cuu?ma=${encodeURIComponent(code)}`;
    } else if (type === "lookup") {
      payload = `bhxh:${code}`;
    } else if (type === "vietqr") {
      const bin = (req.query.bin as string) || "";
      const account = (req.query.account as string) || "";
      const holder = (req.query.holder as string) || "";
      const amount = (req.query.amount as string) || "";
      const content = (req.query.content as string) || "";
      if (!bin || !account) {
        return res.status(400).json({ error: "Thiếu mã ngân hàng hoặc số tài khoản" });
      }
      if (amount && isNaN(Number(amount))) {
        return res.status(400).json({ error: "Số tiền phải là số hợp lệ" });
      }
      const emv = (id: string, value: string) => {
        if (!value) return "";
        const len = value.length.toString();
        return id + (len.length === 1 ? "0" + len : len) + value;
      };
      const merchant = emv("00", bin) + emv("01", account);
      const field26 = emv("26", merchant);
      const field52 = emv("52", "0000");
      const field53 = emv("53", "704");
      const field54 = amount ? emv("54", Number(amount).toFixed(0)) : "";
      const field62 = emv("62", emv("08", content));
      const qrBody = emv("00", "01") + emv("01", "12") + field26 + field52 + field53 + field54 + "5802VN" + field62;
      const crcInput = qrBody + "6304";
      const bytes = Buffer.from(crcInput, "utf8");
      let crc = 0xffff;
      for (let i = 0; i < bytes.length; i++) {
        crc ^= bytes[i] << 8;
        for (let j = 0; j < 8; j++) {
          if (crc & 0x8000) crc = (crc << 1) ^ 0x1021;
          else crc = crc << 1;
          crc &= 0xffff;
        }
      }
      payload = qrBody + "63" + "04" + crc.toString(16).toUpperCase().padStart(4, "0");
      fileNameBase = `vietqr_${bin}_${account}`;
    }

    const cacheKey = `${type}:${payload}:${size}:${margin}:${ecLevel}:${darkColor}:${lightColor}`;
    if (!noCache && qrCache.has(cacheKey)) {
      const cached = qrCache.get(cacheKey)!;
      res.json({ success: true, cached: true, payload: cached.payload, url: cached.url });
      return;
    }

    const safe = fileNameBase.replace(/[^A-Za-z0-9_-]/g, "");
    const fileName = `qr_${safe}_${Date.now()}.png`;
    const qrDir = path.join(publicPath, "qr");
    fs.mkdirSync(qrDir, { recursive: true });
    const filePath = path.join(qrDir, fileName);
    const fileUrl = `/qr/${fileName}`;

    await QRCode.toFile(filePath, payload, {
      errorCorrectionLevel: ecLevel,
      margin,
      width: size,
      color: { dark: darkColor, light: lightColor },
    });

    qrCache.set(cacheKey, { payload, url: fileUrl });
    if (qrCache.size > 500) {
      const firstKey = qrCache.keys().next().value!;
      qrCache.delete(firstKey);
    }

    if (format === "base64") {
      const base64 = fs.readFileSync(filePath, "base64");
      res.json({ success: true, payload, image: `data:image/png;base64,${base64}`, url: fileUrl });
      return;
    }

    res.json({ success: true, payload, url: fileUrl });
  } catch (err) {
    console.error("QR error:", err);
    res.status(500).json({ error: "Lỗi tạo mã QR!" });
  }
});

// ===== PAGE ROUTES =====
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(publicPath, "admin.html"));
});

app.get("/tra-cuu", (req, res) => {
  res.sendFile(path.join(publicPath, "tracuu.html"));
});

// ===== START =====
initializeDatabase()
  .then(() => {
    app.listen(Number(port), host, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Database initialization failed:", err);
    process.exit(1);
  });
