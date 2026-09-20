require("dotenv").config();

const Database = require("better-sqlite3");
const supabase = require("./server/supabase");

const db = new Database("bas.db");

async function importTable(table) {
  const rows = db.prepare(`SELECT * FROM ${table}`).all();

  if (rows.length === 0) {
    console.log(`${table}: empty - skipped`);
    return;
  }

  const { error } = await supabase
    .from(table)
    .upsert(rows, { onConflict: "id" });

  if (error) {
    console.error(`${table}: ERROR - ${error.message}`);
  } else {
    console.log(`${table}: imported ${rows.length} rows`);
  }
}

async function main() {
  // Order matters because articles reference these tables.
  await importTable("categories");
  await importTable("issues");

  // Students and articles are currently empty, but keep this
  // so the script remains reusable later.
  await importTable("students");
  await importTable("articles");

  db.close();

  console.log("\nImport finished.");
}

main().catch((error) => {
  console.error("IMPORT ERROR:", error.message);
  db.close();
});