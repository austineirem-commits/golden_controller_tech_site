// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', links.classList.contains('open'));
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.14 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  initLattice();
  renderAppsPortfolio();
});

// Renders the "Our Apps" portfolio grid from window.GCT_APPS (apps-data.js).
// Editing which apps show up only requires editing apps-data.js — this
// function just draws whatever is in that list.
function renderAppsPortfolio() {
  const grid = document.getElementById('apps-portfolio-grid');
  if (!grid) return;

  const apps = window.GCT_APPS || [];

  if (!apps.length) {
    grid.outerHTML = `
      <div class="apps-empty reveal in">
        <p>No apps published yet. Add one in <code>apps-data.js</code> and it'll show up here.</p>
      </div>`;
    return;
  }

  grid.innerHTML = apps.map(app => {
    const hasLink = app.url && app.url.trim().length > 0;
    const footerRight = hasLink
      ? `<a class="app-card-link" href="${escapeHtml(app.url)}" target="_blank" rel="noopener">View app →</a>`
      : `<span class="app-card-soon">Coming soon</span>`;
    return `
      <div class="app-card">
        <div class="app-card-top">
          <div class="app-card-icon">
            <img src="${escapeHtml(app.icon || 'assets/apps/placeholder-icon.png')}" alt="${escapeHtml(app.name || 'App')} icon" loading="lazy">
          </div>
          <div class="app-card-title">
            <h3>${escapeHtml(app.name || 'Untitled app')}</h3>
            ${app.status ? `<span class="status-pill">${escapeHtml(app.status)}</span>` : ''}
          </div>
        </div>
        ${app.tagline ? `<p class="app-card-tagline">${escapeHtml(app.tagline)}</p>` : ''}
        ${app.description ? `<p class="app-card-desc">${escapeHtml(app.description)}</p>` : ''}
        <div class="app-card-footer">
          <span class="app-card-platform">${escapeHtml(app.platform || '')}</span>
          ${footerRight}
        </div>
      </div>`;
  }).join('');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Signature hero element: a hexagonal node lattice that pulses like a
// controller's circuit board / the GCT ecosystem of connected services.
function initLattice() {
  const canvas = document.getElementById('lattice');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w, h, dpr;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    w = rect.width; h = rect.height;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  // Build hex-grid node positions
  const nodes = [];
  const rings = 3;
  const cx = () => w / 2, cy = () => h / 2;
  const baseR = () => Math.min(w, h) * 0.11;

  function buildNodes() {
    nodes.length = 0;
    nodes.push({ a: 0, r: 0 });
    for (let ring = 1; ring <= rings; ring++) {
      const count = ring === 1 ? 6 : 6 * ring;
      for (let i = 0; i < count; i++) {
        nodes.push({ a: (Math.PI * 2 * i) / count + ring * 0.12, r: ring, ringIdx: i });
      }
    }
  }
  buildNodes();

  function pos(n, t) {
    const R = baseR() * n.r * 1.55 + (n.r === 0 ? 0 : 0);
    const wobble = reduceMotion ? 0 : Math.sin(t * 0.0006 + n.r * 1.3 + n.a) * 3.5;
    const angle = n.a + (reduceMotion ? 0 : t * 0.00004 * (n.r % 2 === 0 ? 1 : -1));
    return {
      x: cx() + Math.cos(angle) * (R + wobble),
      y: cy() + Math.sin(angle) * (R + wobble)
    };
  }

  const gold1 = 'rgba(247,215,116,';
  const gold2 = 'rgba(224,168,39,';

  function draw(t) {
    ctx.clearRect(0, 0, w, h);

    const positions = nodes.map(n => pos(n, t));

    // connective lines: center to ring1, ring to ring (nearest neighbours)
    ctx.lineWidth = 1;
    for (let i = 1; i < positions.length; i++) {
      const n = nodes[i];
      if (n.r === 1) {
        ctx.strokeStyle = gold2 + '0.35)';
        ctx.beginPath();
        ctx.moveTo(positions[0].x, positions[0].y);
        ctx.lineTo(positions[i].x, positions[i].y);
        ctx.stroke();
      }
    }
    for (let i = 1; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const a = nodes[i], b = nodes[j];
        if (a.r === b.r) {
          const dx = positions[i].x - positions[j].x, dy = positions[i].y - positions[j].y;
          const dist = Math.hypot(dx, dy);
          const maxDist = (baseR() * a.r * 1.55) * 1.05;
          if (dist < maxDist * 0.75) {
            ctx.strokeStyle = gold2 + (a.r === 1 ? '0.28)' : '0.14)');
            ctx.beginPath();
            ctx.moveTo(positions[i].x, positions[i].y);
            ctx.lineTo(positions[j].x, positions[j].y);
            ctx.stroke();
          }
        }
      }
    }

    // nodes
    positions.forEach((p, i) => {
      const n = nodes[i];
      const pulse = reduceMotion ? 0 : Math.sin(t * 0.0016 + n.r * 2 + n.a) * 0.5 + 0.5;
      const radius = n.r === 0 ? 6 : Math.max(1.6, 3.6 - n.r * 0.6);
      ctx.beginPath();
      ctx.fillStyle = n.r === 0 ? gold1 + '0.95)' : gold1 + (0.35 + pulse * 0.4) + ')';
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fill();
      if (n.r === 0) {
        ctx.beginPath();
        ctx.strokeStyle = gold1 + '0.5)';
        ctx.arc(p.x, p.y, radius + 5 + pulse * 3, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
  }

  function frame(t) {
    draw(t);
    if (!reduceMotion) requestAnimationFrame(frame);
  }
  if (reduceMotion) {
    draw(0);
  } else {
    requestAnimationFrame(frame);
  }
}