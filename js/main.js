/* =============================================
   DGBS DELIGHTS FOODS — main.js
   ============================================= */

const WA_NUMBER = '447785539203';

// =============================================
// NAVBAR SCROLL EFFECT
// =============================================
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar && navbar.classList.toggle('scrolled', window.scrollY > 50);
  const scrollBtn = document.querySelector('.scroll-top');
  scrollBtn && scrollBtn.classList.toggle('show', window.scrollY > 400);
});

// Scroll to top
document.querySelector('.scroll-top')?.addEventListener('click', () =>
  window.scrollTo({ top: 0, behavior: 'smooth' })
);

// =============================================
// HAMBURGER / MOBILE NAV
// =============================================
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');

hamburger?.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  mobileNav?.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

// Close on link click
document.querySelectorAll('.mobile-nav a').forEach(a =>
  a.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    mobileNav?.classList.remove('open');
    document.body.style.overflow = '';
  })
);

// Close on outside click
document.addEventListener('click', e => {
  if (!navbar?.contains(e.target) && !mobileNav?.contains(e.target)) {
    hamburger?.classList.remove('open');
    mobileNav?.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// =============================================
// ACTIVE NAV LINK
// =============================================
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// =============================================
// FLOATING WHATSAPP
// =============================================
document.querySelector('.floating-wa')?.addEventListener('click', () => {
  window.open(`https://wa.me/${WA_NUMBER}?text=Hello%20DGBS%20Delights%20Foods!%20I%20would%20like%20to%20enquire%20about%20your%20products.`, '_blank');
});

// =============================================
// TOAST NOTIFICATION
// =============================================
function showToast(msg, icon = '🛒') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="toast-icon">${icon}</span> ${msg}`;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

window.showToast = showToast;

// =============================================
// CART STATE (shared across pages)
// =============================================
function getCart() {
  try { return JSON.parse(localStorage.getItem('dgbs_cart') || '[]'); } catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem('dgbs_cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = total;
    el.classList.toggle('show', total > 0);
  });
}

// Ensure cart items reflect latest product data (price, image, name)
function normalizeCart() {
  const cart = getCart();
  if (!window.PRODUCTS || !cart.length) return cart;
  const updated = cart.map(item => {
    const prod = PRODUCTS.find(p => p.id === item.id);
    if (!prod) return item; // keep as-is if product not found
    return Object.assign({}, item, {
      name: prod.name || item.name,
      img: prod.img || item.img,
      price: typeof prod.price === 'number' ? prod.price : item.price,
    });
  });
  localStorage.setItem('dgbs_cart', JSON.stringify(updated));
  return updated;
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart(cart);
  showToast(`${product.name} added to cart!`, '🛒');
  renderCartDrawer();
}

function removeFromCart(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  renderCartDrawer();
}

function updateQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(cart);
  renderCartDrawer();
}

// =============================================
// CART DRAWER
// =============================================
function openCart() {
  document.querySelector('.cart-overlay')?.classList.add('open');
  document.querySelector('.cart-drawer')?.classList.add('open');
  document.body.style.overflow = 'hidden';
  renderCartDrawer();
}

function closeCart() {
  document.querySelector('.cart-overlay')?.classList.remove('open');
  document.querySelector('.cart-drawer')?.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelector('.cart-overlay')?.addEventListener('click', closeCart);
document.querySelector('.cart-close')?.addEventListener('click', closeCart);
document.querySelector('.nav-cart-btn')?.addEventListener('click', openCart);

function renderCartDrawer() {
  const cart = getCart();
  const container = document.getElementById('cart-items-container');
  const totalEl = document.getElementById('cart-total-amount');
  if (!container) return;

  if (!cart.length) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="empty-icon">🛒</div>
        <p>Your cart is empty</p>
        <p style="font-size:0.83rem;margin-top:8px;">Add some delicious African foods!</p>
      </div>`;
    if (totalEl) totalEl.textContent = '£0.00';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img class="cart-item-img" src="${item.img}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1546548970-71785318a17b?w=120&q=70'">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">£${(item.price * item.qty).toFixed(2)}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="updateQty('${item.id}', -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty('${item.id}', 1)">+</button>
        </div>
      </div>
      <button class="remove-item" onclick="removeFromCart('${item.id}')" title="Remove">🗑️</button>
    </div>
  `).join('');

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  if (totalEl) totalEl.textContent = `£${total.toFixed(2)}`;
}

function sendCartToWhatsApp() {
  const cart = getCart();
  if (!cart.length) { showToast('Your cart is empty!', '⚠️'); return; }

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  let msg = `Hello DGBS Delights Foods! 👋\n\nI'd like to place an order:\n\n`;
  cart.forEach(i => {
    msg += `• ${i.name} x${i.qty} — £${(i.price * i.qty).toFixed(2)}\n`;
  });
  msg += `\n*Total: £${total.toFixed(2)}*\n\nPlease confirm availability and delivery details. Thank you! 🙏`;

  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQty = updateQty;
window.openCart = openCart;
window.closeCart = closeCart;
window.sendCartToWhatsApp = sendCartToWhatsApp;

// Init on load
document.addEventListener('DOMContentLoaded', () => {
  // normalize cart with latest PRODUCTS then render
  normalizeCart();
  updateCartCount();
  renderCartDrawer();
});

// =============================================
// FADE IN ON SCROLL
// =============================================
const fadeEls = document.querySelectorAll('.fade-in');
if (fadeEls.length) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  fadeEls.forEach(el => observer.observe(el));
}
