
(function() {
  var container = document.getElementById('particles');
  if (!container) return;
  for (var i = 0; i < 30; i++) {
    var p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (Math.random() * 10 + 8) + 's';
    p.style.animationDelay = Math.random() * 10 + 's';
    var s = Math.random() * 2 + 1;
    p.style.width = p.style.height = s + 'px';
    if (Math.random() > 0.5) p.style.background = '#f472b6';
    container.appendChild(p);
  }
})();

(function() {
  var body = document.getElementById('termBody');
  if (!body) return;
  var lines = [
    '<span class="cmd">$</span> whoami',
    'Trusler258 [Admin]',
    '<span class="cmd">$</span> cat /etc/skills',
    'Python  C++  C#  Qt6  Vulkan  Unity  Linux',
    '<span class="cmd">$</span> gh repo list --public',
    '<span class="comment"># huanmeng-qqbot  -- Python, 3 stars</span>',
    '<span class="comment"># Adofai-Tweaks   -- C#, 3 stars</span>',
    '<span class="cmd">$</span> uptime',
    'up 128 days, 4 hours, 22 minutes',
    '<span class="cmd">$</span> <span class="arg">_</span>',
  ];

  var lineIdx = 0, charIdx = 0, currentLine = null, isTag = false, tagBuffer = '';

  function type() {
    if (lineIdx >= lines.length) return;
    var raw = lines[lineIdx];
    if (!currentLine) { currentLine = document.createElement('div'); currentLine.className = 'line'; body.appendChild(currentLine); }
    if (charIdx < raw.length) {
      var ch = raw[charIdx];
      if (ch === '<') { isTag = true; tagBuffer = ''; }
      if (isTag) { tagBuffer += ch; if (ch === '>') { isTag = false; currentLine.innerHTML += tagBuffer; tagBuffer = ''; } }
      else { currentLine.innerHTML += ch; }
      charIdx++;
      setTimeout(type, 22 + Math.random() * 15);
    } else {
      lineIdx++; charIdx = 0; currentLine = null;
      setTimeout(type, 150);
    }
  }
  setTimeout(type, 400);
})();

(function() {
  var el = document.getElementById('bioText');
  if (!el) return;
  var quotes = [
    { text: 'Stay hungry, stay foolish.', author: 'Steve Jobs' },
    { text: 'Talk is cheap. Show me the code.', author: 'Linus Torvalds' },
    { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
    { text: 'Simplicity is the soul of efficiency.', author: 'Austin Freeman' },
    { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
    { text: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.', author: 'Martin Fowler' },
    { text: 'Programs must be written for people to read, and only incidentally for machines to execute.', author: 'Harold Abelson' },
    { text: 'Simplicity is prerequisite for reliability.', author: 'Edsger W. Dijkstra' },
    { text: 'Make it work, make it right, make it fast.', author: 'Kent Beck' },
    { text: 'Code is like humor. When you have to explain it, it is bad.', author: 'Cory House' },
    { text: 'If debugging is the process of removing bugs, then programming must be the process of putting them in.', author: 'Edsger W. Dijkstra' },
    { text: 'Walking on water and developing software from a specification are easy if both are frozen.', author: 'Edward V. Berard' },
  ];

  var idx = Math.floor(Math.random() * quotes.length);

  function typeQuote(callback) {
    var q = quotes[idx];
    var html = '<span class="arg">"</span>' + q.text + '<span class="arg">"</span><br>';
    html += '<span class="comment">-- ' + q.author + '</span>';

    el.innerHTML = '';
    var total = html.length;
    var pos = 0;
    var tagOpen = false, tagBuf = '';

    function tick() {
      if (pos >= total) { if (callback) callback(); return; }
      var ch = html[pos];
      if (ch === '<') { tagOpen = true; tagBuf = ''; }
      if (tagOpen) { tagBuf += ch; if (ch === '>') { tagOpen = false; el.innerHTML += tagBuf; tagBuf = ''; } }
      else { el.innerHTML += ch; }
      pos++;
      setTimeout(tick, 22 + Math.random() * 15);
    }
    tick();
  }

  function nextQuote() {
    idx = (idx + 1) % quotes.length;
    typeQuote(function() { setTimeout(nextQuote, 5000); });
  }

  typeQuote(function() { setTimeout(nextQuote, 5000); });
})();

(function() {
  var main = document.querySelector('main');
  if (!main) return;
  var cards = main.querySelectorAll('.profile-card, .card');
  if (!cards.length) return;

  var baseDepths = {};
  cards.forEach(function(c, i) {
    var z = window.getComputedStyle(c).getPropertyValue('--card-z');
    baseDepths[c.dataset.cid || i] = z.trim() || '0px';
    if (!c.dataset.cid) c.dataset.cid = i;
  });

  document.addEventListener('mousemove', function(e) {
    cards.forEach(function(c) {
      var rect = c.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      var dx = (e.clientX - cx) / rect.width;
      var dy = (e.clientY - cy) / rect.height;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var factor = Math.max(0, 1 - dist * 1.5);
      var tilt = 10 * factor;
      var rx = -dy * tilt;
      var ry = dx * tilt;
      var z = baseDepths[c.dataset.cid] || '0px';
      c.style.transition = 'none';
      c.style.transform = 'translateZ(' + z + ') rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
    });
  });

  document.addEventListener('mouseleave', function() {
    cards.forEach(function(c) {
      var z = baseDepths[c.dataset.cid] || '0px';
      c.style.transition = 'transform .5s ease-out';
      c.style.transform = 'translateZ(' + z + ') rotateX(0) rotateY(0)';
    });
  });
})();

var _tr_usler_build = '0x1';

setInterval(function() {
  var el = document.getElementById('lat');
  if (el) el.textContent = Math.floor(Math.random() * 15) + 15;
}, 2000);

(function() {
  var el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();
