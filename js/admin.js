/* Simple browser product admin using localStorage */
(function(){
  const LS_KEY = 'dgbs_products';
  const ADMIN_CREDENTIAL_B64 = btoa('obaadmin:obaadmin1');

  function qs(id){return document.getElementById(id);} 
  function load(){ try{ return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); }catch(e){ return []; } }
  function save(list){ localStorage.setItem(LS_KEY, JSON.stringify(list)); }

  const form = qs('product-form');
  const listEl = qs('admin-list');
  const catSelect = qs('prod-category-select');
  const catSelect = qs('prod-category-select');
  const catNew = qs('prod-category-new');
  const addCatBtn = qs('add-category');
  const tagSelect = qs('prod-tag-select');
  const tagNew = qs('prod-tag-new');
  const addTagBtn = qs('add-tag');
  const tagInput = qs('prod-tag');
  const badgeSelect = qs('prod-badge-select');
  const badgeNew = qs('prod-badge-new');
  const addBadgeBtn = qs('add-badge');
  const weightSelect = qs('prod-weight-select');
  const weightNew = qs('prod-weight-new');
  const addWeightBtn = qs('add-weight');
  const fileInput = qs('prod-image-file');
  const imgPreview = qs('img-preview');
  const resetBtn = qs('prod-reset');
  const exportBtn = qs('export-json');
  const syncBtn = qs('sync-now');
  const loginForm = qs('admin-login-form');
  const loginOverlay = qs('admin-login');
  const adminApp = document.getElementById('admin-app');

  function uid(){ return 'p' + Math.random().toString(36).slice(2,8); }

  function renderList(){
    const products = load();
    listEl.innerHTML = products.map(p => `
      <div class="card">
        <img class="thumb" src="${p.img}" onerror="this.src='https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&q=75'" />
        <div class="meta">${p.name}<small>${p.tag || p.category || ''}</small></div>
        <div style="margin-top:8px;display:flex;gap:8px;">
          <button class="btn btn-outline" data-action="edit" data-id="${p.id}">Edit</button>
          <button class="btn" data-action="delete" data-id="${p.id}">Delete</button>
        </div>
      </div>
    `).join('');

    // wire buttons
    listEl.querySelectorAll('button[data-action]').forEach(btn => {
      btn.addEventListener('click', (e)=>{
        const id = btn.dataset.id;
        const act = btn.dataset.action;
        if (act === 'edit') populateForm(id);
        if (act === 'delete') { if (!confirm('Delete this product?')) return; deleteProduct(id); }
      });
    });
  }

  // Sync status UI
  function setSyncStatus(text, cls) {
    const el = document.getElementById('sync-status');
    if (!el) return;
    el.textContent = text;
    el.className = cls || '';
  }

  function populateForm(id){
    const products = load();
    const p = products.find(x=>x.id===id); if (!p) return;
    qs('prod-id').value = p.id;
    qs('prod-name').value = p.name || '';
    // set selects and tag input
    if (catSelect) catSelect.value = p.category || '';
    if (tagInput) tagInput.value = p.tag || '';
    qs('prod-price').value = p.price || '';
    qs('prod-oldprice').value = p.oldPrice || '';
    if (badgeSelect) badgeSelect.value = p.badge || '';
    if (weightSelect) weightSelect.value = p.weight || '';
    qs('prod-img').value = p.img || '';
    qs('prod-desc').value = p.desc || '';
    qs('prod-instock').checked = !!p.inStock;
    // show preview
    if (p.img) setPreview(p.img);
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function deleteProduct(id){
    const products = load().filter(p=>p.id!==id);
    save(products);
    populateChoiceLists();
    renderList();
    // try persist to server
    sendToServer(products).then(ok=>{
      if (ok) alert('Deleted and saved'); else alert('Deleted locally (server not available)');
    });
  }

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const products = load();
    const id = qs('prod-id').value || uid();
    const entry = {
      id,
      name: qs('prod-name').value.trim(),
      category: (catSelect ? catSelect.value : (qs('prod-category') ? qs('prod-category').value : '') ).trim() || 'other',
      tag: (tagInput ? tagInput.value : (qs('prod-tag') ? qs('prod-tag').value : '') ).trim(),
      price: parseFloat(qs('prod-price').value) || 0,
      oldPrice: qs('prod-oldprice').value ? parseFloat(qs('prod-oldprice').value) : null,
      badge: (badgeSelect ? badgeSelect.value : (qs('prod-badge') ? qs('prod-badge').value : '')).trim() || null,
      weight: (weightSelect ? weightSelect.value : (qs('prod-weight') ? qs('prod-weight').value : '')).trim() || '',
      img: qs('prod-img').value.trim() || 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&q=75',
      desc: qs('prod-desc').value.trim() || '',
      inStock: !!qs('prod-instock').checked,
    };

    const exists = products.findIndex(p=>p.id===id);
    if (exists >= 0) { products[exists] = entry; }
    else { products.unshift(entry); }
    save(products);
    // refresh choice lists to include any new values
    populateChoiceLists();
    renderList();
    form.reset(); qs('prod-id').value = '';
    // try to persist to server; fall back to local only
    sendToServer(products).then(ok=>{
      if (ok) alert('Saved and synced to repo file'); else alert('Saved locally (server not running).');
    });
  });

  resetBtn.addEventListener('click', ()=>{ form.reset(); qs('prod-id').value = ''; });

  // Image upload handling: read file as Data URL and store it in hidden prod-img
  if (fileInput) {
    fileInput.addEventListener('change', (e)=>{
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = function(ev){
        const data = ev.target.result;
        qs('prod-img').value = data;
        setPreview(data);
      };
      reader.readAsDataURL(f);
    });
  }

  function setPreview(src){
    if (!imgPreview) return;
    imgPreview.innerHTML = '';
    const img = document.createElement('img'); img.src = src; img.alt = 'Preview';
    imgPreview.appendChild(img);
  }

  // Build distinct lists from saved products
  function collectDistincts(){
    const products = load();
    const cats = new Set();
    const badges = new Set();
    const weights = new Set();
    const tags = new Set();
    products.forEach(p=>{
      if (p.category) cats.add(p.category);
      if (p.badge) badges.add(p.badge);
      if (p.weight) weights.add(p.weight);
      if (p.tag) (''+p.tag).split(',').map(t=>t.trim()).filter(Boolean).forEach(t=>tags.add(t));
    });
    return { cats: Array.from(cats).sort(), badges: Array.from(badges).sort(), weights: Array.from(weights).sort(), tags: Array.from(tags).sort() };
  }

  function fillSelect(sel, arr){
    if (!sel) return;
    const cur = sel.value || '';
    sel.innerHTML = '';
    const empty = document.createElement('option'); empty.value = ''; empty.textContent = '';
    sel.appendChild(empty);
    arr.forEach(v=>{ const o = document.createElement('option'); o.value = v; o.textContent = v; sel.appendChild(o); });
    if (cur) sel.value = cur;
  }

  function addOptionIfMissing(sel, v){ if(!sel || !v) return; v = v.trim(); if(!v) return; if ([...sel.options].some(o=>o.value===v)) return; const o = document.createElement('option'); o.value = v; o.textContent = v; sel.appendChild(o); }

  function populateChoiceLists(){
    const d = collectDistincts();
    fillSelect(catSelect, d.cats);
    fillSelect(badgeSelect, d.badges);
    fillSelect(weightSelect, d.weights);
    fillSelect(tagSelect, d.tags);
  }

  // wire add buttons and tag-select quick add
  if (addCatBtn) addCatBtn.addEventListener('click', ()=>{ const v = (catNew && catNew.value||'').trim(); if(!v) return; addOptionIfMissing(catSelect,v); catSelect.value = v; if (catNew) catNew.value=''; });
  if (addBadgeBtn) addBadgeBtn.addEventListener('click', ()=>{ const v = (badgeNew && badgeNew.value||'').trim(); if(!v) return; addOptionIfMissing(badgeSelect,v); badgeSelect.value = v; if (badgeNew) badgeNew.value=''; });
  if (addWeightBtn) addWeightBtn.addEventListener('click', ()=>{ const v = (weightNew && weightNew.value||'').trim(); if(!v) return; addOptionIfMissing(weightSelect,v); weightSelect.value = v; if (weightNew) weightNew.value=''; });
  if (addTagBtn) addTagBtn.addEventListener('click', ()=>{
    const v = (tagNew && tagNew.value||'').trim(); if(!v) return; addOptionIfMissing(tagSelect,v);
    // append to tag input
    const cur = (tagInput && tagInput.value) ? tagInput.value.split(',').map(t=>t.trim()).filter(Boolean) : [];
    if (!cur.includes(v)) cur.push(v);
    if (tagInput) tagInput.value = cur.join(', ');
    if (tagNew) tagNew.value='';
  });
  if (tagSelect) tagSelect.addEventListener('change', ()=>{
    const v = tagSelect.value; if(!v) return;
    const cur = (tagInput && tagInput.value) ? tagInput.value.split(',').map(t=>t.trim()).filter(Boolean) : [];
    if (!cur.includes(v)) cur.push(v);
    if (tagInput) tagInput.value = cur.join(', ');
    tagSelect.value = '';
  });

  // Send full products array to local server API to persist to data/products.json
  async function sendToServer(products) {
    if (!window.fetch) return false;
    try {
      const auth = sessionStorage.getItem('admin_auth') || btoa('obaadmin:obaadmin1');
      const res = await fetch('/api/save-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Basic ' + auth },
        body: JSON.stringify(products),
      });
      if (!res.ok) return false;
      const j = await res.json();
      return !!j.ok;
    } catch (err) { return false; }
  }

  exportBtn.addEventListener('click', ()=>{
    const data = localStorage.getItem(LS_KEY) || '[]';
    const blob = new Blob([data], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'products.json';
    a.click();
  });

  // Manual sync button: push current local products to server
  if (syncBtn) {
    syncBtn.addEventListener('click', async () => {
      try {
        syncBtn.disabled = true;
        setSyncStatus('Syncing...', 'syncing');
        const products = load();
        const ok = await sendToServer(products);
        if (ok) {
          setSyncStatus('Synced', 'synced');
          setTimeout(()=> setSyncStatus('Online','synced'), 1400);
        } else {
          setSyncStatus('Offline', 'sync-offline');
          alert('Sync failed — server may be offline.');
        }
      } catch (err) {
        setSyncStatus('Offline', 'sync-offline');
        alert('Sync failed — see console for details.');
        console.error(err);
      } finally {
        syncBtn.disabled = false;
      }
    });
  }

  // Auth gating: show login overlay if not authenticated
  function showAdmin() {
    if (loginOverlay) loginOverlay.style.display = 'none';
    if (adminApp) adminApp.style.display = 'block';
    // attempt to auto-sync local <> server products, then populate choice lists and render
    autoSync().then(() => { populateChoiceLists(); renderList(); }).catch(() => { populateChoiceLists(); renderList(); });
  }

  function showLogin() {
    if (loginOverlay) loginOverlay.style.display = 'flex';
    if (adminApp) adminApp.style.display = 'none';
  }

  // Auto-sync local products with server when admin loads.
  // Behavior:
  // - If server has products but localStorage is empty -> load server into localStorage
  // - If local has products and server is empty or different -> POST local to server
  // - If server unreachable -> do nothing (local-only mode)
  async function autoSync() {
    const local = load();
    try {
      const res = await fetch('/api/products', { cache: 'no-store' });
      if (!res.ok) throw new Error('no-server');
      const server = await res.json();
      if (!Array.isArray(server)) return false;

      if ((!server.length || server.length === 0) && local.length) {
        // server empty, push local
        const ok = await sendToServer(local);
        return !!ok;
      }

      if (Array.isArray(server) && server.length) {
        if (local.length === 0) {
          // adopt server as local
          save(server);
          return true;
        }

        // both have data; prefer local changes (push local to server if different)
        if (JSON.stringify(local) !== JSON.stringify(server)) {
          const ok = await sendToServer(local);
          return !!ok;
        }
      }

      return true;
    } catch (err) {
      console.log('Auto-sync: server not available or error', err && err.message);
      return false;
    }
  }

  // Attach login handler
  if (sessionStorage.getItem('admin_auth') === ADMIN_CREDENTIAL_B64) {
    showAdmin();
  } else {
    showLogin();
    if (loginForm) {
      loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const u = qs('login-username').value || '';
        const p = qs('login-password').value || '';
        if (u === 'obaadmin' && p === 'obaadmin1') {
          sessionStorage.setItem('admin_auth', ADMIN_CREDENTIAL_B64);
          showAdmin();
        } else {
          alert('Invalid credentials');
        }
      });
    }
  }

})();
