const counterItems = document.querySelectorAll('.count');
const progressFills = document.querySelectorAll('.fill');
const observerOptions = { threshold: 0.35 };

const animateNumber = (element) => {
  const target = parseInt(element.dataset.target, 10);
  const duration = 1400;
  const start = 0;
  let startTime = null;

  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    element.textContent = Math.floor(progress * (target - start) + start);
    if (progress < 1) window.requestAnimationFrame(step);
  };

  window.requestAnimationFrame(step);
};

const animateProgress = (element) => {
  const width = element.dataset.width;
  element.style.width = width;
};

const revealOnIntersect = (entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const target = entry.target;
    if (target.classList.contains('count')) {
      if (!target.dataset.animated) {
        animateNumber(target);
        target.dataset.animated = 'true';
      }
    }
    if (target.classList.contains('fill')) {
      animateProgress(target);
      observer.unobserve(target);
    }
    if (target.classList.contains('timeline-step')) {
      target.classList.add('active');
    }
  });
};

const observer = new IntersectionObserver(revealOnIntersect, observerOptions);

counterItems.forEach((counter) => observer.observe(counter));
progressFills.forEach((fill) => observer.observe(fill));

document.querySelectorAll('.timeline-step').forEach((step) => observer.observe(step));

window.addEventListener('load', () => {
  document.querySelectorAll('.marquee span').forEach((span) => {
    const clone = span.cloneNode(true);
    document.querySelector('.marquee').appendChild(clone);
  });
});
