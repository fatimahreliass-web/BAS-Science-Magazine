const express = require("express");
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const supabaseDb = require("./supabase-db");

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================================================
   BASIC MIDDLEWARE
========================================================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================================================
   AUTHENTICATION - VERCEL SAFE
========================================================= */

const AUTH_COOKIE = "bas_admin_token";

const AUTH_SECRET =
    process.env.SESSION_SECRET ||
    "BAS-SCIENCE-MAGAZINE-2026-SECRET";

const AUTH_MAX_AGE = 1000 * 60 * 60 * 8; // 8 hours


function parseCookies(req) {
    const header = req.headers.cookie || "";

    const cookies = {};

    header.split(";").forEach(part => {
        const index = part.indexOf("=");

        if (index === -1) return;

        const key = part.slice(0, index).trim();
        const value = part.slice(index + 1).trim();

        try {
            cookies[key] = decodeURIComponent(value);
        } catch {
            cookies[key] = value;
        }
    });

    return cookies;
}


function createAuthToken(user) {
    const payload = {
        id: user.id,
        username: user.username,
        exp: Date.now() + AUTH_MAX_AGE
    };

    const encoded = Buffer
        .from(JSON.stringify(payload))
        .toString("base64url");

    const signature = crypto
        .createHmac("sha256", AUTH_SECRET)
        .update(encoded)
        .digest("base64url");

    return encoded + "." + signature;
}


function verifyAuthToken(token) {
    try {
        if (!token) return null;

        const parts = token.split(".");

        if (parts.length !== 2) return null;

        const encoded = parts[0];
        const signature = parts[1];

        const expected = crypto
            .createHmac("sha256", AUTH_SECRET)
            .update(encoded)
            .digest("base64url");

        const signatureBuffer = Buffer.from(signature);
        const expectedBuffer = Buffer.from(expected);

        if (
            signatureBuffer.length !== expectedBuffer.length
        ) {
            return null;
        }

        if (
            !crypto.timingSafeEqual(
                signatureBuffer,
                expectedBuffer
            )
        ) {
            return null;
        }

        const payload = JSON.parse(
            Buffer
                .from(encoded, "base64url")
                .toString("utf8")
        );

        if (!payload.exp || payload.exp < Date.now()) {
            return null;
        }

        return payload;

    } catch (error) {
        return null;
    }
}


function getLoggedInUser(req) {
    const cookies = parseCookies(req);

    return verifyAuthToken(
        cookies[AUTH_COOKIE]
    );
}


function requireLogin(req, res, next) {

    const user = getLoggedInUser(req);

    if (user) {
        req.user = user;
        return next();
    }

    return res.status(401).json({
        success: false,
        message: "Authentication required."
    });
}


/* =========================================================
   LOGIN
========================================================= */

app.post("/api/login", async (req, res) => {

    try {

        const { username, password } = req.body;

        if (!username || !password) {

            return res.status(400).json({
                success: false,
                message: "Username and password are required."
            });
        }


        const user = await supabaseDb.getOne(
            "users",
            "username",
            username
        );


        if (!user) {

            return res.status(401).json({
                success: false,
                message: "Invalid username or password."
            });
        }


        const validPassword =
            bcrypt.compareSync(
                password,
                user.password_hash
            );


        if (!validPassword) {

            return res.status(401).json({
                success: false,
                message: "Invalid username or password."
            });
        }


        const token = createAuthToken(user);


        const isProduction =
            process.env.VERCEL === "1";


        const securePart =
            isProduction ? "; Secure" : "";


        res.setHeader(
            "Set-Cookie",
            `${AUTH_COOKIE}=${encodeURIComponent(token)}; Max-Age=${AUTH_MAX_AGE / 1000}; Path=/; HttpOnly; SameSite=Lax${securePart}`
        );


        return res.json({
            success: true,
            message: "Login successful.",
            username: user.username
        });

    } catch (error) {

        console.error("LOGIN ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Login failed."
        });
    }
});


/* =========================================================
   CHECK AUTH
========================================================= */

app.get("/api/auth", (req, res) => {

    const user = getLoggedInUser(req);

    if (user) {

        return res.json({
            loggedIn: true,
            user: {
                id: user.id,
                username: user.username
            }
        });
    }

    return res.json({
        loggedIn: false
    });
});


/* =========================================================
   LOGOUT
========================================================= */

app.post("/api/logout", (req, res) => {

    const isProduction =
        process.env.VERCEL === "1";

    const securePart =
        isProduction ? "; Secure" : "";


    res.setHeader(
        "Set-Cookie",
        `${AUTH_COOKIE}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax${securePart}`
    );


    return res.json({
        success: true
    });
});


/* =========================================================
   STATUS
========================================================= */

