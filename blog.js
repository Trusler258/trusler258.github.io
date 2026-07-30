function renderMarkdown(md) {
  var lines = md.split('\n');
  var html = '';
  var inCodeBlock = false, codeContent = '', codeLang = '';
  var inTable = false, tableHtml = '';
  var headingCount = {};

  function slug(text) {
    return text.toLowerCase().replace(/[^\w\u4e00-\u9fff]+/g, '-').replace(/^-|-$/g, '');
  }

  function parseInline(text) {
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    text = text.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
    text = text.replace(/~~(.+?)~~/g, '<del>$1</del>');
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:6px;">');
    return text;
  }

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];

    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        var langAttr = codeLang ? ' class="language-' + codeLang + '"' : '';
        html += '<pre' + (codeLang ? ' data-lang="' + codeLang + '"' : '') + '><code' + langAttr + '>' + codeContent.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</code></pre>';
        codeContent = '';
        codeLang = '';
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeLang = line.trim().slice(3).trim().split(' ')[0];
      }
      continue;
    }
    if (inCodeBlock) {
      codeContent += (codeContent ? '\n' : '') + line;
      continue;
    }

    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      if (!inTable) { inTable = true; tableHtml = ''; }
      var cells = line.split('|').filter(function(c) { return c.trim(); });
      if (cells.every(function(c) { return /^[-: ]+$/.test(c.trim()); })) {
        tableHtml += '<!--sep-->';
        continue;
      }
      var tag = (tableHtml.indexOf('<th') === -1 && tableHtml.indexOf('<!--sep-->') === -1) ? 'th' : 'td';
      tableHtml += '<tr>';
      cells.forEach(function(c) { tableHtml += '<' + tag + '>' + parseInline(c.trim()) + '</' + tag + '>'; });
      tableHtml += '</tr>';
      if (i + 1 >= lines.length || !(lines[i+1].trim().startsWith('|') && lines[i+1].trim().endsWith('|'))) {
        var parts = tableHtml.split('<!--sep-->');
        html += '<table>' + (parts[0] || '') + (parts[1] || '') + '</table>';
        inTable = false; tableHtml = '';
      }
      continue;
    }

    if (line.match(/^#{1,6}\s/)) {
      var level = line.match(/^(#{1,6})/)[1].length;
      var title = parseInline(line.replace(/^#{1,6}\s*/, ''));
      var id = slug(title) || 'h-' + (headingCount[level] = (headingCount[level] || 0) + 1);
      html += '<h' + level + ' id="' + id + '">' + title + '</h' + level + '>';
      continue;
    }

    if (line.match(/^[-*_]{3,}\s*$/)) { html += '<hr>'; continue; }

    if (line.startsWith('>')) {
      var qLines = [];
      var m = i;
      while (m < lines.length && lines[m].startsWith('>')) {
        qLines.push(lines[m].replace(/^>\s?/, ''));
        m++;
      }
      i = m - 1;
      var qText = qLines.join('\n');
      var am = qText.match(/^\[!(NOTE|TIP|WARNING|CAUTION|IMPORTANT|DANGER)\]\s*\n?/);
      if (am) {
        var ctype = am[1].toLowerCase();
        var cbody = qText.slice(am[0].length).replace(/\n/g, '<br>');
        html += '<div class="callout callout-' + ctype + '"><div class="callout-title">' + am[1] + '</div><div class="callout-body">' + parseInline(cbody) + '</div></div>';
      } else {
        html += '<blockquote>' + parseInline(qText.replace(/\n/g, '<br>')) + '</blockquote>';
      }
      continue;
    }

    if (line.match(/^[\s]*[-*+]\s/)) {
      html += '<ul>';
      var j = i;
      while (j < lines.length && lines[j].match(/^[\s]*[-*+]\s/)) {
        html += '<li>' + parseInline(lines[j].replace(/^[\s]*[-*+]\s/, '')) + '</li>';
        j++;
      }
      html += '</ul>';
      i = j - 1;
      continue;
    }

    if (line.match(/^[\s]*\d+\.\s/)) {
      html += '<ol>';
      var k = i;
      while (k < lines.length && lines[k].match(/^[\s]*\d+\.\s/)) {
        html += '<li>' + parseInline(lines[k].replace(/^[\s]*\d+\.\s/, '')) + '</li>';
        k++;
      }
      html += '</ol>';
      i = k - 1;
      continue;
    }

    if (line.trim() === '') continue;

    if (line.trim().startsWith('<')) { html += line; continue; }

    html += '<p>' + parseInline(line) + '</p>';
  }

  return html;
}

function addCopyButtons(container) {
  container.querySelectorAll('pre').forEach(function(pre) {
    if (pre.querySelector('.copy-btn')) return;
    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.onclick = function() {
      var code = pre.querySelector('code');
      var text = code ? code.textContent : pre.textContent;
      navigator.clipboard.writeText(text).then(function() {
        btn.textContent = 'Copied!'; btn.classList.add('copied');
        setTimeout(function() { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1500);
      }).catch(function() {
        btn.textContent = 'Failed';
        setTimeout(function() { btn.textContent = 'Copy'; }, 1500);
      });
    };
    pre.appendChild(btn);
  });
}

function buildTOC(container) {
  var toc = document.getElementById('tocList');
  var navToc = document.getElementById('navToc');
  if (!toc || !navToc) return;
  var headings = container.querySelectorAll('h1, h2, h3');
  if (headings.length === 0) { navToc.style.display = 'none'; return; }
  navToc.style.display = '';
  toc.innerHTML = '';
  headings.forEach(function(h) {
    var a = document.createElement('a');
    a.className = 'toc-link toc-' + h.tagName.toLowerCase();
    a.href = '#' + h.id;
    a.textContent = h.textContent;
    a.addEventListener('click', function(e) {
      e.preventDefault();
      h.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    toc.appendChild(a);
  });
}

var articleCache = {};
var fileMap = {};
var categories = [];

(function() {
  var navCats = document.getElementById('navCats');
  var content = document.getElementById('articleContent');
  var activeId = null;

  function renderArticle(md) {
    content.innerHTML = renderMarkdown(md);
    if (typeof hljs !== 'undefined') {
      content.querySelectorAll('pre code').forEach(function(el) { hljs.highlightElement(el); });
    }
    addCopyButtons(content);
    buildTOC(content);
    content.style.animation = 'none';
    content.offsetHeight;
    content.style.animation = 'fadeUp .4s ease both';
  }

  function showArticle(id) {
    window.scrollTo(0, 0);
    var file = fileMap[id];
    if (!file) { content.innerHTML = '<p style="color:var(--muted)">文章未找到</p>'; return; }
    if (articleCache[file]) { renderArticle(articleCache[file]); }
    else {
      content.innerHTML = '<p style="text-align:center;color:var(--muted);padding:60px 0;">加载中...</p>';
      fetch('posts/' + file)
        .then(function(r) { if (!r.ok) throw Error(r.status); return r.text(); })
        .then(function(md) { articleCache[file] = md; renderArticle(md); })
        .catch(function() { content.innerHTML = '<p style="color:var(--muted)">加载失败，请刷新重试</p>'; });
    }
    activeId = id;
    navCats.querySelectorAll('.toc-nav-item').forEach(function(el) {
      el.classList.toggle('active', parseInt(el.getAttribute('data-id')) === id);
    });
  }

  function renderCats() {
    navCats.innerHTML = '';
    categories.forEach(function(cat) {
      var section = document.createElement('div');
      section.className = 'toc-section';

      var head = document.createElement('button');
      head.className = 'toc-section-head';
      head.innerHTML = cat.name + '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>';
      
      var body = document.createElement('div');
      body.className = 'toc-section-body';

      cat.items.forEach(function(item) {
        var a = document.createElement('a');
        a.className = 'toc-nav-item';
        a.setAttribute('data-id', item.id);
        a.textContent = item.title;
        a.addEventListener('click', function() { showArticle(item.id); });
        body.appendChild(a);
      });

      head.addEventListener('click', function() {
        var open = section.classList.toggle('open');
        head.querySelector('svg').style.transform = open ? 'rotate(180deg)' : '';
      });

      section.appendChild(head);
      section.appendChild(body);
      navCats.appendChild(section);
    });

    // Expand first category
    var first = navCats.querySelector('.toc-section');
    if (first) { first.classList.add('open'); first.querySelector('svg').style.transform = 'rotate(180deg)'; }

    // Open first article
    if (categories[0] && categories[0].items[0]) {
      showArticle(categories[0].items[0].id);
    }
  }

  fetch('posts/index.json')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      categories = data.categories;
      data.categories.forEach(function(cat) {
        cat.items.forEach(function(item) { fileMap[item.id] = item.file; });
      });
      renderCats();
    })
    .catch(function() {
      if (navCats) navCats.innerHTML = '<span style="color:var(--muted)">加载目录失败</span>';
    });
})();
