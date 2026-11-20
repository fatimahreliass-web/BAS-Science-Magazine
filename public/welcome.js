basEditorial.initializeLanguage();

const languageGroup = document.querySelector("[data-language-group]");
const language = document.documentElement;
const animation = document.getElementById("welcome-animation");
const motionButton = document.querySelector(".welcome-motion");
const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");

const syncLanguageLabel = () => {
    languageGroup.setAttribute("aria-label", language.lang === "ar" ? "اللغة" : "Language");
};
syncLanguageLabel();
new MutationObserver(syncLanguageLabel).observe(language, { attributeFilter: ["lang"] });

function syncMotionLabel() {
    if (animation.paused) {
        basEditorial.localized(motionButton, "Play animation", "شغّلوا الحركة");
    } else {
        basEditorial.localized(motionButton, "Pause animation", "أوقفوا الحركة");
    }
}

function playAnimation() {
    animation.play().catch(syncMotionLabel);
}

animation.addEventListener("play", syncMotionLabel);
animation.addEventListener("pause", syncMotionLabel);
motionButton.addEventListener("click", () => {
    if (animation.paused) {
        playAnimation();
    } else {
        animation.pause();
    }
});
motionPreference.addEventListener("change", event => {
    if (event.matches) animation.pause();
});
motionButton.hidden = false;
if (!motionPreference.matches) playAnimation();
