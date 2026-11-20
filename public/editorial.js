const basEditorial = (() => {
    function element(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text) node.textContent = text;
        return node;
    }

    function language() {
        return document.documentElement.lang === "ar" ? "ar" : "en";
    }

    function setLanguage(value) {
        const lang = value === "ar" ? "ar" : "en";
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
        localStorage.setItem("bas-language", lang);
        document.querySelectorAll("[data-en][data-ar]").forEach(node => {
            node.textContent = node.dataset[lang];
        });
        document.querySelectorAll("[data-language]").forEach(button => {
            button.setAttribute("aria-pressed", String(button.dataset.language === lang));
        });
    }

    function localized(node, en, ar) {
        node.dataset.en = en;
        node.dataset.ar = ar;
        node.textContent = language() === "ar" ? ar : en;
        return node;
    }

    function initializeLanguage() {
        document.querySelectorAll("[data-language]").forEach(button => {
            button.addEventListener("click", () => setLanguage(button.dataset.language));
        });
        setLanguage(localStorage.getItem("bas-language"));
    }

    async function fetchList(path) {
        const response = await fetch(path);
        if (!response.ok) throw new Error("HTTP " + response.status);
        const items = await response.json();
        if (!Array.isArray(items)) throw new Error("Expected a list");
        return items;
    }

    function status(container, en, ar) {
        container.replaceChildren(localized(element("p", "bas-status"), en, ar));
    }

    function articleCard(article) {
        const card = element("a", "bas-story-card");
        card.href = "article.html?" + (article.id == null
            ? "slug=" + encodeURIComponent(article.slug ?? "")
            : "id=" + encodeURIComponent(article.id));

        const frame = element("div", "bas-story-image");
        frame.setAttribute("aria-hidden", "true");
        const fallback = element("span", "bas-image-fallback", "BAS");
        frame.append(fallback);
        if (article.main_image) {
            const image = element("img");
            image.alt = "";
            image.loading = "lazy";
            image.decoding = "async";
            image.addEventListener("error", () => image.remove(), { once: true });
            image.src = article.main_image;
            frame.append(image);
        }
        const titleEn = article.title_en || article.title_ar || "Article";
        const titleAr = article.title_ar || titleEn;
        const details = element("div", "bas-story-copy");
        details.append(localized(element("h3"), titleEn, titleAr));
        const excerptEn = article.excerpt_en?.trim();
        const excerptAr = article.excerpt_ar?.trim();
        if (excerptEn && excerptAr) {
            details.append(localized(element("p", "bas-story-excerpt"), excerptEn, excerptAr));
        }
        const badge = basSkills.createBadge(article.id);
        if (badge) details.append(badge);
        card.append(frame, details);
        return card;
    }

    function studentCard(student) {
        const name = student.name || "";
        const nameFallback = name || "Student";
        const card = element("a", "bas-portrait-card");
        card.href = "student.html?id=" + encodeURIComponent(student.id);
        const frame = element("div", "bas-portrait-frame");
        frame.setAttribute("aria-hidden", "true");
        const initials = name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map(part => Array.from(part)[0]).join("");
        frame.append(element("span", "bas-portrait-initials", initials || "BAS"));

        if (student.photo?.trim()) {
            const image = element("img");
            image.alt = "";
            image.loading = "lazy";
            image.decoding = "async";
            image.addEventListener("error", () => image.remove(), { once: true });
            image.src = student.photo.trim();
            frame.append(image);
            if (/^aya (hicham )?raad$/i.test(name.trim())) frame.classList.add("bas-portrait-top");
        }

        const details = element("div", "bas-portrait-copy");
        const title = element("h3", "", nameFallback);
        title.dir = "auto";
        details.append(title);
        if (student.class_name) {
            const grade = student.class_name.match(/^Grade\s+(\d+)(.*)$/i);
            const gradeArabic = {7: "السابع", 8: "الثامن", 9: "التاسع"};
            const localizedGrade = grade && gradeArabic[grade[1]]
                ? "الصف " + gradeArabic[grade[1]] + grade[2]
                : student.class_name;
            details.append(localized(element("p"), student.class_name, localizedGrade));
        }
        const quoteEn = student.quote_en?.trim();
        const quoteAr = student.quote_ar?.trim();
        if (quoteEn || quoteAr) {
            details.append(localized(element("blockquote"), quoteEn || quoteAr, quoteAr || quoteEn));
        }

        card.append(frame, details);
        return card;
    }

    async function loadStudents(container, limit) {
        try {
            const students = await fetchList("/api/students");
            const sorted = students.sort((a, b) => String(a.name ?? "").localeCompare(
                String(b.name ?? ""), "en", { sensitivity: "base", numeric: true }
            ));
            const visible = limit ? sorted.slice(0, limit) : sorted;
            if (!visible.length) {
                status(container, "No student profiles yet.", "لا توجد ملفات للتلاميذ بعد.");
                return;
            }
            container.replaceChildren(...visible.map(studentCard));
        } catch (error) {
            console.error("Student profiles could not be loaded", error);
            status(container, "Could not load student profiles.", "تعذّر تحميل ملفات التلاميذ.");
        }
    }

    return { localized, initializeLanguage, fetchList, status, articleCard, loadStudents };
})();
