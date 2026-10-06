/* Tanks for Watching — shop front.
   Hash-routed single page: #/  #/shop  #/product/<id>. Cart persists in localStorage. */

// ── Content. Edit prices, copy and photos here. ────────────────────────────
const PHOTOS = {
  // slot id → image path. Leave a slot out (or empty) and the page shows a labelled placeholder.
  'hero-tank': 'img/hero-shrimp.webp',
  'prod-cherry': 'img/cherry-shrimp.webp',
  'cherry-t1': 'img/hero-shrimp.webp',
  'cherry-t2': '',
  'cherry-t3': '',
  'prod-snails': '',
  'prod-combo': '',
  'channel-thumb': '',
};
const CHANNEL_URL = 'https://youtube.com';
const LATEST_VIDEO_URL = 'https://youtube.com';

const PRODUCTS = [
  { id: 'cherry', cat: 'shrimp', name: 'Cherry Shrimp', latin: 'Neocaridina davidi', tag: 'Beginner friendly',
    short: 'Bright red, hardy and busy all day. A good first shrimp for a planted tank.',
    blurb: 'Bred in our planted tanks and picked from mixed sizes and sexes, so your colony can start breeding right away. Hardy, peaceful and easy to keep in most tap water.',
    slotHint: 'Cherry shrimp photo',
    options: [{ label: '10 shrimp', price: 30 }, { label: '20 shrimp', price: 55 }, { label: '30 shrimp', price: 75 }],
    care: [['Tank size', '5 gallons or more'], ['Temperature', '65–78°F'], ['pH', '6.5–8.0'], ['GH', '4–8 dGH']] },
  { id: 'snails', cat: 'snails', name: 'Bladder Snails', latin: 'Physella acuta', tag: 'Cleanup crew',
    short: 'Tiny snails that clean up leftover food, biofilm and soft algae.',
    blurb: 'A small, tireless cleanup crew. Bladder snails eat leftover food, biofilm and soft algae, and they get along with shrimp and small fish. They breed easily, so start with a few.',
    slotHint: 'Bladder snail photo',
    options: [{ label: '10 snails', price: 8 }, { label: '25 snails', price: 15 }, { label: '50 snails', price: 25 }],
    care: [['Tank size', 'Any'], ['Temperature', '64–84°F'], ['pH', '7.0–8.0'], ['Adult size', 'Up to ½ inch']] },
  { id: 'combo', cat: 'bundle', name: 'Shrimp Tank Starter', latin: '10 cherry shrimp + 10 bladder snails', tag: 'Bundle',
    short: 'Everything a new shrimp tank needs to come alive.',
    blurb: 'Ten cherry shrimp and ten bladder snails in one box. The snails keep things tidy while the shrimp settle in. A simple way to stock a new nano tank.',
    slotHint: 'Bundle photo',
    options: [{ label: '10 + 10', price: 36 }, { label: '20 + 20', price: 64 }],
    care: [['Tank size', '5 gallons or more'], ['Temperature', '68–78°F'], ['pH', '7.0–7.8'], ['Tank age', 'Cycled, 4+ weeks']] },
];

const STEPS = [
  { n: '1', title: 'Order by Sunday', body: 'We hold orders until Monday so nothing sits in a warehouse over the weekend.' },
  { n: '2', title: 'Packed by hand', body: 'Bagged with tank water, moss to hold onto, and a heat or cold pack when the weather needs it.' },
  { n: '3', title: 'At your door overnight', body: 'Float the bag, drip acclimate for an hour, and watch them explore.' },
];

const FAQS = [
  { q: 'What if something arrives dead?', a: 'Take a photo of the unopened bag within 2 hours of delivery and email it to us. We will refund or reship the losses.' },
  { q: 'Do you ship in winter and summer?', a: 'Yes. Every box gets a heat pack or cold pack based on the forecast at your address. During extreme weather we may hold your order a few days.' },
  { q: 'Will cherry shrimp breed in my tank?', a: 'Usually, yes. Each pack is mixed sizes and sexes. Give them a cycled tank, stable water and some moss or plants to hide in.' },
  { q: 'Are bladder snails pests?', a: 'They breed quickly when there is extra food. Feed lightly and their numbers stay in check while they keep the tank clean.' },
];

