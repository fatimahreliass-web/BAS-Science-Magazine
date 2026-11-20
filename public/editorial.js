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
        const pageTitle = document.querySelector("[data-page-title]");
        if (pageTitle) document.title = pageTitle.textContent + " — BAS";
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

    function cleanArabic(value) {
        return String(value ?? "").normalize("NFC")
            .replace(/[ﭐ-﷿ﹰ-ﻼ]/g, letter => letter.normalize("NFKC"))
            .replace(/ھ/g, "ه")
            .replace(/[ \t]+([،؛؟.!:])/g, "$1").trim();
    }

    function articleTitle(article, node) {
        const titleAr = Number(article.id) === 26 ? "حقيقة أم خرافة؟" : cleanArabic(article.title_ar);
        return localized(node, article.title_en?.trim() || "Article", titleAr || "مقال");
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
        const details = element("div", "bas-story-copy");
        details.append(articleTitle(article, element("h3")));
        const excerptEn = article.excerpt_en?.trim() || "";
        const excerptAr = cleanArabic(article.excerpt_ar);
        if (excerptEn || excerptAr) {
            details.append(localized(element("p", "bas-story-excerpt"), excerptEn, excerptAr));
        }
        const badge = basSkills.createBadge(article.id);
        if (badge) details.append(badge);
        card.append(frame, details);
        return card;
    }

    function gradeInArabic(gradeName) {
        const grade = /^Grade\s+(\d+)(.*)$/i.exec(gradeName);
        const gradeArabic = {7: "السابع", 8: "الثامن", 9: "التاسع"};
        return grade && gradeArabic[grade[1]] ? "الصف " + gradeArabic[grade[1]] + grade[2] : gradeName;
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
        if (student.class_name) details.append(localized(element("p"), student.class_name, gradeInArabic(student.class_name)));
        const quoteEn = student.quote_en?.trim();
        const quoteAr = student.quote_ar?.trim();
        if (quoteEn || quoteAr) {
            details.append(localized(element("blockquote"), quoteEn || quoteAr, quoteAr || quoteEn));
        }

        card.append(frame, details);
        return card;
    }

    function studentLens(students) {
        const scene = element("div", "bas-lens-scene");
        const figures = element("div", "bas-lens-figures");
        const pause = localized(element("button", "bas-lens-motion"), "Pause movement", "إيقاف الحركة");
        pause.type = "button";
        pause.addEventListener("click", () => {
            const stopped = scene.classList.toggle("is-motion-paused");
            localized(pause, stopped ? "Resume movement" : "Pause movement",
                stopped ? "استئناف الحركة" : "إيقاف الحركة");
        });
        scene.append(figures, pause);

        const dialog = element("dialog", "bas-lens-dialog");
        dialog.setAttribute("aria-labelledby", "bas-lens-student-name");
        const close = localized(element("button", "bas-lens-close"), "Close", "إغلاق");
        close.type = "button";
        close.autofocus = true;
        const preview = element("div", "bas-lens-preview");
        dialog.append(close, preview);
        close.addEventListener("click", () => dialog.close());
        dialog.addEventListener("click", event => {
            if (event.target === dialog) {
                const bounds = dialog.getBoundingClientRect();
                if (event.clientX < bounds.left || event.clientX > bounds.right ||
                    event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
            }
        });

        function openStudent(student) {
            const card = studentCard(student);
            const frame = card.querySelector(".bas-portrait-frame");
            frame.classList.add("bas-lens-magnifier");
            const photo = frame.querySelector("img");
            if (photo) photo.loading = "eager";
            const name = card.querySelector("h3");
            name.id = "bas-lens-student-name";
            const link = localized(element("a", "bas-primary"), "View profile", "عرض الملفّ");
            link.href = card.href;
            preview.replaceChildren(frame, card.querySelector(".bas-portrait-copy"), link);
            dialog.showModal();
        }

        const bluePoloUniformIds = new Set(["2", "13", "18", "21", "26"]);
        // Positions follow the perspective of the open surface of the dish.
        const ringSpecs = [
            { share: 0.55, xRadius: 33, yRadius: 20, offset: Math.PI / 16 },
            { share: 0.34, xRadius: 21, yRadius: 11, offset: 0 },
            { xRadius: 8, yRadius: 3.5, offset: Math.PI / 2 },
        ];
        let remaining = students.length;
        const positions = ringSpecs.flatMap(({ share, xRadius, yRadius, offset }) => {
            const count = share ? Math.min(remaining, Math.round(students.length * share)) : remaining;
            remaining -= count;
            return Array.from({ length: count }, (_, index) => {
                const angle = offset + index * 2 * Math.PI / count;
                return [50 + xRadius * Math.cos(angle), 61 + yRadius * Math.sin(angle)];
            });
        });
        figures.replaceChildren(...students.map((student, index) => {
            const button = element("button", "bas-lens-figure");
            button.type = "button";
            button.setAttribute("aria-haspopup", "dialog");
            const [x, y] = positions[index];
            button.style.left = x.toFixed(2) + "%";
            button.style.top = y.toFixed(2) + "%";
            button.title = student.name || "Student";
            const person = element("img", "bas-lens-person");
            const poloUniform = bluePoloUniformIds.has(String(student.id));
            const variant = (poloUniform ? 1 : 2) + (index % 2) * 2;
            person.src = "images/student-miniature-beige-" + variant + ".webp";
            person.alt = "";
            person.width = 96;
            person.height = 128;
            person.decoding = "async";
            const name = element("span", "bas-lens-label", student.name || "Student");
            name.dir = "auto";
            button.append(person, name);
            button.addEventListener("click", () => openStudent(student));
            return button;
        }));
        return [scene, dialog];
    }

    async function loadStudents(container) {
        try {
            const students = await fetchList("/api/students");
            students.sort((a, b) => String(a.name ?? "").localeCompare(
                String(b.name ?? ""), "en", { sensitivity: "base", numeric: true }
            ));
            if (!students.length) {
                status(container, "No student profiles yet.", "لا توجد ملفات للتلاميذ بعد.");
                return;
            }
            container.replaceChildren(...studentLens(students));
        } catch (error) {
            console.error("Student profiles could not be loaded", error);
            status(container, "Could not load student profiles.", "تعذّر تحميل ملفات التلاميذ.");
        }
    }

    return { element, localized, initializeLanguage, fetchList, status, cleanArabic, articleTitle, articleCard, gradeInArabic, studentCard, loadStudents };
})();
