const Database = require("better-sqlite3");
const fs = require("fs");

const db = new Database("bas.db");

function sqlValue(value) {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";

  return "'" + String(value).replace(/'/g, "''") + "'";
}

const tables = ["categories", "issues", "students", "articles"];

let output = `-- BAS Science Magazine data import
-- Generated automatically from bas.db

`;

for (const table of tables) {
  const rows = db.prepare(`SELECT * FROM ${table}`).all();

  if (rows.length === 0) {
    output += `-- ${table}: empty\n\n`;
    continue;
  }

  const columns = Object.keys(rows[0]);

  output += `-- ${table}: ${rows.length} row(s)\n`;

  for (const row of rows) {
    const values = columns.map((column) => sqlValue(row[column]));

    output += `INSERT INTO ${table} (${columns.join(", ")})\n`;
    output += `VALUES (${values.join(", ")})\n`;
    output += `ON CONFLICT (id) DO NOTHING;\n\n`;
  }
}

db.close();

fs.writeFileSync("supabase-import.sql", output, "utf8");

console.log("DONE!");
console.log("Created: supabase-import.sql");