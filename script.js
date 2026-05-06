const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
const links = [...document.querySelectorAll(".main-nav a")];

if (menuToggle) {
  menuToggle.addEventListener("click", () => nav.classList.toggle("open"));
}

links.forEach((link) => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

const reveals = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("section[id]");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.14 }
);

reveals.forEach((el) => revealObserver.observe(el));

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    const top = section.offsetTop - 140;
    if (window.pageYOffset >= top) current = section.id;
  });

  links.forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
  });
});
