const basIssueLab = (() => {
    const issueId = 1;

    function tubeLink(article) {
        const link = document.createElement("a");
        link.className = "bas-lab-article";
        const usesId = article.id != null;
        const identifier = usesId ? article.id : article.slug;
        link.href = "article.html?" + (usesId ? "id=" : "slug=") + encodeURIComponent(identifier);

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

    async function mount() {
        const rack = document.getElementById("latestArticles");
        const content = rack.closest(".bas-lab-content");
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

        try {
            const articles = await basEditorial.fetchList("/api/articles");
            const issueArticles = articles.filter(article => Number(article.issue_id) === issueId &&
                article.title_en !== "About BAS" && article.slug !== "About BAS");
            if (!issueArticles.length) {
                basEditorial.status(rack, "No articles in this issue yet.", "لا توجد مقالات في هذا العدد بعد.");
                return;
            }
            const tubes = issueArticles.map(tubeLink);
            rack.replaceChildren(...tubes);
            tubes.forEach(tube => observer.observe(tube));
        } catch (error) {
            console.error("Issue 1 articles could not be loaded", error);
            basEditorial.status(rack, "Could not load articles.", "تعذّر تحميل المقالات.");
        }
    }

    return { mount };
})();
