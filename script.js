// Sticky nav + mobile menu
const nav = document.querySelector('.nav'), menu = document.querySelector('.menu');
addEventListener('scroll', () => nav.classList.toggle('stuck', scrollY > 40));
document.querySelector('.burger').onclick = () => menu.classList.toggle('show');
menu.querySelectorAll('a').forEach(a => a.onclick = () => menu.classList.remove('show'));

// Progress bars fill when scrolled into view
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.querySelector('i').style.width = e.target.dataset.v + '%'; io.unobserve(e.target); }
}), { threshold: .5 });
document.querySelectorAll('.bar').forEach(b => io.observe(b));

// FAQ accordion (one open at a time)
document.querySelectorAll('.q button').forEach(btn => btn.onclick = () => {
  const q = btn.parentElement, was = q.classList.contains('open');
  document.querySelectorAll('.q').forEach(x => x.classList.remove('open'));
  if (!was) q.classList.add('open');
});

// How-it-works steps
document.querySelectorAll('.step .sh').forEach(h => h.onclick = () => {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('open'));
  h.parentElement.classList.add('open');
});

// Testimonial slider
const track = document.querySelector('.track'), slides = track.children, dotsBox = document.querySelector('.dotsnav');
let i = 0, timer;
[...slides].forEach((_, n) => {
  const d = document.createElement('button'); d.setAttribute('aria-label', 'Slide ' + (n + 1));
  d.onclick = () => { go(n); restart(); }; dotsBox.append(d);
});
function go(n) {
  i = (n + slides.length) % slides.length;
  track.style.transform = `translateX(-${i * 100}%)`;
  [...dotsBox.children].forEach((d, k) => d.classList.toggle('on', k === i));
  [...slides].forEach((q, k) => q.classList.toggle('act', k === i));
}
function restart() { clearInterval(timer); timer = setInterval(() => go(i + 1), 5000); }
go(0); restart();

// Newsletter demo
document.querySelector('.news').onsubmit = e => { e.preventDefault(); e.target.reset(); alert('Thanks for subscribing!'); };

/* ===== ANIMATIONS ===== */
const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

// Scroll progress bar, nav hide/show, parallax
const prog = document.createElement('div'); prog.id = 'prog'; document.body.append(prog);
const heroIn = document.querySelector('.hero-in');
const par = [['.drone', .07], ['.map', .08], ['.collage .small', -.06], ['.faqimg .two', -.07]]
  .map(([s, k]) => [document.querySelector(s), k]);
let ly = 0, tick = false;
function onScroll() {
  const y = scrollY;
  prog.style.width = y / (document.documentElement.scrollHeight - innerHeight) * 100 + '%';
  nav.classList.toggle('hide', y > ly && y > 300 && !menu.classList.contains('show'));
  ly = y;
  if (reduce) return;
  heroIn.style.translate = `0 ${Math.min(y, 800) * .12}px`;
  par.forEach(([el, k]) => {
    const r = el.parentElement.getBoundingClientRect();
    el.style.translate = `0 ${(innerHeight / 2 - (r.top + r.height / 2)) * k}px`;
  });
}
addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(() => { onScroll(); tick = false; }); } }, { passive: true });
onScroll();

if (!reduce) {
  // Reveal on scroll (staggered by position among siblings)
  const rio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target; rio.unobserve(el); el.classList.add('in');
    const d = parseFloat(el.style.getPropertyValue('--d')) || 0;
    setTimeout(() => el.classList.remove('rv', 'in'), 1300 + d * 1000); // frees hover transforms
  }), { threshold: .15, rootMargin: '0px 0px -40px 0px' });
  const R = (sel, type) => document.querySelectorAll(sel).forEach(el => {
    el.classList.add('rv'); if (type) el.dataset.rv = type;
    el.style.setProperty('--d', [...el.parentElement.children].indexOf(el) * .12 + 's');
    rio.observe(el);
  });
  R('.sec .eyebrow,.cta .eyebrow,.cta p:not(.eyebrow),.cta .btn,.center>p,.about p.muted,.lic,.bar,.about .btn,.trust,.head-row .btn,.testi>div:first-child p:not(.eyebrow),.how p.muted');
  R('.collage .big', 'left'); R('.years', 'right'); R('.faqimg .one', 'left'); R('.badge', 'zoom');
  R('.card,.case,.post,.step,.q'); R('.fbox', 'zoom'); R('.map', 'zoom');
  R('.fgrid>div'); R('.copy'); R('.slider');
  R('.sgrid>div,.dl-tabs,.dl-panel,.cmp,.fw,.plan,.tog'); R('.tl-item:nth-child(odd)','left'); R('.tl-item:nth-child(even)','right');

  // Count-up numbers
  const count = (el, to, fmt) => {
    const t0 = performance.now();
    (function f(t) {
      const p = Math.min((t - t0) / 1600, 1);
      el.textContent = fmt(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(f);
    })(t0);
  };
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target; cio.unobserve(el);
    if (el.matches('.years strong')) count(el, 13, n => n + '+');
    else if (el.matches('.badge b')) count(el, 250, n => n + ' +');
    else count(el, +el.dataset.to, n => n + '%');
  }), { threshold: .6 });
  document.querySelectorAll('.bar span').forEach(s => { s.dataset.to = s.closest('.bar').dataset.v; cio.observe(s); });
  document.querySelectorAll('.years strong,.badge b').forEach(el => cio.observe(el));
}

