import { Pool } from "pg";

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:REDACTED@ep-jolly-shape-ao9zjo2o-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

export async function initializeDatabase() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL DEFAULT '',
      bhxh_code VARCHAR(20) NOT NULL DEFAULT '',
      cccd VARCHAR(20) NOT NULL DEFAULT '',
      phone VARCHAR(20) NOT NULL DEFAULT '',
      email VARCHAR(255) NOT NULL DEFAULT '',
      account_type VARCHAR(20) NOT NULL DEFAULT 'individual',
      status VARCHAR(20) NOT NULL DEFAULT 'pending',
      registered_at TIMESTAMP DEFAULT NOW(),
      province VARCHAR(100) NOT NULL DEFAULT '',
      ward VARCHAR(100) NOT NULL DEFAULT '',
      street VARCHAR(255) NOT NULL DEFAULT '',
      gender VARCHAR(10) NOT NULL DEFAULT '',
      ethnicity VARCHAR(50) NOT NULL DEFAULT '',
      birth_date VARCHAR(20) NOT NULL DEFAULT '',
      payment_method VARCHAR(50) NOT NULL DEFAULT 'transfer',
      bank_name VARCHAR(255) NOT NULL DEFAULT '',
      bank_account_name VARCHAR(255) NOT NULL DEFAULT '',
      bank_account_number VARCHAR(50) NOT NULL DEFAULT '',
      registration_location VARCHAR(50) NOT NULL DEFAULT 'portal',
      receiving_agency VARCHAR(50) NOT NULL DEFAULT '',
      photo_url TEXT NOT NULL DEFAULT '',
      cccd_front_url TEXT NOT NULL DEFAULT '',
      cccd_back_url TEXT NOT NULL DEFAULT ''
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS appointments (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL DEFAULT '',
      phone VARCHAR(20) NOT NULL DEFAULT '',
      email VARCHAR(255) NOT NULL DEFAULT '',
      bhxh_code VARCHAR(20) NOT NULL DEFAULT '',
      date VARCHAR(20) NOT NULL DEFAULT '',
      time_slot VARCHAR(50) NOT NULL DEFAULT '',
      service VARCHAR(50) NOT NULL DEFAULT '',
      note TEXT NOT NULL DEFAULT '',
      status VARCHAR(20) NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS chat_conversations (
      id SERIAL PRIMARY KEY,
      user_name VARCHAR(255) NOT NULL DEFAULT '',
      id_card VARCHAR(20) NOT NULL DEFAULT '',
      phone VARCHAR(20) NOT NULL DEFAULT '',
      status VARCHAR(20) NOT NULL DEFAULT 'active',
      unread INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id SERIAL PRIMARY KEY,
      conversation_id INTEGER NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
      sender VARCHAR(20) NOT NULL DEFAULT 'user',
      text TEXT NOT NULL DEFAULT '',
      type VARCHAR(20) NOT NULL DEFAULT 'text',
      file_url TEXT NOT NULL DEFAULT '',
      file_name VARCHAR(255) NOT NULL DEFAULT '',
      time VARCHAR(10) NOT NULL DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS admin_tokens (
      id SERIAL PRIMARY KEY,
      token VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // Migration: add missing columns if they don't exist
  const missingCols = [
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS photo_url TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS cccd_front_url TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS cccd_back_url TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS street VARCHAR(255) NOT NULL DEFAULT ''",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(10) NOT NULL DEFAULT ''",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS ethnicity VARCHAR(50) NOT NULL DEFAULT ''",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS birth_date VARCHAR(20) NOT NULL DEFAULT ''",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) NOT NULL DEFAULT 'transfer'",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS bank_name VARCHAR(255) NOT NULL DEFAULT ''",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS bank_account_name VARCHAR(255) NOT NULL DEFAULT ''",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS bank_account_number VARCHAR(50) NOT NULL DEFAULT ''",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS registration_location VARCHAR(50) NOT NULL DEFAULT 'portal'",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS receiving_agency VARCHAR(50) NOT NULL DEFAULT ''",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255) NOT NULL DEFAULT ''",
  ];
  for (const sql of missingCols) {
    try { await query(sql); } catch (_) { /* column may already exist */ }
  }

  // Fix registered_at column: set default and fix empty values
  try {
    await query(`UPDATE users SET registered_at = NOW() WHERE registered_at IS NULL OR registered_at = ''`);
  } catch (_) {}
  try {
    await query(`ALTER TABLE users ALTER COLUMN registered_at SET DEFAULT NOW()`);
  } catch (_) {}
  try {
    await query(`ALTER TABLE users ALTER COLUMN created_at SET DEFAULT NOW()`);
  } catch (_) {}

  const userCount = await query("SELECT COUNT(*) as count FROM users");
  if (parseInt(userCount.rows[0].count) === 0) {
    await seedData();
  }
}

