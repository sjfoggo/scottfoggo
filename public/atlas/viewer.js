(() => {
  const data = window.FIRE_ATLAS;
  const list = document.getElementById('province-list');
  const tabs = document.getElementById('view-tabs');
  const stage = document.getElementById('map-stage');
  const image = document.getElementById('map-image');
  const level = document.getElementById('zoom-level');
  let provinceIndex = 0;
  let viewIndex = 0;
  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;
  let drag = null;

  function transform() {
    image.style.transform = `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
    level.textContent = `${Math.round(scale * 100)}%`;
  }
  function reset() { scale = 1; offsetX = 0; offsetY = 0; transform(); }
  function zoom(factor) { scale = Math.max(1, Math.min(8, scale * factor)); if (scale === 1) { offsetX = 0; offsetY = 0; } transform(); }
  function saveLocation() { history.replaceState(null, '', `#${data.provinces[provinceIndex].code}/${viewIndex}`); }
  function chooseProvince(index) { provinceIndex = index; viewIndex = 0; render(); saveLocation(); list.children[index].focus(); }
  function chooseView(index) { viewIndex = index; render(); saveLocation(); tabs.children[index].focus(); }
  function readLocation() {
    const [code, selectedView] = location.hash.slice(1).split('/');
    const index = data.provinces.findIndex(province => province.code === code);
    provinceIndex = index < 0 ? 0 : index;
    const requested = Number(selectedView);
    viewIndex = Number.isInteger(requested) && requested >= 0 && requested <= data.provinces[provinceIndex].focus_views.length ? requested : 0;
    render();
  }
  function render() {
    const province = data.provinces[provinceIndex];
    const views = [{ name: 'Overview', image: province.overview, map_image: province.map_image }, ...province.focus_views];
    const view = views[viewIndex];
    document.getElementById('province-title').textContent = province.name;
    document.getElementById('province-meta').textContent = `${province.incident_perimeters.toLocaleString()} recorded incident perimeters · 1980–2024`;
    document.getElementById('position').textContent = `${String(provinceIndex + 1).padStart(2, '0')} / 13`;
    image.src = view.map_image || view.image;
    image.alt = `${province.name}: ${view.name}, recorded fire perimeters from 1980 to 2024`;
    const download = document.getElementById('download-link');
    download.href = view.image;
    download.download = view.image;
    list.innerHTML = '';
    data.provinces.forEach((item, index) => {
      const button = document.createElement('button');
      button.className = `province-button${index === provinceIndex ? ' active' : ''}`;
      button.innerHTML = `<span>${item.name}</span><span>${item.code}</span>`;
      button.type = 'button';
      button.setAttribute('aria-pressed', String(index === provinceIndex));
      button.addEventListener('click', () => chooseProvince(index));
      list.appendChild(button);
    });
    tabs.innerHTML = '';
    views.forEach((item, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = index === viewIndex ? 'active' : '';
      button.textContent = item.name;
      button.setAttribute('aria-pressed', String(index === viewIndex));
      button.addEventListener('click', () => chooseView(index));
      tabs.appendChild(button);
    });
    reset();
  }
  document.getElementById('zoom-in').addEventListener('click', () => zoom(1.35));
  document.getElementById('zoom-out').addEventListener('click', () => zoom(1 / 1.35));
  document.getElementById('zoom-reset').addEventListener('click', reset);
  stage.addEventListener('wheel', event => { event.preventDefault(); zoom(event.deltaY < 0 ? 1.18 : 1 / 1.18); }, { passive: false });
  stage.addEventListener('pointerdown', event => { drag = { x: event.clientX, y: event.clientY, ox: offsetX, oy: offsetY }; stage.classList.add('dragging'); stage.setPointerCapture(event.pointerId); });
  stage.addEventListener('pointermove', event => { if (!drag) return; offsetX = drag.ox + event.clientX - drag.x; offsetY = drag.oy + event.clientY - drag.y; transform(); });
  for (const name of ['pointerup', 'pointercancel']) stage.addEventListener(name, () => { drag = null; stage.classList.remove('dragging'); });
  window.addEventListener('hashchange', readLocation);
  readLocation();
})();
