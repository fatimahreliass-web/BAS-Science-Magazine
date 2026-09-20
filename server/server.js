require("dotenv").config();
const express = require("express");
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const supabaseDb = require("./supabase-db");
const supabase = require("./supabase");

const app = express();

const PORT = process.env.PORT || 3000;


// ======================================
// SERVER
// ======================================

console.log("=== BAS SERVER STARTING ===");


// ======================================
// MIDDLEWARE
// ======================================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// ======================================
// SESSION
// ======================================

app.use(
    session({
        secret:
            process.env.SESSION_SECRET ||
            "BAS-SCIENCE-MAGAZINE-2026-SECRET",

        resave: false,

        saveUninitialized: false,

        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 8
        }
    })
);


// ======================================
// FILE UPLOADS
// ======================================

const uploadFolder = path.resolve(
    __dirname,
    "../uploads"
);

const upload = multer({
    storage: multer.memoryStorage()
});

app.use(
    "/uploads",
    express.static(uploadFolder)
);


// ======================================
// AUTHENTICATION
// ======================================

function requireLogin(
    req,
    res,
    next
) {

    if (
        req.session &&
        req.session.user
    ) {

        return next();

    }

    return res
        .status(401)
        .json({

            success: false,

            message:
                "Authentication required."

        });

}


// ======================================
// LOGIN
// ======================================

app.post(
    "/api/login",
    async (req, res) => {

        try {

            const {
                username,
                password
            } = req.body;

            if (
                !username ||
                !password
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "Username and password are required."

                    });

            }

            const user =
                await supabaseDb.getOne(
                    "users",
                    "username",
                    username
                );

            if (!user) {

                return res
                    .status(401)
                    .json({

                        success: false,

                        message:
                            "Invalid username or password."

                    });

            }

            const validPassword =
                bcrypt.compareSync(
                    password,
                    user.password_hash
                );

            if (!validPassword) {

                return res
                    .status(401)
                    .json({

                        success: false,

                        message:
                            "Invalid username or password."

                    });

            }

            req.session.user = {

                id:
                    user.id,

                username:
                    user.username

            };

            res.json({

                success: true,

                message:
                    "Login successful.",

                username:
                    user.username

            });

        }

        catch (error) {

            console.error(
                "LOGIN ERROR:",
                error
            );

            res
                .status(500)
                .json({

                    success: false,

                    message:
                        "Login failed."

                });

        }

    }
);


// ======================================
// CHECK LOGIN
// ======================================

app.get(
    "/api/auth",
    (req, res) => {

        if (
            req.session &&
            req.session.user
        ) {

            return res.json({

                loggedIn: true,

                user:
                    req.session.user

            });

        }

        res.json({

            loggedIn: false

        });

    }
);


// ======================================
// LOGOUT
// ======================================

app.post(
    "/api/logout",
    (req, res) => {

        req.session.destroy(
            error => {

                if (error) {

                    return res
                        .status(500)
                        .json({

                            success: false

                        });

                }

                res.json({

                    success: true

                });

            }
        );

    }
);


// ======================================
// STATUS
// ======================================

app.get(
    "/api/status",
    (req, res) => {

        res.json({

            success: true,

            message:
                "BAS Science Magazine API is working",

            database:
                "connected"

        });

    }
);


// ======================================
// FILE UPLOAD
// ======================================

app.post(
    "/api/upload",
    requireLogin,
    upload.single("file"),
    async (req, res) => {

        try {

            if (!req.file) {

                return res
                    .status(400)
                    .json({
                        success: false,
                        message: "No file uploaded."
                    });

            }

            const extension =
                path.extname(req.file.originalname);

            const baseName =
                path.basename(
                    req.file.originalname,
                    extension
                )
                .replace(
                    /[^a-zA-Z0-9-_]/g,
                    "-"
                );

            const fileName =
                `${Date.now()}-${baseName}${extension}`;

            const filePath =
                `uploads/${fileName}`;

            const { error } =
                await supabase
                    .storage
                    .from("bas-media")
                    .upload(
                        filePath,
                        req.file.buffer,
                        {
                            contentType:
                                req.file.mimetype,

                            upsert: false
                        }
                    );

            if (error) {
                throw error;
            }

            const { data } =
                supabase
                    .storage
                    .from("bas-media")
                    .getPublicUrl(filePath);

            res.json({

                success: true,

                filename:
                    fileName,

                url:
                    data.publicUrl,

                original_name:
                    req.file.originalname

            });

        }

        catch (error) {

            console.error(
                "Supabase upload error:",
                error
            );

            res
                .status(500)
                .json({

                    success: false,

                    message:
                        "File upload failed."

                });

        }

    }
);

