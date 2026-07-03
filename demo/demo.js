/* =====================================================================
   VYD demos — switcher de tema + densidade (chrome do DEMO, não do DS).
   Auto-oculto em automação (navigator.webdriver) para não contaminar
   baselines de regressão visual nem varreduras axe.
   Reaproveitado como base do switcher global do docs site (Fase 13).
   ===================================================================== */
(function () {
  if (navigator.webdriver) return; // Playwright/CI: não renderizar

  var THEMES = ['dark', 'light', 'high-contrast'];
  var DENSITIES = ['compact', 'comfortable'];
  var root = document.documentElement;

  function make(tag, css, html) {
    var el = document.createElement(tag);
    if (css) el.style.cssText = css;
    if (html != null) el.innerHTML = html;
    return el;
  }

  var bar = make(
    'div',
    'position:fixed;bottom:10px;left:50%;transform:translateX(-50%);z-index:99999;' +
      'display:flex;gap:6px;align-items:center;padding:6px 10px;' +
      'background:var(--vyd-bg-elevated);border:1px solid var(--vyd-border-default);' +
      'border-radius:6px;font:12px var(--vyd-font-sans);color:var(--vyd-text-primary);' +
      'box-shadow:var(--vyd-shadow-md)'
  );
  bar.className = 'vyd-demo-switcher';

  function group(label, values, attr, current) {
    var wrap = make('span', 'display:inline-flex;gap:4px;align-items:center');
    wrap.appendChild(make('span', 'color:var(--vyd-text-secondary)', label));
    values.forEach(function (v) {
      var b = make(
        'button',
        'font:inherit;cursor:pointer;padding:2px 8px;border-radius:4px;' +
          'border:1px solid var(--vyd-border-default);background:transparent;color:inherit'
      );
      b.type = 'button';
      b.textContent = v;
      function paint() {
        var active = (root.getAttribute(attr) || current) === v;
        b.style.background = active ? 'var(--vyd-action-primary)' : 'transparent';
        b.style.color = active ? 'var(--vyd-text-on-accent)' : 'inherit';
      }
      b.addEventListener('click', function () {
        root.setAttribute(attr, v);
        Array.prototype.forEach.call(bar.querySelectorAll('button'), function (x) {
          x.dispatchEvent(new Event('vyd:paint'));
        });
      });
      b.addEventListener('vyd:paint', paint);
      paint();
      wrap.appendChild(b);
    });
    return wrap;
  }

  bar.appendChild(group('tema', THEMES, 'data-vyd-theme', root.getAttribute('data-vyd-theme') || 'dark'));
  bar.appendChild(make('span', 'width:1px;height:16px;background:var(--vyd-border-default)'));
  bar.appendChild(group('densidade', DENSITIES, 'data-vyd-density', root.getAttribute('data-vyd-density') || 'compact'));

  document.body.appendChild(bar);
})();
