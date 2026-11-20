basEditorial.initializeLanguage();

const languageGroup = document.querySelector("[data-language-group]");
const language = document.documentElement;
const animation = document.getElementById("welcome-animation");
const motionButton = document.querySelector(".welcome-motion");
const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
const conferenceNotice = document.getElementById("welcome-conference");
const characterCue = { start: 10.5, end: 16.5 };

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

function syncConferenceNotice() {
    const { currentTime, paused, error } = animation;
    const characterVisible = currentTime >= characterCue.start && currentTime < characterCue.end;
    conferenceNotice.hidden = !characterVisible && !paused && !error && !motionPreference.matches
        && document.activeElement !== conferenceNotice;
}

function playAnimation() {
    animation.play().catch(() => {
        syncMotionLabel();
        syncConferenceNotice();
    });
    syncConferenceNotice();
}

animation.addEventListener("play", syncMotionLabel);
animation.addEventListener("pause", syncMotionLabel);
for (const event of ["play", "pause", "timeupdate", "seeked", "error"]) {
    animation.addEventListener(event, syncConferenceNotice);
}
animation.querySelector("source").addEventListener("error", () => { conferenceNotice.hidden = false; });
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
