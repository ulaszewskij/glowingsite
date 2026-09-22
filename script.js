const dateNode = document.querySelector("#date");
const form = document.querySelector(".dummy-form");
const statusNode = document.querySelector(".form-status");
const progressBar = document.querySelector(".reading-progress span");
const sidebar = document.querySelector(".sidebar");
const contentGrid = document.querySelector(".content-grid");
const articleHero = document.querySelector(".article-hero");
const mobileLayout = window.matchMedia("(max-width: 980px)");
const quizSteps = [...document.querySelectorAll("[data-quiz-step]")];
const quizDots = [...document.querySelectorAll("[data-quiz-dot]")];
let quizStep = 0;

const showQuizStep = (step) => {
  quizStep = step;
  quizSteps.forEach((panel, index) => {
    const isActive = index === step;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  });
  quizDots.forEach((dot, index) => {
    dot.classList.toggle("is-current", index === step);
    dot.classList.toggle("is-done", index < step);
  });
  quizSteps[step]?.querySelector("h2")?.focus({ preventScroll: true });
};

document.querySelectorAll("[data-quiz-answer]").forEach((button) => {
  button.addEventListener("click", () => {
    if (quizStep < quizSteps.length - 1) {
      showQuizStep(quizStep + 1);
      return;
    }
    document.documentElement.classList.remove("quiz-active");
    document.documentElement.classList.add("quiz-complete");
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.querySelector(".article-hero h1")?.focus({ preventScroll: true });
  });
});

document.querySelectorAll("[data-quiz-back]").forEach((button) => {
  button.addEventListener("click", () => showQuizStep(Math.max(0, quizStep - 1)));
});

const placePromoBox = () => {
  if (!sidebar || !contentGrid || !articleHero) return;

  if (mobileLayout.matches) {
    articleHero.insertAdjacentElement("afterend", sidebar);
    sidebar.classList.add("mobile-inline");
  } else {
    contentGrid.append(sidebar);
    sidebar.classList.remove("mobile-inline");
  }
};

placePromoBox();
mobileLayout.addEventListener("change", placePromoBox);

if (dateNode) {
  const now = new Date();
  dateNode.textContent = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
}

if (form && statusNode) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    statusNode.textContent = "Formularz demonstracyjny — dane nie zostały wysłane.";
  });
}

const updateProgress = () => {
  if (!progressBar) return;

  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
};

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -30px" },
  );

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}
