(() => {
  const $ = (selector) => document.querySelector(selector);
  const progress = $("#progress");
  const menu = $(".menu-toggle");
  const nav = $(".main-nav");
  const startedAt = Date.now();
  let revealed = false;

  function updatePage() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progressValue = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    progress.style.width = progressValue + "%";
    document.body.classList.toggle("late", progressValue > 58);
    if (progressValue > 72 && !revealed) {
      revealed = true;
      const insight = $("#reportInsight");
      const note = $("#nightNote");
      if (insight) insight.textContent = "A small irregularity was noticed upstairs. It has been taken care of.";
      if (note) note.textContent = "You don't need to check. The room is accounted for.";
    }
  }

  window.addEventListener("scroll", updatePage, { passive: true });
  updatePage();

  if (menu && nav) {
    menu.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      menu.textContent = open ? "×" : "☰";
    });
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      nav.classList.remove("open");
      menu.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-label", "Open navigation");
      menu.textContent = "☰";
    }));
  }

  window.setTimeout(() => {
    const accounted = $("#accounted");
    const insight = $("#reportInsight");
    const closing = $("#closingNote");
    if (accounted) accounted.textContent = "3";
    if (insight && !revealed) insight.textContent = "One more person is accounted for than expected.";
    if (closing) closing.textContent = "Everyone is home. That's what matters.";
  }, 42000);

  window.setTimeout(() => {
    const nightNote = $("#nightNote");
    if (nightNote) nightNote.textContent = "Goodwell has noted a familiar movement in the room.";
  }, 57000);

  // The changing report is part of the fictional experience; no visitor data is collected.
  const elapsed = Math.floor((Date.now() - startedAt) / 1000);
  if (elapsed > 0) document.documentElement.dataset.session = "active";
})();