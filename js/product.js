/* Render product detail and related products */
(function(){
  function qs(id){ return document.getElementById(id); }

  // load products from localStorage as source-of-truth
  function loadProducts(){
    try{ const s = localStorage.getItem('dgbs_products'); return s ? JSON.parse(s) : (window.PRODUCTS || []); }catch(e){ return window.PRODUCTS || []; }
  }

  function getParam(name){
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
  }

  const id = getParam('id');
  const products = loadProducts();
  const product = products.find(p => p.id === id);

  const detail = qs('product-detail');
  const relatedGrid = qs('related-grid');

  if (!product) {
    if (detail) detail.innerHTML = `<div style="padding:40px;background:#fff;border-radius:12px;">Product not found. <a href="shop.html">Back to shop</a></div>`;
    return;
  }

  // Render detail
  if (detail) {
    detail.innerHTML = `
      <div class="product-row">
        <div class="product-gallery">
          <div style="position:relative;">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <img src="${product.img}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&q=70'">
          </div>
        </div>
        <div class="product-info">
          <div class="product-tag">${product.tag || ''}</div>
          <h1 class="product-title">${product.name}</h1>
          <div class="product-price">£${product.price.toFixed(2)} ${product.oldPrice ? `<span style='text-decoration:line-through;color:var(--gray);font-weight:600;margin-left:8px'>£${product.oldPrice.toFixed(2)}</span>` : ''}</div>
          <p class="product-desc">${product.desc}</p>
          <div class="product-actions">
            <button class="btn btn-primary" onclick="addToCartFromDetail('${product.id}')">🛒 Add to Cart</button>
            <a href="shop.html?cat=${encodeURIComponent(product.category)}" class="btn btn-outline">View Category</a>
          </div>
        </div>
      </div>
    `;
  }

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

      // Click to open
      relatedGrid.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
          const pid = card.dataset.id;
          if (pid) window.location.href = `product.html?id=${encodeURIComponent(pid)}`;
        });
      });
    }
  }

  // Expose simple add-to-cart for this page
  window.addToCartFromDetail = function(id){
    try{ const p = products.find(x=>x.id===id); if (p) { window.addToCart && window.addToCart(p); alert('Added to cart'); } }
    catch(e){ console.warn(e); }
  };

})();
