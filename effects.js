/* ========== 自定义光标 ========== */
(function() {
  var style = document.createElement('style');
  style.textContent = [
    'html { cursor: none !important; }',
    'a, button, input, textarea, .proj-item, .s-btn, .blog-nav-item, .pane-btn, .tool-btn, .copy-btn, .convert-tab { cursor: none !important; }',
    '.custom-cursor { position: fixed; pointer-events: none; z-index: 9999; transition: width 0.15s, height 0.15s, border-color 0.15s; }',
    '.cursor-outer {',
    '  width: 28px; height: 28px; border: 1.5px solid rgba(103,232,249,0.5);',
    '  border-radius: 50%; top: -14px; left: -14px;',
    '}',
    '.cursor-inner {',
    '  width: 6px; height: 6px; background: var(--highlight);',
    '  border-radius: 50%; top: -3px; left: -3px;',
    '  box-shadow: 0 0 10px var(--highlight), 0 0 20px var(--highlight);',
    '}',
    '.cursor-outer.hover {',
    '  width: 44px; height: 44px; top: -22px; left: -22px;',
    '  border-color: rgba(103,232,249,0.8);',
    '  background: rgba(103,232,249,0.05);',
    '}',
    '.cursor-inner.hover {',
    '  width: 10px; height: 10px; top: -5px; left: -5px;',
    '  background: #fff; box-shadow: 0 0 15px #fff, 0 0 30px var(--highlight);',
    '}'
  ].join('\n');
  document.head.appendChild(style);

  var outer = document.createElement('div');
  outer.className = 'custom-cursor cursor-outer';
  var inner = document.createElement('div');
  inner.className = 'custom-cursor cursor-inner';
  document.body.appendChild(outer);
  document.body.appendChild(inner);

  var mx = 0, my = 0;
  var ox = 0, oy = 0;
  var ix = 0, iy = 0;
  var hovering = false;

  document.addEventListener('mousemove', function(e) {
    mx = e.clientX; my = e.clientY;
    ix = mx; iy = my;
  });

  // Check if hovering interactive elements
  document.querySelectorAll('a, button, input, textarea, .proj-item, .s-btn, .blog-nav-item, .pane-btn, .tool-btn, .copy-btn, .convert-tab').forEach(function(el) {
    el.addEventListener('mouseenter', function() { hovering = true; });
    el.addEventListener('mouseleave', function() { hovering = false; });
  });

  function animate() {
    ox += (mx - ox) * 0.15;
    oy += (my - oy) * 0.15;
    ix += (mx - ix) * 0.35;
    iy += (my - iy) * 0.35;

    outer.style.transform = 'translate(' + ox + 'px, ' + oy + 'px)';
    inner.style.transform = 'translate(' + ix + 'px, ' + iy + 'px)';

    if (hovering) {
      outer.classList.add('hover');
      inner.classList.add('hover');
    } else {
      outer.classList.remove('hover');
      inner.classList.remove('hover');
    }

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();

/* ========== 鼠标拖尾 ========== */
(function() {
  var trailContainer = document.createElement('div');
  trailContainer.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;';
  document.body.appendChild(trailContainer);

  var particles = [];
  var maxParticles = 40;
  var mx = 0, my = 0;
  var lastX = 0, lastY = 0;
  var spawnTimer = 0;

  document.addEventListener('mousemove', function(e) {
    mx = e.clientX; my = e.clientY;
  });

  function createParticle(x, y) {
    var p = document.createElement('div');
    var size = Math.random() * 3 + 1.5;
    var life = Math.random() * 0.6 + 0.3;
    var hue = Math.random() > 0.5 ? '103,232,249' : '244,114,182';
    p.style.cssText = [
      'position:absolute;',
      'width:' + size + 'px;height:' + size + 'px;',
      'background:rgba(' + hue + ',' + (Math.random()*0.5+0.3) + ');',
      'border-radius:50%;',
      'left:' + x + 'px;top:' + y + 'px;',
      'pointer-events:none;',
      'box-shadow: 0 0 ' + (size*2) + 'px rgba(' + hue + ',0.4);',
      'transition: opacity ' + life + 's ease-out, transform ' + life + 's ease-out;'
    ].join('');
    trailContainer.appendChild(p);

    requestAnimationFrame(function() {
      p.style.opacity = '0';
      p.style.transform = 'translate(' + ((Math.random()-0.5)*20) + 'px, ' + ((Math.random()-0.5)*20) + 'px) scale(0)';
    });

    setTimeout(function() {
      if (p.parentNode) p.parentNode.removeChild(p);
    }, life * 1000 + 100);
  }

  function updateTrail() {
    var dx = mx - lastX;
    var dy = my - lastY;
    var dist = Math.sqrt(dx*dx + dy*dy);

    spawnTimer += 16;
    if (dist > 3 && spawnTimer > 15) {
      spawnTimer = 0;
      createParticle(mx, my);
    }

    lastX = mx;
    lastY = my;
    requestAnimationFrame(updateTrail);
  }
  requestAnimationFrame(updateTrail);
})();

/* ========== 增强背景粒子 ========== */
(function() {
  var container = document.getElementById('particles');
  if (!container) {
    container = document.createElement('div');
    container.id = 'particles';
    container.className = 'particles';
    container.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(container, document.body.firstChild);
  }

  // 清理现有粒子
  container.innerHTML = '';

  // 小光点粒子
  for (var i = 0; i < 25; i++) {
    var p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (Math.random() * 12 + 8) + 's';
    p.style.animationDelay = Math.random() * 12 + 's';
    var s = Math.random() * 2 + 1;
    p.style.width = p.style.height = s + 'px';
    if (Math.random() > 0.5) p.style.background = '#f472b6';
    if (Math.random() > 0.7) p.style.boxShadow = '0 0 3px ' + p.style.background;
    container.appendChild(p);
  }

  // 大型明亮浮游光球
  for (var j = 0; j < 6; j++) {
    var bp = document.createElement('div');
    var bSize = Math.random() * 250 + 150;
    var isPink = Math.random() > 0.5;
    var color = isPink ? '244,114,182' : '103,232,249';
    bp.style.cssText = [
      'position:absolute;',
      'width:' + bSize + 'px;height:' + bSize + 'px;',
      'border-radius:50%;',
      'left:' + (Math.random()*80+10) + '%;',
      'top:' + (Math.random()*80+10) + '%;',
      'animation: floatOrb ' + (Math.random()*20+20) + 's linear infinite;',
      'animation-delay:' + (Math.random()*10) + 's;',
      'opacity:0.25;',
      'pointer-events:none;',
      'filter:blur(' + (Math.random()*30+20) + 'px);',
      'background:radial-gradient(circle, rgba(' + color + ',0.7) 0%, rgba(' + color + ',0.2) 40%, transparent 70%);',
      'mix-blend-mode:screen;'
    ].join('');
    container.appendChild(bp);
  }

  // 扫描线覆盖层
  var scan = document.createElement('div');
  scan.style.cssText = [
    'position:fixed;top:0;left:0;width:100%;height:100%;',
    'pointer-events:none;z-index:0;',
    'background:repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(103,232,249,0.015) 2px, rgba(103,232,249,0.015) 4px);',
    'animation: scanMove 8s linear infinite;'
  ].join('');
  container.appendChild(scan);

  // 四角发光
  var corners = [
    { top: '-10%', left: '-10%', size: '400px' },
    { top: '-10%', right: '-10%', size: '350px' },
    { bottom: '-10%', left: '-10%', size: '300px' },
    { bottom: '-10%', right: '-10%', size: '400px' }
  ];
  corners.forEach(function(pos, i) {
    var c = document.createElement('div');
    var clr = i % 2 === 0 ? 'rgba(103,232,249,0.12)' : 'rgba(244,114,182,0.1)';
    c.style.cssText = [
      'position:absolute;',
      'pointer-events:none;',
      'width:' + pos.size + ';height:' + pos.size + ';',
      'border-radius:50%;',
      'background:radial-gradient(circle, ' + clr + ' 0%, transparent 70%);',
      'animation: cornerPulse ' + (i*2+3) + 's ease-in-out infinite;',
      'animation-delay:' + (i*1.5) + 's;',
      (pos.top ? 'top:' + pos.top + ';' : ''),
      (pos.bottom ? 'bottom:' + pos.bottom + ';' : ''),
      (pos.left ? 'left:' + pos.left + ';' : ''),
      (pos.right ? 'right:' + pos.right + ';' : '')
    ].join('');
    container.appendChild(c);
  });

  // 随机闪烁的数据点
  for (var d = 0; d < 15; d++) {
    var dp = document.createElement('div');
    dp.style.cssText = [
      'position:absolute;',
      'width:3px;height:3px;',
      'background:' + (Math.random() > 0.5 ? 'var(--highlight)' : 'var(--admin)') + ';',
      'border-radius:50%;',
      'left:' + (Math.random()*90+5) + '%;',
      'top:' + (Math.random()*90+5) + '%;',
      'pointer-events:none;',
      'animation: dataBlink ' + (Math.random()*3+2) + 's ease-in-out infinite;',
      'animation-delay:' + (Math.random()*3) + 's;',
      'box-shadow: 0 0 6px currentColor;'
    ].join('');
    container.appendChild(dp);
  }
})();
