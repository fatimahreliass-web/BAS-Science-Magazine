(() => {
    const date = document.querySelector('time[datetime="2026-11-27"]');
    const countdown = document.querySelector("[data-conference-countdown]");
    const notice = document.querySelector("[data-conference-notice]");
    if (!date) return;

    const dayMilliseconds = 86_400_000;
    const eventDay = Date.parse(date.dateTime);
    const beirutDate = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Beirut", year: "numeric", month: "2-digit", day: "2-digit"
    });
    const arabicNumber = new Intl.NumberFormat("ar", { numberingSystem: "arab" });

    function updateConferenceDate() {
        const parts = Object.fromEntries(beirutDate.formatToParts(new Date()).map(part => [part.type, part.value]));
        const localDay = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day));
        const days = (eventDay - localDay) / dayMilliseconds;

        if (notice && days <= 0) {
            basEditorial.localized(notice, days === 0 ? "Conference today" : "Science Club conference",
                days === 0 ? "الندوة اليوم" : "ندوة نادي العلوم");
        }

        if (!countdown) return;
        if (days < 0) {
            countdown.hidden = true;
        } else if (days === 0) {
            basEditorial.localized(countdown, "The conference is today", "الندوة اليوم");
        } else {
            const ar = days === 1 ? "باقي يوم واحد" : days === 2 ? "باقي يومان"
                : `باقي ${arabicNumber.format(days)} ${days <= 10 ? "أيام" : "يومًا"}`;
            basEditorial.localized(countdown, `${days} ${days === 1 ? "day" : "days"} to go`, ar);
        }
    }

    updateConferenceDate();
    setInterval(updateConferenceDate, 60_000);
})();
