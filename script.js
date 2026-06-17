const body = document.body;
const dock = document.querySelector(".tab-dock");
const tabs = Array.from(document.querySelectorAll(".tab"));
const sections = tabs
  .map((tab) => document.querySelector(tab.getAttribute("href")))
  .filter(Boolean);

function setActiveSection(sectionId) {
  const activeTab = tabs.find((tab) => tab.getAttribute("href") === `#${sectionId}`);
  if (!activeTab) return;

  tabs.forEach((tab) => tab.classList.toggle("is-active", tab === activeTab));
  body.dataset.theme = activeTab.dataset.theme || "selfservice";
}

function syncDockHeight() {
  if (!dock) return;
  document.documentElement.style.setProperty("--dock-height", `${dock.offsetHeight}px`);
}

document.querySelectorAll(".subtabs").forEach((group) => {
  const buttons = Array.from(group.querySelectorAll(".subtab"));
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const panel = button.closest(".panel");
      const target = panel?.querySelector(`#${button.dataset.target}`);
      if (!panel || !target) return;

      buttons.forEach((item) => item.classList.toggle("is-active", item === button));
      panel.querySelectorAll(".subpanel").forEach((subpanel) => {
        const isTarget = subpanel === target;
        subpanel.classList.toggle("is-active", isTarget);
        subpanel.hidden = !isTarget;
      });
    });
  });
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const sectionId = tab.getAttribute("href")?.replace("#", "");
    if (sectionId) setActiveSection(sectionId);
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible?.target?.id) setActiveSection(visible.target.id);
  },
  {
    rootMargin: "-35% 0px -55% 0px",
    threshold: [0.05, 0.2, 0.4],
  }
);

sections.forEach((section) => observer.observe(section));
syncDockHeight();
window.addEventListener("resize", syncDockHeight);
