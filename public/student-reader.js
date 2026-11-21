const subjectLabels = {
    biology: ["Biology", "الأحياء"],
    physics: ["Physics", "الفيزياء"],
    chemistry: ["Chemistry", "الكيمياء"],
};

function studentIntroduction(article, notes) {
    const { element, localized, articleTitle } = basEditorial;
    const panel = element("section", "bas-student-introduction");
    const heading = localized(element("h2"), "From the magazine", "لمحة من المجلّة");
    heading.id = "student-introduction-title";
    panel.setAttribute("aria-labelledby", heading.id);
    panel.append(heading);

    if (notes) {
        panel.append(localized(element("p"), ...notes.about));
    } else if (article) {
        const about = element("p");
        about.append(localized(element("span"), "Contributes to BAS with ", "يشارك في مجلّة بشائر بمقال "));
        about.append(articleTitle(article, element("strong")));
        panel.append(about);
    } else {
        panel.append(localized(element("p"), "Part of the BAS student team at Al Bashaer High School.",
            "ضمن فريق تلاميذ مجلّة بشائر العلميّة في ثانويّة البشائر."));
    }

    const subject = subjectLabels[notes?.subject];
    if (subject) {
        const subjectRow = element("p", "bas-student-subject");
        subjectRow.append(
            localized(element("span"), "Subject in the article", "المادّة المرتبطة بالمقال"),
            localized(element("strong"), ...subject)
        );
        panel.append(subjectRow);
    }

    const voice = notes?.voice || [
        "I’d like to turn a question from my everyday life into a magazine article and explore it with the Science Club.",
        "أحبّ أن أحوّل سؤالًا من حياتي اليوميّة إلى مقال في المجلّة، وأن أستكشفه مع زملائي في نادي العلوم.",
    ];
    const motivation = element("div", "bas-student-motivation");
    motivation.append(
        localized(element("h3"), "Why the magazine and the club?", "لماذا المجلّة والنادي؟"),
        localized(element("p", "bas-student-voice-label"), "Suggested first-person wording", "صياغة مقترحة بصوت التلميذ"),
        localized(element("p"), ...voice)
    );
    panel.append(motivation);
    return panel;
}

async function loadStudent() {
    basEditorial.initializeLanguage();
    const { element, localized, status, studentCard, articleCard, fetchList } = basEditorial;
    const container = document.getElementById("student");
    const list = document.getElementById("articles");
    try {
        const id = new URLSearchParams(location.search).get("id");
        const articlesRequest = id ? fetchList("/api/articles").catch(error => {
            console.error("Student articles could not be loaded", error);
            return null;
        }) : Promise.resolve([]);
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
        const articles = await articlesRequest;
        if (!articles) {
            status(list, "Could not load articles.", "تعذّر تحميل المقالات.");
            return;
        }
        const selected = articles.filter(article => article.status === "published" &&
            String(article.student_id ?? article.author_id) === String(student.id));
        const lead = selected.find(article => basStudentProfileNotes[article.id]) ?? selected[0];
        copy.append(studentIntroduction(lead, basStudentProfileNotes[lead?.id]));
        if (selected.length) list.replaceChildren(...selected.map(articleCard));
        else status(list, "This student has no published articles yet.", "ما من مقالات منشورة لهذا التلميذ بعد.");
    } catch (error) {
        console.error("Student profile could not be loaded", error);
        status(container, "Could not load student.", "تعذّر تحميل بيانات التلميذ.");
        list.closest("section").hidden = true;
    }
}

loadStudent();
