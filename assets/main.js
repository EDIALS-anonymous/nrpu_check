(() => {
  const milestones = [
    { date: "2026-05-10", title: "Advertisement", detail: "Call opens" },
    { date: "2026-06-10", title: "Last date", detail: "Submit outline" },
    { date: "2026-06-20", title: "Document notice", detail: "Missing/incorrect files" },
    { date: "2026-06-28", title: "Corrections", detail: "Final upload window" },
    { date: "2026-07-12", title: "Merit list", detail: "Before external review" },
    { date: "2026-07-24", title: "Review outcome", detail: "External review stage" },
    { date: "2026-08-05", title: "Final selection", detail: "Selected candidates" }
  ];

  const todayOverride = "2026-05-24"; 
  // Change this to null when you want the real visitor date:
  // const todayOverride = null;

  const parseDate = (value) => {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const formatDate = (date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

  const today = todayOverride ? parseDate(todayOverride) : new Date();
  today.setHours(0, 0, 0, 0);

  const start = parseDate(milestones[0].date);
  const end = parseDate(milestones[milestones.length - 1].date);
  const totalMs = end - start;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const timeline = document.querySelector("[data-timeline]");
  const nextStep = document.querySelector("[data-next-step]");
  const todayText = document.querySelector("[data-today-text]");
  const resumeTargets = document.querySelectorAll("[data-resume-link]");

  resumeTargets.forEach((link) => {
    link.setAttribute("href", "My_resume.pdf");
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener");
  });

  if (todayText) {
    todayText.textContent = `Today: ${formatDate(today)}`;
  }

  if (timeline) {
    timeline.innerHTML = "";

    const track = document.createElement("div");
    track.className = "timeline-track";

    const progress = document.createElement("div");
    progress.className = "timeline-progress";

    const todayMarker = document.createElement("div");
    todayMarker.className = "today-marker";
    todayMarker.innerHTML = `<span>Today: ${formatDate(today)}</span>`;

    const todayPosition = clamp(((today - start) / totalMs) * 100, 0, 100);
    progress.style.width = `${todayPosition}%`;
    todayMarker.style.left = `${todayPosition}%`;

    track.appendChild(progress);
    track.appendChild(todayMarker);
    timeline.appendChild(track);

    milestones.forEach((milestone) => {
      const date = parseDate(milestone.date);
      const position = clamp(((date - start) / totalMs) * 100, 0, 100);
      const isDone = today >= date;

      const item = document.createElement("article");
      item.className = `timeline-item ${isDone ? "is-done" : "is-pending"}`;
      item.style.left = `${position}%`;

      item.innerHTML = `
        <div class="timeline-dot" aria-hidden="true"></div>
        <time datetime="${milestone.date}">${formatDate(date).replace(" 2026", "")}</time>
        <h3>${milestone.title}</h3>
        <p>${milestone.detail}</p>
        <span class="status-pill">${isDone ? "Done" : "Pending"}</span>
      `;

      timeline.appendChild(item);
    });
  }

  if (nextStep) {
    const next = milestones.find((milestone) => today < parseDate(milestone.date));
    if (next) {
      nextStep.textContent = `Next step: ${next.title} on ${formatDate(parseDate(next.date))}.`;
    } else {
      nextStep.textContent = "The call cycle is complete.";
    }
  }

  const menuButton = document.querySelector("[data-menu-button]");
  const nav = document.querySelector("[data-nav]");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const expanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("is-open");
    });
  }
})();