async function seedData() {
  await query(`
    INSERT INTO users (full_name, bhxh_code, cccd, phone, email, account_type, status, registered_at, province, ward)
    VALUES
      ('Nguyễn Văn An', '0123456789', '001099001234', '0912345678', 'nguyenvanan@email.com', 'individual', 'approved', '2026-06-15 08:30:00', 'Hà Nội', 'Cầu Giấy'),
      ('Trần Thị Bình', '0123456790', '002099001235', '0987654321', 'tranthibinh@email.com', 'individual', 'pending', '2026-07-01 09:15:00', 'TP. Hồ Chí Minh', 'Quận 1'),
      ('Công ty TNHH Sản xuất ABC', '0123456791', '030099001236', '02412345678', 'abc@company.com', 'organization', 'approved', '2026-06-20 10:00:00', 'Bình Dương', 'Thủ Dầu Một'),
      ('Lê Văn Cường', '0123456792', '004099001237', '0933123456', 'levancuong@email.com', 'individual', 'rejected', '2026-06-25 14:20:00', 'Đà Nẵng', 'Hải Châu'),
      ('Phạm Thị Dung', '0123456793', '005099001238', '0977456123', 'phamthidung@email.com', 'individual', 'pending', '2026-07-02 11:30:00', 'Hải Phòng', 'Hồng Bàng'),
      ('Doanh nghiệp Tư nhân XYZ', '0123456794', '060099001239', '0255123456', 'xyz@company.com', 'organization', 'approved', '2026-06-10 08:00:00', 'Đồng Nai', 'Biên Hòa'),
      ('Hoàng Văn Em', '0123456795', '007099001240', '0968123456', 'hoangvanem@email.com', 'individual', 'pending', '2026-07-03 15:45:00', 'Cần Thơ', 'Ninh Kiều'),
      ('Vũ Thị Phương', '0123456796', '008099001241', '0944223344', 'vuthiphuong@email.com', 'individual', 'approved', '2026-06-28 09:10:00', 'Bắc Ninh', 'Từ Sơn')
  `);

  await query(`
    INSERT INTO appointments (full_name, phone, email, bhxh_code, date, time_slot, service, note, status, created_at)
    VALUES
      ('Nguyễn Văn An', '0912345678', 'nguyenvanan@email.com', '0123456789', '2026-07-10', '08:30 - 09:30', 'kekhai', 'Cần tư vấn thủ tục kê khai BHXH cho nhân viên mới', 'confirmed', '2026-07-05 10:30:00'),
      ('Trần Thị Bình', '0987654321', 'tranthibinh@email.com', '0123456790', '2026-07-11', '14:30 - 15:30', 'huong-dan', 'Hướng dẫn nộp hồ sơ điện tử', 'pending', '2026-07-05 14:20:00')
  `);

  await query(`
    INSERT INTO chat_conversations (user_name, id_card, phone, status, unread, created_at)
    VALUES ('Nguyễn Văn An', '079099001234', '0912345678', 'active', 1, '2026-07-05 09:00:00')
  `);

  await query(`
    INSERT INTO chat_messages (conversation_id, sender, text, time)
    VALUES
      (1, 'user', 'Chào bạn, tôi cần hỗ trợ về thủ tục đăng ký BHXH điện tử', '09:00'),
      (1, 'admin', 'Chào anh/chị! Anh/chị vui lòng cho tôi biết mã số BHXH để kiểm tra ạ.', '09:02'),
      (1, 'user', 'Mã số BHXH của tôi là 0123456789', '09:05')
  `);
}
