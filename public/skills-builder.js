const basSkills = (() => {
    const iconDirectory = "https://cdn.prod.website-files.com/689201fe2216589f5d4897f1/";
    const skills = {
        listening: {
            icon: "689201fe2216589f5d48a930_Listening%20SVG.svg", en: "Listening", ar: "الإصغاء",
            descriptionEn: "Pay attention to what others communicate, ask questions when needed, and check that you understood.",
            descriptionAr: "أنتبه لما يقوله الآخرون، وأطرح أسئلة عند الحاجة، وأتأكّد من أنّني فهمت قصدهم.",
        },
        speaking: {
            icon: "689201fe2216589f5d48a931_Speaking%20SVG.svg", en: "Speaking", ar: "التحدّث",
            descriptionEn: "Share your ideas clearly and choose words and examples that suit your audience.",
            descriptionAr: "أعبّر عن أفكاري بوضوح، وأختار الكلمات والأمثلة التي تناسب من يستمع إليّ.",
        },
        "problem-solving": {
            icon: "689201fe2216589f5d48a932_Problem%20Solving%20SVG.svg", en: "Problem Solving", ar: "حلّ المشكلات",
            descriptionEn: "Work out what the problem is, use evidence to consider possible solutions, and check what works.",
            descriptionAr: "أحدّد المشكلة، وأستعين بالأدلّة لدراسة الحلول الممكنة، وأتحقّق ممّا ينجح منها.",
        },
        creativity: {
            icon: "689201fe2216589f5d48a933_Creativity%20SVG.svg", en: "Creativity", ar: "الإبداع",
            descriptionEn: "Come up with different ideas, then try and develop the ones that show promise.",
            descriptionAr: "أقترح أفكارًا متنوّعة، ثم أجرّب الأفكار الواعدة وأطوّرها.",
        },
        adapting: {
            icon: "689201fe2216589f5d48a934_Adapting%20SVG.svg", en: "Adapting", ar: "التكيّف",
            descriptionEn: "Notice what has changed, adjust your approach, and use feedback to keep making progress.",
            descriptionAr: "ألاحظ ما تغيّر، وأعدّل طريقتي، وأستفيد من الملاحظات لأواصل التقدّم.",
        },
        planning: {
            icon: "689201fe2216589f5d48a935_Planning%20SVG.svg", en: "Planning", ar: "التخطيط",
            descriptionEn: "Set a goal, put the steps in order, and check your progress along the way.",
            descriptionAr: "أحدّد هدفًا، وأرتّب خطوات العمل، وأتابع تقدّمي أثناء التنفيذ.",
        },
        leadership: {
            icon: "689201fe2216589f5d48a936_Leadership%20SVG.svg", en: "Leadership", ar: "القيادة",
            descriptionEn: "Help a group agree on a direction, support its members, and encourage everyone to contribute.",
            descriptionAr: "أساعد المجموعة على الاتفاق على هدف، وأدعم أعضاءها، وأشجّع الجميع على المشاركة.",
        },
        teamwork: {
            icon: "689201fe2216589f5d48a937_Teamwork%20SVG.svg", en: "Teamwork", ar: "العمل الجماعي",
            descriptionEn: "Work with others toward a shared goal, do your part, and help the group succeed.",
            descriptionAr: "أتعاون مع الآخرين لتحقيق هدف مشترك، وأقوم بدوري، وأساعد المجموعة على النجاح.",
        },
    };

    // Initial editorial assignments for Issue 1, keyed by the original article IDs.
    const articleSkills = {
        1: "teamwork",
        2: "problem-solving",
        3: "speaking",
        4: "planning",
        8: "adapting",
        10: "problem-solving",
        11: "problem-solving",
        12: "creativity",
        13: "speaking",
        14: "problem-solving",
        15: "problem-solving",
        16: "problem-solving",
        17: "speaking",
        18: "creativity",
        19: "listening",
        20: "speaking",
        21: "problem-solving",
        22: "problem-solving",
        23: "planning",
        25: "adapting",
        26: "problem-solving",
        27: "problem-solving",
        28: "problem-solving",
    };

    function localizedText(en, ar) {
        const text = document.createElement("span");
        text.dataset.en = en;
        text.dataset.ar = ar;
        text.textContent = document.documentElement.lang === "ar" ? ar : en;
        return text;
    }

    function iconFor(skill) {
        const icon = document.createElement("img");
        icon.className = "skill-icon";
        icon.src = iconDirectory + skill.icon;
        icon.alt = "";
        icon.width = 44;
        icon.height = 44;
        return icon;
    }

    function mountBar() {
        const bar = document.getElementById("skills-builder");
        const buttons = bar.querySelector(".skills-builder-options");
        const explanation = bar.querySelector(".skills-builder-explanation");
        const prompt = bar.querySelector(".skills-builder-prompt");

        function selectSkill(key) {
            const skill = Object.hasOwn(skills, key) ? skills[key] : null;
            for (const button of buttons.children) {
                button.setAttribute("aria-pressed", String(button.dataset.skill === key));
            }
            if (!skill) return;

            const title = document.createElement("strong");
            title.append(localizedText(skill.en, skill.ar));
            const definition = document.createElement("p");
            definition.append(localizedText(skill.descriptionEn, skill.descriptionAr));
            const details = document.createElement("div");
            details.className = "skills-builder-definition";
            details.append(title, definition);
            prompt.hidden = true;
            explanation.dataset.skill = key;
            explanation.replaceChildren(details);
        }

        for (const [key, skill] of Object.entries(skills)) {
            const button = document.createElement("button");
            button.type = "button";
            button.dataset.skill = key;
            button.setAttribute("aria-controls", explanation.id);
            const label = localizedText(skill.en, skill.ar);
            label.className = "skills-builder-icon-label";
            button.append(iconFor(skill), label);
            button.addEventListener("click", () => selectSkill(key));
            buttons.appendChild(button);
        }

        selectSkill(new URLSearchParams(window.location.search).get("skill"));
    }

    function createBadge(articleId, { link = false } = {}) {
        const key = articleSkills[articleId];
        if (!Object.hasOwn(skills, key)) return null;

        const skill = skills[key];
        const badge = document.createElement(link ? "a" : "span");
        badge.className = "article-skill-badge";
        badge.dataset.skill = key;
        badge.append(iconFor(skill));
        if (link) {
            badge.href = "index.html?skill=" + encodeURIComponent(key) + "#skills-builder";
        }
        badge.append(localizedText(skill.en, skill.ar));
        return badge;
    }

    return { mountBar, createBadge };
})();
