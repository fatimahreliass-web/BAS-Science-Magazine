const supabase = require("./supabase");

// ======================================
// SUPABASE DATABASE HELPER
// ======================================

async function getAll(table, options = {}) {

    let query = supabase
        .from(table)
        .select(options.select || "*");

    if (options.order) {

        query = query.order(
            options.order.column,
            {
                ascending:
                    options.order.ascending ?? true
            }
        );

    }

    const { data, error } = await query;

    if (error) {
        throw error;
    }

    return data || [];
}


// ======================================
// GET ONE
// ======================================

async function getOne(
    table,
    column,
    value
) {

    const { data, error } =
        await supabase
            .from(table)
            .select("*")
            .eq(column, value)
            .maybeSingle();

    if (error) {
        throw error;
    }

    return data;
}


// ======================================
// INSERT
// ======================================

async function insert(
    table,
    values
) {

    const { data, error } =
        await supabase
            .from(table)
            .insert(values)
            .select()
            .single();

    if (error) {
        throw error;
    }

    return data;
}


// ======================================
// UPDATE
// ======================================

async function update(
    table,
    id,
    values
) {

    const { data, error } =
        await supabase
            .from(table)
            .update(values)
            .eq("id", id)
            .select()
            .maybeSingle();

    if (error) {
        throw error;
    }

    return data;
}


// ======================================
// DELETE
// ======================================

async function remove(
    table,
    id
) {

    const { data, error } =
        await supabase
            .from(table)
            .delete()
            .eq("id", id)
            .select();

    if (error) {
        throw error;
    }

    return data;
}


// ======================================
// EXPORT
// ======================================

module.exports = {

    getAll,
    getOne,
    insert,
    update,
    remove

};