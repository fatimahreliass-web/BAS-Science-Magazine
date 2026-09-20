const Database = require("better-sqlite3");
const path = require("path");
const bcrypt = require("bcryptjs");

// ======================================
// DATABASE
// ======================================

const dbPath = path.join(__dirname, "../bas.db");

const db = new Database(dbPath);


// ======================================
// TABLES
// ======================================

db.exec(`

    CREATE TABLE IF NOT EXISTS users (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        username TEXT UNIQUE NOT NULL,

        password_hash TEXT NOT NULL,

        created_at TEXT DEFAULT CURRENT_TIMESTAMP

    );


    CREATE TABLE IF NOT EXISTS issues (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        issue_number INTEGER NOT NULL,

        month TEXT NOT NULL,

        year INTEGER NOT NULL,

        title_en TEXT NOT NULL,

        title_ar TEXT NOT NULL,

        description_en TEXT,

        description_ar TEXT,

        cover_image TEXT,

        pdf_file TEXT,

        publication_date TEXT,

        status TEXT DEFAULT 'draft',

        featured INTEGER DEFAULT 0,

        created_at TEXT DEFAULT CURRENT_TIMESTAMP

    );


    CREATE TABLE IF NOT EXISTS categories (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        name_en TEXT NOT NULL,

        name_ar TEXT NOT NULL,

        description_en TEXT,

        description_ar TEXT,

        slug TEXT UNIQUE NOT NULL,

        image TEXT,

        display_order INTEGER DEFAULT 0

    );


    CREATE TABLE IF NOT EXISTS students (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        name TEXT NOT NULL,

        class_name TEXT,

        photo TEXT,

        biography_en TEXT,

        biography_ar TEXT,

        quote_en TEXT,

        quote_ar TEXT

    );


    CREATE TABLE IF NOT EXISTS articles (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        title_en TEXT NOT NULL,

        title_ar TEXT NOT NULL,

        slug TEXT UNIQUE NOT NULL,

        content_en TEXT,

        content_ar TEXT,

        excerpt_en TEXT,

        excerpt_ar TEXT,

        main_image TEXT,

        student_id INTEGER,

        issue_id INTEGER,

        category_id INTEGER,

        class_name TEXT,

        tags TEXT,

        publication_date TEXT,

        status TEXT DEFAULT 'draft',

        featured INTEGER DEFAULT 0,

        reel_url TEXT,

        video_url TEXT,

        podcast_url TEXT,

        FOREIGN KEY (student_id) REFERENCES students(id),

        FOREIGN KEY (issue_id) REFERENCES issues(id),

        FOREIGN KEY (category_id) REFERENCES categories(id)

    );

`);


// ======================================
// CREATE DEFAULT ADMIN
// ======================================

const existingAdmin = db
    .prepare(`
        SELECT id
        FROM users
        WHERE username = ?
    `)
    .get("admin");


if (!existingAdmin) {

    const passwordHash =
        bcrypt.hashSync(
            "BAS2026",
            12
        );

    db.prepare(`
        INSERT INTO users (
            username,
            password_hash
        )

        VALUES (?, ?)
    `).run(
        "admin",
        passwordHash
    );

    console.log("Default admin account created.");

}


console.log("BAS database is ready.");

module.exports = db;