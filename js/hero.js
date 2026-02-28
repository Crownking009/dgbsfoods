/* =============================================
   DGBS DELIGHTS FOODS — hero.js
   Cinematic Auto-Advancing Carousel
   ============================================= */

(function () {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const progress = document.querySelector('.hero-progress');
  const DURATION = 6000;
  let current = 0;
  let timer = null;
  let startTime = null;
  let animFrame = null;
  let paused = false;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
    resetProgress();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function resetProgress() {
    clearTimeout(timer);
    cancelAnimationFrame(animFrame);
    startTime = performance.now();
    animateProgress();
    timer = setTimeout(next, DURATION);
  }

  function animateProgress() {
    if (paused) return;
    const elapsed = performance.now() - startTime;
    const pct = Math.min((elapsed / DURATION) * 100, 100);
    if (progress) progress.style.width = pct + '%';
    if (pct < 100) animFrame = requestAnimationFrame(animateProgress);
  }

  // Dots
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  // Arrow buttons
  document.querySelector('.hero-prev')?.addEventListener('click', prev);
  document.querySelector('.hero-next')?.addEventListener('click', next);

  // Pause on hover
  const hero = document.querySelector('.hero');
  hero?.addEventListener('mouseenter', () => {
    paused = true;
    clearTimeout(timer);
    cancelAnimationFrame(animFrame);
  });

  hero?.addEventListener('mouseleave', () => {
    paused = false;
    startTime = performance.now() - (parseFloat(progress?.style.width || 0) / 100) * DURATION;
    animateProgress();
    const remaining = DURATION - (performance.now() - startTime);
    timer = setTimeout(next, Math.max(remaining, 500));
  });

  // Touch/swipe
  let touchStartX = 0;
  hero?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  hero?.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  }, { passive: true });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  // Init
  slides[0]?.classList.add('active');
  dots[0]?.classList.add('active');
  resetProgress();
})();
