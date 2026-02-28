/* Render product detail and related products (enhanced) */
(function(){
  function qs(id){ return document.getElementById(id); }

  function loadProducts(){
    try{ const s = localStorage.getItem('dgbs_products'); return s ? JSON.parse(s) : (window.PRODUCTS || []); }catch(e){ return window.PRODUCTS || []; }
  }

  function getParam(name){ return new URL(window.location.href).searchParams.get(name); }

  const id = getParam('id');
  const products = loadProducts();
  const product = products.find(p => p.id === id);

  const detail = qs('product-detail');
  const relatedGrid = qs('related-grid');

  if (!product) {
    if (detail) detail.innerHTML = `<div style="padding:40px;background:#fff;border-radius:12px;">Product not found. <a href="shop.html">Back to shop</a></div>`;
    return;
  }

  // Ensure images array for gallery
  const thumbs = Array.isArray(product.images) && product.images.length ? product.images.slice() : [product.img || ''];

  // Render detail with thumbnails, qty, share and wishlist
  if (detail) {
    detail.innerHTML = `
      <div class="product-row">
        <div class="product-gallery">
          <div style="position:relative;">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <img id="main-img" class="main-image" src="${thumbs[0]}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1546548970-71785318a17b?w=800&q=80'">
          </div>
          <div class="thumbs">
            ${thumbs.map(src => `<div class="thumb" data-src="${src}"><img src="${src}" alt="thumb" onerror="this.src='assets/images/placeholder.png'"></div>`).join('')}
          </div>
        </div>
        <div class="product-info">
          <div class="product-tag">${product.tag || ''}</div>
          <h1 class="product-title">${product.name}</h1>
          <div class="product-price">£${product.price.toFixed(2)} ${product.oldPrice ? `<span class='old'>£${product.oldPrice.toFixed(2)}</span>` : ''}</div>
          <div class="product-attrs">
            <div class="attr">Category: ${product.category || 'General'}</div>
            ${product.weight? `<div class="attr">Weight: ${product.weight}</div>` : ''}
            ${product.tag? `<div class="attr">Tag: ${product.tag}</div>` : ''}
          </div>
          <div id="rating" style="margin-bottom:12px;"></div>
          <p class="product-desc">${product.desc}</p>
          <div class="product-actions">
            <div class="qty">
              <button id="qty-minus" class="btn">−</button>
              <input id="qty" type="number" value="1" min="1">
              <button id="qty-plus" class="btn">+</button>
            </div>
            <button id="add-cart" class="btn btn-primary">🛒 Add to Cart</button>
            <button id="wishlist-btn" class="btn btn-outline">♡ Wishlist</button>
            <button id="share-btn" class="btn">Share</button>
          </div>
        </div>
      </div>
    `;
  }

  // Rating render
  function renderRating(container, score){
    const out = [];
    const full = Math.floor(score);
    const half = score - full >= 0.5;
    for (let i=0;i<5;i++) {
      if (i < full) out.push('★');
      else if (i === full && half) out.push('☆');
      else out.push('☆');
    }
    container.innerHTML = `<div style="color:var(--gold);font-weight:800;font-size:1rem">${out.join(' ')} <span style='color:var(--muted);font-weight:600;margin-left:8px'>${score.toFixed(1)}</span></div>`;
  }

  const ratingEl = qs('rating');
  const score = (typeof product.rating === 'number') ? product.rating : (4 + Math.random() * 1); // 4.0 - 5.0
  if (ratingEl) renderRating(ratingEl, Math.min(5, Math.max(0, score)));

  // Thumbnail switching
  const mainImg = qs('main-img');
  document.querySelectorAll('.thumb').forEach(t => t.addEventListener('click', ()=>{ if (mainImg && t.dataset.src) mainImg.src = t.dataset.src; }));

  // Quantity controls and add to cart
  const qtyInput = qs('qty');
  qs('qty-plus')?.addEventListener('click', ()=> { qtyInput.value = Math.max(1, Number(qtyInput.value||1) + 1); });
  qs('qty-minus')?.addEventListener('click', ()=> { qtyInput.value = Math.max(1, Number(qtyInput.value||1) - 1); });

  qs('add-cart')?.addEventListener('click', ()=>{
    const qty = Math.max(1, Number(qtyInput.value||1));
    try{ const p = products.find(x=>x.id===product.id); if (p) { window.addToCart && window.addToCart(Object.assign({},p,{qty})); showToast('Added to cart','🛒'); } }
    catch(e){ console.warn(e); }
  });

  // Wishlist toggle (localStorage)
  const WKEY = 'dgbs_wishlist';
  function loadWishlist(){ try{ return JSON.parse(localStorage.getItem(WKEY) || '[]'); }catch(e){return[];} }
  function saveWishlist(arr){ localStorage.setItem(WKEY, JSON.stringify(arr)); }
  const wishBtn = qs('wishlist-btn');
  function updateWishBtn(){ const list = loadWishlist(); if (list.includes(product.id)) { wishBtn.textContent = '♥ In Wishlist'; wishBtn.classList.add('wished'); } else { wishBtn.textContent = '♡ Wishlist'; wishBtn.classList.remove('wished'); } }
  wishBtn?.addEventListener('click', ()=>{
    const list = loadWishlist(); const idx = list.indexOf(product.id);
    if (idx === -1) list.push(product.id); else list.splice(idx,1);
    saveWishlist(list); updateWishBtn(); showToast(list.includes(product.id)?'Added to wishlist':'Removed from wishlist','♥');
  });
  if (wishBtn) updateWishBtn();

  // Share
  qs('share-btn')?.addEventListener('click', async ()=>{
    try{
      await navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard','🔗');
    }catch(e){ prompt('Copy this link', window.location.href); }
  });

  // Related products (same category)
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0,4);
  if (relatedGrid) {
    if (!related.length) {
      relatedGrid.innerHTML = '<p style="color:var(--gray)">No related products found.</p>';
    } else {
      relatedGrid.innerHTML = related.map(p => `
        <div class="product-card" data-id="${p.id}" style="max-width:220px;">
          <div class="product-card-img-wrap">
            <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&q=70'">
          </div>
          <div style="padding:8px;">
            <div style="font-weight:800">${p.name}</div>
            <div style="color:var(--gray);font-size:0.9rem">£${p.price.toFixed(2)}</div>
          </div>
        </div>
      `).join('');

      relatedGrid.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
          const pid = card.dataset.id;
          if (pid) window.location.href = `product.html?id=${encodeURIComponent(pid)}`;
        });
      });
    }
  }

  // small toast helper (uses global showToast if available)
  function showToast(msg, emoji){ if (window.showToast) return window.showToast(msg, emoji); alert(msg); }

})();