// ======================================
// ISSUES
// ======================================


// GET ALL ISSUES

app.get(
    "/api/issues",
    async (req, res) => {

        try {

            const issues =
                await supabaseDb.getAll(
                    "issues"
                );

            issues.sort((a, b) => {

                if (
                    Number(b.year) !==
                    Number(a.year)
                ) {

                    return (
                        Number(b.year) -
                        Number(a.year)
                    );

                }

                return (
                    Number(b.issue_number) -
                    Number(a.issue_number)
                );

            });

            res.json(issues);

        }

        catch (error) {

            console.error(error);

            res
                .status(500)
                .json({

                    success: false,

                    message:
                        "Could not load issues."

                });

        }

    }
);


// CREATE ISSUE

app.post(
    "/api/issues",
    requireLogin,
    async (req, res) => {

        try {

            const {
                issue_number,
                month,
                year,
                title_en,
                title_ar,
                description_en,
                description_ar,
                cover_image,
                pdf_file,
                publication_date,
                status,
                featured
            } = req.body;

            const issue =
                await supabaseDb.insert(
                    "issues",
                    {

                        issue_number:
                            Number(issue_number),

                        month,

                        year:
                            Number(year),

                        title_en,

                        title_ar,

                        description_en:
                            description_en || null,

                        description_ar:
                            description_ar || null,

                        cover_image:
                            cover_image || null,

                        pdf_file:
                            pdf_file || null,

                        publication_date:
                            publication_date || null,

                        status:
                            status || "draft",

                        featured:
                            Boolean(featured)

                    }
                );

            res.json({

                success: true,

                id:
                    issue.id

            });

        }

        catch (error) {

            console.error(error);

            res
                .status(500)
                .json({

                    success: false,

                    message:
                        "Could not create issue."

                });

        }

    }
);


// UPDATE ISSUE

app.put(
    "/api/issues/:id",
    requireLogin,
    async (req, res) => {

        try {

            const {
                issue_number,
                month,
                year,
                title_en,
                title_ar,
                description_en,
                description_ar,
                cover_image,
                pdf_file,
                publication_date,
                status,
                featured
            } = req.body;

            const issue =
                await supabaseDb.update(
                    "issues",
                    req.params.id,
                    {

                        issue_number:
                            Number(issue_number),

                        month,

                        year:
                            Number(year),

                        title_en,

                        title_ar,

                        description_en:
                            description_en || null,

                        description_ar:
                            description_ar || null,

                        cover_image:
                            cover_image || null,

                        pdf_file:
                            pdf_file || null,

                        publication_date:
                            publication_date || null,

                        status:
                            status || "draft",

                        featured:
                            Boolean(featured)

                    }
                );

            if (!issue) {

                return res
                    .status(404)
                    .json({

                        success: false,

                        message:
                            "Issue not found."

                    });

            }

            res.json({

                success: true,

                message:
                    "Issue updated successfully."

            });

        }

        catch (error) {

            console.error(error);

            res
                .status(500)
                .json({

                    success: false,

                    message:
                        "Could not update issue."

                });

        }

    }
);


// DELETE ISSUE

app.delete(
    "/api/issues/:id",
    requireLogin,
    async (req, res) => {

        try {

            const deleted =
                await supabaseDb.remove(
                    "issues",
                    req.params.id
                );

            if (
                !deleted ||
                deleted.length === 0
            ) {

                return res
                    .status(404)
                    .json({

                        success: false,

                        message:
                            "Issue not found."

                    });

            }

            res.json({

                success: true,

                message:
                    "Issue deleted successfully."

            });

        }

        catch (error) {

            console.error(error);

            res
                .status(500)
                .json({

                    success: false,

                    message:
                        "Could not delete issue."

                });

        }

    }
);


// ======================================
// CATEGORIES
// ======================================


// GET CATEGORIES