app.get("/api/status", async (req, res) => {

    try {

        const categories =
            await supabaseDb.getAll("categories");

        const issues =
            await supabaseDb.getAll("issues");

        const students =
            await supabaseDb.getAll("students");

        const articles =
            await supabaseDb.getAll("articles");


        return res.json({
            success: true,

            database: "supabase",

            counts: {
                categories: categories.length,
                issues: issues.length,
                students: students.length,
                articles: articles.length
            }
        });

    } catch (error) {

        console.error("STATUS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to read database status."
        });
    }
});


/* =========================================================
   FILE UPLOAD
   VERCEL SAFE - MEMORY STORAGE
========================================================= */

const storage = multer.memoryStorage();

const upload = multer({
    storage
});


app.post(
    "/api/upload",
    requireLogin,
    upload.single("file"),
    async (req, res) => {

        try {

            if (!req.file) {

                return res.status(400).json({
                    success: false,
                    message: "No file uploaded."
                });
            }


            const extension =
                path.extname(
                    req.file.originalname
                );


            const originalName =
                path.basename(
                    req.file.originalname,
                    extension
                );


            const safeName =
                originalName
                    .replace(
                        /[^a-zA-Z0-9-_]/g,
                        "-"
                    );


            const fileName =
                `${Date.now()}-${safeName}${extension}`;


            const supabase =
                require("./supabase");


            const {
                data,
                error
            } = await supabase.storage
                .from("bas-media")
                .upload(
                    fileName,
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


            const {
                data: publicData
            } = supabase.storage
                .from("bas-media")
                .getPublicUrl(
                    data.path
                );


            return res.json({
                success: true,
                url: publicData.publicUrl,
                path: data.path,
                fileName
            });

        } catch (error) {

            console.error(
                "UPLOAD ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Upload failed.",
                error: error.message
            });
        }
    }
);


/* =========================================================
   ISSUES
========================================================= */


/* GET ALL ISSUES */

app.get("/api/issues", async (req, res) => {

    try {

        const issues =
            await supabaseDb.getAll(
                "issues",
                {
                    order: {
                        column: "issue_number",
                        ascending: false
                    }
                }
            );


        return res.json(issues);

    } catch (error) {

        console.error(
            "GET ISSUES ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to load issues."
        });
    }
});


/* GET ONE ISSUE */

app.get("/api/issues/:id", async (req, res) => {

    try {

        const issue =
            await supabaseDb.getOne(
                "issues",
                "id",
                req.params.id
            );


        if (!issue) {

            return res.status(404).json({
                success: false,
                message: "Issue not found."
            });
        }


        return res.json(issue);

    } catch (error) {

        console.error(
            "GET ISSUE ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to load issue."
        });
    }
});


/* CREATE ISSUE */

app.post(
    "/api/issues",
    requireLogin,
    async (req, res) => {

        try {

            const issue =
                await supabaseDb.insert(
                    "issues",
                    req.body
                );


            return res.json({
                success: true,
                issue
            });

        } catch (error) {

            console.error(
                "CREATE ISSUE ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to create issue.",
                error: error.message
            });
        }
    }
);


/* UPDATE ISSUE */

app.put(
    "/api/issues/:id",
    requireLogin,
    async (req, res) => {

        try {

            const issue =
                await supabaseDb.update(
                    "issues",
                    req.params.id,
                    req.body
                );


            return res.json({
                success: true,
                issue
            });

        } catch (error) {

            console.error(
                "UPDATE ISSUE ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to update issue.",
                error: error.message
            });
        }
    }
);


/* DELETE ISSUE */

app.delete(
    "/api/issues/:id",
    requireLogin,
    async (req, res) => {

        try {

            await supabaseDb.remove(
                "issues",
                req.params.id
            );


            return res.json({
                success: true
            });

        } catch (error) {

            console.error(
                "DELETE ISSUE ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to delete issue.",
                error: error.message
            });
        }
    }
);


/* =========================================================
   CATEGORIES
========================================================= */


/* GET */

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


            return res.json(categories);

        } catch (error) {

            console.error(
                "GET CATEGORIES ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to load categories."
            });
        }
    }
);


/* CREATE */

app.post(
    "/api/categories",
    requireLogin,
    async (req, res) => {

        try {

            const category =
                await supabaseDb.insert(
                    "categories",
                    req.body
                );


            return res.json({
                success: true,
                category
            });

        } catch (error) {

            console.error(
                "CREATE CATEGORY ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to create category.",
                error: error.message
            });
        }
    }
);


/* UPDATE */

app.put(
    "/api/categories/:id",
    requireLogin,
    async (req, res) => {

        try {

            const category =
                await supabaseDb.update(
                    "categories",
                    req.params.id,
                    req.body
                );


            return res.json({
                success: true,
                category
            });

        } catch (error) {

            console.error(
                "UPDATE CATEGORY ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to update category.",
                error: error.message
            });
        }
    }
);