/* ===== NEW SECTIONS ===== */
const tween = (el, to, fmt, ms = 1600) => {
  const from = +el.textContent.replace(/\D/g, '') || 0, t0 = performance.now();
  (function f(t) {
    const p = reduce ? 1 : Math.min((t - t0) / ms, 1);
    el.textContent = fmt(Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(f);
  })(t0);
};

// Marquee: duplicate content for a seamless loop
const mt = document.querySelector('.marq-t'); mt.innerHTML += mt.innerHTML;

// Stats count-up
const sio = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; sio.unobserve(e.target);
  const b = e.target, s = b.dataset.s;
  b.textContent = '0'; tween(b, +b.dataset.c, n => n.toLocaleString('en-US') + s);
}), { threshold: .8 });
if (!reduce) document.querySelectorAll('.sgrid b').forEach(b => sio.observe(b));

// Deliverables tabs
const dt = [...document.querySelectorAll('.dl-tabs button')], dp = [...document.querySelectorAll('.tp')];
dt.forEach((t, i) => t.onclick = () => {
  dt.forEach((x, k) => { x.classList.toggle('on', k === i); x.setAttribute('aria-selected', k === i); });
  dp.forEach((p, k) => p.classList.toggle('on', k === i));
});

// Before/after slider (+ one intro sweep)
const cmp = document.querySelector('.cmp'), cr = cmp.querySelector('input');
const setP = v => { cmp.style.setProperty('--p', v + '%'); cr.value = v; };
cr.oninput = () => setP(cr.value);
if (!reduce) new IntersectionObserver((es, o) => es.forEach(e => {
  if (!e.isIntersecting) return; o.disconnect();
  const t0 = performance.now();
  (function f(t) { const p = Math.min((t - t0) / 2600, 1); setP(50 + 38 * Math.sin(p * Math.PI * 2) * (1 - p)); if (p < 1) requestAnimationFrame(f); })(t0);
}), { threshold: .7 }).observe(cmp);

// Timeline: line draws with scroll, dots light up
const tl = document.querySelector('.tl');
function tlUpd() {
  const r = tl.getBoundingClientRect();
  tl.style.setProperty('--tl', Math.max(0, Math.min(1, (innerHeight * .65 - r.top) / r.height)));
  tl.querySelectorAll('.tl-item').forEach(it => it.classList.toggle('on', it.getBoundingClientRect().top < innerHeight * .65));
}
addEventListener('scroll', tlUpd, { passive: true }); tlUpd();

// Pricing toggle with rolling numbers
const sw = document.querySelector('.sw');
sw.onclick = () => {
  sw.classList.toggle('on'); const on = sw.classList.contains('on');
  document.querySelector('.tog').classList.toggle('ann', on);
  document.querySelectorAll('.price b[data-a]').forEach(b => tween(b, +(on ? b.dataset.b : b.dataset.a), n => n.toLocaleString('en-US'), 700));
};

/* ===== EXTRA SCROLL EFFECTS ===== */
const mq = document.querySelector('.marq'), canHover = matchMedia('(hover:hover)').matches;
const tt = document.createElement('button'); tt.className = 'totop'; tt.setAttribute('aria-label', 'Back to top');
tt.onclick = () => scrollTo({ top: 0, behavior: 'smooth' }); document.body.append(tt);

