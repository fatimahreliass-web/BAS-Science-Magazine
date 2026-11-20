async function loadStudent() {
    basEditorial.initializeLanguage();
    const { element, localized, status, studentCard, articleCard, fetchList } = basEditorial;
    const container = document.getElementById("student");
    const list = document.getElementById("articles");
    try {
        const id = new URLSearchParams(location.search).get("id");
        const students = id ? await fetchList("/api/students") : [];
        const student = students.find(item => String(item.id) === id);
        if (!student) {
            status(container, "Student not found.", "ملفّ التلميذ غير موجود.");
            list.closest("section").hidden = true;
            return;
        }
        const portrait = studentCard(student);
        const profile = element("div", "bas-issue-detail bas-student-profile");
        const portraitFrame = portrait.querySelector(".bas-portrait-frame");
        portraitFrame.querySelector("img")?.setAttribute("loading", "eager");
        const copy = portrait.querySelector(".bas-portrait-copy");
        const name = element("h1", "", student.name);
        name.dir = "auto";
        copy.querySelector("h3").replaceWith(name);
        document.title = name.textContent + " — BAS";
        if (student.biography_en || student.biography_ar) {
            copy.append(localized(element("p"), student.biography_en || "", student.biography_ar || ""));
        }
        profile.append(portraitFrame, copy);
        container.replaceChildren(profile);
        try {
            const articles = await fetchList("/api/articles");
            const selected = articles.filter(article => Number(article.student_id) === Number(student.id));
            if (selected.length) list.replaceChildren(...selected.map(articleCard));
            else status(list, "This student has no published articles yet.", "ما من مقالات منشورة لهذا التلميذ بعد.");
        } catch (error) {
            console.error("Student articles could not be loaded", error);
            status(list, "Could not load articles.", "تعذّر تحميل المقالات.");
        }
    } catch (error) {
        console.error("Student profile could not be loaded", error);
        status(container, "Could not load student.", "تعذّر تحميل بيانات التلميذ.");
        list.closest("section").hidden = true;
    }
}

loadStudent();
