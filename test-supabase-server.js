require("dotenv").config();

const supabase = require("./server/supabase");

async function test() {

    console.log("=== SUPABASE SERVER TEST ===");

    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("display_order", {
            ascending: true
        });

    if (error) {

        console.error("ERROR:");
        console.error(error);

        process.exit(1);
    }

    console.log("SUCCESS!");
    console.log(`Categories found: ${data.length}`);

    data.forEach(category => {

        console.log(
            `- ${category.name_en} | ${category.name_ar}`
        );

    });

}

test();