/* =============================================
   DGBS DELIGHTS FOODS — shop.js
   Products Data, Search, Filter, Sort
   ============================================= */

let PRODUCTS = [
  // Oils & Fats
  { id: 'p001', name: 'Premium Red Palm Oil', category: 'oils', price: 8.99, oldPrice: 11.99, badge: 'hot', tag: 'Oils & Fats', desc: 'Pure unrefined red palm oil, rich in nutrients and perfect for traditional Nigerian cooking.', img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=75', weight: '1L', inStock: true },
  { id: 'p002', name: 'Palm Oil 5L Canister', category: 'oils', price: 32.99, oldPrice: null, badge: 'new', tag: 'Oils & Fats', desc: 'Value-size pure red palm oil for the whole family. Ideal for large portions of egusi or banga soup.', img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=75', weight: '5L', inStock: true },
  { id: 'p003', name: 'Palm Kernel Oil', category: 'oils', price: 9.49, oldPrice: null, badge: null, tag: 'Oils & Fats', desc: 'Cold-pressed palm kernel oil, great for soups, cooking and traditional remedies.', img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=75', weight: '500ml', inStock: true },

  // Dried Fish & Seafood
  { id: 'p004', name: 'Dried Catfish (Eja Aro)', category: 'fish', price: 12.99, oldPrice: 15.99, badge: 'sale', tag: 'Dried Fish & Seafood', desc: 'Smoked and sun-dried catfish, essential for pepper soup, egusi, and many Nigerian stews.', img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=75', weight: '500g', inStock: true },
  { id: 'p005', name: 'Whole Dried Catfish Large', category: 'fish', price: 18.99, oldPrice: null, badge: 'hot', tag: 'Dried Fish & Seafood', desc: 'Premium large whole dried catfish. Deeply smoky flavour perfect for banga soup and ofe onugbu.', img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=75', weight: '1kg', inStock: true },
  { id: 'p006', name: 'Ground Crayfish (Ijeba)', category: 'fish', price: 5.99, oldPrice: 7.49, badge: 'sale', tag: 'Dried Fish & Seafood', desc: 'Finely ground dried crayfish — adds authentic depth to any Nigerian soup or stew.', img: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&q=75', weight: '200g', inStock: true },
  { id: 'p007', name: 'Whole Dried Crayfish', category: 'fish', price: 7.49, oldPrice: null, badge: null, tag: 'Dried Fish & Seafood', desc: 'Sun-dried whole crayfish with intense umami flavour. A pantry staple for every Nigerian kitchen.', img: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&q=75', weight: '300g', inStock: true },
  { id: 'p008', name: 'Dried Snail (Eju)', category: 'fish', price: 14.99, oldPrice: null, badge: 'new', tag: 'Dried Fish & Seafood', desc: 'Premium quality dried snails, a delicacy used in pepper soup, nkwobi and ofe akwu.', img: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&q=75', weight: '250g', inStock: true },
  { id: 'p009', name: 'Dried Stockfish (Okporoko)', category: 'fish', price: 16.99, oldPrice: 20.00, badge: 'sale', tag: 'Dried Fish & Seafood', desc: 'Air-dried Norwegian stockfish, a must-have for Igbo soups and Yoruba stews alike.', img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=75', weight: '500g', inStock: true },

  // Grains & Flour
  { id: 'p010', name: 'White Garri (Fine)', category: 'grains', price: 4.99, oldPrice: null, badge: null, tag: 'Grains & Flour', desc: 'Light and fluffy white garri, perfect for soaking with groundnuts, cold water, and sugar or swallow.', img: 'assets/images/garri.jpg', weight: '1kg', inStock: true },
  { id: 'p011', name: 'Red Garri (Ijebu Garri)', category: 'grains', price: 5.49, oldPrice: null, badge: 'hot', tag: 'Grains & Flour', desc: 'Coarse and tangy Ijebu-style red garri. Perfect with cold water and sugar — a nostalgic favourite.', img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=75', weight: '1kg', inStock: true },
  { id: 'p012', name: 'Egusi (Melon Seeds)', category: 'grains', price: 7.99, oldPrice: 9.99, badge: 'sale', tag: 'Grains & Flour', desc: 'Ground melon seeds for the most delicious egusi soup. Rich, nutty, and full of protein.', img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=75', weight: '500g', inStock: true },
  { id: 'p013', name: 'Whole Egusi Seeds', category: 'grains', price: 6.99, oldPrice: null, badge: null, tag: 'Grains & Flour', desc: 'Raw whole egusi seeds. Grind fresh at home for the best flavour in your soups.', img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=75', weight: '500g', inStock: true },

  // Spices & Seasonings
  { id: 'p014', name: 'Uziza Leaves (Dried)', category: 'spices', price: 3.49, oldPrice: null, badge: null, tag: 'Spices & Seasonings', desc: 'Dried uziza leaves with a peppery and slightly bitter flavour. Essential for ofe onugbu and pepper soup.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=75', weight: '100g', inStock: true },
  { id: 'p015', name: 'Ogiri (Fermented Locust Bean)', category: 'spices', price: 2.99, oldPrice: null, badge: null, tag: 'Spices & Seasonings', desc: 'Traditional fermented seasoning used in egusi, oha, and bitterleaf soups for deep umami taste.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=75', weight: '100g', inStock: true },
  { id: 'p016', name: 'Iru / Dawadawa (Locust Beans)', category: 'spices', price: 3.99, oldPrice: null, badge: 'new', tag: 'Spices & Seasonings', desc: 'Whole fermented locust beans for authentic Yoruba soups and stews.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=75', weight: '150g', inStock: true },
  { id: 'p017', name: 'Ehuru (Calabash Nutmeg)', category: 'spices', price: 3.29, oldPrice: null, badge: null, tag: 'Spices & Seasonings', desc: 'Dried calabash nutmeg seeds — a key spice for pepper soup and ofe owerri.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=75', weight: '100g', inStock: true },

  // Snacks & Specialty
  { id: 'p018', name: 'Chin Chin (Crunchy)', category: 'snacks', price: 4.49, oldPrice: null, badge: 'new', tag: 'Snacks & Specialty', desc: 'Golden, crunchy Nigerian chin chin fried to perfection. A satisfying bite-sized snack for all ages.', img: 'https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=400&q=75', weight: '300g', inStock: true },
  { id: 'p019', name: 'Fried Groundnuts', category: 'snacks', price: 3.49, oldPrice: null, badge: null, tag: 'Snacks & Specialty', desc: 'Lightly salted fried groundnuts — the perfect partner for your garri or just as a snack.', img: 'https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=400&q=75', weight: '300g', inStock: true },
  { id: 'p020', name: 'Bonga Fish (Smoked)', category: 'snacks', price: 10.99, oldPrice: 12.99, badge: 'sale', tag: 'Snacks & Specialty', desc: 'Heavily smoked bonga fish, adding a signature smoky taste to jollof rice, stews and soups.', img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=75', weight: '500g', inStock: true },

  // Soups & Stews Ingredients
  { id: 'p021', name: 'Oha Leaves (Dried)', category: 'soups', price: 4.99, oldPrice: null, badge: 'new', tag: 'Soups & Stews', desc: 'Sun-dried oha leaves for the classic Igbo oha soup. Mild, earthy and incredibly aromatic.', img: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&q=75', weight: '100g', inStock: true },
  { id: 'p022', name: 'Dried Bitterleaf', category: 'soups', price: 3.99, oldPrice: null, badge: null, tag: 'Soups & Stews', desc: 'Dried bitterleaf for ofe onugbu (bitter leaf soup). Pre-washed and easy to use.', img: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&q=75', weight: '100g', inStock: true },
  { id: 'p023', name: 'Ogbono Seeds', category: 'soups', price: 8.49, oldPrice: 10.00, badge: 'sale', tag: 'Soups & Stews', desc: 'Wild mango seeds ground for silky, draw ogbono soup. Packed with iron and fibre.', img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=75', weight: '500g', inStock: true },
  { id: 'p024', name: 'Dried Ede Cocoyam Flour', category: 'soups', price: 5.49, oldPrice: null, badge: null, tag: 'Soups & Stews', desc: 'Cocoyam flour for thickening oha and bitterleaf soups the traditional Igbo way.', img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=75', weight: '500g', inStock: true },
];

// Persist products to localStorage so the admin page can edit them.
try {
  const saved = localStorage.getItem('dgbs_products');
  if (saved) {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length) {
      PRODUCTS = parsed;
    } else {
      localStorage.setItem('dgbs_products', JSON.stringify(PRODUCTS));
    }
  } else {
    localStorage.setItem('dgbs_products', JSON.stringify(PRODUCTS));
  }
} catch (err) {
  console.warn('Could not access localStorage for products', err);
}

window.PRODUCTS = PRODUCTS;

// Try to load canonical product list from data/products.json (preferred).
// If available, overwrite PRODUCTS and sync to localStorage.
(function tryLoadDataJson(){
  if (!window.fetch) return;
  fetch('data/products.json', {cache: 'no-store'}).then(r => {
    if (!r.ok) throw new Error('Not found');
    return r.json();
  }).then(json => {
    if (Array.isArray(json) && json.length) {
      PRODUCTS = json;
      window.PRODUCTS = PRODUCTS;
      try { localStorage.setItem('dgbs_products', JSON.stringify(PRODUCTS)); } catch(e){}
      // If shop page is active, re-render product grid
      if (typeof renderProducts === 'function') try { renderProducts(); } catch(e){}
    }
  }).catch(()=>{/* no data/products.json served or fetch blocked on file:// */});
})();

// =============================================
// SHOP PAGE LOGIC
// =============================================
(function () {
  if (!document.getElementById('products-grid')) return;

  let currentCategory = 'all';
  let currentSearch = '';
  let currentSort = 'default';
  let maxPrice = 50;
  let viewMode = 'grid';
  let activeFilters = { inStock: false };

  const grid = document.getElementById('products-grid');
  const searchInput = document.getElementById('shop-search');
  const sortSelect = document.getElementById('sort-select');
  const resultCount = document.getElementById('results-count');
  const priceMax = document.getElementById('price-max');
  const priceLabel = document.getElementById('price-label-max');

  // Category buttons
  document.querySelectorAll('.category-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.category-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.cat;
      renderProducts();
    });
  });

  // Search
  searchInput?.addEventListener('input', e => {
    currentSearch = e.target.value.trim().toLowerCase();
    const box = searchInput.closest('.search-box');
    box?.classList.toggle('has-value', currentSearch.length > 0);
    renderProducts();
  });

  document.querySelector('.search-clear')?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    currentSearch = '';
    searchInput?.closest('.search-box')?.classList.remove('has-value');
    renderProducts();
  });

  // Sort
  sortSelect?.addEventListener('change', e => {
    currentSort = e.target.value;
    renderProducts();
  });

  // Price range
  priceMax?.addEventListener('input', e => {
    maxPrice = parseInt(e.target.value);
    if (priceLabel) priceLabel.textContent = `£${maxPrice}`;
    updatePriceSlider();
    renderProducts();
  });

  function updatePriceSlider() {
    const fill = document.querySelector('.price-slider-fill');
    if (fill && priceMax) {
      const pct = ((parseInt(priceMax.value) - 1) / (parseInt(priceMax.max) - 1)) * 100;
      fill.style.width = pct + '%';
    }
  }

  // In-stock filter
  document.getElementById('filter-instock')?.addEventListener('change', e => {
    activeFilters.inStock = e.target.checked;
    updateFilterBadge();
    renderProducts();
  });

  function updateFilterBadge() {
    const count = Object.values(activeFilters).filter(Boolean).length;
    const badge = document.querySelector('.filter-badge');
    if (badge) {
      badge.textContent = count;
      badge.classList.toggle('show', count > 0);
    }
  }

  // Reset filters
  document.querySelector('.filter-reset')?.addEventListener('click', () => {
    currentCategory = 'all';
    currentSearch = '';
    currentSort = 'default';
    maxPrice = 50;
    activeFilters = { inStock: false };
    if (searchInput) searchInput.value = '';
    if (sortSelect) sortSelect.value = 'default';
    if (priceMax) { priceMax.value = 50; if (priceLabel) priceLabel.textContent = '£50'; }
    document.querySelectorAll('.category-filter-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
    document.getElementById('filter-instock') && (document.getElementById('filter-instock').checked = false);
    updatePriceSlider();
    updateFilterBadge();
    renderProducts();
  });

  // View toggle
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      viewMode = btn.dataset.view;
      grid.classList.toggle('list-view', viewMode === 'list');
    });
  });

  // Mobile sidebar
  document.querySelector('.filter-toggle-btn')?.addEventListener('click', () => {
    document.querySelector('.sidebar')?.classList.add('open');
    document.querySelector('.sidebar-overlay')?.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  function closeSidebar() {
    document.querySelector('.sidebar')?.classList.remove('open');
    document.querySelector('.sidebar-overlay')?.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelector('.sidebar-overlay')?.addEventListener('click', closeSidebar);
  document.getElementById('sidebar-close-btn')?.addEventListener('click', closeSidebar);

  // =============================================
  // RENDER PRODUCTS
  // =============================================
  function getFiltered() {
    let list = [...PRODUCTS];

    if (currentCategory !== 'all') list = list.filter(p => p.category === currentCategory);
    if (currentSearch) list = list.filter(p =>
      p.name.toLowerCase().includes(currentSearch) ||
      p.desc.toLowerCase().includes(currentSearch) ||
      p.tag.toLowerCase().includes(currentSearch)
    );
    if (maxPrice < 50) list = list.filter(p => p.price <= maxPrice);
    if (activeFilters.inStock) list = list.filter(p => p.inStock);

    switch (currentSort) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'name-asc': list.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc': list.sort((a, b) => b.name.localeCompare(a.name)); break;
    }

    return list;
  }

  function renderProducts() {
    const list = getFiltered();
    if (resultCount) {
      resultCount.innerHTML = `<span>${list.length}</span> product${list.length !== 1 ? 's' : ''} found`;
    }

    if (!list.length) {
      grid.innerHTML = `
        <div class="no-results">
          <div class="no-icon">🔍</div>
          <h3>No products found</h3>
          <p>Try adjusting your filters or search term.</p>
          <button class="btn btn-primary" onclick="document.querySelector('.filter-reset')?.click()">
            Reset Filters
          </button>
        </div>`;
      return;
    }

    grid.innerHTML = list.map(p => `
      <div class="product-card" data-id="${p.id}">
        <div class="product-card-img-wrap">
          <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&q=70'">
          ${p.badge ? `<span class="product-badge badge-${p.badge}">${p.badge}</span>` : ''}
          <button class="product-wishlist" title="Save for later">♡</button>
        </div>
        <div class="product-card-body">
          <div class="product-cat-tag">${p.tag}</div>
          <div class="product-name">${p.name}</div>
          <div class="product-desc">${p.desc}</div>
          <div class="product-footer">
            <div class="product-price">
              <span class="price-current">£${p.price.toFixed(2)}</span>
              ${p.oldPrice ? `<span class="price-old">£${p.oldPrice.toFixed(2)}</span>` : ''}
            </div>
            <button class="add-cart-btn" onclick="handleAddToCart(this, '${p.id}')">
              🛒 Add
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Wishlist toggle
    document.querySelectorAll('.product-wishlist').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('wished');
        btn.textContent = btn.classList.contains('wished') ? '♥' : '♡';
      });
    });

    // Open product detail on card click (ignore clicks on buttons)
    document.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.add-cart-btn') || e.target.closest('.product-wishlist') || e.target.tagName === 'BUTTON') return;
        const id = card.dataset.id;
        if (id) window.location.href = `product.html?id=${encodeURIComponent(id)}`;
      });
    });

    // If page was opened with ?product=<id>, highlight & scroll to it
    tryApplyUrlHighlight();
  }

  // Highlight product when arriving from homepage (shop.html?product=...)
  let _pendingHighlightId = (new URLSearchParams(window.location.search)).get('product');
  let _triedRelaxFilters = false;

  function tryApplyUrlHighlight(){
    if (!_pendingHighlightId) return;
    const target = grid.querySelector(`.product-card[data-id="${_pendingHighlightId}"]`);
    if (target) {
      target.classList.add('highlight');
      target.scrollIntoView({behavior:'smooth', block:'center'});
      setTimeout(()=> target.classList.remove('highlight'), 4000);
      _pendingHighlightId = null;
      return;
    }
    // product not visible due to filters — try to relax filters once
    if (!_triedRelaxFilters) {
      _triedRelaxFilters = true;
      const prod = PRODUCTS.find(p => p.id === _pendingHighlightId);
      if (prod) {
        currentCategory = 'all';
        currentSearch = '';
        currentSort = 'default';
        maxPrice = 50;
        activeFilters = { inStock: false };
        if (searchInput) searchInput.value = '';
        if (sortSelect) sortSelect.value = 'default';
        if (priceMax) { priceMax.value = 50; if (priceLabel) priceLabel.textContent = `£${50}`; }
        renderProducts();
      }
    }
  }

  window.handleAddToCart = function(btn, id) {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return;
    addToCart(product);
    btn.textContent = '✓ Added';
    btn.classList.add('added');
    setTimeout(() => {
      btn.textContent = '🛒 Add';
      btn.classList.remove('added');
    }, 1800);
  };

  // Init
  updatePriceSlider();
  renderProducts();
})();
