
    const deck = document.getElementById('deck');
    const narrativeOrder = [
      'Rivane',
      'Problem',
      'Customer',
      'Market',
      'Why now',
      'Capital momentum',
      'Product',
      'Product status',
      'Competition',
      'Business model',
      'Founder',
      'Next milestone'
    ];

    narrativeOrder.forEach(title => {
      const slide = [...deck.children].find(item => item.dataset.title === title);
      if (slide) deck.append(slide);
    });

    const slides = [...document.querySelectorAll('.slide')];
    slides.forEach((slide, index) => {
      const position = index + 1;
      slide.setAttribute('aria-label', `Slide ${position} of ${slides.length}`);
      const number = slide.querySelector('.slide-no');
      if (number) number.textContent = `${String(position).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    });
    const dots = document.getElementById('dots');
    const progress = document.getElementById('progress');
    const prev = document.getElementById('prev');
    const next = document.getElementById('next');
    const fullscreen = document.getElementById('fullscreen');
    const overview = document.getElementById('overview');
    let current = Math.max(0, Math.min(slides.length - 1, Number(location.hash.replace('#', '')) - 1 || 0));
    let cleanupTimer;

    function scaleDeck() {
      const scale = Math.min(innerWidth / 1600, innerHeight / 900);
      deck.style.top = "50%";
      document.body.classList.toggle("controls-over-slide", innerHeight - 900 * scale < 100);
      deck.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }

    function buildDots() {
      slides.forEach((slide, index) => {
        const button = document.createElement('button');
        button.className = 'dot';
        button.setAttribute('aria-label', `Go to slide ${index + 1}: ${slide.dataset.title}`);
        button.title = slide.dataset.title;
        button.addEventListener('click', () => show(index));
        dots.append(button);
      });
    }

    function show(index, push = true) {
      index = Math.max(0, Math.min(slides.length - 1, index));
      clearTimeout(cleanupTimer);
      const outgoing = current;
      slides.forEach((slide, i) => {
        slide.classList.remove('was-active');
        if (i === outgoing && i !== index) slide.classList.add('was-active');
        slide.classList.toggle('active', i === index); slide.inert = i !== index; slide.setAttribute('aria-hidden', String(i !== index));
      });
      current = index;
      slides.forEach((slide, i) => slide.querySelectorAll('video').forEach(video => {
        if (i === current && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
          video.currentTime = 0;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }));
      cleanupTimer = setTimeout(() => slides.forEach((slide, i) => i !== current && slide.classList.remove('was-active')), 560);
      [...dots.children].forEach((dot, i) => dot.classList.toggle('active', i === current));
      progress.style.width = `${((current + 1) / slides.length) * 100}%`;
      prev.disabled = current === 0;
      next.disabled = current === slides.length - 1;
      document.title = `${slides[current].dataset.title} · Rivane`;
      if (push) history.replaceState(null, '', `#${current + 1}`);
    }

    function move(amount) { show(current + amount); }

    function toggleFullscreen() {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
      else document.exitFullscreen?.();
    }

    function toggleOverview(force) {
      const open = force ?? !overview.classList.contains('open');
      overview.classList.toggle('open', open);
      if (!open) overview.innerHTML = '';
      if (open && !overview.children.length) {
        slides.forEach((slide, index) => {
          const thumb = document.createElement('button');
          thumb.className = 'thumb';
          thumb.innerHTML = `<span class="thumb-label">${String(index + 1).padStart(2, '0')} · ${slide.dataset.title}</span>`;
          const clone = slide.cloneNode(true);
          clone.classList.add('active');
          clone.classList.remove('was-active');
          clone.style.position = 'absolute';
          clone.style.transform = 'scale(.21875)';
          clone.style.transformOrigin = 'top left';
          clone.style.width = '1600px';
          clone.style.height = '900px';
          clone.querySelectorAll('video').forEach(video => { video.autoplay = false; video.removeAttribute('src'); });
          clone.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
          thumb.prepend(clone);
          thumb.addEventListener('click', () => { show(index); toggleOverview(false); });
          overview.append(thumb);
        });
      }
    }

    function buildCompetitorPopovers() {
      document.querySelectorAll('.map-point[data-popover]').forEach((point, index) => {
        const tooltip = document.createElement('aside');
        tooltip.className = 'map-popover';
        tooltip.id = `competitor-popover-${index + 1}`;
        tooltip.setAttribute('role', 'tooltip');

        const name = document.createElement('p');
        name.className = 'map-popover-name';
        name.textContent = point.dataset.name;

        const summary = document.createElement('p');
        summary.className = 'map-popover-summary';
        summary.textContent = point.dataset.popover;

        const stats = document.createElement('dl');
        stats.className = 'map-popover-stats';
        [
          ['Revenue', point.dataset.revenue],
          ['Value / capital', point.dataset.capital],
          ['Reach', point.dataset.reach],
          ['Market', point.dataset.market]
        ].forEach(([label, value]) => {
          const row = document.createElement('div');
          row.className = 'map-popover-stat';
          const term = document.createElement('dt');
          const detail = document.createElement('dd');
          term.textContent = label;
          detail.textContent = value;
          row.append(term, detail);
          stats.append(row);
        });

        const note = document.createElement('small');
        note.className = 'map-popover-note';
        note.textContent = 'Latest public figure available by Sep 2026 · company claims may be unaudited';

        tooltip.append(name, summary, stats, note);
        point.append(tooltip);
        point.setAttribute('aria-describedby', tooltip.id);
      });
    }

    buildCompetitorPopovers();
    buildDots();
    slides.forEach((slide, index) => slide.classList.toggle('active', index === current));
    show(current, false);
    scaleDeck();
    addEventListener('resize', scaleDeck);
    prev.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    fullscreen.addEventListener('click', toggleFullscreen);

    document.addEventListener('keydown', event => {
      if (event.target.closest('a,button') && event.key === ' ') return;
      if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') { event.preventDefault(); move(1); }
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') { event.preventDefault(); move(-1); }
      if (event.key === 'Home') { event.preventDefault(); show(0); }
      if (event.key === 'End') { event.preventDefault(); show(slides.length - 1); }
      if (event.key.toLowerCase() === 'f') toggleFullscreen();
      if (event.key.toLowerCase() === 'o') toggleOverview();
      if (event.key.toLowerCase() === 'h') {
        document.body.classList.add('show-help');
        clearTimeout(window.helpTimer);
        window.helpTimer = setTimeout(() => document.body.classList.remove('show-help'), 2600);
      }
      if (event.key === 'Escape' && overview.classList.contains('open')) toggleOverview(false);
    });

    let touchStartX = 0;
    document.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
    document.addEventListener('touchend', event => {
      const delta = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 52) move(delta < 0 ? 1 : -1);
    }, { passive: true });
  
addEventListener('hashchange',()=>show((parseInt(location.hash.slice(1))||1)-1,false));

document.querySelectorAll('.erp-trigger').forEach(erpTrigger => {
const erpCategory = erpTrigger.closest('.positioning-category');
function setErpOpen(open) {
  erpCategory.classList.toggle('is-open', open);
  erpCategory.classList.toggle('is-dismissed', !open);
  erpTrigger.setAttribute('aria-expanded', String(open));
}
erpCategory.addEventListener('mouseenter', () => setErpOpen(true));
erpCategory.addEventListener('mouseleave', () => {
  if (!erpCategory.contains(document.activeElement)) setErpOpen(false);
});
erpTrigger.addEventListener('focus', () => setErpOpen(true));
erpTrigger.addEventListener('click', () => setErpOpen(true));
erpCategory.addEventListener('focusout', event => {
  if (!erpCategory.contains(event.relatedTarget)) setErpOpen(false);
});
document.addEventListener('pointerdown', event => {
  if (!erpCategory.contains(event.target)) setErpOpen(false);
});
erpTrigger.addEventListener('keydown', event => {
  if (event.key === 'Escape') { event.preventDefault(); setErpOpen(false); }
});

});
