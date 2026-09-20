const Database = require("better-sqlite3");
const fs = require("fs");

const db = new Database("bas.db");

const tables = ["users", "students", "categories", "issues", "articles"];

const data = {};

for (const table of tables) {
  data[table] = db.prepare(`SELECT * FROM ${table}`).all();
  console.log(`${table}: ${data[table].length} rows`);
}

fs.writeFileSync(
  "bas-data.json",
  JSON.stringify(data, null, 2),
  "utf8"
);

db.close();

console.log("\nDone! Created bas-data.json");