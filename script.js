(() => {
  const $ = (selector) => document.querySelector(selector);
  const body = document.body;
  const progress = $("#progress");
  const menu = $(".menu-toggle");
  const nav = $(".main-nav");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let ticking = false;
  let currentStage = -1;

  const story = {
    0: {
      note: "No action needed. Goodwell is keeping watch.",
      report: "A familiar evening. Everything is in its place.",
      movement: "22:41 · Yesterday",
      occupancy: "Unoccupied",
      warning: "Everything looks as it should.",
      metric: "Your home is having an ordinary day.",
      closing: "Your home is in good hands.",
      title: "Goodwell — A healthier feeling, at home."
    },
    1: {
      note: "A small movement was recorded after the room settled.",
      report: "One room has been active a little later than usual.",
      movement: "02:16 · Today",
      occupancy: "Recently active",
      warning: "A movement was recorded in an empty room.",
      metric: "A few routines took place outside their usual hours.",
      closing: "Your home is in good hands.",
      title: "Goodwell — Just checking in."
    },
    2: {
      note: "You don't need to check. Goodwell has already checked twice.",
      report: "The upstairs room appears occupied. No one is registered there.",
      movement: "Just now",
      occupancy: "Occupied · 1",
      warning: "Presence detected. No household member identified.",
      metric: "Some activity does not match the household schedule.",
      closing: "Everything is where it belongs.",
      title: "Goodwell — We noticed something."
    },
    3: {
      note: "The room is no longer showing as empty.",
      report: "The upstairs room is occupied. It has been occupied all evening.",
      movement: "Live · 00:00",
      occupancy: "Occupied · 2",
      warning: "A second presence is still in the room.",
      metric: "The home has recorded one more arrival than expected.",
      closing: "You are safe at home.",
      title: "Goodwell — Someone is home."
    },
    4: {
      note: "We have made room for you.",
      report: "All residents are accounted for. Please remain where you are.",
      movement: "Now · Behind you",
      occupancy: "Occupied · 3",
      warning: "PLEASE DO NOT ENTER THE ROOM.",
      metric: "There are no unaccounted-for rooms now.",
      closing: "You were never home alone.",
      title: "Goodwell — Welcome back."
    }
  };

  function setText(selector, value) {
    const node = $(selector);
    if (node && node.textContent !== value) node.textContent = value;
  }

  function applyStage(stage) {
    if (stage === currentStage) return;
    currentStage = stage;
    body.classList.toggle("uneasy", stage >= 1);
    body.classList.toggle("disturbed", stage >= 2);
    body.classList.toggle("wrong", stage >= 3);
    body.classList.toggle("nightmare", stage >= 4);
    const copy = story[stage];
    setText("#nightNote", copy.note);
    setText("#reportInsight", copy.report);
    setText("#lastMovement", copy.movement);
    setText("#roomOccupancy", copy.occupancy);
    setText("#watchWarning", copy.warning);
    setText("#metricNote", copy.metric);
    setText("#closingNote", copy.closing);
    document.title = copy.title;
    if (stage >= 2) setText("#accounted", stage >= 4 ? "3" : "2");
    else setText("#accounted", "2");
    if (stage >= 3) setText("#metricPresence", "100%");
    else setText("#metricPresence", "98.6%");
    if (stage >= 4) {
      const closingHeading = $(".closing h2");
      if (closingHeading) closingHeading.innerHTML = "You were never<br><em>home alone.</em>";
    } else {
      const closingHeading = $(".closing h2");
      if (closingHeading) closingHeading.innerHTML = "You're home.<br><em>We'll take it from here.</em>";
    }
  }

  function updateScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    if (progress) progress.style.width = (ratio * 100) + "%";
    // The opening stays completely ordinary. Each later stage is earned by scrolling.
    const stage = ratio < .18 ? 0 : ratio < .38 ? 1 : ratio < .60 ? 2 : ratio < .82 ? 3 : 4;
    applyStage(stage);
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScroll);
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener("resize", updateScroll);
  updateScroll();

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

  function updateClock() {
    const clock = $("#metricTime");
    if (clock) clock.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  updateClock();
  window.setInterval(updateClock, 30000);

  // Motion is deliberately restrained, and all narrative changes are local to this page.
  if (reducedMotion) body.classList.add("reduce-motion");
})();