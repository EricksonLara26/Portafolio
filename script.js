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
  const dialog = document.querySelector("[data-project-dialog]");
  const dialogImage = dialog?.querySelector("[data-dialog-image]");
  const dialogLabel = dialog?.querySelector("[data-dialog-label]");
  const dialogCount = dialog?.querySelector("[data-dialog-count]");
  const dialogThumbnails = dialog?.querySelector("[data-dialog-thumbnails]");
  const thumbnails = [];
  let currentIndex = 0;
  let dialogIndex = 0;
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
  };

  const showDialogImage = (requestedIndex) => {
    dialogIndex = (requestedIndex + slides.length) % slides.length;
    const slide = slides[dialogIndex];
    const image = slide.querySelector("img");
    if (!image || !dialogImage) return;

    dialogImage.src = image.currentSrc || image.src;
    dialogImage.alt = image.alt;
    if (dialogLabel) dialogLabel.textContent = slide.dataset.label;
    if (dialogCount) dialogCount.textContent = `${dialogIndex + 1} / ${slides.length}`;
    thumbnails.forEach((thumbnail, index) => {
      thumbnail.classList.toggle("active", index === dialogIndex);
      thumbnail.setAttribute("aria-pressed", String(index === dialogIndex));
    });
  };

  const openDialog = (index) => {
    if (!dialog) return;
    showDialogImage(index);
    dialog.showModal();
    document.body.classList.add("dialog-open");
  };

  slides.forEach((slide, index) => {
    slide.addEventListener("click", (event) => {
      event.preventDefault();
      openDialog(index);
    });

    if (!dialogThumbnails) return;
    const thumbnail = document.createElement("button");
    const preview = slide.querySelector("img")?.cloneNode();
    thumbnail.type = "button";
    thumbnail.className = "project-dialog-thumbnail";
    thumbnail.setAttribute("aria-label", `Ver ${slide.dataset.label}`);
    thumbnail.setAttribute("aria-pressed", "false");
    if (preview) {
      preview.alt = "";
      thumbnail.append(preview);
    }
    const title = document.createElement("span");
    title.textContent = slide.dataset.label;
    thumbnail.append(title);
    thumbnail.addEventListener("click", () => showDialogImage(index));
    dialogThumbnails.append(thumbnail);
    thumbnails.push(thumbnail);
  });

  openProject?.addEventListener("click", () => openDialog(currentIndex));
  dialog?.querySelector("[data-dialog-close]")?.addEventListener("click", () => dialog.close());
  dialog?.querySelector("[data-dialog-prev]")?.addEventListener("click", () => showDialogImage(dialogIndex - 1));
  dialog?.querySelector("[data-dialog-next]")?.addEventListener("click", () => showDialogImage(dialogIndex + 1));
  dialog?.addEventListener("close", () => document.body.classList.remove("dialog-open"));
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      showDialogImage(dialogIndex + (event.key === "ArrowRight" ? 1 : -1));
    }
  });

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