app.get(
    "/api/categories",
    async (req, res) => {

        try {

            const categories =
                await supabaseDb.getAll(
                    "categories",
                    {
                        order: {
                            column: "display_order",
                            ascending: true
                        }
                    }
                );

            res.json(categories);

        }

        catch (error) {

            console.error(error);

            res
                .status(500)
                .json({

                    success: false,

                    message:
                        "Could not load categories."

                });

        }

    }
);


// CREATE CATEGORY

app.post(
    "/api/categories",
    requireLogin,
    async (req, res) => {

        try {

            const {
                name_en,
                name_ar,
                description_en,
                description_ar,
                slug,
                image,
                display_order
            } = req.body;

            if (
                !name_en ||
                !name_ar ||
                !slug
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "English name, Arabic name and slug are required."

                    });

            }

            const category =
                await supabaseDb.insert(
                    "categories",
                    {

                        name_en,

                        name_ar,

                        description_en:
                            description_en || null,

                        description_ar:
                            description_ar || null,

                        slug,

                        image:
                            image || null,

                        display_order:
                            Number(display_order) || 0

                    }
                );

            res.json({

                success: true,

                id:
                    category.id

            });

        }

        catch (error) {

            console.error(error);

            if (
                error.code === "23505"
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "This slug already exists."

                    });

            }

            res
                .status(500)
                .json({

                    success: false,

                    message:
                        "Could not create category."

                });

        }

    }
);


// UPDATE CATEGORY

app.put(
    "/api/categories/:id",
    requireLogin,
    async (req, res) => {

        try {

            const {
                name_en,
                name_ar,
                description_en,
                description_ar,
                slug,
                image,
                display_order
            } = req.body;

            if (
                !name_en ||
                !name_ar ||
                !slug
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "English name, Arabic name and slug are required."

                    });

            }

            const category =
                await supabaseDb.update(
                    "categories",
                    req.params.id,
                    {

                        name_en,

                        name_ar,

                        description_en:
                            description_en || null,

                        description_ar:
                            description_ar || null,

                        slug,

                        image:
                            image || null,

                        display_order:
                            Number(display_order) || 0

                    }
                );

            if (!category) {

                return res
                    .status(404)
                    .json({

                        success: false,

                        message:
                            "Category not found."

                    });

            }

            res.json({

                success: true,

                message:
                    "Category updated successfully."

            });

        }

        catch (error) {

            console.error(error);

            if (
                error.code === "23505"
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "This slug already exists."

                    });

            }

            res
                .status(500)
                .json({

                    success: false,

                    message:
                        "Could not update category."

                });

        }

    }
);


// DELETE CATEGORY

app.delete(
    "/api/categories/:id",
    requireLogin,
    async (req, res) => {

        try {

            const deleted =
                await supabaseDb.remove(
                    "categories",
                    req.params.id
                );

            if (
                !deleted ||
                deleted.length === 0
            ) {

                return res
                    .status(404)
                    .json({

                        success: false,

                        message:
                            "Category not found."

                    });

            }

            res.json({

                success: true,

                message:
                    "Category deleted successfully."

            });

        }

        catch (error) {

            console.error(error);

            if (
                error.code === "23503"
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "This category cannot be deleted because articles are using it."

                    });

            }

            res
                .status(500)
                .json({

                    success: false,

                    message:
                        "Could not delete category."

                });

        }

    }
);


// ======================================
// STUDENTS
// ======================================


// GET STUDENTS

app.get(
    "/api/students",
    async (req, res) => {

        try {

            const students =
                await supabaseDb.getAll(
                    "students",
                    {
                        order: {
                            column: "name",
                            ascending: true
                        }
                    }
                );

            res.json(students);

        }

        catch (error) {

            console.error(error);

            res
                .status(500)
                .json({

                    success: false,

                    message:
                        "Could not load students."

                });

        }

    }
);


// CREATE STUDENT

app.post(
    "/api/students",
    requireLogin,
    async (req, res) => {

        try {

            const {
                name,
                class_name,
                photo,
                biography_en,
                biography_ar,
                quote_en,
                quote_ar
            } = req.body;

            if (!name) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "Student name is required."

                    });

            }

            const student =
                await supabaseDb.insert(
                    "students",
                    {

                        name,

                        class_name:
                            class_name || null,

                        photo:
                            photo || null,

                        biography_en:
                            biography_en || null,

                        biography_ar:
                            biography_ar || null,

                        quote_en:
                            quote_en || null,

                        quote_ar:
                            quote_ar || null

                    }
                );

            res.json({

                success: true,

                id:
                    student.id

            });

        }

        catch (error) {

            console.error(error);

            res
                .status(500)
                .json({

                    success: false,

                    message:
                        "Could not create student."

                });

        }

    }
);


