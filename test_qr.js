const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

function verifyVietQrCrc(payload) {
  if (!payload.startsWith("000201")) return null;
  const body = payload.slice(0, -8);          // bỏ "6304" + CRC
  const expected = payload.slice(-4).toUpperCase();
  const crcInput = body + "6304";
  const bytes = Buffer.from(crcInput, "utf8");
  let crc = 0xffff;
  for (let i = 0; i < bytes.length; i++) {
    crc ^= bytes[i] << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
      crc &= 0xffff;
    }
  }
  const actual = crc.toString(16).toUpperCase().padStart(4, "0");
  return { expected, actual, valid: expected === actual };
}

function detectType(data) {
  if (!data) return { type: "unknown", label: "Không decode được" };
  if (data.startsWith("bhxh:")) return { type: "lookup", label: "QR tra cứu (lookup)" };
  if (data.startsWith("000201") || /^\d{4}01\d{2}01/.test(data)) return { type: "vietqr", label: "VietQR (EMV Napas)" };
  if (/^https?:\/\//.test(data)) return { type: "url", label: "QR đường dẫn (url)" };
  return { type: "text", label: "QR văn bản (text)" };
}

(async () => {
  const file = process.argv[2] || path.join(__dirname, "public", "qr", "qr_0123456789.png");
  if (!fs.existsSync(file)) {
    console.log("FAIL: không tìm thấy file", file);
    process.exit(1);
  }

  const png = PNG.sync.read(fs.readFileSync(file));
  const jsQR = (await import("./node_modules/jsqr/dist/jsQR.js")).default;
  const code = jsQR(Uint8ClampedArray.from(png.data), png.width, png.height);

  if (!code) {
    console.log("FAIL: không decode được QR");
    process.exit(1);
  }

  const info = detectType(code.data);
  console.log("FILE       ->", path.basename(file));
  console.log("DECODE OK  ->", code.data);
  console.log("LOẠI QR    ->", info.label);

  if (info.type === "vietqr") {
    const v = verifyVietQrCrc(code.data);
    if (v) {
      console.log("CRC        -> kỳ vọng", v.expected, "| thực tế", v.actual, v.valid ? "(HỢP LỆ)" : "(SAI)");
      if (!v.valid) { console.log("KẾT QUẢ  -> KHÔNG HỢP LỆ"); process.exit(1); }
    }
  }
  console.log("KẾT QUẢ    ->", "HỢP LỆ");
})();