// Scrollspy: highlight the current nav link
const links = [...document.querySelectorAll('.menu a')];
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(a => a.classList.toggle('act', a.getAttribute('href') === '#' + e.target.id));
}), { rootMargin: '-50% 0px -50% 0px' });
['about', 'services', 'cases', 'blog', 'contact'].forEach(id => spy.observe(document.getElementById(id)));

// Ghost words that drift horizontally with scroll
const ghosts = [['deliver', 'DELIVERABLES'], ['why', 'PRECISION'], ['tech', 'SENSORS'], ['story', 'SINCE 2013'], ['pricing', 'PLANS']].map(([id, t], i) => {
  const s = document.getElementById(id), g = document.createElement('span');
  g.className = 'ghost'; g.textContent = t; g.setAttribute('aria-hidden', 'true'); s.prepend(g);
  return [s, g, i % 2 ? 1 : -1];
});

let pv = scrollY, st, ft = false;
function fx() {
  const y = scrollY, dy = y - pv; pv = y;
  tt.style.setProperty('--sp', y / (document.documentElement.scrollHeight - innerHeight) * 100 + '%');
  tt.classList.toggle('show', y > 700);
  if (reduce) return;
  heroIn.style.opacity = Math.max(0, 1 - y / 650);
  mq.style.transform = `rotate(-1.5deg) skewX(${Math.max(-10, Math.min(10, -dy * .6))}deg)`;
  clearTimeout(st); st = setTimeout(() => mq.style.transform = '', 150);
  ghosts.forEach(([s, g, d]) => { g.style.translate = `${d * (innerHeight - s.getBoundingClientRect().top) * .18}px -50%`; });
}
addEventListener('scroll', () => { if (!ft) { ft = true; requestAnimationFrame(() => { fx(); ft = false; }); } }, { passive: true });
fx();

if (!reduce) {
  // Word-by-word heading reveal
  const split = (n, c) => [...n.childNodes].forEach(k => {
    if (k.nodeType === 3) {
      const f = document.createDocumentFragment();
      k.textContent.split(/(\s+)/).forEach(t => {
        if (!t) return;
        if (/^\s+$/.test(t)) return f.append(' ');
        const w = document.createElement('span'), i = document.createElement('i');
        w.className = 'w'; i.style.setProperty('--i', c.i++); i.textContent = t; w.append(i); f.append(w);
      });
      k.replaceWith(f);
    } else if (k.nodeType === 1) split(k, c);
  });
  const hio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('h-in'); hio.unobserve(e.target); } }), { threshold: .3 });
  document.querySelectorAll('.sec h2,.cta h2').forEach(h => { const label = h.textContent; split(h, { i: 0 }); h.setAttribute('aria-label', label); hio.observe(h); });

  // Image wipe reveals
  const wio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; wio.unobserve(e.target); e.target.classList.add('in');
    setTimeout(() => e.target.classList.remove('wipe', 'in'), 1500);
  }), { threshold: .25 });
  document.querySelectorAll('.post .ph,.card .ph,.collage .small,.faqimg .two').forEach(el => { el.classList.add('wipe'); wio.observe(el); });

  // Process steps open as they pass the middle of the screen
  const stepIO = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    document.querySelectorAll('.step').forEach(s => s.classList.remove('open')); e.target.classList.add('open');
  }), { rootMargin: '-45% 0px -45% 0px' });
  document.querySelectorAll('.step').forEach(s => stepIO.observe(s));

  if (canHover) {
    // 3D tilt on cards
    document.querySelectorAll('.card,.plan,.case,.post,.watch').forEach(el => {
      el.addEventListener('mousemove', e => {
        if (el.classList.contains('rv')) return;
        const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `perspective(900px) rotateX(${-y * 7}deg) rotateY(${x * 9}deg) translateY(-8px)`;
      });
      el.addEventListener('mouseleave', () => el.style.transform = '');
    });
    // Magnetic buttons
    document.querySelectorAll('.btn').forEach(b => {
      b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); b.style.translate = `${(e.clientX - r.left - r.width / 2) * .2}px ${(e.clientY - r.top - r.height / 2) * .3}px`; });
      b.addEventListener('mouseleave', () => b.style.translate = '');
    });
    // Spotlight glow on dark sections
    document.querySelectorAll('.dark').forEach(s => s.addEventListener('mousemove', e => {
      const r = s.getBoundingClientRect(); s.style.setProperty('--mx', e.clientX - r.left + 'px'); s.style.setProperty('--my', e.clientY - r.top + 'px');
    }));
  }
}