"use strict";

/**
 * THEME
 * The initial theme is applied by an inline script in <head> to avoid a flash.
 */

const HTML = document.documentElement;
const themeBtn = document.querySelector("[data-theme-btn]");

const updateThemeBtnLabel = () => {
  const next = HTML.dataset.theme === "dark" ? "light" : "dark";
  themeBtn.setAttribute("aria-label", `Switch to ${next} mode`);
};

const changeTheme = () => {
  HTML.dataset.theme = HTML.dataset.theme === "dark" ? "light" : "dark";
  try {
    localStorage.setItem("theme", HTML.dataset.theme);
  } catch (e) { /* storage unavailable */ }
  updateThemeBtnLabel();
};

updateThemeBtnLabel();
themeBtn.addEventListener("click", changeTheme);


/**
 * TABS
 */

const tabBtns = document.querySelectorAll("[data-tab-btn]");
const tabs = document.querySelectorAll("[data-tab-content]");

const activateTab = (btn) => {
  tabBtns.forEach(item => {
    const isActive = item === btn;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-selected", isActive);
    item.tabIndex = isActive ? 0 : -1;
  });

  tabs.forEach(tab => {
    tab.classList.toggle("active", tab.dataset.tabContent === btn.dataset.tabBtn);
  });
};

tabBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => activateTab(btn));

  btn.addEventListener("keydown", (event) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    const next = tabBtns[(index + step + tabBtns.length) % tabBtns.length];
    activateTab(next);
    next.focus();
  });
});

document.querySelectorAll("[data-open-tab]").forEach(link => {
  link.addEventListener("click", (event) => {
    const btn = document.querySelector(`[data-tab-btn="${link.dataset.openTab}"]`);
    if (!btn) return;
    event.preventDefault();
    activateTab(btn);
    btn.scrollIntoView({ block: "start" });
    btn.focus({ preventScroll: true });
  });
});


const openTabFromHash = () => {
  const btn = document.querySelector(`[data-tab-btn="${location.hash.slice(1)}"]`);
  if (btn) activateTab(btn);
};

window.addEventListener("hashchange", openTabFromHash);
openTabFromHash();

/**
 * TOP BAR SHADOW ON SCROLL
 */

const topbar = document.querySelector("[data-topbar]");
const onScroll = () => topbar.classList.toggle("scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();


/**
 * CONTACT FORM
 * The site is static, so the form opens the visitor's mail app with the message pre-filled.
 */

const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(contactForm);
  const name = data.get("name").trim();
  const email = data.get("email").trim();
  const subject = data.get("subject").trim() || `Portfolio contact from ${name}`;
  const message = data.get("message").trim();

  const body = `${message}\n\n${name}\n${email}`;
  const mailto = `mailto:${contactForm.dataset.mailTo}`
    + `?subject=${encodeURIComponent(subject)}`
    + `&body=${encodeURIComponent(body)}`;

  window.location.href = mailto;
  formStatus.textContent = "Opening your email app… If nothing happens, email me directly at "
    + contactForm.dataset.mailTo + ".";
});


/**
 * FOOTER YEAR
 */

document.querySelector("[data-year]").textContent = new Date().getFullYear();
