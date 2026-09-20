const fs = require("fs");

let sql = fs.readFileSync("supabase-import.sql", "utf8");

// Fix SQLite 0/1 values for Supabase boolean columns
sql = sql.replace(
  /('draft', )1(, '2026-09-19)/g,
  "$1TRUE$2"
);

sql = sql.replace(
  /('draft', )0(, '2026-09-19)/g,
  "$1FALSE$2"
);

// General fix for featured values in the generated INSERT statements
sql = sql.replace(
  /(status, featured, created_at\)\s*VALUES\s*\([^)]*,\s*'[^']*',\s*)1(,)/g,
  "$1TRUE$2"
);

sql = sql.replace(
  /(status, featured, created_at\)\s*VALUES\s*\([^)]*,\s*'[^']*',\s*)0(,)/g,
  "$1FALSE$2"
);

fs.writeFileSync("supabase-import-fixed.sql", sql, "utf8");

console.log("DONE!");
console.log("Created: supabase-import-fixed.sql");