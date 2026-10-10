/* OneWay - luxury request-type picker (works with any version of index.html)
   Replaces the native <select id="nty"> with a gold/glass bottom sheet that never
   closes or flickers when the page refreshes its data in the background. */
(function () {
  if (window.__lxSel) return;
  window.__lxSel = 1;
  var d = document;
  var css = [
    '.owq_b{width:100%;display:flex;align-items:center;gap:12px;padding:13px 16px;border-radius:14px;cursor:pointer;text-align:start;',
    'font-weight:600;font-size:15px;line-height:1.3;font-family:inherit;color:var(--m,#8ea3c7);background:linear-gradient(135deg,#0b1736,#071026);',
    'border:1px solid #e8c98744;box-shadow:0 8px 24px -14px #000,inset 0 1px 0 #ffffff0d;transition:border-color .25s,box-shadow .25s,color .25s}',
    '.owq_b:hover,.owq_b:focus-visible,.owq_b.op{border-color:#e8c987aa;box-shadow:0 0 0 3px #e8c98722,0 8px 24px -14px #000}',
    '.owq_b.on{color:#fff}',
    '.owq_b .owq_v{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.owq_b .owq_e2{font-size:19px;line-height:1}',
    '.owq_b svg{width:18px;height:18px;flex:none;stroke:#e8c987;transition:transform .3s}',
    '.owq_b.op svg{transform:rotate(180deg)}',
    '.owq_o{position:fixed;inset:0;z-index:2147483200;display:none;align-items:flex-end;justify-content:center;background:rgba(2,6,16,.74);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}',
    '.owq_o.sh{display:flex;animation:owq_fade .25s ease}',
    '.owq_s{width:100%;max-width:540px;max-height:84vh;max-height:84dvh;display:flex;flex-direction:column;overflow:hidden;',
    'background:radial-gradient(120% 60% at 50% 0,#1a3270 0,#0e1f46 38%,#07101f 100%);border:1px solid #e8c98766;border-bottom:0;',
    'border-radius:28px 28px 0 0;box-shadow:0 -24px 70px -10px #000,0 0 60px -20px #e8c987,inset 0 1px 0 #ffffff1a;',
    'padding-bottom:env(safe-area-inset-bottom,0px);animation:owq_up .38s cubic-bezier(.2,.9,.2,1)}',
    '@media(min-width:700px){.owq_o{align-items:center}.owq_s{border-bottom:1px solid #e8c98766;border-radius:28px;max-height:80vh}}',
    '.owq_g{width:46px;height:5px;border-radius:9px;margin:10px auto 0;background:linear-gradient(90deg,#b8924a,#f6e3a8,#b8924a);opacity:.85}',
    '.owq_h{display:flex;align-items:center;gap:10px;padding:14px 20px 10px}',
    '.owq_h b{flex:1;font-size:19px;font-weight:900;letter-spacing:.2px;background:linear-gradient(135deg,#f6e3a8,#e8c987 50%,#b8924a);-webkit-background-clip:text;background-clip:text;color:transparent}',
    '.owq_x{width:36px;height:36px;border-radius:50%;border:1px solid #e8c98744;background:#ffffff0a;color:#e8c987;font-size:20px;line-height:1;cursor:pointer}',
    '.owq_l{overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;padding:4px 0 16px}',
    '.owq_i{display:flex;align-items:center;gap:14px;margin:6px 14px;padding:12px 14px;border-radius:18px;cursor:pointer;color:#eaf2ff;',
    'font-weight:700;font-size:16.5px;line-height:1.3;font-family:inherit;background:#ffffff08;border:1px solid #ffffff10;animation:owq_in .4s both;transition:background .2s,border-color .2s,transform .15s}',
    '.owq_i:hover{background:#e8c9871a;border-color:#e8c98766}',
    '.owq_i:active{transform:scale(.985)}',
    '.owq_i .owq_e{width:46px;height:46px;flex:none;border-radius:50%;display:grid;place-items:center;font-size:23px;',
    'background:radial-gradient(circle at 30% 25%,#e8c98744,#e8c98708);border:1px solid #e8c98744}',
    '.owq_i .owq_t{flex:1;min-width:0}',
    '.owq_i .owq_k{width:26px;height:26px;border-radius:50%;flex:none;display:grid;place-items:center;font-size:14px;font-weight:900;color:#1a1204;opacity:0;transform:scale(.4);',
    'background:linear-gradient(135deg,#f6e3a8,#e8c987 50%,#b8924a);transition:.25s}',
    '.owq_i.sel{background:linear-gradient(135deg,#e8c98726,#e8c98710);border-color:#e8c987cc;box-shadow:0 0 22px -8px #e8c987}',
    '.owq_i.sel .owq_k{opacity:1;transform:none}',
    '@keyframes owq_up{from{transform:translateY(60px);opacity:0}to{transform:none;opacity:1}}',
    '@keyframes owq_fade{from{opacity:0}to{opacity:1}}',
    '@keyframes owq_in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}'
  ].join('');
  var st = d.createElement('style');
  st.textContent = css;
  (d.head || d.documentElement).appendChild(st);

  var ICONS = [['تخليص', '🛃'], ['تسعير', '💰'], ['استفسار', '🔎'], ['تأخير', '⏱️'], ['شكوى', '⚠️'], ['دفع', '🧾'], ['فاتورة', '🧾'], ['شحن', '📦']];
  function ico(t) {
    for (var i = 0; i < ICONS.length; i++) if (t.indexOf(ICONS[i][0]) > -1) return ICONS[i][1];
    return '✨';
  }
  var CHEV = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
  var PLACE = 'اختر النوع...';
  var opts = [];
  var cur = '';
  var sheet = null;

  function hid() { return d.getElementById('nty'); }
  function btn() { return d.getElementById('ntyb'); }

  function paint() {
    var b = btn();
    if (!b) return;
    var h = hid();
    var v = h ? h.value : '';
    var vs = b.querySelector('.owq_v');
    var ic = b.querySelector('.owq_e2');
    if (v) {
      vs.textContent = v;
      ic.textContent = ico(v);
      b.classList.add('on');
    } else {
      vs.textContent = PLACE;
      ic.textContent = '✦';
      b.classList.remove('on');
    }
  }

  function close() {
    if (!sheet) return;
    sheet.classList.remove('sh');
    d.documentElement.style.overflow = '';
    var b = btn();
    if (b) b.classList.remove('op');
  }

  function pick(v) {
    var h = hid();
    if (h) h.value = v;
    cur = v;
    var er = d.getElementById('nerr');
    if (er) er.textContent = '';
    paint();
    close();
  }

  function build() {
    if (sheet) sheet.parentNode && sheet.parentNode.removeChild(sheet);
    sheet = d.createElement('div');
    sheet.className = 'owq_o';
    var h = '<div class="owq_s" role="listbox"><div class="owq_g"></div><div class="owq_h"><b>اختر نوع الطلب</b><button type="button" class="owq_x" aria-label="close">×</button></div><div class="owq_l">';
    opts.forEach(function (o, i) {
      h += '<div class="owq_i" role="option" data-v="' + o.replace(/"/g, '&quot;') + '" style="animation-delay:' + (60 + i * 45) + 'ms"><span class="owq_e">' + ico(o) + '</span><span class="owq_t">' + o + '</span><span class="owq_k">✓</span></div>';
    });
    h += '</div></div>';
    sheet.innerHTML = h;
    sheet.addEventListener('click', function (e) {
      if (e.target === sheet || (e.target.closest && e.target.closest('.owq_x'))) return close();
      var it = e.target.closest && e.target.closest('.owq_i');
      if (it) pick(it.getAttribute('data-v'));
    });
    d.body.appendChild(sheet);
  }

  window.lxOpen = function () {
    if (!opts.length) return;
    if (!sheet || !sheet.parentNode) build();
    var items = sheet.querySelectorAll('.owq_i');
    for (var i = 0; i < items.length; i++) items[i].classList.toggle('sel', items[i].getAttribute('data-v') === cur);
    if (d.activeElement && d.activeElement.blur) d.activeElement.blur();
    d.documentElement.style.overflow = 'hidden';
    sheet.classList.add('sh');
    var b = btn();
    if (b) b.classList.add('op');
  };

  d.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });

  function patch(sel) {
    if (!sel || sel.getAttribute('data-lx') || sel.tagName !== 'SELECT') return;
    var list = [];
    for (var i = 0; i < sel.options.length; i++) if (sel.options[i].value) list.push(sel.options[i].value);
    if (!list.length) return;
    if (sel.options[0] && !sel.options[0].value) PLACE = sel.options[0].text || PLACE;
    opts = list;
    var h = d.createElement('input');
    h.type = 'hidden';
    h.id = 'nty';
    h.setAttribute('data-lx', '1');
    h.value = cur && list.indexOf(cur) > -1 ? cur : '';
    var b = d.createElement('button');
    b.type = 'button';
    b.id = 'ntyb';
    b.className = 'owq_b';
    b.setAttribute('onclick', 'lxOpen()');
    b.innerHTML = '<span class="owq_e2"></span><span class="owq_v"></span>' + CHEV;
    var w = d.createDocumentFragment();
    w.appendChild(h);
    w.appendChild(b);
    sel.parentNode.replaceChild(w, sel);
    paint();
  }

  function scan() {
    var s = d.getElementById('nty');
    if (s && s.tagName === 'SELECT') patch(s);
    else if (!s) cur = '';
  }

  /* keep the form alive while the page refreshes its data in the background */
  function wrap() {
    var r = window.render;
    if (typeof r !== 'function' || r.__lx) return;
    var w = function () {
      var h = hid(), app = d.getElementById('app');
      if (h && h.getAttribute('data-lx') && app && app.contains(h) && h.offsetParent !== null) return;
      return r.apply(this, arguments);
    };
    w.__lx = 1;
    window.render = w;
  }

  /* a different user logging in must never see the previous form */
  function watchApp() {
    var app = d.getElementById('app');
    if (!app || app.__lxw) return;
    app.__lxw = 1;
    new MutationObserver(function () {
      if (app.style.display === 'none') {
        var h = hid();
        if (h) h.removeAttribute('data-lx');
        cur = '';
      }
    }).observe(app, { attributes: true, attributeFilter: ['style'] });
  }

  function init() {
    wrap();
    watchApp();
    scan();
    new MutationObserver(scan).observe(d.documentElement, { childList: true, subtree: true });
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init);
  else init();
  addEventListener('load', function () { wrap(); watchApp(); });
})();
