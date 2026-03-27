// Adds new tables to existing DB without dropping data
const db = require('./index');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE,
    password_hash TEXT NOT NULL,
    dob TEXT,
    gender TEXT,
    area TEXT,
    city TEXT DEFAULT 'Faridabad',
    blood_group TEXT,
    pro_member INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    booking_type TEXT NOT NULL,       -- 'doctor' | 'lab_test'
    reference_id INTEGER NOT NULL,    -- doctor_id or lab_id
    reference_name TEXT,
    test_name TEXT,                   -- for lab bookings
    booking_date TEXT NOT NULL,
    booking_time TEXT,
    status TEXT DEFAULT 'pending',    -- pending | confirmed | completed | cancelled
    notes TEXT,
    amount INTEGER,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    user_name TEXT,
    review_type TEXT NOT NULL,        -- 'doctor' | 'lab' | 'hospital'
    reference_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
    title TEXT,
    body TEXT,
    verified_visit INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS health_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    record_type TEXT NOT NULL,        -- 'lab_report' | 'prescription' | 'discharge_summary' | 'scan'
    title TEXT NOT NULL,
    test_name TEXT,
    lab_name TEXT,
    doctor_name TEXT,
    record_date TEXT,
    file_name TEXT,
    file_size INTEGER,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS provider_registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    provider_type TEXT NOT NULL,      -- 'doctor' | 'lab' | 'hospital' | 'pharmacy'
    name TEXT NOT NULL,
    contact_person TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    address TEXT,
    area TEXT,
    registration_number TEXT,
    accreditation TEXT,
    status TEXT DEFAULT 'pending',    -- pending | verified | rejected
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

console.log('✅ Migration complete — new tables created.');
db.close();