const FILTERS = [['all', 'All'], ['shrimp', 'Shrimp'], ['snails', 'Snails'], ['bundle', 'Bundles']];

// ── Helpers ────────────────────────────────────────────────────────────────
const $ = (sel, root = document) => root.querySelector(sel);
const money = n => '$' + n.toFixed(2);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const prod = id => PRODUCTS.find(p => p.id === id);
const fromPrice = p => money(p.options[0].price);

const icon = {
  arrow: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>',
  play: '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2.75" stroke-linejoin="round" aria-hidden="true"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>',
  plus: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>',
  minus16: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"></path></svg>',
  plus16: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>',
  close: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>',
  shield: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-2-700)" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg>',
  truck: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-2-700)" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path><path d="M15 18H9"></path><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path><circle cx="17" cy="18" r="2"></circle><circle cx="7" cy="18" r="2"></circle></svg>',
};

// A photo slot: the image when one is set, otherwise a labelled placeholder.
function slot(id, hint, alt = '') {
  const src = PHOTOS[id];
  if (src) return `<div class="slot"><img src="${esc(src)}" alt="${esc(alt || hint)}" loading="lazy"></div>`;
  return `<div class="slot slot-empty" role="img" aria-label="${esc(hint)}"><span>${esc(hint)}</span></div>`;
}

// ── State ──────────────────────────────────────────────────────────────────
const state = { view: 'home', pid: 'cherry', opt: 0, qty: 1, cart: [], cartOpen: false, cartClosing: false, filter: 'all', email: '', subscribed: false };
try { const c = JSON.parse(localStorage.getItem('tfw-cart') || '[]'); if (Array.isArray(c)) state.cart = c; } catch (e) {}
function saveCart(cart) { state.cart = cart; try { localStorage.setItem('tfw-cart', JSON.stringify(cart)); } catch (e) {} renderCart(); }
const cartCount = () => state.cart.reduce((s, c) => s + c.qty, 0);