/* DELETE */

app.delete(
    "/api/categories/:id",
    requireLogin,
    async (req, res) => {

        try {

            await supabaseDb.remove(
                "categories",
                req.params.id
            );


            return res.json({
                success: true
            });

        } catch (error) {

            console.error(
                "DELETE CATEGORY ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to delete category.",
                error: error.message
            });
        }
    }
);


/* =========================================================
   STUDENTS
========================================================= */


/* GET */

app.get(
    "/api/students",
    async (req, res) => {

        try {

            const students =
                await supabaseDb.getAll(
                    "students"
                );


            return res.json(students);

        } catch (error) {

            console.error(
                "GET STUDENTS ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to load students."
            });
        }
    }
);


/* CREATE */

app.post(
    "/api/students",
    requireLogin,
    async (req, res) => {

        try {

            const student =
                await supabaseDb.insert(
                    "students",
                    req.body
                );


            return res.json({
                success: true,
                student
            });

        } catch (error) {

            console.error(
                "CREATE STUDENT ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to create student.",
                error: error.message
            });
        }
    }
);


/* UPDATE */

app.put(
    "/api/students/:id",
    requireLogin,
    async (req, res) => {

        try {

            const student =
                await supabaseDb.update(
                    "students",
                    req.params.id,
                    req.body
                );


            return res.json({
                success: true,
                student
            });

        } catch (error) {

            console.error(
                "UPDATE STUDENT ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to update student.",
                error: error.message
            });
        }
    }
);


/* DELETE */

app.delete(
    "/api/students/:id",
    requireLogin,
    async (req, res) => {

        try {

            await supabaseDb.remove(
                "students",
                req.params.id
            );


            return res.json({
                success: true
            });

        } catch (error) {

            console.error(
                "DELETE STUDENT ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to delete student.",
                error: error.message
            });
        }
    }
);


/* =========================================================
   ARTICLES
========================================================= */


/* GET */

app.get(
    "/api/articles",
    async (req, res) => {

        try {

            const articles =
                await supabaseDb.getAll(
                    "articles"
                );


            return res.json(articles);

        } catch (error) {

            console.error(
                "GET ARTICLES ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to load articles."
            });
        }
    }
);


/* GET ONE */

app.get(
    "/api/articles/:id",
    async (req, res) => {

        try {

            const article =
                await supabaseDb.getOne(
                    "articles",
                    "id",
                    req.params.id
                );


            if (!article) {

                return res.status(404).json({
                    success: false,
                    message: "Article not found."
                });
            }


            return res.json(article);

        } catch (error) {

            console.error(
                "GET ARTICLE ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to load article."
            });
        }
    }
);


/* CREATE */

app.post(
    "/api/articles",
    requireLogin,
    async (req, res) => {

        try {

            const article =
                await supabaseDb.insert(
                    "articles",
                    req.body
                );


            return res.json({
                success: true,
                article
            });

        } catch (error) {

            console.error(
                "CREATE ARTICLE ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to create article.",
                error: error.message
            });
        }
    }
);


/* UPDATE */

app.put(
    "/api/articles/:id",
    requireLogin,
    async (req, res) => {

        try {

            const article =
                await supabaseDb.update(
                    "articles",
                    req.params.id,
                    req.body
                );


            return res.json({
                success: true,
                article
            });

        } catch (error) {

            console.error(
                "UPDATE ARTICLE ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to update article.",
                error: error.message
            });
        }
    }
);


/* DELETE */

app.delete(
    "/api/articles/:id",
    requireLogin,
    async (req, res) => {

        try {

            await supabaseDb.remove(
                "articles",
                req.params.id
            );


            return res.json({
                success: true
            });

        } catch (error) {

            console.error(
                "DELETE ARTICLE ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to delete article.",
                error: error.message
            });
        }
    }
);


/* =========================================================
   ADMIN HOME
========================================================= */

app.get("/admin", (req, res) => {

    const user = getLoggedInUser(req);

    if (user) {
        return res.redirect(
            "/admin/dashboard.html"
        );
    }

    return res.redirect(
        "/admin/login.html"
    );
});


/* =========================================================
   STATIC FILES
========================================================= */

app.use(
    express.static(
        path.resolve(
            __dirname,
            "../public"
        )
    )
);


app.use(
    "/admin",
    express.static(
        path.resolve(
            __dirname,
            "../admin"
        )
    )
);


/* =========================================================
   LOCAL SERVER
========================================================= */

if (require.main === module) {

    app.listen(PORT, () => {

        console.log(
            "=== BAS SERVER READY ==="
        );

        console.log(
            `BAS Science Magazine is running at http://localhost:${PORT}`
        );

    });
}


/* =========================================================
   EXPORT FOR VERCEL
========================================================= */

module.exports = app;