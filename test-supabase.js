require("dotenv").config();

const supabase = require("./server/supabase");

async function test() {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name_en")
    .limit(3);

  if (error) {
    console.error("SUPABASE ERROR:", error.message);
    return;
  }

  console.log("SUPABASE CONNECTED!");
  console.log(data);
}

test();