// ── Routing ────────────────────────────────────────────────────────────────
function parseHash() {
  const h = location.hash.replace(/^#\/?/, '');
  const [path, anchor] = h.split('#');
  const parts = path.split('/').filter(Boolean);
  if (parts[0] === 'shop') return { view: 'shop' };
  if (parts[0] === 'product' && prod(parts[1])) return { view: 'product', pid: parts[1] };
  return { view: 'home', anchor };
}
function route() {
  const r = parseHash();
  const changed = r.view !== state.view || (r.view === 'product' && r.pid !== state.pid);
  state.view = r.view;
  if (r.pid) state.pid = r.pid;
  if (changed) { state.opt = 0; state.qty = 1; }
  if (state.cartOpen) closeCart(true);
  render(changed);
  const el = r.anchor && document.getElementById(r.anchor);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
  else if (changed) window.scrollTo({ top: 0 });
}
window.addEventListener('hashchange', route);

// ── Views ──────────────────────────────────────────────────────────────────
function productCardFeatured(p) {
  return `<a class="feature-card" href="#/product/${p.id}">
    <div class="washed photo">${slot('prod-' + p.id, p.slotHint, p.name)}</div>
    <div class="feature-body">
      <span class="tag tag-accent-2">${esc(p.tag)}</span>
      <h3>${esc(p.name)}</h3>
      <div class="latin">${esc(p.latin)}</div>
      <p>${esc(p.short)}</p>
      <div class="price-row"><span class="from">From ${fromPrice(p)}</span><span class="view-link">View</span></div>
    </div></a>`;
}

function homeView() {
  return `<div class="tfw-view">
  <section class="wrap hero">
    <div class="hero-copy">
      <h1>Shrimp and snails from the tanks you watch.</h1>
      <p class="hero-lede">Cherry shrimp and bladder snails raised in the same planted tanks you see on the channel. Packed by hand, shipped overnight, guaranteed to arrive alive.</p>
      <div class="btn-row">
        <a class="btn btn-primary btn-lg" href="#/shop">Shop the tank</a>
        <a class="btn btn-secondary btn-lg" href="#/#channel">Watch on YouTube</a>
      </div>
    </div>
    <div class="washed hero-photo">${slot('hero-tank', 'Drop a photo of your tank or a shrimp close-up', 'Cherry shrimp on driftwood')}</div>
  </section>

  <section class="wrap promises">
    <div class="promises-grid">
      <div class="promise"><b>Raised in our tanks</b><span>Never resold from a wholesaler.</span></div>
      <div class="promise"><b>Overnight shipping</b><span>Heat or cold packs when the weather needs it.</span></div>
      <div class="promise"><b>Live arrival guarantee</b><span>Send a photo within 2 hours of delivery.</span></div>
    </div>
  </section>

  <section class="wrap section">
    <div class="section-head">
      <h2 class="h2">Shop the tank</h2>
      <a class="btn btn-ghost see-all" href="#/shop">See everything ${icon.arrow}</a>
    </div>
    <div class="featured-grid">${PRODUCTS.slice(0, 2).map(productCardFeatured).join('')}</div>
  </section>

  <section id="channel" class="wrap section">
    <div class="channel-grid">
      <a class="video" href="${esc(LATEST_VIDEO_URL)}" target="_blank" rel="noopener" aria-label="Watch the latest video">
        <div class="washed">${slot('channel-thumb', 'Drop your latest video thumbnail', 'Latest video')}</div>
        <div class="play">${icon.play}</div>
      </a>
      <div class="channel-copy">
        <h2 class="h2">You've seen these tanks. Now take some home.</h2>
        <p>Every colony on Tanks for Watching is filmed, fed and thinned out right here. When a tank gets crowded, the extras end up in this shop.</p>
        <div class="btn-row">
          <a class="btn btn-primary btn-md" href="${esc(CHANNEL_URL)}" target="_blank" rel="noopener">Subscribe on YouTube</a>
          <a class="btn btn-secondary btn-md" href="${esc(LATEST_VIDEO_URL)}" target="_blank" rel="noopener">Watch latest video</a>
        </div>
      </div>
    </div>
  </section>

  <section id="care" class="wrap section">
    <h2 class="h2 steps-head">From our tank to yours</h2>
    <div class="steps-grid">${STEPS.map(s => `
      <div class="step"><span class="step-n">${s.n}</span><h3>${esc(s.title)}</h3><p>${esc(s.body)}</p></div>`).join('')}
    </div>
  </section>

  <section id="faq" class="wrap section faq-grid">
    <div><h2 class="h2">Questions people ask</h2></div>
    <div class="faq-list">${FAQS.map(f => `
      <details><summary>${esc(f.q)}<span class="plus">${icon.plus}</span></summary><p>${esc(f.a)}</p></details>`).join('')}
    </div>
  </section>

  <section class="wrap signup-section">
    <div class="signup"><div class="signup-inner">
      <h2>Get first pick of the next batch</h2>
      <p>Colonies sell out between videos. Leave your email and we'll tell you when shrimp are back in stock.</p>
      ${state.subscribed
        ? `<div class="signup-done">You're on the list. We'll email you when the next batch is ready.</div>`
        : `<form id="subscribe" novalidate>
            <input class="input" type="email" id="email" name="email" placeholder="you@example.com" value="${esc(state.email)}" aria-label="Email address">
            <button type="submit" class="btn btn-primary">Notify me</button>
          </form>`}
    </div></div>
  </section>
  </div>`;
}

function shopView() {
  const list = PRODUCTS.filter(p => state.filter === 'all' || p.cat === state.filter);
  return `<div class="tfw-view wrap shop">
    <div class="crumbs"><a href="#/">Home</a> / Shop</div>
    <h1>Shop the tank</h1>
    <p class="shop-lede">Everything here was bred in our own planted tanks. Stock changes with each batch, so what you see is what's swimming right now.</p>
    <div class="filters">${FILTERS.map(([k, label]) =>
      `<button type="button" class="btn ${state.filter === k ? 'btn-secondary tfw-on' : 'btn-ghost tfw-off'}" data-filter="${k}" aria-pressed="${state.filter === k}">${label}</button>`).join('')}
    </div>
    <div class="shop-grid">${list.map(p => `
      <a class="shop-card" href="#/product/${p.id}">
        <div class="washed photo">${slot('prod-' + p.id, p.slotHint, p.name)}</div>
        <div class="shop-body">
          <span class="tag tag-accent-2">${esc(p.tag)}</span>
          <h3>${esc(p.name)}</h3>
          <div class="latin">${esc(p.latin)}</div>
          <div class="shop-foot"><span class="from">From ${fromPrice(p)}</span><span class="btn btn-primary">View</span></div>
        </div>
      </a>`).join('')}
    </div>
  </div>`;
}

function productView() {
  const p = prod(state.pid) || PRODUCTS[0];
  const opt = p.options[state.opt] || p.options[0];
  const related = PRODUCTS.filter(x => x.id !== p.id);
  return `<div class="tfw-view wrap product">
    <div class="crumbs"><a href="#/">Home</a> / <a href="#/shop">Shop</a> / ${esc(p.name)}</div>
    <div class="product-grid">
      <div class="gallery">
        <div class="washed gallery-main">${slot('prod-' + p.id, p.slotHint, p.name)}</div>
        <div class="thumbs">
          <div class="washed">${slot(p.id + '-t1', 'Photo', p.name)}</div>
          <div class="washed">${slot(p.id + '-t2', 'Photo', p.name)}</div>
          <div class="washed">${slot(p.id + '-t3', 'In the tank', p.name + ' in the tank')}</div>
        </div>
      </div>
      <div class="product-info">
        <span class="tag tag-accent-2">${esc(p.tag)}</span>
        <div><h1>${esc(p.name)}</h1><div class="latin">${esc(p.latin)}</div></div>
        <p class="blurb">${esc(p.blurb)}</p>
        <div class="unit-price">${money(opt.price)}</div>
        <div class="options">
          <div class="options-label">Pack size</div>
          <div class="options-row">${p.options.map((o, i) =>
            `<button type="button" class="btn btn-secondary${i === state.opt ? ' tfw-on' : ''}" data-opt="${i}" aria-pressed="${i === state.opt}">${esc(o.label)}</button>`).join('')}
          </div>
        </div>
        <div class="buy-row">
          <div class="qty">
            <button type="button" class="btn btn-ghost btn-icon" data-action="decQty" aria-label="Less">${icon.minus16}</button>
            <span>${state.qty}</span>
            <button type="button" class="btn btn-ghost btn-icon" data-action="incQty" aria-label="More">${icon.plus16}</button>
          </div>
          <button type="button" class="btn btn-primary add-btn" data-action="addToCart">Add to cart · ${money(opt.price * state.qty)}</button>
        </div>
        <div class="assurances">
          <div>${icon.shield}Live arrival guaranteed</div>
          <div>${icon.truck}Ships overnight, Monday to Wednesday</div>
        </div>
        <div class="care-box">
          <div class="care-title">Quick care</div>
          ${p.care.map(([k, v]) => `<div class="care-row"><span>${esc(k)}</span><span>${esc(v)}</span></div>`).join('')}
        </div>
      </div>
    </div>
    <div class="related">
      <h2>Goes well with</h2>
      <div class="related-grid">${related.map(r => `
        <a class="related-card" href="#/product/${r.id}">
          <div class="washed photo">${slot('prod-' + r.id, 'Photo', r.name)}</div>
          <div class="related-body"><div class="name">${esc(r.name)}</div><div class="from">From ${fromPrice(r)}</div></div>
        </a>`).join('')}
      </div>
    </div>
  </div>`;
}

function cartView() {
  if (!state.cartOpen) return '';
  const lines = state.cart.map((c, i) => {
    const p = prod(c.id); const o = p && p.options[c.opt];
    if (!p || !o) return '';
    return `<div class="line">
      <div class="washed photo">${slot('prod-' + p.id, ' ', p.name)}</div>
      <div class="line-info">
        <div class="line-name">${esc(p.name)}</div>
        <div class="line-opt">${esc(o.label)}</div>
        <div class="line-qty">
          <button type="button" class="btn btn-ghost" data-line="${i}" data-delta="-1" aria-label="Less">–</button>
          <span>${c.qty}</span>
          <button type="button" class="btn btn-ghost" data-line="${i}" data-delta="1" aria-label="More">+</button>
        </div>
      </div>
      <div class="line-right">
        <span class="line-total">${money(o.price * c.qty)}</span>
        <button type="button" class="line-remove" data-line="${i}" data-remove="1">Remove</button>
      </div>
    </div>`;
  }).join('');
  const subtotal = state.cart.reduce((s, c) => { const p = prod(c.id); const o = p && p.options[c.opt]; return s + (o ? o.price * c.qty : 0); }, 0);
  return `<div class="cart-layer" data-closing="${state.cartClosing}" role="dialog" aria-modal="true" aria-labelledby="cartTitle">
    <div class="tfw-backdrop" data-action="closeCart"></div>
    <aside class="tfw-aside">
      <div class="cart-head">
        <h2 id="cartTitle">Your cart</h2>
        <button type="button" class="btn btn-secondary btn-icon" data-action="closeCart" aria-label="Close">${icon.close}</button>
      </div>
      <div class="cart-body">
        ${state.cart.length === 0 ? `<div class="cart-empty"><div>Nothing in here yet.</div><a class="btn btn-primary btn-md" href="#/shop">Shop the tank</a></div>` : lines}
      </div>
      <div class="cart-foot">
        <div class="subtotal"><span>Subtotal</span><b>${money(subtotal)}</b></div>
        <div class="cart-note">Overnight shipping is added at checkout.</div>
        <button type="button" class="btn btn-primary checkout-btn" data-action="checkout" ${state.cart.length === 0 ? 'disabled' : ''}>Checkout</button>
      </div>
    </aside>
  </div>`;
}

// ── Rendering ──────────────────────────────────────────────────────────────
function render(animate = true) {
  const main = $('#main');
  main.innerHTML = state.view === 'shop' ? shopView() : state.view === 'product' ? productView() : homeView();
  if (!animate) main.firstElementChild && main.firstElementChild.classList.remove('tfw-view');
  renderCart();
}
function renderCart() {
  $('#cartCount').textContent = cartCount();
  $('#cartRoot').innerHTML = cartView();
  document.body.style.overflow = state.cartOpen ? 'hidden' : '';
}
function openCart() { state.cartOpen = true; state.cartClosing = false; renderCart(); }
let closeTimer;
function closeCart(immediate) {
  if (!state.cartOpen) return;
  if (immediate) { state.cartOpen = false; state.cartClosing = false; renderCart(); return; }
  if (state.cartClosing) return;
  state.cartClosing = true; renderCart();
  clearTimeout(closeTimer);
  closeTimer = setTimeout(() => { state.cartOpen = false; state.cartClosing = false; renderCart(); }, 300);
}

// ── Events ─────────────────────────────────────────────────────────────────
document.addEventListener('click', e => {
  const t = e.target.closest('[data-action], [data-filter], [data-opt], [data-line]');
  if (!t) return;
  const p = prod(state.pid) || PRODUCTS[0];
  if (t.dataset.filter) { state.filter = t.dataset.filter; render(false); return; }
  if (t.dataset.opt !== undefined) { state.opt = Number(t.dataset.opt); render(false); return; }
  if (t.dataset.line !== undefined) {
    const i = Number(t.dataset.line);
    if (t.dataset.remove) saveCart(state.cart.filter((_, j) => j !== i));
    else saveCart(state.cart.map((x, j) => j === i ? { ...x, qty: x.qty + Number(t.dataset.delta) } : x).filter(x => x.qty > 0));
    return;
  }
  switch (t.dataset.action) {
    case 'openCart': openCart(); break;
    case 'closeCart': closeCart(); break;
    case 'incQty': state.qty = Math.min(state.qty + 1, 20); render(false); break;
    case 'decQty': state.qty = Math.max(state.qty - 1, 1); render(false); break;
    case 'addToCart': {
      const idx = state.cart.findIndex(c => c.id === p.id && c.opt === state.opt);
      const next = idx >= 0
        ? state.cart.map((c, j) => j === idx ? { ...c, qty: c.qty + state.qty } : c)
        : [...state.cart, { id: p.id, opt: state.opt, qty: state.qty }];
      saveCart(next); openCart(); break;
    }
    case 'checkout': break; // Hook your payment provider here (Stripe Checkout, Shopify Buy Button, …).
  }
});
document.addEventListener('submit', e => {
  if (e.target.id !== 'subscribe') return;
  e.preventDefault();
  state.email = $('#email').value.trim();
  if (/\S+@\S+/.test(state.email)) { state.subscribed = true; render(false); }
  else $('#email').focus();
});
document.addEventListener('input', e => { if (e.target.id === 'email') state.email = e.target.value; });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && state.cartOpen) closeCart(); });

route();