// UPDATE STUDENT

app.put(
    "/api/students/:id",
    requireLogin,
    async (req, res) => {

        try {

            const {
                name,
                class_name,
                photo,
                biography_en,
                biography_ar,
                quote_en,
                quote_ar
            } = req.body;

            if (!name) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "Student name is required."

                    });

            }

            const student =
                await supabaseDb.update(
                    "students",
                    req.params.id,
                    {

                        name,

                        class_name:
                            class_name || null,

                        photo:
                            photo || null,

                        biography_en:
                            biography_en || null,

                        biography_ar:
                            biography_ar || null,

                        quote_en:
                            quote_en || null,

                        quote_ar:
                            quote_ar || null

                    }
                );

            if (!student) {

                return res
                    .status(404)
                    .json({

                        success: false,

                        message:
                            "Student not found."

                    });

            }

            res.json({

                success: true,

                message:
                    "Student updated successfully."

            });

        }

        catch (error) {

            console.error(error);

            res
                .status(500)
                .json({

                    success: false,

                    message:
                        "Could not update student."

                });

        }

    }
);


// DELETE STUDENT

app.delete(
    "/api/students/:id",
    requireLogin,
    async (req, res) => {

        try {

            const deleted =
                await supabaseDb.remove(
                    "students",
                    req.params.id
                );

            if (
                !deleted ||
                deleted.length === 0
            ) {

                return res
                    .status(404)
                    .json({

                        success: false,

                        message:
                            "Student not found."

                    });

            }

            res.json({

                success: true,

                message:
                    "Student deleted successfully."

            });

        }

        catch (error) {

            console.error(error);

            res
                .status(500)
                .json({

                    success: false,

                    message:
                        "Could not delete student."

                });

        }

    }
);


// ======================================
// ARTICLES
// ======================================


// GET ARTICLES

app.get(
    "/api/articles",
    async (req, res) => {

        try {

            const articles =
                await supabaseDb.getAll(
                    "articles"
                );

            articles.sort((a, b) => {

                const dateA =
                    a.publication_date
                        ? new Date(
                            a.publication_date
                        ).getTime()
                        : 0;

                const dateB =
                    b.publication_date
                        ? new Date(
                            b.publication_date
                        ).getTime()
                        : 0;

                if (
                    dateB !== dateA
                ) {

                    return (
                        dateB -
                        dateA
                    );

                }

                return (
                    Number(b.id) -
                    Number(a.id)
                );

            });

            res.json(articles);

        }

        catch (error) {

            console.error(error);

            res
                .status(500)
                .json({

                    success: false,

                    message:
                        "Could not load articles."

                });

        }

    }
);


// CREATE ARTICLE

app.post(
    "/api/articles",
    requireLogin,
    async (req, res) => {

        try {

            const {
                title_en,
                title_ar,
                slug,
                content_en,
                content_ar,
                excerpt_en,
                excerpt_ar,
                main_image,
                student_id,
                issue_id,
                category_id,
                class_name,
                tags,
                publication_date,
                status,
                featured,
                reel_url,
                video_url,
                podcast_url
            } = req.body;

            if (
                !title_en ||
                !title_ar ||
                !slug
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "English title, Arabic title and slug are required."

                    });

            }

            const article =
                await supabaseDb.insert(
                    "articles",
                    {

                        title_en,

                        title_ar,

                        slug,

                        content_en:
                            content_en || null,

                        content_ar:
                            content_ar || null,

                        excerpt_en:
                            excerpt_en || null,

                        excerpt_ar:
                            excerpt_ar || null,

                        main_image:
                            main_image || null,

                        student_id:
                            student_id
                                ? Number(student_id)
                                : null,

                        issue_id:
                            issue_id
                                ? Number(issue_id)
                                : null,

                        category_id:
                            category_id
                                ? Number(category_id)
                                : null,

                        class_name:
                            class_name || null,

                        tags:
                            tags || null,

                        publication_date:
                            publication_date || null,

                        status:
                            status || "draft",

                        featured:
                            Boolean(featured),

                        reel_url:
                            reel_url || null,

                        video_url:
                            video_url || null,

                        podcast_url:
                            podcast_url || null

                    }
                );

            res.json({

                success: true,

                id:
                    article.id

            });

        }

        catch (error) {

            console.error(error);

            if (
                error.code === "23505"
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "This slug already exists."

                    });

            }

            res
                .status(500)
                .json({

                    success: false,

                    message:
                        "Could not create article."

                });

        }

    }
);


