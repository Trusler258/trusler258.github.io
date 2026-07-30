function renderMarkdown(md) {
  var lines = md.split('\n');
  var html = '';
  var inCodeBlock = false, codeContent = '', codeLang = '';
  var inTable = false, tableHtml = '';

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
        html += '<pre><code' + langAttr + '>' + codeContent.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</code></pre>';
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
      html += '<h' + level + '>' + parseInline(line.replace(/^#{1,6}\s*/, '')) + '</h' + level + '>';
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

var articleCache = {};
var fileMap = {};
var categories = [];

(function() {
  var navCats = document.getElementById('navCats');
  var navList = document.getElementById('navList');
  var content = document.getElementById('articleContent');
  var activeCat = 0;

  function renderArticle(md) {
    content.innerHTML = renderMarkdown(md);
    if (typeof hljs !== 'undefined') {
      content.querySelectorAll('pre code').forEach(function(el) { hljs.highlightElement(el); });
    }
    addCopyButtons(content);
    content.style.animation = 'none';
    content.offsetHeight;
    content.style.animation = 'fadeUp .4s ease both';
  }

  function showArticle(idx) {
    window.scrollTo(0, 0);
    var file = fileMap[idx];
    if (!file) { content.innerHTML = '<p style="color:var(--muted)">文章未找到</p>'; return; }
    if (articleCache[file]) { renderArticle(articleCache[file]); }
    else {
      content.innerHTML = '<p style="text-align:center;color:var(--muted);padding:60px 0;">加载中...</p>';
      fetch('posts/' + file)
        .then(function(r) { if (!r.ok) throw Error(r.status); return r.text(); })
        .then(function(md) { articleCache[file] = md; renderArticle(md); })
        .catch(function() { content.innerHTML = '<p style="color:var(--muted)">加载失败，请刷新重试</p>'; });
    }
    var items = document.querySelectorAll('.blog-nav-item');
    items.forEach(function(item) {
      item.classList.toggle('active', parseInt(item.getAttribute('data-idx')) === idx);
    });
  }

  function renderList() {
    navList.innerHTML = '';
    categories[activeCat].items.forEach(function(a) {
      var b = document.createElement('button');
      b.className = 'blog-nav-item';
      b.setAttribute('data-idx', a.id);
      b.textContent = a.title;
      b.addEventListener('click', function() { showArticle(a.id); });
      navList.appendChild(b);
    });
    if (categories[activeCat].items.length > 0) {
      showArticle(categories[activeCat].items[0].id);
    }
  }

  function renderCats() {
    navCats.innerHTML = '';
    categories.forEach(function(cat, i) {
      var b = document.createElement('button');
      b.className = 'blog-cat-btn';
      if (i === 0) b.classList.add('active');
      b.textContent = cat.name;
      b.addEventListener('click', function() {
        activeCat = i;
        navCats.querySelectorAll('.blog-cat-btn').forEach(function(btn) { btn.classList.remove('active'); });
        b.classList.add('active');
        renderList();
      });
      navCats.appendChild(b);
    });
  }

  fetch('posts/index.json')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      categories = data.categories;
      data.categories.forEach(function(cat) {
        cat.items.forEach(function(item) {
          fileMap[item.id] = item.file;
        });
      });
      renderCats();
      renderList();
    })
    .catch(function() {
      if (navCats) navCats.innerHTML = '<span style="color:var(--muted)">加载目录失败</span>';
    });
})();
