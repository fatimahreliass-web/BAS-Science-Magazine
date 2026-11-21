(() => {
    const stateKey = "bas-background-music";
    const audio = new Audio("/audio/bas-background.mp3");
    audio.loop = true;
    audio.preload = "none";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "bas-music-toggle";
    button.innerHTML = '<span aria-hidden="true">♫</span>';
    document.body.append(button);

    function readState() {
        try {
            return JSON.parse(sessionStorage.getItem(stateKey)) || {};
        } catch {
            return {};
        }
    }

    let { enabled = true, time = 0 } = readState();
    let waitingForGesture = true;
    let playingRequested = false;
    let restoreTime = time;

    function saveState() {
        try {
            sessionStorage.setItem(stateKey, JSON.stringify({
                enabled,
                time: restoreTime || audio.currentTime
            }));
        } catch {
            // Playback still works when session storage is unavailable.
        }
    }

    function updateButton() {
        const on = enabled && !waitingForGesture;
        const arabic = document.documentElement.lang === "ar";
        const label = arabic
            ? (on ? "إيقاف موسيقى الخلفية" : "تشغيل موسيقى الخلفية")
            : (on ? "Pause background music" : "Play background music");
        button.setAttribute("aria-label", label);
        button.title = label;
        button.dataset.playing = String(on);
    }

    function applyPlayback() {
        const videoPlaying = [...document.querySelectorAll("video:not([muted])")]
            .some(video => !video.muted && !video.paused && !video.ended);
        if (!enabled || videoPlaying || document.hidden) {
            audio.pause();
            updateButton();
            return;
        }

        if (playingRequested || !audio.paused) return;
        if (restoreTime > 0) {
            audio.currentTime = restoreTime;
            restoreTime = 0;
        }
        playingRequested = true;
        audio.play().then(() => {
            waitingForGesture = false;
        }).catch(() => {
            if (enabled && audio.paused) waitingForGesture = true;
        }).finally(() => {
            playingRequested = false;
            updateButton();
        });
    }

    button.addEventListener("click", () => {
        enabled = !enabled || waitingForGesture;
        saveState();
        applyPlayback();
    });

    document.addEventListener("click", event => {
        if (!button.contains(event.target) && waitingForGesture && enabled) applyPlayback();
    });

    for (const event of ["play", "pause", "ended", "volumechange"]) {
        document.addEventListener(event, ({ target }) => {
            if (target instanceof HTMLVideoElement) applyPlayback();
        }, true);
    }

    window.addEventListener("pagehide", () => {
        saveState();
        audio.pause();
    });
    window.addEventListener("pageshow", event => {
        if (!event.persisted) return;
        ({ enabled = true, time: restoreTime = 0 } = readState());
        audio.currentTime = restoreTime;
        updateButton();
        applyPlayback();
    });
    document.addEventListener("visibilitychange", applyPlayback);
    new MutationObserver(updateButton).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["lang"]
    });

    updateButton();
    applyPlayback();
})();