// UPDATE ARTICLE

app.put(
    "/api/articles/:id",
    requireLogin,
    async (req, res) => {

        try {

            const {
                title_en,
                title_ar,
                slug,
                content_en,
                content_ar,
                excerpt_en,
                excerpt_ar,
                main_image,
                student_id,
                issue_id,
                category_id,
                class_name,
                tags,
                publication_date,
                status,
                featured,
                reel_url,
                video_url,
                podcast_url
            } = req.body;

            if (
                !title_en ||
                !title_ar ||
                !slug
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "English title, Arabic title and slug are required."

                    });

            }

            const article =
                await supabaseDb.update(
                    "articles",
                    req.params.id,
                    {

                        title_en,

                        title_ar,

                        slug,

                        content_en:
                            content_en || null,

                        content_ar:
                            content_ar || null,

                        excerpt_en:
                            excerpt_en || null,

                        excerpt_ar:
                            excerpt_ar || null,

                        main_image:
                            main_image || null,

                        student_id:
                            student_id
                                ? Number(student_id)
                                : null,

                        issue_id:
                            issue_id
                                ? Number(issue_id)
                                : null,

                        category_id:
                            category_id
                                ? Number(category_id)
                                : null,

                        class_name:
                            class_name || null,

                        tags:
                            tags || null,

                        publication_date:
                            publication_date || null,

                        status:
                            status || "draft",

                        featured:
                            Boolean(featured),

                        reel_url:
                            reel_url || null,

                        video_url:
                            video_url || null,

                        podcast_url:
                            podcast_url || null

                    }
                );

            if (!article) {

                return res
                    .status(404)
                    .json({

                        success: false,

                        message:
                            "Article not found."

                    });

            }

            res.json({

                success: true,

                message:
                    "Article updated successfully."

            });

        }

        catch (error) {

            console.error(error);

            if (
                error.code === "23505"
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "This slug already exists."

                    });

            }

            res
                .status(500)
                .json({

                    success: false,

                    message:
                        "Could not update article."

                });

        }

    }
);


// DELETE ARTICLE

app.delete(
    "/api/articles/:id",
    requireLogin,
    async (req, res) => {

        try {

            const deleted =
                await supabaseDb.remove(
                    "articles",
                    req.params.id
                );

            if (
                !deleted ||
                deleted.length === 0
            ) {

                return res
                    .status(404)
                    .json({

                        success: false,

                        message:
                            "Article not found."

                    });

            }

            res.json({

                success: true,

                message:
                    "Article deleted successfully."

            });

        }

        catch (error) {

            console.error(error);

            if (
                error.code === "23503"
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "This article cannot be deleted."

                    });

            }

            res
                .status(500)
                .json({

                    success: false,

                    message:
                        "Could not delete article."

                });

        }

    }
);


// ======================================
// ADMIN PAGE
// ======================================

app.get(
    "/admin",
    (req, res) => {

        if (
            req.session &&
            req.session.user
        ) {

            return res.redirect(
                "/admin/dashboard.html"
            );

        }

        res.redirect(
            "/admin/login.html"
        );

    }
);


// ======================================
// PUBLIC WEBSITE
// ======================================

app.use(
    express.static(
        path.resolve(
            __dirname,
            "../public"
        )
    )
);


// ======================================
// ADMIN STATIC FILES
// ======================================

app.use(
    "/admin",
    express.static(
        path.resolve(
            __dirname,
            "../admin"
        )
    )
);


// ======================================
// START SERVER
// ======================================

if (require.main === module) {

    app.listen(
        PORT,
        () => {

            console.log(
                "=== BAS SERVER READY ==="
            );

            console.log(
                `BAS Science Magazine is running at http://localhost:${PORT}`
            );

        }
    );

}

module.exports = app;