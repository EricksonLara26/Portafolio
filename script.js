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

const projectCarousels = document.querySelectorAll("[data-project-carousel]");

projectCarousels.forEach((carousel) => {
  const track = carousel.querySelector("[data-project-track]");
  const slides = [...carousel.querySelectorAll("[data-project-slide]")];
  const dots = [...carousel.querySelectorAll("[data-carousel-dot]")];
  const previousButton = carousel.querySelector("[data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  const label = carousel.querySelector("[data-carousel-label]");
  const count = carousel.querySelector("[data-carousel-count]");
  const openProject = carousel.closest(".project-showcase")?.querySelector("[data-project-open]");
  let currentIndex = 0;
  let touchStartX = 0;

  if (!track || slides.length === 0) return;

  const showSlide = (requestedIndex) => {
    currentIndex = (requestedIndex + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    slides.forEach((slide, index) => {
      const isActive = index === currentIndex;
      slide.setAttribute("aria-hidden", String(!isActive));
      slide.tabIndex = isActive ? 0 : -1;
    });

    dots.forEach((dot, index) => {
      const isActive = index === currentIndex;
      dot.classList.toggle("active", isActive);
      dot.setAttribute("aria-pressed", String(isActive));
    });

    const activeSlide = slides[currentIndex];
    if (label) label.textContent = activeSlide.dataset.label;
    if (count) count.textContent = `${currentIndex + 1} / ${slides.length}`;
    if (openProject) {
      openProject.href = activeSlide.href;
      openProject.setAttribute("aria-label", `Abrir la captura completa: ${activeSlide.dataset.label}`);
    }
  };

  previousButton?.addEventListener("click", () => showSlide(currentIndex - 1));
  nextButton?.addEventListener("click", () => showSlide(currentIndex + 1));

  dots.forEach((dot) => {
    dot.addEventListener("click", () => showSlide(Number(dot.dataset.carouselDot)));
  });

  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showSlide(currentIndex - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      showSlide(currentIndex + 1);
    }
  });

  carousel.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  carousel.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) < 45) return;
    showSlide(currentIndex + (distance < 0 ? 1 : -1));
  }, { passive: true });

  showSlide(0);
});

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
