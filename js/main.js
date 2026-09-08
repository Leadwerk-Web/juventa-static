const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window) {
  root.classList.add('js');
  const reveal = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const delay = Number(entry.target.getAttribute('data-anim-delay') || 0);
      if (delay) entry.target.style.animationDelay = `${delay}ms`;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px 0px 0px', threshold: 0 });
  document.querySelectorAll('.anim').forEach((element) => reveal.observe(element));
}

const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
if (navToggle && header) {
  navToggle.addEventListener('click', () => {
    const open = header.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

const YT_ID = 'Lybg-xky7B4';
const YT_END = 61;
const heroMedia = document.querySelector('.hero-media');
const heroMount = document.querySelector('[data-hero-yt]');
const heroVideo = document.querySelector('[data-hero-video]');
const heroPoster = document.querySelector('.hero-poster');

const hideEl = (el) => { if (el) el.hidden = true; };
const showEl = (el) => { if (el) el.hidden = false; };
const heroSection = document.querySelector('.hero');
const setHeroPlaying = (playing) => {
  heroSection?.classList.toggle('is-playing', playing);
  if (playing) hideEl(heroPoster);
};

const playLocalHero = () => {
  hideEl(heroMount);
  if (!heroVideo) return;
  showEl(heroVideo);
  heroVideo.muted = true;
  heroVideo.loop = true;
  const onPlay = () => setHeroPlaying(true);
  heroVideo.addEventListener('playing', onPlay, { once: true });
  heroVideo.play().then(onPlay).catch(() => {
    setHeroPlaying(false);
    showEl(heroPoster);
  });
};

const ytCommand = (win, func, args = []) => {
  win.postMessage(JSON.stringify({ event: 'command', func, args }), '*');
};

const mountYouTubeHero = () => {
  if (!heroMount || !heroMedia) {
    playLocalHero();
    return;
  }
  const origin = encodeURIComponent(window.location.origin);
  const src = `https://www.youtube.com/embed/${YT_ID}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&cc_load_policy=0&enablejsapi=1&loop=1&playlist=${YT_ID}&start=0&end=${YT_END}&origin=${origin}`;
  const frame = document.createElement('iframe');
  frame.title = 'Willkommen in der Brückenmühle';
  frame.src = src;
  frame.allow = 'autoplay; encrypted-media; picture-in-picture';
  frame.setAttribute('allowfullscreen', '');
  frame.tabIndex = -1;
  frame.setAttribute('aria-hidden', 'true');
  heroMount.append(frame);
  showEl(heroMount);

  let ready = false;
  const markReady = () => {
    if (ready) return;
    ready = true;
    window.clearTimeout(fallback);
    hideEl(heroVideo);
    setHeroPlaying(true);
  };
  const fallback = window.setTimeout(() => {
    if (ready) return;
    frame.remove();
    playLocalHero();
  }, 8000);

  window.addEventListener('message', (event) => {
    if (!String(event.origin).includes('youtube')) return;
    let data = event.data;
    if (typeof data === 'string') {
      try { data = JSON.parse(data); } catch { return; }
    }
    if (!data) return;
    if (data.event === 'onReady' || data.event === 'initialDelivery' || data.event === 'infoDelivery') {
      markReady();
      ytCommand(frame.contentWindow, 'playVideo');
      ytCommand(frame.contentWindow, 'mute');
    }
    if (data.event === 'onStateChange' && (data.info === 0 || data.info === 2)) {
      ytCommand(frame.contentWindow, 'seekTo', [0, true]);
      ytCommand(frame.contentWindow, 'playVideo');
    }
  });

  frame.addEventListener('load', () => {
    frame.contentWindow?.postMessage(JSON.stringify({ event: 'listening', id: 1 }), '*');
    window.setTimeout(markReady, 1400);
  });
};

if (heroMedia) {
  if (reduceMotion) {
    showEl(heroPoster);
    hideEl(heroMount);
    hideEl(heroVideo);
  } else {
    mountYouTubeHero();
  }
}

const fxLayer = document.querySelector('[data-mouse-fx]');
const finePointer = window.matchMedia('(pointer: fine)').matches;
if (fxLayer && !reduceMotion && finePointer) {
  window.addEventListener('mousemove', (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 36;
    const y = (event.clientY / window.innerHeight - 0.5) * 24;
    fxLayer.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.08)`;
  }, { passive: true });
}

const countdown = document.querySelector('[data-countdown]');
if (countdown) {
  const target = Number(countdown.getAttribute('data-countdown')) * 1000;
  const number = countdown.querySelector('[data-countdown-number]');
  const label = countdown.querySelector('[data-countdown-label]');
  const tick = () => {
    const days = Math.max(0, Math.ceil((target - Date.now()) / 86400000));
    if (number) number.textContent = String(days).padStart(2, '0');
    if (label) label.textContent = days === 1 ? 'Tag' : 'Tage';
  };
  tick();
  window.setInterval(tick, 60000);
}

document.querySelectorAll('[data-slider]').forEach((slider) => {
  const track = slider.querySelector('[data-slider-track]');
  const dotsHost = slider.querySelector('[data-slider-dots]');
  const slides = track ? [...track.children] : [];
  if (!track || slides.length === 0) return;
  let index = 0;
  let timer = 0;
  const dots = slides.map((_, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', `Bild ${i + 1}`);
    btn.addEventListener('click', () => go(i, true));
    dotsHost?.append(btn);
    return btn;
  });
  const go = (next, pause) => {
    index = (next + slides.length) % slides.length;
    track.style.transitionDuration = '500ms';
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
    if (pause) restart();
  };
  const restart = () => {
    window.clearInterval(timer);
    timer = window.setInterval(() => go(index + 1), 5000);
  };
  slider.querySelector('[data-slider-prev]')?.addEventListener('click', () => go(index - 1, true));
  slider.querySelector('[data-slider-next]')?.addEventListener('click', () => go(index + 1, true));
  slider.addEventListener('mouseenter', () => window.clearInterval(timer));
  slider.addEventListener('mouseleave', restart);
  go(0);
  if (!reduceMotion) restart();
});
