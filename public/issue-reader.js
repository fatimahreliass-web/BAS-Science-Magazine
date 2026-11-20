const { element, localized, status, articleCard, cleanArabic, fetchList } = basEditorial;

function issueCard(issue, standalone = false) {
    const card = element("article", standalone ? "bas-issue-detail" : "bas-story-card");
    if (issue.cover_image) {
        const cover = element("img", "bas-issue-cover");
        cover.src = issue.cover_image;
        cover.alt = "";
        cover.decoding = "async";
        card.append(cover);
    }
    const details = element("div", "bas-story-copy");
    const titleAr = cleanArabic(issue.title_ar).replace(/^BAS Science Magazine\s*-\s*/, "مجلة بشائر العلميّة — العدد ");
    const heading = localized(element(standalone ? "h1" : "h2"),
        issue.title_en || "Magazine issue", titleAr || "عدد المجلة");
    if (standalone) {
        heading.dataset.pageTitle = "";
        document.title = heading.textContent + " — BAS";
    }
    details.append(heading);
    if (issue.description_en || issue.description_ar) {
        details.append(localized(element("p"), issue.description_en || "", cleanArabic(issue.description_ar)));
    }
    if (!standalone) {
        const link = localized(element("a", "bas-primary"), "Explore the issue", "تصفّحوا العدد");
        link.href = "issue.html?id=" + encodeURIComponent(issue.id);
        details.append(link);
    }
    if (issue.pdf_file) {
        const link = localized(element("a", "bas-primary"), "Read the PDF", "قراءة ملفّ العدد");
        link.href = issue.pdf_file;
        link.target = "_blank";
        link.rel = "noopener";
        details.append(link);
    }
    card.append(details);
    return card;
}

async function loadIssuePages() {
    basEditorial.initializeLanguage();
    const archive = document.getElementById("issues");
    const single = document.getElementById("issue");
    const list = document.getElementById("articles");
    try {
        const issues = await fetchList("/api/issues");
        if (archive) {
            if (issues.length) archive.replaceChildren(...issues.map(issue => issueCard(issue)));
            else status(archive, "No issues available yet.", "ما من أعداد منشورة بعد.");
            return;
        }

        const id = new URLSearchParams(location.search).get("id");
        const issue = issues.find(item => String(item.id) === id);
        if (!issue) {
            status(single, "Issue not found.", "العدد غير موجود.");
            list.closest("section").hidden = true;
            return;
        }
        single.replaceChildren(issueCard(issue, true));
        try {
            const articles = await fetchList("/api/articles");
            const selected = articles.filter(article =>
                String(article.issue_id) === String(issue.id) ||
                (article.issue_id == null && Number(issue.issue_number) === 1));
            if (selected.length) list.replaceChildren(...selected.map(articleCard));
            else status(list, "No articles in this issue yet.", "لا توجد مقالات في هذا العدد بعد.");
        } catch (error) {
            console.error("Issue articles could not be loaded", error);
            status(list, "Could not load articles.", "تعذّر تحميل المقالات.");
        }
    } catch (error) {
        console.error("Issues could not be loaded", error);
        status(archive || single, "Could not load issues.", "تعذّر تحميل الأعداد.");
        if (list) list.closest("section").hidden = true;
    }
}

loadIssuePages();
