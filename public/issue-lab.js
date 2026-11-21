const basIssueLab = (() => {
    function articleLink(article) {
        const usesId = article.id != null;
        return "article.html?" + (usesId ? "id=" : "slug=") + encodeURIComponent(usesId ? article.id : article.slug);
    }

    function tubeLink(article) {
        const link = document.createElement("a");
        link.className = "bas-lab-article";
        link.href = articleLink(article);

        const tube = document.createElement("span");
        tube.className = "bas-lab-tube";
        tube.setAttribute("aria-hidden", "true");
        const glass = document.createElement("span");
        glass.className = "bas-lab-glass";
        const liquid = document.createElement("span");
        liquid.className = "bas-tube-liquid";
        glass.append(liquid);
        tube.append(glass);
        for (let index = 0; index < 7; index += 1) {
            const bubble = document.createElement("i");
            bubble.className = "bas-tube-bubble";
            if (index < 5) {
                glass.append(bubble);
            } else {
                bubble.classList.add("bas-tube-air");
                tube.append(bubble);
            }
        }

        const smoke = document.createElement("span");
        smoke.className = "bas-tube-smoke";
        tube.append(smoke);

        const title = document.createElement("span");
        title.className = "bas-lab-article-title";
        basEditorial.articleTitle(article, title);
        link.append(tube, title);
        return link;
    }

    function updateImage(image, source) {
        if (source && source !== image.dataset.original) image.src = source;
        image.hidden = !source;
    }

    function updateIssue(cover, issue) {
        const link = cover.querySelector("a");
        const label = link.querySelector("span");
        const number = issue.issue_number;
        const en = "Issue " + number;
        const ar = Number(number) === 1 ? "العدد الأول" : "العدد " + new Intl.NumberFormat("ar-LB-u-nu-arab").format(number);
        basEditorial.localized(label, en, ar);
        link.href = "issue.html?id=" + encodeURIComponent(issue.id);
        updateImage(link.querySelector("img"), issue.cover_image);
    }

    function showFeatured(story, articles, studentsRequest) {
        const featured = articles.filter(article => article.featured);
        const article = featured.find(item => String(item.id) === story.dataset.articleId) ||
            featured.find(item => item.main_image && item.student_id != null) ||
            featured[0] || articles.find(item => item.main_image && item.student_id != null) || articles[0];
        story.hidden = !article;
        if (!article) return;

        basEditorial.articleTitle(article, story.querySelector("h2"));
        story.querySelector(".bas-front-read").href = articleLink(article);
        updateImage(story.querySelector("img"), article.main_image);
        const byline = story.querySelector(".bas-front-author");
        if (String(article.id) !== story.dataset.articleId) byline.hidden = true;
        studentsRequest.then(students => {
            const name = students.find(student => String(student.id) === String(article.student_id))?.name?.trim();
            byline.querySelector("bdi").textContent = name || "";
            byline.hidden = !name;
        }, () => {});
    }

    async function mount(studentsRequest) {
        const rack = document.getElementById("latestArticles");
        const content = rack.closest(".bas-lab-content");
        const cover = document.querySelector(".bas-front-cover");
        const story = document.querySelector(".bas-front-story");
        const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
        let bubbling = null;
        let navigationTimer;

        const observer = new IntersectionObserver(entries => {
            for (const entry of entries) {
                entry.target.classList.toggle("is-in-view", entry.isIntersecting);
            }
        }, { threshold: 0.35 });

        content.addEventListener("click", event => {
            const tube = event.target.closest(".bas-lab-article");
            if (!tube || event.defaultPrevented || event.button !== 0 ||
                event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || reducedMotion.matches) return;
            event.preventDefault();
            clearTimeout(navigationTimer);
            bubbling?.classList.remove("is-fizzing");
            bubbling = tube;
            tube.classList.add("is-fizzing");
            navigationTimer = setTimeout(() => window.location.assign(tube.href), 1000);
        });
        window.addEventListener("pagehide", () => {
            clearTimeout(navigationTimer);
            bubbling?.classList.remove("is-fizzing");
            bubbling = null;
        });

        for (const image of [cover.querySelector("img"), story.querySelector("img")]) {
            image.addEventListener("error", () => { image.hidden = true; });
        }
        const [issues, articles] = await Promise.allSettled([
            basEditorial.fetchList("/api/issues"),
            basEditorial.fetchList("/api/articles")
        ]);
        const issue = issues.status === "fulfilled" ? issues.value.find(item => item.status === "published") : null;
        if (issues.status === "fulfilled" && !issue) {
            cover.hidden = story.hidden = true;
            basEditorial.status(rack, "No published issues yet.", "لا توجد أعداد منشورة بعد.");
            return;
        }
        if (issue) updateIssue(cover, issue);
        const issueId = String(issue?.id ?? story.dataset.issueId);
        if (articles.status === "rejected") {
            story.hidden = issueId !== story.dataset.issueId;
            basEditorial.status(rack, "Could not load articles.", "تعذّر تحميل المقالات.");
            return;
        }
        const issueArticles = articles.value.filter(article => article.status === "published" &&
            (String(article.issue_id) === issueId || (article.issue_id == null && Number(issue?.issue_number) === 1)) &&
            article.title_en !== "About BAS" && article.slug !== "About BAS");
        showFeatured(story, issueArticles, studentsRequest);
        if (!issueArticles.length) {
            basEditorial.status(rack, "No articles in this issue yet.", "لا توجد مقالات في هذا العدد بعد.");
            return;
        }
        const tubes = issueArticles.map(tubeLink);
        rack.replaceChildren(...tubes);
        tubes.forEach(tube => observer.observe(tube));
    }

    return { mount };
})();
