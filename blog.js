
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
  var el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();

function raw(fn) {
  var s = fn.toString();
  return s.slice(s.indexOf('/*') + 2, s.lastIndexOf('*/'));
}

var articles = [
  /* ---- 0: Markdown 入门 ---- */
  raw(function(){/*
# Markdown 入门指南

Markdown 是一种轻量级标记语言，创始人为 John Gruber。它允许人们使用易读易写的纯文本格式编写文档，然后转换成有效的 XHTML（或 HTML）文档。

## 为什么用 Markdown

- **纯文本**：任何编辑器都能打开，跨平台无压力
- **易读**：即使不渲染，源文件也像一份排版好的纯文本
- **通用**：GitHub、Notion、Obsidian、VS Code 等全部支持
- **可版本控制**：纯文本天然适合 Git diff

## 标题

使用 `#` 号标记，1-6 级：

```markdown
# 一级标题
## 二级标题
### 三级标题
```

## 段落与换行

直接写就是段落。段间空一行表示新段落。  
行末加两个空格再回车 = 软换行（同段内换行）。

## 强调

| 语法 | 效果 |
|---|---|
| `**粗体**` | **粗体** |
| `*斜体*` | *斜体* |
| `***粗斜体***` | ***粗斜体*** |
| `~~删除线~~` | ~~删除线~~ |
| ``行内代码`` | `行内代码` |

## 列表

无序列表用 `-`、`*` 或 `+`：

```markdown
- 第一项
- 第二项
  - 嵌套子项
```

有序列表用数字 + 点：

```markdown
1. 第一步
2. 第二步
3. 第三步
```

## 代码块

三个反引号包裹，指定语言可高亮：

```python
def hello():
    print("Hello, Markdown!")
```

## 引用

```markdown
> 这是一段引用。
> 可以多行。
>
> > 也可以嵌套。
```

> 这是一段引用。
> 可以多行。

## 链接与图片

```markdown
[链接文本](https://example.com)
![图片描述](image.png)
```

## 表格

```markdown
| 列A | 列B | 列C |
|-----|-----|-----|
| 数据1 | 数据2 | 数据3 |
| 数据4 | 数据5 | 数据6 |
```

## 分割线

三个或更多 `---` / `***` 单独一行：

---

## 常用工具推荐

- **VS Code** + Markdown Preview Enhanced 插件
- **Typora**：所见即所得编辑器
- **Obsidian**：双向链接笔记
- **Marp**：用 Markdown 做 PPT

## 总结

Markdown 的核心哲学是 **内容优先，排版靠后**。花半小时学会，受益整个开发生涯。
*/}),

  /* ---- 1: Linux 命令 ---- */
  raw(function(){/*
# Linux 命令速查手册

以 CentOS 7/8 为主，兼顾 Ubuntu。覆盖日常开发、运维、排障全场景。每个命令附带参数解释和常见坑点。

---

## 一、文件与目录

### ls — 列出文件

最基础的命令，但参数丰富程度远超想象：

```bash
ls
```

> 不加参数只显示文件名，隐藏文件（以 `.` 开头的）不显示。大部分时候你需要的其实是下面这个：

```bash
ls -la
```

> `-l` 长格式（权限、大小、时间、属主），`-a` 显示隐藏文件。合起来 `-la` 是最常用的组合。再加 `-h`（human-readable）可以把文件大小显示为 1K、234M 而非 1024、245366784：

```bash
ls -lah
```

> 按时间倒序排列（最新的在最上面），排查日志文件时很有用：

```bash
ls -lt
```

> 只显示目录：

```bash
ls -F | grep /
```

### cd — 切换目录

```bash
cd /etc/nginx
```

> 几个快捷方式：
> - `cd -` 回到上一次的目录（在 A 和 B 两个目录间反复横跳时极其好用）
> - `cd ~` 或 `cd` 直接回 home 目录
> - `cd ..` 回到上级目录

### pwd — 显示当前路径

```bash
pwd
```

> 输出当前所在的完整路径。在写脚本、配环境变量时，**不要手写路径**，先用 `pwd` 看一眼，然后复制结果。手写路径写错一个字符就要查半天。

### mkdir — 创建目录

```bash
mkdir myfolder
```

> 如果要创建的路径的父目录不存在，会报错。加上 `-p` 可以自动创建所有不存在的父目录：

```bash
mkdir -p /data/logs/nginx/2026/07
```

> `-p` 还有一个好处：如果目录已存在也不会报错，静默跳过。写脚本时必加，避免二次运行报错中断。

### cp — 复制文件/目录

复制单个文件：

```bash
cp source.txt dest.txt
```

复制目录需要 `-r`（递归）：

```bash
cp -r /etc/nginx /backup/nginx
```

> 保留文件属性（权限、时间戳）：

```bash
cp -rp source/ dest/
```

> `-p` 保留原文件的权限、属主、时间戳。做备份时一定要加，否则所有备份文件的修改时间都变成当前时间，分不清哪个是新哪个是旧。

### mv — 移动 / 重命名

```bash
mv oldname.txt newname.txt
```

```bash
mv file.log /var/log/archive/
```

> `mv` 在同一个分区内移动是修改 inode 指针，速度极快。跨分区移动等于"复制+删除"，大文件会很慢。如果目标已存在会被静默覆盖，加 `-i` 可以在覆盖前提示确认：

```bash
mv -i file.txt /existing/path/
```

### rm — 删除（高危操作）

```bash
rm file.txt
```

```bash
rm -rf /tmp/cache/
```

> **`-rf` 是组合拳：`-r` 递归删目录，`-f` 强制不提示。** 手滑打错路径（比如多打一个空格变成 `rm -rf / tmp/cache`）就是灾难。建议先 `ls` 确认路径，再删。或者养成习惯：先用 `rm -ri` 预览一遍，确认无误再换 `-rf`。

> 防止 `rm -rf /` 黑洞：很多发行版已经加了保护，`rm -rf /` 会提示 `--no-preserve-root` 才执行。但别依赖这个——**永远不要在生产环境测试**。

### find — 查找文件

按名称查找：

```bash
find /var/log -name "*.log"
```

> `-name` 区分大小写，`-iname` 不区分。路径用 `/var/log` 而非 `/` 可以极大减少搜索时间。

按类型查找（`f`=文件, `d`=目录）：

```bash
find . -type f -name "*.py"
```

```bash
find . -type d -name "node_modules"
```

按大小查找（大于 100MB 的文件）：

```bash
find / -type f -size +100M 2>/dev/null
```

> `2>/dev/null` 是把"权限拒绝"之类的错误信息丢掉，屏幕干净。不加的话满屏 Permission denied 淹没了真正结果。

按修改时间查找（7 天内修改过的）：

```bash
find . -type f -mtime -7
```

> 配合 `-exec` 可以对找到的每个文件执行操作。比如找到所有 `.tmp` 文件并删除：

```bash
find . -name "*.tmp" -exec rm {} \;
```

> `{}` 是占位符，代表找到的每个文件，`\;` 表示 exec 语句结束。比 `find | xargs rm` 更安全，因为文件名里有空格 `xargs` 会炸。

### du — 磁盘使用

```bash
du -sh /var/log
```

> `-s` 只显示总计（不列出子目录），`-h` 人类可读。不加 `-s` 会列出每个子目录的大小，输出很长。

看看当前目录下哪些子目录最占空间：

```bash
du -sh * | sort -rh | head -10
```

> 这是查"磁盘为什么满了"的必备组合。`sort -rh` 按人类可读的数字大小倒序排列。

### tree — 树形结构

```bash
tree -L 2 /etc/nginx
```

> `-L 2` 限制显示深度为 2 层。不加的话目录太深会刷屏。部分最小化系统没装 tree，`yum install tree` 装上即可。

---

## 二、文件内容操作

### cat — 输出全部内容

```bash
cat /etc/hosts
```

> 文件太大会刷屏。小文件（几 KB）用 cat，大文件用 less。

合并多个文件：

```bash
cat file1.txt file2.txt > merged.txt
```

> 重定向 `>` 会覆盖目标文件，`>>` 追加到末尾。

### head / tail — 看头看尾

看前 20 行：

```bash
head -n 20 /var/log/messages
```

看最后 50 行：

```bash
tail -n 50 /var/log/nginx/access.log
```

**实时跟踪日志（最有用的 tail 用法）：**

```bash
tail -f /var/log/nginx/error.log
```

> `-f` 是 follow，文件有新内容写入时会自动显示。排查线上问题时开一个 `tail -f` 再复现 bug，日志实时出来，定位极快。按 `Ctrl+C` 退出。

跟踪多个文件：

```bash
tail -f /var/log/nginx/*.log
```

### less — 分页浏览

```bash
less /var/log/messages
```

> 比 `cat` 好一万倍的查看工具。操作：
> - `空格/f` 下一页，`b` 上一页
> - `g` 跳到开头，`G` 跳到末尾
> - `/关键词` 向下搜索，`?关键词` 向上搜索
> - `n` 下一个匹配，`N` 上一个匹配
> - `q` 退出
>
> 为什么不用 `more`？`less` 支持回滚（往回翻），`more` 只能往前走。

### grep — 文本搜索

最常用的命令之一。

在单个文件中搜索：

```bash
grep "ERROR" /var/log/app.log
```

递归搜索整个目录：

```bash
grep -rn "TODO" ./src/
```

> `-r` 递归，`-n` 显示行号。搜索结果直接告诉你哪个文件的第几行，点过去就改。

忽略大小写：

```bash
grep -rni "error" /var/log/
```

显示匹配行的上下文（前后各 3 行）：

```bash
grep -rnC 3 "Exception" ./app/
```

> `-C 3` = context 3 行。让你看到报错前在做什么、后发生了什么，而不只是一行孤零零的错误信息。

反向匹配（显示不包含关键词的行）：

```bash
grep -v "DEBUG" app.log
```

> `-v` 反向。过滤掉 DEBUG 日志只看重要的。

### wc — 统计

统计行数：

```bash
wc -l access.log
```

统计字数：

```bash
wc -w article.md
```

统计文件大小（字节数）：

```bash
wc -c file.bin
```

### sort & uniq — 排序去重

`sort` 排序，`uniq` 去重（只对相邻重复行有效，所以几乎总是先 sort 再 uniq）：

```bash
sort access.log | uniq
```

统计每行的出现次数：

```bash
sort access.log | uniq -c | sort -rn
```

> 这是分析日志的神器组合。管道流程：
> 1. `sort` 排序 → 相同的行排到一起
> 2. `uniq -c` 统计每行出现次数
> 3. `sort -rn` 按数量倒序排列
>
> 瞬间知道"谁访问最频繁""哪个错误最多"。

---

## 三、权限管理

### chmod — 改权限

权限分三段：属主(u) / 属组(g) / 其他人(o)。每段三个位：读(r=4) / 写(w=2) / 执行(x=1)。

用数字设权限：

```bash
chmod 755 script.sh
```

> `755 = rwxr-xr-x`。属主可读写执行，其他人可读执行。这是脚本和目录的标准权限。

```bash
chmod 644 config.ini
```

> `644 = rw-r--r--`。属主可读写，其他人只读。普通配置文件标准权限。

```bash
chmod 600 ~/.ssh/id_rsa
```

> `600 = rw-------`。只有属主能读写。**SSH 私钥必须是 600，权限不对 SSH 直接拒绝连接。**

用符号设权限（更直观）：

```bash
chmod +x script.sh
```

> 给所有用户加执行权限。相当于 `chmod a+x`。

```bash
chmod u+w file.txt
```

> 只给属主加写权限。`u=user`，`g=group`，`o=other`，`a=all`。

递归修改目录下所有文件：

```bash
chmod -R 755 /var/www/
```

### chown — 改属主

```bash
chown hadoop file.txt
```

改属主+属组：

```bash
chown hadoop:hadoop file.txt
```

递归修改：

```bash
chown -R nginx:nginx /var/www/html/
```

> 常见场景：网站文件用 root 放的，Nginx 以 nginx 用户运行读不了，报 403 Forbidden。`chown -R nginx:nginx` 解决。

---

## 四、进程管理

### ps — 查看进程

显示当前终端的所有进程：

```bash
ps aux
```

> `a`=所有用户的进程，`u`=用户格式（显示用户名和 CPU/内存），`x`=包括没有控制终端的进程。合起来 `ps aux` 是查看全部进程的标准写法。

找特定进程：

```bash
ps aux | grep nginx
```

> 管道给 `grep` 过滤。注意 `grep nginx` 这条命令自身也会出现在结果里（因为它的命令行里包含 nginx）。用 `grep [n]ginx` 这个技巧可以排除自身——正则表达式 `[n]` 只匹配 `n`，但不再匹配字面字符串 `[n]`。

### top / htop — 实时监控

```bash
top
```

> 按 `q` 退出，按 `1` 展开看每颗 CPU 核心，按 `M` 按内存排序，按 `P` 按 CPU 排序。`htop` 是增强版，颜色更好、支持鼠标点击，但需要单独安装。

### kill — 终止进程

优雅终止（给进程时间清理）：

```bash
kill 12345
```

> 发送 SIGTERM（信号 15），进程可以选择忽略或做清理后再退出。这是"请你自己关掉"。

强制杀（不商量）：

```bash
kill -9 12345
```

> 发送 SIGKILL（信号 9），**内核直接终止进程，进程没有机会做任何清理**。可能导致临时文件残留、socket 未关闭等问题。只有在 `kill` 普通信号没用时才用 -9。

按名称杀进程：

```bash
pkill -f "python app.py"
```

> `-f` 匹配完整命令行（而不仅是进程名）。不加 `-f` 只匹配进程名本身。

### 后台运行

前台运行的命令会占用终端，关了终端进程就没了。后台运行解决这个问题：

```bash
nohup python server.py &
```

> `&` 放后台运行，`nohup` 让它忽略 hangup 信号（关终端也不会被杀）。输出默认重定向到 `nohup.out`。

指定输出文件：

```bash
nohup python server.py > server.log 2>&1 &
```

> `> server.log` 把标准输出写到 log 文件，`2>&1` 把标准错误也重定向到同一个文件（`2` 是 stderr，`1` 是 stdout）。这样报错信息也能在日志里看到。

查看后台任务：

```bash
jobs
```

把后台任务调回前台：

```bash
fg %1
```

> `%1` 是 `jobs` 列出的任务编号。把前台任务放回后台：先 `Ctrl+Z` 挂起，再 `bg %1`。

---

## 五、网络

### 查看 IP

```bash
ip addr
```

> `ifconfig` 是老命令，新系统推荐 `ip addr`（属于 iproute2 工具集）。输出里找 `inet` 后面跟的 IP。

只看某个网卡：

```bash
ip addr show eth0
```

### ping — 测试连通性

```bash
ping -c 4 8.8.8.8
```

> `-c 4` 发 4 个包后自动停止。不加 `-c` 会一直 ping，按 `Ctrl+C` 才能停。Linux 的 ping 默认不设次数限制，跟 Windows 不一样。

### ss — 查看端口

（替代旧命令 netstat）

查看所有监听的 TCP 端口：

```bash
ss -tlnp
```

> `-t` TCP，`-l` 监听中，`-n` 不解析域名（快），`-p` 显示进程名。查"我的服务到底有没有启动"最常用的命令。

查看所有连接（含已建立的）：

```bash
ss -tnp
```

### curl — HTTP 客户端

查看响应头（不下载内容）：

```bash
curl -I https://example.com
```

GET 请求：

```bash
curl https://api.example.com/data
```

POST JSON 数据：

```bash
curl -X POST https://api.example.com/login -H "Content-Type: application/json" -d '{"user":"admin","pass":"123"}'
```

> `-X` 指定 HTTP 方法，`-H` 设置请求头，`-d` 发送数据。测试 API 时这套参数是标准模板。

下载文件并保存：

```bash
curl -o file.zip https://example.com/file.zip
```

> `-o` 指定保存的文件名。不指定会直接输出到屏幕。

静默模式（不显示进度条）：

```bash
curl -s https://example.com
```

> `-s` = silent。写脚本时必加，否则进度条会污染脚本输出。

### wget — 下载文件

```bash
wget https://example.com/file.tar.gz
```

> 跟 `curl -O` 的区别：wget 支持递归下载、断点续传（`-c`），更适合下载大文件和大批量资源。

### scp — 远程拷贝

本地 → 远程：

```bash
scp localfile.txt root@192.168.1.100:/root/
```

远程 → 本地：

```bash
scp root@192.168.1.100:/var/log/app.log ./
```

拷贝整个目录：

```bash
scp -r /local/dir/ root@192.168.1.100:/remote/dir/
```

> 路径后面的 `/` 很重要：`/remote/dir/` 表示放到 dir 目录里面，`/remote/dir` 表示拷贝为名为 dir 的文件/目录。

### rsync — 增量同步

比 scp 更快更智能——只传有变化的部分：

```bash
rsync -avz /source/dir/ root@host:/dest/dir/
```

> `-a` 归档模式（保留权限、时间），`-v` 显示详情，`-z` 传输时压缩。做备份和部署时的首选。配合 `--delete` 可以删除目标端多余的文件（实现完全同步）：

```bash
rsync -avz --delete /source/dir/ root@host:/dest/dir/
```

### nc — 端口连通测试

```bash
nc -zv 192.168.1.100 3306
```

> `-z` 只扫描不发送数据，`-v` 显示结果。成功输出 `succeeded`，失败输出 `refused` 或 `timeout`。排查"数据库连不上"时第一件事就是 `nc -zv` 测试端口。

---

## 六、systemd 服务管理

CentOS 7+ 和 Ubuntu 16.04+ 都用 systemd 管理服务。

### 查看服务状态

```bash
systemctl status nginx
```

> 输出包括：服务是否在跑、启动时间、最近 10 行日志、进程 PID。一眼看清服务当前状态。

### 启动 / 停止 / 重启

```bash
systemctl start nginx
```

```bash
systemctl stop nginx
```

```bash
systemctl restart nginx
```

> `restart` = stop + start。如果只想重新加载配置（不中断服务），用 `systemctl reload nginx`。Nginx 支持 reload，但很多程序不支持。

### 开机自启

```bash
systemctl enable nginx
```

> 创建符号链接到 `/etc/systemd/system/multi-user.target.wants/`，系统启动时自动拉起。

禁用自启：

```bash
systemctl disable nginx
```

### 查看日志

```bash
journalctl -u nginx -f
```

> `-u` 指定服务，`-f` 实时跟踪（类似 tail -f）。看最近的日志用 `journalctl -u nginx --since "10 minutes ago"`。

查看本次启动以来的所有日志：

```bash
journalctl -b
```

---

## 七、磁盘与内存

### df — 磁盘空间

```bash
df -h
```

> `-h` 人类可读。关注 `Use%` 列，接近 100% 就要清理了。`/dev/sda1` 这种是物理磁盘，`tmpfs` 是内存文件系统可以忽略。

只看某个分区：

```bash
df -h /var
```

### free — 内存使用

```bash
free -h
```

> `-h` 人类可读。关注 `available` 列而非 `free`——Linux 会把空闲内存用做缓存（buff/cache），`free` 看起来很低是正常的，**只要 `available` 还够就不用担心**。

持续监控（每秒刷新）：

```bash
free -h -s 1
```

### lsblk — 查看块设备

```bash
lsblk
```

> 列出所有磁盘和分区，包括挂载点。新服务器到手先跑 `lsblk` 看看有几块盘、分区情况。

---

## 八、压缩与解压

### tar — 打包

打包并 gzip 压缩（最常用）：

```bash
tar -czf archive.tar.gz /path/to/dir/
```

> 参数记忆法：`c`reate + `z`ip(gzip) + `f`ile。`f` 必须在最后，因为后面跟文件名。

解压：

```bash
tar -xzf archive.tar.gz
```

> `x`tract + `z`ip + `f`ile。指定解压目录加 `-C`：

```bash
tar -xzf archive.tar.gz -C /opt/module/
```

查看压缩包内容（不解压）：

```bash
tar -tzf archive.tar.gz
```

> `t`est/list。看看包里有什么，确认了再解压。

### unzip — 解压 zip

```bash
unzip file.zip -d /target/dir/
```

> `-d` 指定目标目录，不加就是当前目录。

---

## 九、实用快捷键与技巧

| 快捷键 | 效果 | 场景 |
|---|---|---|
| `Ctrl+R` | 反向搜索历史命令 | 忘了完整命令，打几个字母自动补全 |
| `Ctrl+C` | 终止前台进程 | 程序卡死或 tail -f 退出 |
| `Ctrl+Z` | 挂起进程到后台 | 临时暂停，后续用 `fg` 调回 |
| `Ctrl+D` | 发送 EOF / 退出终端 | 比打 `exit` 快 |
| `Ctrl+L` | 清屏 | 等价 `clear`，手不用离开键盘 |
| `Ctrl+A` | 跳到行首 | 快速改命令开头 |
| `Ctrl+E` | 跳到行尾 | 快速在命令末尾加参数 |
| `!!` | 重复上一条命令 | 忘了加 `sudo`？`sudo !!` 搞定 |
| `!$` | 上条命令的最后一个参数 | `mkdir /long/path` → `cd !$` 直接进去 |
| `!nginx` | 执行最近以 nginx 开头的命令 | `!sys` → 执行最近的 systemctl 命令 |

> `Ctrl+R` 王者用法：按一次 `Ctrl+R`，打关键字，再按 `Ctrl+R` 继续往前翻更旧的匹配。翻过头了按 `Ctrl+Shift+R`（部分终端）往回翻。

---

## 十、组合管道示例

**查最大的 10 个文件：**

```bash
find / -type f -exec du -h {} + 2>/dev/null | sort -rh | head -10
```

> 拆解：`find` 找所有文件 → `du -h` 算大小 → `sort -rh` 倒序 → `head -10` 取前 10。`2>/dev/null` 丢掉权限错误。

**统计 Nginx 日志访问 Top 10 IP：**

```bash
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -10
```

> 拆解：`awk` 提取第一列(IP) → `sort` 排序让相同 IP 相邻 → `uniq -c` 计数 → `sort -rn` 按数量倒序 → `head` 取前 10。

**批量终止 Python 进程：**

```bash
ps aux | grep python | awk '{print $2}' | xargs kill -9
```

> 拆解：列出所有进程 → 过滤 Python → 取 PID（第2列）→ 传给 kill。**先跑一遍不带 `| xargs kill -9` 的版本确认要杀的 PID 是对的**，再加后半段。

**查看端口占用并杀进程：**

```bash
ss -tlnp | grep :8080
```

> 先查出谁占了 8080，记下 PID。然后：

```bash
kill -9 <PID>
```

**快速备份并编辑：**

```bash
cp /etc/nginx/nginx.conf{,.bak}
vim /etc/nginx/nginx.conf
```

> `{,.bak}` 是 bash 的花括号展开——等价于 `cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak`。改配置前先备份，出问题一分钟回滚。
*/}),

  /* ---- 2: 大数据省赛全流程复盘 ---- */
  raw(function(){/*
# 大数据省赛全流程复盘

> 2026 年 3 月省赛真题。赛题分三大模块：数据平台搭建与运维、数据获取与清洗、业务分析与可视化。以下严格按赛题答案还原每一步。

<div class="timeline">
  <div class="timeline-item active"><div class="timeline-date">模块一</div><div class="timeline-content">Hadoop 完全分布式 + Zookeeper + Flume + Kafka + MySQL + Hive（7 个子任务）</div></div>
  <div class="timeline-item active"><div class="timeline-date">模块二</div><div class="timeline-content">Python 数据探索（6 项）+ 7 步清洗流水线 + 距离分类 / 时段热度标注</div></div>
  <div class="timeline-item active"><div class="timeline-date">模块三</div><div class="timeline-content">HDFS 操作 + MapReduce 统计 + 5 项数据分析 + 5 张 Matplotlib 图表</div></div>
</div>

---

## 模块一：数据平台搭建与运维

> [!IMPORTANT]
> 模块一占分最高、步骤最多，覆盖 Hadoop / Zookeeper / Flume / Kafka / MySQL / Hive 六大组件。以下严格按赛题顺序，**全部使用 root 或 hadoop 用户、绝对路径**。

### 子任务一：基础环境准备

三节点 master（10.30.30.31）、slave1（10.30.30.32）、slave2（10.30.30.33），全部用 root 完成。

#### 1.1 设置主机名

三台都要做，执行完 `bash` 刷新提示符：

```bash
hostnamectl set-hostname master
bash
```

```bash
hostnamectl set-hostname slave1
bash
```

```bash
hostnamectl set-hostname slave2
bash
```

> [!NOTE]
> 改完主机名后 `bash` 一下，让命令提示符立即刷新，否则截图里显示的仍是旧主机名。

#### 1.2 配置 hosts

三节点间要通过主机名互访，必须在 `/etc/hosts` 里做 IP 映射：

```bash
vim /etc/hosts
```

添加三行：

```text
10.30.30.31     master
10.30.30.32     slave1
10.30.30.33     slave2
```

下发到 slave1 和 slave2：

```bash
scp /etc/hosts root@slave1:/etc/
scp /etc/hosts root@slave2:/etc/
```

> [!TIP]
> 截图只截 `cat /etc/hosts` 的结果，整屏截会扣分。

#### 1.3 安装 JDK

三节点都要有 `/opt/module` 目录（没有就 `mkdir`），从 `/opt/software` 解压 JDK：

```bash
mkdir -p /opt/module
tar -zxf /opt/software/jdk-8u191-linux-x64.tar.gz -C /opt/module/
```

> [!WARNING]
> **千万不要加 `-v`**！`tar -zvxf` 会把解压日志刷满整个屏幕，截图没法看。

用 `scp -r` 分发到 slave1、slave2：

```bash
scp -r /opt/module/jdk1.8.0_191 root@slave1:/opt/module/
scp -r /opt/module/jdk1.8.0_191 root@slave2:/opt/module/
```

```bash
mkdir -p /opt/module
```

#### 1.4 配置环境变量

**不要直接改 `/etc/profile`**！新建独立文件 `/etc/profile.d/myenv.sh`：

```bash
vim /etc/profile.d/myenv.sh
```

```bash
export JAVA_HOME=/opt/module/jdk1.8.0_191
export PATH=$PATH:$JAVA_HOME/bin
```

> [!WARNING]
> `PATH=$PATH:$JAVA_HOME/bin` —— 前面的 `$PATH` 必须写，否则会覆盖系统路径，`ls`、`vim` 全废。如果不小心写错了，急救命令：`export PATH=/usr/bin:/usr/sbin`。

三台都要 source 并分发环境文件：

```bash
source /etc/profile
scp /etc/profile.d/myenv.sh root@slave1:/etc/profile.d/
scp /etc/profile.d/myenv.sh root@slave2:/etc/profile.d/
```

slave1 和 slave2 也要各自 `source /etc/profile`。

> [!TIP]
> 写环境变量路径不要手敲！`cd` 到目标目录后用 `pwd` 复制绝对路径，手写容易拼错。

#### 1.5 验证 JDK

```bash
java -version
```

期望输出类似 `java version "1.8.0_191"`。

#### 1.6 创建 hadoop 用户并加 sudoers

三台都要做：

```bash
useradd hadoop
passwd hadoop
```

master 上编辑 sudoers：

```bash
vim /etc/sudoers
```

```text
hadoop  ALL=(ALL)       NOPASSWD:ALL
```

```bash
grep 'hadoop' /etc/sudoers
scp /etc/sudoers root@slave1:/etc/
scp /etc/sudoers root@slave2:/etc/
```

> [!NOTE]
> 创建用户后必须分配管理员权限，否则后面 Hadoop 配置跑不起来。这一步扣分非常常见。

#### 1.7 关闭防火墙 & SELinux

```bash
systemctl disable firewalld
systemctl stop firewalld.service
```

三台都要做。防火墙还要关 SELinux——`setenforce 0` 只是临时（输出 Permissive），要永久关：

```bash
vim /etc/selinux/config
```

把 `SELINUX=enforcing` 改为 `SELINUX=disabled`。改完**重启生效**后 `getenforce` 输出 `Disabled`（与 `setenforce 0` 的 `Permissive` 不同）。

```bash
setenforce 0
getenforce
```

> [!DANGER]
> 注意区分：`setenforce 0` 只是临时放宽（输出 `Permissive`），改配置文件才是永久关闭（输出 `Disabled`）。赛题可能要求截 `getenforce` 结果。

#### 1.8 SSH 免密登录

**三台都要做！**且 root 和 hadoop 两个用户都要做一轮：

```bash
ssh-keygen -t rsa
ssh-copy-id master
ssh-copy-id slave1
ssh-copy-id slave2
```

切换到 hadoop 用户再重复一轮：

```bash
su - hadoop
ssh-keygen -t rsa
ssh-copy-id master
ssh-copy-id slave1
ssh-copy-id slave2
```

> [!WARNING]
> 很多人只做了 root 的免密，忘了 hadoop 用户。后续启动 Hadoop 会用 hadoop 用户，不通直接报错。

---

### 子任务二：Hadoop 完全分布式安装配置

#### 2.1 解压 Hadoop

```bash
tar -zxf /opt/software/hadoop-3.3.6.tar.gz -C /opt/module/
```

#### 2.2 重命名并改归属

```bash
cd /opt/module
mv hadoop-3.3.6 hadoop
chown -R hadoop:hadoop hadoop
```

#### 2.3 配置六个文件

切换到 hadoop 用户：

```bash
su - hadoop
cd /opt/module/hadoop/etc/hadoop/
```

**(1) hadoop-env.sh**

```bash
vim hadoop-env.sh
```

```bash
export JAVA_HOME=/opt/module/jdk1.8.0_191
export HDFS_NAMENODE_USER=hadoop
export HDFS_DATANODE_USER=hadoop
export HDFS_SECONDARYNAMENODE_USER=hadoop
export YARN_RESOURCEMANAGER_USER=hadoop
export YARN_NODEMANAGER_USER=hadoop
```

> [!NOTE]
> 不加 `export ..._USER=hadoop` 这几行，启动时会报 `Permission denied`。

**(2) core-site.xml**

```xml
<property>
  <name>fs.defaultFS</name>
  <value>hdfs://master:8020</value>
</property>
<property>
  <name>hadoop.tmp.dir</name>
  <value>/opt/module/hadoop</value>
</property>
<property>
  <name>hadoop.http.staticuser.user</name>
  <value>hadoop</value>
</property>
<property>
  <name>hadoop.proxyuser.hadoop.hosts</name>
  <value>*</value>
</property>
<property>
  <name>hadoop.proxyuser.hadoop.groups</name>
  <value>*</value>
</property>
```

**(3) hdfs-site.xml**

```xml
<property>
  <name>dfs.namenode.secondary.http-address</name>
  <value>master:50090</value>
</property>
```

**(4) mapred-site.xml**

```xml
<property>
  <name>mapreduce.framework.name</name>
  <value>yarn</value>
</property>
<property>
  <name>yarn.app.mapreduce.am.env</name>
  <value>HADOOP_MAPRED_HOME=${HADOOP_HOME}</value>
</property>
<property>
  <name>mapreduce.map.env</name>
  <value>HADOOP_MAPRED_HOME=${HADOOP_HOME}</value>
</property>
<property>
  <name>mapreduce.reduce.env</name>
  <value>HADOOP_MAPRED_HOME=${HADOOP_HOME}</value>
</property>
<property>
  <name>mapreduce.jobhistory.address</name>
  <value>master:10020</value>
</property>
<property>
  <name>mapreduce.jobhistory.webapp.address</name>
  <value>master:19888</value>
</property>
```

**(5) yarn-site.xml**

```xml
<property>
  <name>yarn.resourcemanager.hostname</name>
  <value>master</value>
</property>
<property>
  <name>yarn.nodemanager.aux-services</name>
  <value>mapreduce_shuffle</value>
</property>
<property>
  <name>yarn.nodemanager.pmem-check-enabled</name>
  <value>false</value>
</property>
<property>
  <name>yarn.nodemanager.vmem-check-enabled</name>
  <value>false</value>
</property>
<property>
  <name>yarn.log-aggregation-enable</name>
  <value>true</value>
</property>
<property>
  <name>yarn.log.server.url</name>
  <value>http://master:19888/jobhistory/logs</value>
</property>
<property>
  <name>yarn.log-aggregation.retain-seconds</name>
  <value>604800</value>
</property>
```

**(6) workers**

```bash
vim workers
```

```text
master
slave1
slave2
```

#### 2.4 分发配置

切回 root，用 `scp -r` 分发整个 hadoop 目录：

```bash
scp -r /opt/module/hadoop/ root@slave1:/opt/module/
scp -r /opt/module/hadoop/ root@slave2:/opt/module/
```

> [!WARNING]
> 注意路径！`$PWD` 会获取当前工作目录，如果提示符在 `~`（家目录），`$PWD` 拿到的是 `/root` 而不是 `/opt/module`。命令里建议直接写绝对路径。

slave1 / slave2 上重新 chown：

```bash
chown -R hadoop:hadoop /opt/module/hadoop
```

#### 2.5 Hadoop 环境变量

在 `/etc/profile.d/myenv.sh` 追加：

```bash
export HADOOP_HOME=/opt/module/hadoop
export PATH=$PATH:$HADOOP_HOME/bin:$HADOOP_HOME/sbin
```

分发并在所有节点 source。

#### 2.6 格式化 namenode

切换到 hadoop 用户：

```bash
su - hadoop
hdfs namenode -format
```

> [!NOTE]
> 格式化必须用 hadoop 用户。如果之前格式化过，重新格式化前要先删除 `/opt/module/hadoop/` 下的 `data` 和 `logs` 目录。

#### 2.7 启动集群

```bash
start-all.sh
mapred --daemon start historyserver
```

master 上 `jps` 应看到：

```text
NameNode
DataNode
SecondaryNameNode
ResourceManager
NodeManager
JobHistoryServer
```

slave1 上 `jps` 应看到 `DataNode` 和 `NodeManager`。

---

### 子任务三：Zookeeper 集群安装配置

#### 3.1 解压

```bash
tar -zxf /opt/software/apache-zookeeper-3.8.3-bin.tar.gz -C /opt/module/
cd /opt/module
mv apache-zookeeper-3.8.3-bin zookeeper-3.8.3
```

#### 3.2 环境变量

在 `myenv.sh` 追加：

```bash
export ZOOKEEPER_HOME=/opt/module/zookeeper-3.8.3
export PATH=$PATH:$ZOOKEEPER_HOME/bin
```

#### 3.3 配置 zoo.cfg

```bash
cd /opt/module/zookeeper-3.8.3/conf
cp zoo_sample.cfg zoo.cfg
vim zoo.cfg
```

```text
dataDir=/opt/module/zookeeper-3.8.3/data
server.1=master:2888:3888
server.2=slave1:2888:3888
server.3=slave2:2888:3888
```

#### 3.4 创建 myid

master = 1，slave1 = 2，slave2 = 3：

```bash
mkdir -p /opt/module/zookeeper-3.8.3/data
echo 1 > /opt/module/zookeeper-3.8.3/data/myid
```

分发到 slave1 / slave2 后分别改 myid 为 2 和 3。

#### 3.5 启动

三台都要：

```bash
zkServer.sh start
zkServer.sh status
```

`status` 应输出 `Mode: follower` 或 `Mode: leader`。

---

### 子任务四：Flume 安装配置

#### 4.1 解压并改名

```bash
tar -zxf /opt/software/apache-flume-1.11.0-bin.tar.gz -C /opt/module/
cd /opt/module
mv apache-flume-1.11.0-bin flume-1.11.0
chown -R hadoop:hadoop flume-1.11.0
```

#### 4.2 配置 flume-env.sh

用 hadoop 用户：

```bash
su - hadoop
cd /opt/module/flume-1.11.0/conf
cp flume-env.sh.template flume-env.sh
vim flume-env.sh
```

```bash
export JAVA_HOME=/opt/module/jdk1.8.0_191
export JAVA_OPTS="-Xms512m -Xmx1024m"
```

#### 4.3 环境变量

在 `myenv.sh` 追加：

```bash
export FLUME_HOME=/opt/module/flume-1.11.0
export PATH=$PATH:$FLUME_HOME/bin
```

验证：

```bash
source /etc/profile
flume-ng version
```

#### 4.4 创建 flume-conf.properties

用 hadoop 用户，监控 NameNode 日志 → HDFS：

```bash
vim /opt/module/flume-1.11.0/conf/flume-conf.properties
```

```text
a2.sources = r2
a2.sinks = k2
a2.channels = c2

a2.sources.r2.type = exec
a2.sources.r2.command = tail -F /opt/module/hadoop/logs/hadoop-hadoop-namenode-master.log
a2.sources.r2.shell = /bin/bash -c

a2.sinks.k2.type = hdfs
a2.sinks.k2.hdfs.path = hdfs://master:8020/tmp/flume/%Y%m%d/%H
a2.sinks.k2.hdfs.filePrefix = logs-
a2.sinks.k2.hdfs.fileSuffix = .log
a2.sinks.k2.hdfs.round = true
a2.sinks.k2.hdfs.roundValue = 1
a2.sinks.k2.hdfs.roundUnit = hour
a2.sinks.k2.hdfs.useLocalTimeStamp = true
a2.sinks.k2.hdfs.batchSize = 1000
a2.sinks.k2.hdfs.fileType = DataStream
a2.sinks.k2.hdfs.rollInterval = 600
a2.sinks.k2.hdfs.rollSize = 134217700
a2.sinks.k2.hdfs.rollCount = 0
a2.sinks.k2.hdfs.minBlockReplicas = 1

a2.channels.c2.type = memory
a2.channels.c2.capacity = 1000
a2.channels.c2.transactionCapacity = 1000

a2.sources.r2.channels = c2
a2.sinks.k2.channel = c2
```

#### 4.5 启动 Flume 并验证

先在 HDFS 创建目标目录：

```bash
hdfs dfs -mkdir -p /tmp/flume
```

启动 Flume：

```bash
cd /opt/module/flume-1.11.0
bin/flume-ng agent --name a2 --conf conf --conf-file conf/flume-conf.properties -Dflume.root.logger=INFO,console
```

另开终端写入测试数据触发采集：

```bash
echo "$(date) - Flume test entry" >> /opt/module/hadoop/logs/hadoop-hadoop-namenode-master.log
```

等几秒查看 HDFS 输出：

```bash
hdfs dfs -ls -R /tmp/flume/
# 找到 logs-*.log 文件后 cat 确认内容写入成功
```

---

### 子任务五：Kafka 安装配置

#### 5.1 解压

```bash
tar -zxf /opt/software/kafka_2.12-3.6.1.tgz -C /opt/module/
cd /opt/module
mv kafka_2.12-3.6.1 kafka
```

#### 5.2 环境变量

在 `myenv.sh` 追加：

```bash
export KAFKA_HOME=/opt/module/kafka
export PATH=$PATH:$KAFKA_HOME/bin
```

#### 5.3 配置 server.properties

master 上（node.id=1）：

```bash
vim /opt/module/kafka/config/server.properties
```

```text
node.id=1
controller.quorum.bootstrap.servers=master:9093,slave1:9093,slave2:9093
controller.quorum.voters=1@master:9093,2@slave1:9093,3@slave2:9093
listeners=PLAINTEXT://0.0.0.0:9092,CONTROLLER://0.0.0.0:9093
advertised.listeners=PLAINTEXT://master:9092,CONTROLLER://master:9093
log.dirs=/tmp/kraft-combined-logs
num.partitions=3
default.replication.factor=3
min.insync.replicas=2
```

分发后 slave1 改 `node.id=2` 和 `advertised.listeners`，slave2 对应改 `node.id=3`。

#### 5.4 格式化并启动

master 上生成唯一 ID：

```bash
kafka-storage.sh random-uuid
```

拿到 UUID 后三台各自格式化：

```bash
kafka-storage.sh format -t <UUID> -c /opt/module/kafka/config/server.properties
```

启动：

```bash
kafka-server-start.sh -daemon /opt/module/kafka/config/server.properties
```

#### 5.5 创建 Topic

```bash
kafka-topics.sh --bootstrap-server master:9092 --create --partitions 2 --replication-factor 2 --topic installtopic
```

验证：

```bash
kafka-topics.sh --bootstrap-server master:9092 --describe --topic installtopic
```

---

### 子任务六：MySQL 安装配置（rpm）

#### 6.1 解压

```bash
mkdir -p /opt/module
tar -xf /opt/software/mysql-5.7.44-1.el7.x86_64.rpm-bundle.tar -C /opt/module/
```

#### 6.2 rpm 安装

先卸载系统自带的 mariadb：

```bash
yum remove mariadb* -y
```

按顺序安装五个 rpm：

```bash
cd /opt/module
rpm -ivh mysql-community-common-5.7.44-1.el7.x86_64.rpm
rpm -ivh mysql-community-libs-5.7.44-1.el7.x86_64.rpm
rpm -ivh mysql-community-libs-compat-5.7.44-1.el7.x86_64.rpm
rpm -ivh mysql-community-client-5.7.44-1.el7.x86_64.rpm
rpm -ivh mysql-community-server-5.7.44-1.el7.x86_64.rpm
```

#### 6.3 启动 & 改密码

```bash
systemctl start mysqld
systemctl enable mysqld
grep 'temporary password' /var/log/mysqld.log
```

拿到临时密码后登入 MySQL：

```sql
set global validate_password_policy=0;
set global validate_password_length=1;
ALTER USER 'root'@'localhost' IDENTIFIED BY '123456';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '123456' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

---

### 子任务七：Hive 安装配置

#### 7.1 解压

```bash
tar -zxf /opt/software/apache-hive-3.1.3-bin.tar.gz -C /opt/module/
cd /opt/module
mv apache-hive-3.1.3-bin hive-3.1.3
chown -R hadoop:hadoop hive-3.1.3
```

#### 7.2 替换 Guava（版本冲突修复）

```bash
mv /opt/module/hive-3.1.3/lib/guava-*.jar /opt/module/hive-3.1.3/lib/guava-old.jar.bak
cp /opt/module/hadoop/share/hadoop/common/lib/guava-*.jar /opt/module/hive-3.1.3/lib/
```

> [!TIP]
> Hive 自带的 Guava 和 Hadoop 的 Guava 版本不一致会报 `NoSuchMethodError`。直接拿 Hadoop 的替换掉 Hive 的即可。

#### 7.3 环境变量 & hive-env.sh

在 `myenv.sh` 追加：

```bash
export HIVE_HOME=/opt/module/hive-3.1.3
export PATH=$PATH:$HIVE_HOME/bin
```

hive-env.sh：

```bash
cd /opt/module/hive-3.1.3/conf
cp hive-env.sh.template hive-env.sh
vim hive-env.sh
```

```bash
export HADOOP_HOME=/opt/module/hadoop
export HIVE_CONF_DIR=/opt/module/hive-3.1.3/conf
export HIVE_AUX_JARS_PATH=/opt/module/hive-3.1.3/lib
```

#### 7.4 hive-site.xml

```xml
<property>
  <name>javax.jdo.option.ConnectionURL</name>
  <value>jdbc:mysql://master:3306/hive?createDatabaseIfNotExist=true</value>
</property>
<property>
  <name>javax.jdo.option.ConnectionDriverName</name>
  <value>com.mysql.jdbc.Driver</value>
</property>
<property>
  <name>javax.jdo.option.ConnectionUserName</name>
  <value>root</value>
</property>
<property>
  <name>javax.jdo.option.ConnectionPassword</name>
  <value>123456</value>
</property>
<property>
  <name>hive.server2.thrift.port</name>
  <value>10000</value>
</property>
<property>
  <name>hive.server2.thrift.bind.host</name>
  <value>master</value>
</property>
<property>
  <name>hive.server2.authentication</name>
  <value>NONE</value>
</property>
<property>
  <name>hive.metastore.uris</name>
  <value>thrift://master:9083</value>
</property>
```

#### 7.5 拷贝 JDBC 驱动

```bash
cp /opt/software/mysql-connector-java-5.1.32.jar /opt/module/hive-3.1.3/lib/
```

#### 7.6 初始化元数据库

```bash
bin/schematool -initSchema -dbType mysql -verbose
```

初始化完在 MySQL 中验证元数据表：

```sql
SELECT COUNT(*) FROM information_schema.tables
WHERE table_schema = DATABASE() AND table_type = 'BASE TABLE';
```

> [!NOTE]
> 初始化前确保 Hadoop 已启动、MySQL 已运行且能远程连接。

#### 7.7 启动 Hive 服务

```bash
nohup bin/hive --service metastore > /tmp/metastore.log 2>&1 &
nohup bin/hive --service hiveserver2 > /tmp/hiveserver2.log 2>&1 &
```

beeline 连接验证：

```bash
bin/beeline -u jdbc:hive2://master:10000 -n hadoop
```

---

## 模块二：数据获取与清洗

数据集 `bike_rides.csv`，字段：骑行ID、单车编号、用户ID、开始/结束时间、起始/结束位置、骑行距离(km)、骑行时长(分钟)、天气状况、温度、周末标记。

### 任务一：数据探索（6 项）

#### 1.1 行列数 & 数据类型

```python
import pandas as pd
df = pd.read_csv('bike_rides.csv')
print(f"行数: {df.shape[0]}, 列数: {df.shape[1]}")
print(df.dtypes)
```

#### 1.2 前 10 行

```python
print(df.head(10).to_string())
```

#### 1.3 缺失值统计

```python
missing_count = df.isnull().sum()
print(missing_count)
print(f"总缺失值数量: {df.isnull().sum().sum()}")
```

#### 1.4 基本统计量（骑行距离 & 骑行时长）

```python
stats = df[['骑行距离(km)', '骑行时长(分钟)']].describe().loc[['min', 'max', 'mean', '50%']]
stats = stats.round(2)
stats.index = ['最小值', '最大值', '平均值', '中位数']
print(stats)
```

#### 1.5 不同单车数量

```python
print(f"不同单车数量: {df['单车编号'].nunique()}")
```

---

### 任务二：7 步数据清洗

每步**都基于前一步的输出结果**，每步保存为 `cleaned_data_cN_{删除数}.csv`。

#### C1：删除骑行距离为空或为 0 的记录

```python
o_count = len(df)
df = df.dropna(subset=['骑行距离(km)'])
df = df[df['骑行距离(km)'] > 0]
deleted = o_count - len(df)
df.to_csv(f'cleaned_data_c1_{deleted}.csv', index=False, encoding='utf-8-sig')
```

#### C2：天气状况缺失值用众数填充

```python
m_count = df['天气状况'].isnull().sum()
df['天气状况'] = df['天气状况'].fillna(df['天气状况'].mode()[0])
df.to_csv(f'cleaned_data_c2_{m_count}.csv', index=False, encoding='utf-8-sig')
```

#### C3：删除异常骑行时长（< 1 分钟或 > 1440 分钟）

```python
o_count = len(df)
df = df[df['骑行时长(分钟)'].notna() & (df['骑行时长(分钟)'] >= 1) & (df['骑行时长(分钟)'] <= 1440)]
deleted = o_count - len(df)
df.to_csv(f'cleaned_data_c3_{deleted}.csv', index=False, encoding='utf-8-sig')
```

#### C4：删除异常骑行距离（<= 0 或 > 50 km）

```python
o_count = len(df)
df = df[df['骑行距离(km)'].notna() & (df['骑行距离(km)'] > 0) & (df['骑行距离(km)'] <= 50)]
deleted = o_count - len(df)
df.to_csv(f'cleaned_data_c4_{deleted}.csv', index=False, encoding='utf-8-sig')
```

#### C5：删除结束时间早于开始时间的记录

```python
o_count = len(df)
df['开始时间'] = pd.to_datetime(df['开始时间'])
df['结束时间'] = pd.to_datetime(df['结束时间'])
df = df[df['结束时间'] >= df['开始时间']].copy()
deleted = o_count - len(df)
df.to_csv(f'cleaned_data_c5_{deleted}.csv', index=False, encoding='utf-8-sig')
```

> [!WARNING]
> 时间比较前必须先 `pd.to_datetime()`，否则字符串比大小会出错。

#### C6：删除完全重复的行

```python
o_count = len(df)
df = df.drop_duplicates()
deleted = o_count - len(df)
df.to_csv(f'cleaned_data_c6_{deleted}.csv', index=False, encoding='utf-8-sig')
```

#### C7：删除起始位置=结束位置且时长 > 5 分钟的异常记录

```python
abnormal = df[(df['起始位置'] == df['结束位置']) & (df['骑行时长(分钟)'] > 5)]
df = df[~((df['起始位置'] == df['结束位置']) & (df['骑行时长(分钟)'] > 5))]
df.to_csv(f'cleaned_data_c7_{len(abnormal)}.csv', index=False, encoding='utf-8')
```

---

### 数据标注（两列）

#### 距离分类：短途 / 中途 / 长途

```python
df = pd.read_csv('final_cleaned_data.csv')

def classify(d):
    if d < 2:      return '短途'
    elif d <= 5:   return '中途'
    return '长途'

df['距离分类'] = df['骑行距离(km)'].apply(classify)
df.to_csv('ride_distance_mark.csv', index=False)
for cat in ['短途', '中途', '长途']:
    print(f"{cat}: {df['距离分类'].value_counts().get(cat, 0)} 条")
```

#### 时段热度：高峰 / 平峰 / 低峰

```python
df['开始时间'] = pd.to_datetime(df['开始时间'])

def classify_time(row):
    h = row['开始时间'].hour
    if row['周末标记'] == 1:
        return '低峰时段'
    if (7 <= h < 9) or (17 <= h < 19):
        return '高峰时段'
    elif (9 <= h < 17) or (19 <= h < 22):
        return '平峰时段'
    return '低峰时段'

df['时段热度'] = df.apply(classify_time, axis=1)
df.to_csv('time_period_mark.csv', index=False)
```

---

## 模块三：业务分析与可视化

### 任务一：HDFS 文件操作

```bash
hdfs dfs -mkdir -p /bike_data/records /bike_data/statistics
hdfs dfs -chmod -R 777 /bike_data
hdfs dfs -put /tmp/bike_rides.csv /bike_data/records
hdfs dfs -cat /bike_data/records/bike_rides.csv | head -10
hdfs dfs -get /bike_data/records/*  /tmp/bike_analysis
```

### 任务二：MapReduce 统计分析

```bash
hdfs dfs -mkdir -p /user/hadoop/input
hdfs dfs -put /var/log/dmesg /user/hadoop/input
hadoop jar /opt/module/hadoop/share/hadoop/mapreduce/hadoop-mapreduce-examples-3.3.6.jar wordcount /user/hadoop/input/dmesg /user/hadoop/output
hdfs dfs -cat /user/hadoop/output/part-r-* | sort -k2 -nr | head -10
hadoop jar ... wordcount -D mapreduce.job.reduces=2 /user/hadoop/input/dmesg /user/hadoop/output2
hadoop jar ... pi 16 10000
hdfs dfs -mkdir -p /user/hadoop/grep_input
hdfs dfs -put -f /var/log/dmesg /user/hadoop/grep_input/
hadoop jar ... grep /user/hadoop/grep_input /user/hadoop/grep_output "system.*"
hdfs dfs -mkdir -p /user/hadoop/wordmean_input
hdfs dfs -put /var/log/dmesg /user/hadoop/wordmean_input/
hadoop jar ... wordmean /user/hadoop/wordmean_input /user/hadoop/wordmean_output
hadoop jar ... teragen 100000 /user/hadoop/terasort-input
hadoop jar ... terasort /user/hadoop/terasort-input /user/hadoop/terasort-output
hadoop jar ... teravalidate /user/hadoop/terasort-output /user/hadoop/teravalidate-output
```

---

### 任务三：5 项数据分析

基于 `final_cleaned_data.csv`。

#### 3.1 每小时平均骑行量 Top 3

```python
df['开始时间'] = pd.to_datetime(df['开始时间'])
df['小时'] = df['开始时间'].dt.hour
df['日期'] = df['开始时间'].dt.date

hourly_total = df.groupby('小时')['骑行ID'].count()
hourly_days = df.groupby('小时')['日期'].nunique()
hourly_avg = (hourly_total / hourly_days).round(2)

for hour, avg in hourly_avg.sort_values(ascending=False).head(3).items():
    print(f"{hour}:00 -> 平均 {avg} 次骑行")
```

#### 3.2 不同天气下的平均骑行时长 & 距离

```python
weather_stats = df.groupby('天气状况').agg(
    平均骑行时长=('骑行时长(分钟)', 'mean'),
    平均骑行距离=('骑行距离(km)', 'mean')
).round(2)
print(weather_stats)
```

#### 3.3 工作日 vs 周末骑行模式

```python
comparison = df.groupby('周末标记').agg(
    骑行次数=('骑行ID', 'count'),
    平均骑行时长=('骑行时长(分钟)', 'mean'),
    平均骑行距离=('骑行距离(km)', 'mean')
).round(2)
comparison.index = ['工作日', '周末']
print(comparison)
```

#### 3.4 最热门上车 / 下车区域 Top 5

```python
print(df['起始位置'].value_counts().head(5))
print(df['结束位置'].value_counts().head(5))
```

#### 3.5 温度区间对骑行量的影响

```python
df['日期'] = df['开始时间'].dt.date
temp_bins = [-float('inf'), 0, 10, 20, 30, float('inf')]
temp_labels = ['0℃以下', '0-10℃', '10-20℃', '20-30℃', '30℃以上']
df['温度区间'] = pd.cut(df['温度'], bins=temp_bins, labels=temp_labels)

daily = df.groupby(['日期', '温度区间']).size().reset_index(name='每日骑行量')
avg_daily = daily.groupby('温度区间')['每日骑行量'].mean().round(2)
print(avg_daily.reindex(temp_labels))
```

---

### 任务四：5 张 Matplotlib 可视化图表

**中文字体配置（每个文件开头必写）：**

```python
import matplotlib
matplotlib.rcParams['font.sans-serif'] = ['SimHei', 'Microsoft YaHei']
matplotlib.rcParams['axes.unicode_minus'] = False
```

#### 4.1 柱状图：Top 5 区域骑行量

```python
import matplotlib.pyplot as plt

top5 = df['起始位置'].value_counts().head(5)
fig, ax = plt.subplots(figsize=(12, 6))
bars = ax.bar(range(len(top5)), top5.values, color=['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7'], edgecolor='black', linewidth=1.2)
ax.set_xticks(range(len(top5)))
ax.set_xticklabels(top5.index, rotation=15, ha='right')
ax.set_title('主要区域骑行量统计', fontsize=16, fontweight='bold')
ax.set_ylabel('骑行量')
for bar, count in zip(bars, top5.values):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5, str(count), ha='center', fontweight='bold')
plt.tight_layout(); plt.show()
```

#### 4.2 折线图：连续 7 天每日骑行量

```python
df['日期'] = df['开始时间'].dt.date
dates = sorted(df['日期'].unique())[:7]
workday, weekend, labels = [], [], []
for d in dates:
    workday.append(df[(df['日期']==d)&(df['周末标记']==0)]['骑行距离(km)'].sum())
    weekend.append(df[(df['日期']==d)&(df['周末标记']==1)]['骑行距离(km)'].sum())
    labels.append(d.strftime('%m/%d'))

fig, ax = plt.subplots(figsize=(12, 6))
ax.plot(range(7), workday, 'b-o', label='工作日', linewidth=2, markersize=8)
ax.plot(range(7), weekend, 'r-s', label='周末', linewidth=2, markersize=8)
ax.set_xticks(range(7)); ax.set_xticklabels(labels)
ax.set_title('连续7天每日骑行总量变化', fontsize=16, fontweight='bold')
ax.legend(); ax.grid(True, alpha=0.3)
plt.tight_layout(); plt.show()
```

#### 4.3 水平条形图：四时段平均骑行时长

```python
def period(h):
    if 7<=h<9: return '早高峰'
    elif 9<=h<17: return '日间'
    elif 17<=h<19: return '晚高峰'
    return '夜间'
df['时段'] = df['开始时间'].dt.hour.apply(period)
period_avg = df.groupby('时段')['骑行时长(分钟)'].mean().sort_values()

fig, ax = plt.subplots(figsize=(10, 6))
bars = ax.barh(range(len(period_avg)), period_avg.values, color=['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4'], height=0.6)
ax.set_yticks(range(len(period_avg))); ax.set_yticklabels(period_avg.index)
for bar, v in zip(bars, period_avg.values):
    ax.text(bar.get_width()+0.5, bar.get_y()+bar.get_height()/2, f'{v:.1f}分钟', va='center')
plt.tight_layout(); plt.show()
```

#### 4.4 散点图：骑行距离 vs 骑行时长

```python
fig, ax = plt.subplots(figsize=(12, 8))
ax.scatter(df['骑行距离(km)'], df['骑行时长(分钟)'], color='blue', alpha=0.6, s=10, edgecolors='white', linewidth=0.5)
ax.set_title('骑行距离与时长关系', fontsize=16, fontweight='bold')
ax.set_xlabel('骑行距离 (km)'); ax.set_ylabel('骑行时长 (分钟)')
ax.grid(True, alpha=0.3)
plt.tight_layout(); plt.show()
```

#### 4.5 饼图：天气状况比例

```python
weather = df['天气状况'].value_counts()
fig, ax = plt.subplots(figsize=(12, 8))
wedges, texts, autotexts = ax.pie(weather.values, labels=weather.index, autopct='%1.1f%%', startangle=90)
for at in autotexts: at.set_color('white'); at.set_fontweight('bold')
ax.set_title('不同天气状况下的骑行量比例', fontsize=16, fontweight='bold')
ax.axis('equal')
plt.tight_layout(); plt.show()
```

---

## 踩坑备忘

| 分类 | 坑点 |
|---|---|
| **环境** | `hostnamectl` 完要 `bash` 刷提示符；环境变量放 `/etc/profile.d/myenv.sh` 不要直接改 `/etc/profile`；路径用 `pwd` 复制不要手写 |
| **环境** | `PATH=$PATH:...` 前面的 `$PATH` 忘写会导致 `ls`/`vim` 全丢；急救 `export PATH=/usr/bin:/usr/sbin` |
| **环境** | SSH 免密 root 和 hadoop 两个用户都要做三台；`scp $PWD` 注意当前目录 |
| **Hadoop** | `hadoop-env.sh` 必须加 `export ..._USER=hadoop` 那五行；5 个 xml 别忘了 yarn 的内存检查关闭和日志聚合 |
| **SELinux** | `setenforce 0`（临时 Permissive）≠ 改 `config` 文件（永久 Disabled） |
| **Python** | 每清洗步备份原始行数再算删除量；时间列用 `pd.to_datetime()` 转换后再比较 |
| **Python** | `encoding='utf-8-sig'` 解决 CSV 中文乱码；Matplotlib 中文字体配置必须放文件最前面 |
| **截图** | 只截关键内容；`tar -zxf` 不要 `-v`；`jps` 截完确认所有进程都在 |

  */})
,
  /* ---- 3: Python 入门 ---- */
  raw(function(){/*
# Python 入门教程

Python 由 Guido van Rossum 于 1991 年发布，设计哲学是"优雅、明确、简单"。2024 年起它长期霸榜 TIOBE，是数据科学、人工智能、自动化运维、Web 后端的首选语言之一。

## 为什么学 Python

- **语法接近自然语言**：用缩进表示代码块，读起来像伪代码
- **生态庞大**：PyPI 上有 50 万+ 第三方库，几乎想要的都有
- **跨平台**：Windows / Linux / macOS 一套代码通吃
- **胶水语言**：能轻松调用 C / C++ / Fortran 写的高性能模块

> [!TIP]
> 新手最大误区：Python 2 已在 2020 年停止维护。请务必安装 **Python 3.10 及以上**版本。

## 环境搭建

### 安装解释器

Windows 去 python.org 下载安装包，安装时**务必勾选 Add Python to PATH**。macOS 用 `brew install python`，Linux 用系统包管理器。

验证：

```bash
python --version
pip --version
```

### 虚拟环境（强烈建议）

每个项目用独立环境，避免不同项目的库版本互相冲突：

```bash
python -m venv venv
# Windows 激活
venv\Scripts\activate
# macOS / Linux 激活
source venv/bin/activate
# 退出环境
deactivate
```

### 第一个程序

新建 `hello.py`：

```python
print("Hello, World!")
```

运行：

```bash
python hello.py
```

> [!NOTE]
> 也可以用交互式解释器（REPL）：终端输入 `python` 回车，直接敲代码即时看到结果，非常适合做小实验。退出按 `Ctrl+Z`(Win) / `Ctrl+D`(Mac)。

## 基础语法

### 注释

```python
# 这是单行注释

# 没有真正的多行注释语法，用多个 # 或三引号字符串代替
"""
这是一段
跨行的说明文字
"""
```

### 变量与类型

Python 是**动态类型**语言，变量不需要声明类型，第一次赋值就确定了：

```python
name = "Trusler"      # 字符串 str
age = 20              # 整数 int
height = 1.75         # 浮点数 float
is_student = True     # 布尔 bool
nothing = None        # 空值，相当于其他语言的 null

print(type(age))      # <class 'int'>
```

> [!WARNING]
> Python 里变量只是"贴在对象上的名字"。`a = b` 之后如果修改 `b` 指向的**可变对象**（如列表），`a` 看到的内容也会变，因为它们指向同一个对象。

### 运算符

| 类型 | 符号 | 示例 |
|---|---|---|
| 算术 | `+ - * / // % **` | `7 // 2 = 3`（整除），`2 ** 3 = 8`（幂） |
| 比较 | `== != > < >= <=` | 返回 bool |
| 逻辑 | `and or not` | `True and False` |
| 成员 | `in` | `"a" in "abc"` 为 True |
| 身份 | `is` | 判断是不是同一个对象（慎用 ==） |

### 字符串

```python
s = "hello"
print(s.upper())               # HELLO
print(s.capitalize())          # Hello
print(len(s))                  # 5
print(s[0], s[-1])             # h o（负索引从末尾往前）
print("a" + "b")               # ab（拼接）
print("-".join(["a", "b"]))    # a-b

# f-string 是最推荐的格式化方式
name = "Trusler"
print(f"你好，{name}，明年 {age + 1} 岁")
```

> [!TIP]
> 字符串本身不可变。想修改要先转成列表或重新赋值。格式化优先用 f-string，比老式的 `%` 和 `.format()` 清晰得多。

## 数据结构

### 列表 list（可变、有序）

```python
lst = [1, 2, 3]
lst.append(4)                  # [1, 2, 3, 4]
lst.insert(0, 0)               # [0, 1, 2, 3, 4]
lst.remove(2)                  # 删除第一个值为 2 的元素
print(lst[1:3])                # 切片，得到 [1, 2]
print(lst[-1])                 # 取最后一个
for i, v in enumerate(lst):
    print(i, v)                # 带索引遍历
```

### 元组 tuple（不可变、有序）

```python
t = (1, "a", True)
# t[0] = 2  # 报错，元组不能修改
# 常用于让函数一次返回多个值
def minmax(nums):
    return min(nums), max(nums)
lo, hi = minmax([3, 1, 4])
```

### 字典 dict（键值对）

```python
d = {"name": "Trusler", "age": 20}
print(d["name"])               # Trusler
d["age"] = 21                  # 修改已有键
d["city"] = "BJ"               # 新增键值对
for k, v in d.items():
    print(k, v)
```

### 集合 set（自动去重、无序）

```python
s = {1, 2, 2, 3}               # {1, 2, 3} 自动去重
s.add(4)
print(s & {2, 4})              # 交集 {2, 4}
```

## 控制流

```python
score = 85
if score >= 90:
    print("A")
elif score >= 60:
    print("及格")
else:
    print("挂科")

for i in range(5):             # 0 1 2 3 4
    print(i)

n = 3
while n > 0:
    print(n)
    n -= 1

# 列表推导式：Python 的特色语法
squares = [x * x for x in range(10) if x % 2 == 0]
```

> [!TIP]
> 能用列表推导式就别写啰嗦的 for 循环，但**不要嵌套超过两层**，否则可读性反而下降。

## 函数

```python
def greet(name, msg="你好"):           # msg 是默认参数
    return f"{msg}，{name}"

print(greet("Trusler"))
print(greet("Tom", "Hi"))

def total(*nums):                      # *nums 收集为元组
    return sum(nums)

def show(**kw):                        # **kw 收集为字典
    for k, v in kw.items():
        print(k, v)

double = lambda x: x * 2               # lambda 匿名函数
print(double(5))

counter = 0
def inc():
    global counter                     # 改全局变量要先声明
    counter += 1
```

## 异常处理

```python
try:
    x = int(input("输入数字："))
    print(10 / x)
except ValueError:
    print("不是合法数字")
except ZeroDivisionError:
    print("不能除以 0")
else:
    print("正常完成，没有异常")
finally:
    print("无论有没有异常都会执行")

if age < 0:
    raise ValueError("年龄不能为负")    # 主动抛异常
```

## 文件操作

```python
# 写文件
with open("note.txt", "w", encoding="utf-8") as f:
    f.write("你好\n世界")

# 按行读
with open("note.txt", "r", encoding="utf-8") as f:
    for line in f:
        print(line.strip())

# 一次性读全部
content = open("note.txt", encoding="utf-8").read()
```

> [!WARNING]
> 永远用 `with open(...)` 上下文管理器。它会在代码块结束时**自动关闭文件**，忘记 `close()` 可能导致数据没真正写进磁盘。

## 常用标准库

| 库 | 用途 | 例子 |
|---|---|---|
| `os` / `pathlib` | 文件路径、目录操作 | `os.listdir(".")` |
| `sys` | 命令行参数 | `sys.argv` |
| `datetime` | 日期时间 | `datetime.now()` |
| `json` | JSON 读写 | `json.dumps(obj)` |
| `random` | 随机数 | `random.randint(1, 6)` |
| `math` | 数学函数 | `math.sqrt(16)` |
| `collections` | 高级容器 | `Counter`, `defaultdict` |

## 实战项目：学生成绩管理系统

做一个命令行小系统，支持录入学生、查看排行榜、把数据保存到文件。

### 需求拆解

1. 用列表存学生字典 `{"name": 名字, "scores": [成绩列表]}`
2. 录入：输入姓名和若干门成绩
3. 统计：算平均分、最高分
4. 排序：按平均分从高到低
5. 持久化：用 json 存到 `students.json`

### 参考答案

```python
import json

FILE = "students.json"

def load():
    try:
        with open(FILE, encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def save(students):
    with open(FILE, "w", encoding="utf-8") as f:
        json.dump(students, f, ensure_ascii=False, indent=2)

def add(students):
    name = input("姓名：")
    n = int(input("几门课："))
    scores = [float(input(f"第{i + 1}门：")) for i in range(n)]
    students.append({"name": name, "scores": scores})
    print(f"已录入 {name}")

def avg(s):
    return sum(s["scores"]) / len(s["scores"])

def show(students):
    if not students:
        print("暂无数据")
        return
    ranked = sorted(students, key=avg, reverse=True)
    for s in ranked:
        print(f"{s['name']:8} 平均 {avg(s):.1f} 最高 {max(s['scores'])}")

def main():
    students = load()
    while True:
        print("\n1 录入  2 查看  3 退出")
        c = input("选择：")
        if c == "1":
            add(students)
            save(students)
        elif c == "2":
            show(students)
        elif c == "3":
            break

if __name__ == "__main__":
    main()
```

> [!NOTE]
> `if __name__ == "__main__":` 保证只有直接运行脚本时才执行 `main()`，被别的文件 import 时不会自动跑。这是 Python 项目的标准写法。

## 课后练习

1. 给系统加"按姓名删除学生"功能
2. 把平均分直接存进每个学生字典，避免每次都重新计算
3. 用 `csv` 模块把成绩导出成表格文件
*/}),

  /* ---- 4: Java 入门 ---- */
  raw(function(){/*
# Java 入门教程

Java 由 Sun 公司（后并入 Oracle）在 1995 年发布，核心理念是"一次编写，到处运行"（WORA）。它运行在 JVM 虚拟机上，是企业级后端、Android、大数据生态的绝对主力。

## 为什么学 Java

- **强类型 + 编译型**：编译阶段就帮你抓出大量错误
- **JVM 跨平台**：编译成字节码，任何装了 JVM 的系统都能跑
- **生态成熟**：Spring、Hadoop、Flink 都是 Java 系
- **就业面广**：银行、电商、大厂后端大量招聘 Java 工程师

> [!TIP]
> 2026 年主流用 **Java 17（LTS）** 或 **Java 21（LTS）**。装 JDK 时认准 LTS 长期支持版，别追最新的非 LTS 版本。

## 环境搭建

### 安装 JDK

去 Oracle 或 Adoptium 下载 JDK 17+，配置好 `JAVA_HOME` 并把它加进 PATH。

```bash
java -version
javac -version
```

### 第一个程序

Java 强制**类名与文件名一致**，而且程序从 `main` 方法启动：

```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

编译并运行：

```bash
javac Hello.java     # 生成 Hello.class 字节码
java Hello           # 由 JVM 运行
```

> [!WARNING]
> 文件名必须是 `Hello.java`，类名必须是 `Hello`，否则 `javac` 直接报错。这是 Java 新手遇到的第一个坑。

## 基础语法

### 变量与类型

Java 是**静态强类型**语言，变量必须声明类型：

```java
int age = 20;                 // 整数
double price = 9.9;          // 双精度浮点
boolean flag = true;         // 布尔
char c = 'A';                // 单个字符
String name = "Trusler";     // 字符串，注意 S 大写
long big = 1000000000L;      // long 类型要加 L
```

| 类型 | 位数 | 范围 |
|---|---|---|
| `int` | 32 | 约 -21 亿到 21 亿 |
| `long` | 64 | 更大 |
| `double` | 64 | 小数 |
| `float` | 32 | 小数（字面量加 F） |

> [!NOTE]
> `String` 是对象，不是基本类型。Java 有 8 个基本类型：byte short int long float double boolean char。

### 运算符

```java
int a = 10, b = 3;
System.out.println(a / b);        // 3（整数除法会截断小数）
System.out.println(a % b);        // 1（取余）
System.out.println(a == b);       // false
boolean t = a > 5 && b < 10;      // 逻辑与
```

### 字符串

```java
String s = "hello";
System.out.println(s.length());           // 5
System.out.println(s.toUpperCase());      // HELLO
System.out.println(s.equals("hello"));    // true（比较内容用 equals）
System.out.println(s.substring(1, 3));    // el
System.out.println("a" + 1 + 2);          // a12（字符串拼接）
```

> [!WARNING]
> 字符串比较**必须用 `.equals()`**。用 `==` 比的是内存地址，绝大多数情况下会得到 false。这是第二大坑。

## 控制流

```java
int score = 85;
if (score >= 90) {
    System.out.println("A");
} else if (score >= 60) {
    System.out.println("及格");
} else {
    System.out.println("挂科");
}

for (int i = 0; i < 5; i++) {
    System.out.println(i);
}

int n = 3;
while (n > 0) {
    System.out.println(n);
    n--;
}

// 增强 for：遍历数组或集合
int[] arr = {1, 2, 3};
for (int x : arr) {
    System.out.println(x);
}

switch (score / 10) {
    case 10:
    case 9:  System.out.println("A"); break;
    case 8:  System.out.println("B"); break;
    default: System.out.println("其他");
}
```

## 数组与集合

```java
// 数组：长度固定，创建后不能改大小
int[] nums = new int[3];
nums[0] = 1;
int[] a2 = {1, 2, 3};

// ArrayList：动态数组，日常最常用
import java.util.ArrayList;
ArrayList<String> list = new ArrayList<>();
list.add("Tom");
list.add("Jerry");
list.remove(0);
for (String s : list) System.out.println(s);

// HashMap：键值对
import java.util.HashMap;
HashMap<String, Integer> map = new HashMap<>();
map.put("age", 20);
System.out.println(map.get("age"));
```

> [!TIP]
> 实际开发几乎都用 `ArrayList` / `HashMap` 这类集合类，而不是原生数组。记得在文件顶部 `import java.util.*;`。

## 函数（方法）

```java
static int add(int x, int y) {
    return x + y;
}

// 方法重载：同名不同参数列表
static double add(double x, double y) {
    return x + y;
}

// 可变参数
static int sum(int... nums) {
    int t = 0;
    for (int n : nums) t += n;
    return t;
}
```

## 面向对象

Java 是纯面向对象语言，一切皆对象（8 个基本类型除外）。

```java
class Student {
    String name;
    int age;

    Student(String name, int age) {     // 构造方法
        this.name = name;
        this.age = age;
    }

    void study() {
        System.out.println(name + " 在学习");
    }
}

// 继承
class Graduate extends Student {
    String mentor;
    Graduate(String n, int a, String m) {
        super(n, a);                     // 调用父类构造
        this.mentor = m;
    }
}

Student s = new Student("Trusler", 20);
s.study();
```

三大特性：

- **封装**：用 `private` 隐藏字段，提供 `getter / setter`
- **继承**：用 `extends` 复用父类代码
- **多态**：父类引用指向子类对象，运行时调用子类重写的方法

> [!NOTE]
> `this` 指当前对象，`super` 指父类。`static` 方法属于类而不是对象，不能访问非 static 成员。

## 异常处理

```java
try {
    int x = Integer.parseInt("abc");
} catch (NumberFormatException e) {
    System.out.println("格式错误：" + e.getMessage());
} finally {
    System.out.println("无论怎样都会执行");
}

// 主动抛出异常
if (age < 0) throw new IllegalArgumentException("年龄非法");
```

## 文件操作

```java
import java.nio.file.*;
import java.util.List;

// 写文件（一行一个元素）
Files.write(Paths.get("note.txt"),
    List.of("你好", "世界"),
    StandardCharsets.UTF_8);

// 读文件
List<String> lines = Files.readAllLines(
    Paths.get("note.txt"), StandardCharsets.UTF_8);
```

> [!TIP]
> 新项目直接用 `java.nio.file.Files`，比老式的 `FileInputStream` 简洁十倍。

## 实战项目：命令行通讯录

用 `HashMap` 存姓名到电话的映射，支持增、查、删，并把数据持久化到文件。

### 参考答案

```java
import java.io.*;
import java.util.HashMap;
import java.util.Scanner;

public class PhoneBook {
    static HashMap<String, String> pb = new HashMap<>();
    static String FILE = "phonebook.txt";
    static Scanner sc = new Scanner(System.in);

    static void load() {
        try (BufferedReader br = new BufferedReader(new FileReader(FILE))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] p = line.split(",");
                pb.put(p[0], p[1]);
            }
        } catch (IOException e) { }
    }

    static void save() {
        try (PrintWriter pw = new PrintWriter(new FileWriter(FILE))) {
            for (var e : pb.entrySet())
                pw.println(e.getKey() + "," + e.getValue());
        } catch (IOException e) { }
    }

    public static void main(String[] args) {
        load();
        while (true) {
            System.out.print("\n1 增 2 查 3 删 4 退出 > ");
            String c = sc.nextLine();
            if (c.equals("1")) {
                System.out.print("姓名："); String n = sc.nextLine();
                System.out.print("电话："); String t = sc.nextLine();
                pb.put(n, t); save();
            } else if (c.equals("2")) {
                System.out.print("姓名："); String n = sc.nextLine();
                System.out.println(n + " -> " + pb.getOrDefault(n, "未找到"));
            } else if (c.equals("3")) {
                System.out.print("姓名："); pb.remove(sc.nextLine()); save();
            } else break;
        }
    }
}
```

## 课后练习

1. 加一个"列出全部联系人"的功能
2. 改成用 `ArrayList` 存对象（包含姓名、电话、邮箱）
3. 用 `Properties` 类重写存储逻辑
*/}),

  /* ---- 5: C++ 入门 ---- */
  raw(function(){/*
# C++ 入门教程

C++ 由 Bjarne Stroustrup 在 1979 年基于 C 语言扩展而来，加入了类、模板和 STL 标准库。它奉行"零成本抽象"，直接贴近硬件，是游戏引擎、操作系统、高频交易、嵌入式开发的不二之选。

## 为什么学 C++

- **性能极致**：直接管理内存，没有垃圾回收的停顿
- **底层可控**：指针、内存布局随心所欲
- **应用极广**：Unreal 引擎、Chrome、MySQL，连 STL 本身都是 C++ 写的
- **打基础**：学完 C++ 再看 Java / Go，会觉得它们简单很多

> [!WARNING]
> C++ 能力越大责任越大。内存泄漏、野指针、段错误是三大经典坑。新手一定要从 RAII 和智能指针开始，养成好习惯。

## 环境搭建

### 安装编译器

- Windows：装 **MinGW-w64** 或装 Visual Studio 自带的 **MSVC**
- macOS：`xcode-select --install` 或 `brew install gcc`
- Linux：`sudo apt install g++`

验证：

```bash
g++ --version
```

### 第一个程序

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
```

编译运行：

```bash
g++ hello.cpp -o hello
./hello
```

> [!TIP]
> `cout <<` 是输出，`cin >>` 是输入，`<< endl` 相当于换行。C++ 用"流（stream）"而不是 print 函数来做输入输出。

## 基础语法

### 变量与类型

```cpp
int age = 20;              // 整数
double price = 9.9;        // 双精度浮点
float f = 1.5f;            // 单精度要加 f
bool ok = true;            // 布尔
char c = 'A';              // 单个字符
string name = "Trusler";   // 字符串（需 #include <string>）
const int MAX = 100;       // 常量，不可改
auto x = 3.14;             // 让编译器自动推导类型
```

| 类型 | 字节 | 说明 |
|---|---|---|
| `int` | 4 | 默认整数 |
| `long long` | 8 | 更大的整数 |
| `double` | 8 | 默认浮点 |
| `char` | 1 | 字符 |

### 运算符

```cpp
int a = 10, b = 3;
cout << a / b << endl;          // 3（整数除法截断）
cout << a % b << endl;          // 1（取余）
cout << (a > 5 && b < 10) << endl;   // 1（逻辑与，true 输出为 1）
a += 2;                         // 等价于 a = a + 2
```

### 字符串

```cpp
#include <string>
string s = "hello";
cout << s.length() << endl;     // 5
cout << s.substr(1, 3) << endl; // ell（从索引1取3个字符）
s += " world";
cout << s << endl;
```

> [!NOTE]
> C 风格字符串是 `char` 数组，而 C++ 的 `std::string` 好用得多，请优先用 `string`。

## 控制流

```cpp
int score = 85;
if (score >= 90) cout << "A";
else if (score >= 60) cout << "及格";
else cout << "挂科";

for (int i = 0; i < 5; i++) cout << i;

int n = 3;
while (n > 0) { cout << n; n--; }

// 范围 for（C++11 起）
for (char ch : s) cout << ch;

switch (score / 10) {
    case 9: case 10: cout << "A"; break;
    default: cout << "其他";
}
```

## 数组与 STL 容器

```cpp
#include <vector>
#include <map>
#include <set>
using namespace std;

vector<int> v = {1, 2, 3};      // 动态数组
v.push_back(4);
for (int x : v) cout << x;

map<string, int> m;             // 红黑树实现的键值对
m["age"] = 20;
cout << m["age"];

set<int> s = {3, 1, 2};         // 自动排序并去重
```

> [!TIP]
> STL 是 C++ 的灵魂：`vector` / `map` / `set` / `unordered_map` 几乎覆盖所有需求。别自己手搓链表和哈希表。

## 函数

```cpp
int add(int x, int y) {
    return x + y;
}

// 引用传参：避免拷贝，还能修改原值
void swap(int& a, int& b) {
    int t = a; a = b; b = t;
}

// 默认参数
void log(string msg, int level = 1) { }

// 函数重载
double add(double x, double y) { return x + y; }

// Lambda 匿名函数（C++11 起）
auto square = [](int x) { return x * x; };
```

## 面向对象

```cpp
class Student {
private:
    string name;
    int age;
public:
    Student(string n, int a) : name(n), age(a) {}   // 初始化列表
    void study() { cout << name << " 学习" << endl; }
    int getAge() { return age; }
};

class Graduate : public Student {        // 公有继承
    string mentor;
public:
    Graduate(string n, int a, string m) : Student(n, a), mentor(m) {}
};

Student s("Trusler", 20);
s.study();
```

> [!NOTE]
> 冒号后面是初始化列表，比在构造函数体里逐个赋值更高效。封装用 `private`，继承用 `: public`。

## 内存与指针（重点）

```cpp
int x = 10;
int* p = &x;              // p 保存 x 的地址
cout << *p << endl;      // 解引用，输出 10

// new / delete：手动管理内存
int* q = new int(5);
delete q;                // 必须手动释放，否则内存泄漏

// 现代 C++：智能指针（推荐）
#include <memory>
auto sp = make_shared<int>(5);    // 引用计数，自动释放
```

> [!WARNING]
> 新手尽量用 `vector` + 智能指针，避免裸 `new / delete`。忘了 `delete` 会内存泄漏，重复 `delete` 会直接崩溃。

## 异常处理

```cpp
#include <stdexcept>
try {
    throw runtime_error("出错了");
} catch (const exception& e) {
    cout << e.what() << endl;
}
```

## 文件操作

```cpp
#include <fstream>
ofstream out("note.txt");
out << "你好" << endl;
out.close();

ifstream in("note.txt");
string line;
while (getline(in, line)) cout << line;
in.close();
```

## 实战项目：学生成绩管理（C++ 版）

用 `vector<Student>` 存学生，支持录入、按平均分排序、输出排行榜。

### 参考答案

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>
using namespace std;

struct Student {
    string name;
    vector<double> scores;
    double avg() const {
        return scores.empty() ? 0 :
            accumulate(scores.begin(), scores.end(), 0.0) / scores.size();
    }
};

int main() {
    vector<Student> stus;
    int n;
    cout << "学生数："; cin >> n;
    for (int i = 0; i < n; i++) {
        Student s;
        cout << "姓名："; cin >> s.name;
        int k; cout << "几门课："; cin >> k;
        for (int j = 0; j < k; j++) {
            double x; cin >> x; s.scores.push_back(x);
        }
        stus.push_back(s);
    }
    sort(stus.begin(), stus.end(),
        [](const Student& a, const Student& b) { return a.avg() > b.avg(); });
    for (auto& s : stus)
        cout << s.name << " 平均 " << s.avg() << endl;
    return 0;
}
```

## 课后练习

1. 加一个"按姓名查找"功能
2. 把成绩存进文件，下次启动再读回来
3. 用 `class` 替代 `struct`，并把字段设为私有
*/}),
  /* ---- 6: JavaScript 入门 ---- */
  raw(function(){/*
# JavaScript 入门教程

JavaScript（简称 JS）由 Brendan Eich 在 1995 年仅用 10 天设计出来，原本叫 LiveScript。它是**浏览器的原生语言**，负责网页的交互。2015 年的 ES6 是一次大更新，加上 Node.js 让它能跑在服务端，如今前后端通吃。

## 为什么学 JavaScript

- **唯一能直接操纵网页的语言**：想做前端绕不开
- **全栈可行**：Node.js 让你用同一门语言写后端
- **生态爆炸**：npm 上有上百万个包
- **上手快**：浏览器按 F12 就能写代码看效果

> [!TIP]
> 现代 JS 请直接用 ES6+ 语法（let / const / 箭头函数 / 模板字符串）。老的 `var` 和回调地狱已经是过去式。

## 环境搭建

### 三种运行方式

1. **浏览器控制台**：按 F12 打开 DevTools，切到 Console 直接敲
2. **Node.js**：装好 Node 后终端输入 `node` 进 REPL，或 `node app.js` 跑文件
3. **VS Code + Live Server**：写 HTML/JS 实时刷新预览

```bash
node --version
```

### 第一个程序

```javascript
console.log("Hello, World!");
```

在网页里也可以这样写：

```html
<script>
  alert("Hello, World!");
</script>
```

## 基础语法

### 变量声明

```javascript
let count = 0;            // 可变变量，推荐
const PI = 3.14;          // 常量，不可重新赋值
// var 老写法，存在变量提升坑，尽量别用
```

> [!WARNING]
> 默认用 `const`，只有确实需要重新赋值才用 `let`。这能避免很多意外修改。

### 数据类型

```javascript
let n = 42;               // number（只有这一种数字类型）
let s = "hi";             // string
let b = true;             // boolean
let empty = null;         // null（空对象）
let undef;                // undefined（未定义）
let obj = { name: "Tom" };// object
let big = 9007199254740993n;  // bigint（超大整数）

console.log(typeof n);    // "number"
console.log(typeof obj);  // "object"
```

### 模板字符串

```javascript
let name = "Trusler";
let msg = `你好，${name}，今年 ${20 + 1} 岁`;   // 反引号 + ${}
console.log(msg);
```

### 运算符

```javascript
let a = 10, b = 3;
console.log(a / b);       // 3.333...（JS 除法保留小数）
console.log(a % b);       // 1
console.log(a === b);     // false（=== 严格相等，类型和值都要一样）
console.log(a == "10");   // true（== 会做类型转换，容易出 bug）
```

> [!WARNING]
> 永远用 `===` 和 `!==`，别用 `==` / `!=`。`==` 会偷偷做类型转换，`0 == ""` 居然是 true，坑极多。

## 数据结构

```javascript
// 数组
let arr = [1, 2, 3];
arr.push(4);
arr.forEach(x => console.log(x));

// 对象
let user = { name: "Tom", age: 20 };
console.log(user.name);
user.city = "BJ";

// Map（键可以是任意类型）
let m = new Map();
m.set("a", 1);
console.log(m.get("a"));

// Set（去重）
let set = new Set([1, 1, 2]);   // {1, 2}
```

## 控制流

```javascript
let score = 85;
if (score >= 90) console.log("A");
else if (score >= 60) console.log("及格");
else console.log("挂科");

for (let i = 0; i < 5; i++) console.log(i);

let n = 3;
while (n > 0) { console.log(n); n--; }

// for...of 遍历可迭代对象
for (let x of [1, 2, 3]) console.log(x);

// for...in 遍历对象键
for (let k in user) console.log(k);
```

## 函数

```javascript
function add(x, y) {        // 函数声明
    return x + y;
}

const mul = (x, y) => x * y;   // 箭头函数，更简洁

function greet(name = "匿名") { // 默认参数
    return `你好，${name}`;
}

const sum = (...nums) => nums.reduce((a, b) => a + b, 0);  // rest 参数

// 闭包：函数记住了外部变量
function counter() {
    let c = 0;
    return () => ++c;
}
```

> [!NOTE]
> 箭头函数没有自己的 `this`，它继承外层 `this`。在事件回调、数组方法里特别好用。

## 面向对象（ES6 class）

```javascript
class Student {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    study() {
        console.log(this.name + " 在学习");
    }
}

class Graduate extends Student {
    constructor(name, age, mentor) {
        super(name, age);
        this.mentor = mentor;
    }
}

const s = new Student("Trusler", 20);
s.study();
```

## DOM 基础（让网页动起来）

```javascript
// 获取元素
let btn = document.getElementById("myBtn");
let title = document.querySelector("h1");

// 修改内容
title.textContent = "新标题";

// 绑定事件
btn.addEventListener("click", () => {
    alert("被点击了！");
});

// 修改样式
btn.style.color = "red";
```

## 异步编程

```javascript
// 回调（老式）
setTimeout(() => console.log("2 秒后"), 2000);

// Promise
fetch("/api/data")
  .then(res => res.json())
  .then(data => console.log(data));

// async / await（推荐写法）
async function load() {
    let res = await fetch("/api/data");
    let data = await res.json();
    console.log(data);
}
```

> [!TIP]
> `async / await` 是把 Promise 写成同步样子的语法糖，可读性最好，优先用它。

## 异常处理与常用 API

```javascript
try {
    JSON.parse("{错误");
} catch (e) {
    console.log("出错：", e.message);
}

// JSON 互转
let str = JSON.stringify({ a: 1 });
let obj = JSON.parse(str);

// 本地存储（浏览器，不会过期）
localStorage.setItem("token", "abc");
localStorage.getItem("token");
```

## 实战项目：待办清单 Todo

一个能增删、标记完成、自动保存的网页清单。

### 需求拆解

1. 输入框 + 添加按钮，回车也能加
2. 列表展示，每项带删除按钮和勾选框
3. 勾选标记完成（加删除线样式）
4. 用 `localStorage` 持久化，刷新不丢

### 参考答案

```html
<input id="inp" placeholder="写点什么">
<button id="add">添加</button>
<ul id="list"></ul>

<script>
let todos = JSON.parse(localStorage.getItem("todos") || "[]");

function render() {
    const ul = document.getElementById("list");
    ul.innerHTML = "";
    todos.forEach((t, i) => {
        const li = document.createElement("li");
        li.innerHTML = `<input type="checkbox" ${t.done ? "checked" : ""}>
          <span style="text-decoration:${t.done ? "line-through" : "none"}">${t.text}</span>
          <button onclick="del(${i})">删</button>`;
        li.querySelector("input").onchange = () => {
            todos[i].done = !todos[i].done; save(); render();
        };
        ul.appendChild(li);
    });
}

function save() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

function del(i) {
    todos.splice(i, 1); save(); render();
}

document.getElementById("add").onclick = () => {
    const v = document.getElementById("inp").value.trim();
    if (!v) return;
    todos.push({ text: v, done: false });
    document.getElementById("inp").value = "";
    save(); render();
};

render();
</script>
```

## 课后练习

1. 加一个"清空已完成"按钮
2. 支持双击文字编辑内容
3. 用 `filter` 实现"只看未完成"
*/}),

  /* ---- 7: Vim / Nano 编辑器 ---- */
  raw(function(){/*
# Vim / Nano 编辑器实战

服务器通常没有图形界面，你只能在终端里改文件。Vim 和 Nano 是两件必备武器：Nano 上手零门槛，Vim 学会之后效率极高。

## 为什么必须用终端编辑器

- 远程服务器没有鼠标、没有 GUI
- `scp` 把文件下载下来改再传回去太慢
- 应急改一行配置（比如 nginx、hosts）必须当场搞定

> [!TIP]
> 新手先掌握 Nano 应付日常，再花半天练 Vim。两者都会，你就不怕任何服务器了。

## Vim：四种模式

Vim 最难的是**模式**，搞清楚就不会懵：

| 模式 | 进入键 | 作用 |
|---|---|---|
| Normal（普通） | `Esc` | 移动光标、执行命令，默认模式 |
| Insert（插入） | `i` / `a` / `o` | 真正打字输入内容 |
| Visual（可视） | `v` / `V` / `Ctrl+v` | 选中文本块 |
| Command（命令） | `:` | 底部输入 `:w` `:q` 等指令 |

### 启动与退出

```bash
vim note.txt          # 打开（不存在则新建）
```

进入后默认是 Normal 模式，常用退出命令：

| 命令 | 含义 |
|---|---|
| `:w` | 保存（write） |
| `:q` | 退出（quit） |
| `:wq` 或 `:x` | 保存并退出 |
| `:q!` | 不保存，强制退出 |

> [!WARNING]
> 直接关终端窗口不会保存！一定要先 `:wq`。新手卡在 Vim 里出不去，记住 `Esc` 然后 `:q!` 就能强制离开。

### 移动光标（Normal 模式）

```vim
h j k l          # 左 下 上 右（右手放在键盘上就能按）
w b             # 跳到下一个 / 上一个单词开头
0 ^ $           # 行首 / 首个非空字符 / 行尾
gg G            # 文件第一行 / 最后一行
Ctrl+f Ctrl+b   # 向下 / 向上翻一页
```

### 编辑文本

```vim
i a             # 在光标前 / 后插入
o O             # 在下方 / 上方新建一行并插入
x              # 删除光标处字符
dw             # 删除一个单词
dd             # 删除（剪切）整行
u Ctrl+r        # 撤销 / 重做
```

### 复制粘贴

```vim
yy             # 复制整行
yw             # 复制一个单词
p              # 粘贴到光标后
```

### 搜索与替换

```vim
/pattern       # 向下搜索，按 n 下一个，N 上一个
?pattern       # 向上搜索
:%s/old/new/g  # 全局把 old 替换成 new
```

### 可视模式选中

```vim
v              # 字符级选中
V              # 行级选中
Ctrl+v         # 列块选中（批量改多行前缀很好用）
```

### 个人配置 ~/.vimrc

```vim
set number          " 显示行号
set tabstop=4       " Tab 宽度 4
set expandtab       " Tab 自动转空格
set mouse=a         " 启用鼠标
syntax on           " 语法高亮
```

## Nano：开箱即用

Nano 没有模式概念，打开就能打字，底部有一排快捷键提示。

### 启动

```bash
nano note.txt
```

### 常用快捷键（^ 代表 Ctrl）

| 快捷键 | 作用 |
|---|---|
| `Ctrl+O` | 保存（Write Out） |
| `Ctrl+X` | 退出（Exit） |
| `Ctrl+K` | 剪切当前行 |
| `Ctrl+U` | 粘贴 |
| `Ctrl+W` | 搜索 |
| `Ctrl+G` | 查看全部帮助 |
| `Ctrl+_` | 跳转到指定行号 |

> [!NOTE]
> Nano 退出时如果没保存，会问你要不要保存，按 `Y` 确认、`Enter` 确认文件名即可。比 Vim 友好太多。

### 个人配置 ~/.nanorc

```bash
set linenumbers        # 显示行号
set tabsize 4          # Tab 宽度
set mouse              # 启用鼠标
```

## 两者怎么选

| 场景 | 推荐 |
|---|---|
| 改一两行配置、赶时间 | Nano |
| 长时间写代码、大量编辑 | Vim |
| 完全新手第一次上服务器 | Nano |

> [!TIP]
> 紧急改配置（比如修复一个写错的 nginx .conf 导致服务起不来），用 `nano 文件名` 最稳，避免 Vim 模式切换手忙脚乱。
*/}),

  /* ---- 8: 代码风格与规范 ---- */
  raw(function(){/*
# 代码风格与规范

代码是写给人看的，顺便让机器执行。统一的风格能让团队协作顺畅、bug 更少、维护更轻松。

## 为什么风格重要

- **可读性**：你三个月后看自己代码，像看别人的
- **协作**：10 个人 10 种风格，PR 里全是格式争吵
- **减少 bug**：一致的结构让异常更容易被发现
- **工具化**：有了规范，格式化、检查都能自动化

> [!TIP]
> 风格之争（tab vs space、单引号 vs 双引号）没有绝对对错，关键是**整个项目统一**。用工具强制执行比靠自觉靠谱。

## 命名规范

| 目标 | 风格 | 示例 |
|---|---|---|
| 变量 / 函数 | camelCase | `userName`, `getScore()` |
| 类 / 构造函数 | PascalCase | `Student`, `HttpClient` |
| 常量 | UPPER_SNAKE | `MAX_RETRY`, `API_URL` |
| 私有成员 | 前缀 `_` | `_cache`, `_init()` |

核心原则：**见名知意**，别用 `a` `tmp` `data1` 这种含糊名字。

```python
# 坏
def p(u, d):
    ...

# 好
def calculate_average(user, scores):
    ...
```

## 缩进与格式

- **缩进用空格**，别混用 Tab 和空格（混用会报缩进错误）
- Python 强制 4 空格；前端大多 2 空格；Java/C++ 多 4 空格或 2
- **一行别太长**：建议 80-120 字符，超了换行
- 运算符前后、逗号后加空格，眼睛更舒服

```javascript
// 坏：挤在一行
if(x>0){doSomething(x);}

// 好
if (x > 0) {
    doSomething(x);
}
```

## 注释原则

- 解释 **为什么**（why），而不是 **是什么**（what）
- 代码本身能说清的，别写废话注释
- 复杂的算法、业务规则、踩过的坑，值得写

```java
// 坏：明显在干什么还写一遍
i++;  // i 加 1

// 好：解释业务原因
// 给连续登录失败的用户加 5 分钟冷却，防暴力破解
lockUser(account, 300);
```

## 各语言主流规范

| 语言 | 规范 | 说明 |
|---|---|---|
| Python | **PEP 8** | 官方风格指南，4 空格缩进 |
| Java | Google Java Style / 阿里巴巴 Java 开发手册 | 国内阿里那本很实用 |
| C++ | Google C++ Style | 强调可读性和线程安全 |
| JavaScript | Airbnb / Standard | Airbnb 最严格也最流行 |

## 自动化工具（让机器替你格式化）

| 语言 | 工具 | 作用 |
|---|---|---|
| Python | `black` | 一键格式化，零配置 |
| C / C++ | `clang-format` | 按 .clang-format 配置格式化 |
| JavaScript | `prettier` + `eslint` | 格式化 + 风格检查 |
| Java | `checkstyle` | 静态风格检查 |
| 通用 | EditorConfig | 跨编辑器统一缩进/换行 |

> [!TIP]
> 把格式化工具接进保存动作（VS Code 的 Format on Save）和 Git 提交钩子（pre-commit），从此不用手动纠结格式。

## 提交信息规范（Conventional Commits）

清晰的提交信息让 `git log` 一目了然：

```bash
feat: 新增学生成绩排序功能
fix: 修复除零导致的崩溃
docs: 补充 README 使用说明
refactor: 重构数据加载逻辑
test: 补充用户模块的单元测试
```

格式：`<类型>(可选范围): <简短描述>`

## 实战：混乱代码 vs 规范代码

```javascript
// 混乱版
function  p(u){let s=0;for(let i=0;i<u.scores.length;i++){s=s+u.scores[i];}return s/u.scores.length;}

// 规范版
function calculateAverage(user) {
    const total = user.scores.reduce((sum, score) => sum + score, 0);
    return total / user.scores.length;
}
```

> [!NOTE]
> 规范版虽然行数多，但变量名、空格、换行让意图一目了然，三个月后你依然秒懂。
*/}),
];

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

var categories = [
  { name: '复盘', items: [ {idx:2, title:'大数据省赛全流程复盘'} ] },
  { name: '技术', items: [
    {idx:0, title:'Markdown 入门指南'},
    {idx:1, title:'Linux 命令速查手册'}
  ]},
  { name: '教学', items: [
    {idx:3, title:'Python 入门教程'},
    {idx:4, title:'Java 入门教程'},
    {idx:5, title:'C++ 入门教程'},
    {idx:6, title:'JavaScript 入门教程'},
    {idx:7, title:'Vim / Nano 编辑器实战'},
    {idx:8, title:'代码风格与规范'}
  ]}
];

(function() {
  var navCats = document.getElementById('navCats');
  var navList = document.getElementById('navList');
  var content = document.getElementById('articleContent');
  var activeCat = 0;

  function showArticle(idx) {
    content.innerHTML = renderMarkdown(articles[idx]);
    if (typeof hljs !== 'undefined') {
      content.querySelectorAll('pre code').forEach(function(el) { hljs.highlightElement(el); });
    }
    addCopyButtons(content);
    content.style.animation = 'none';
    content.offsetHeight;
    content.style.animation = 'fadeUp .4s ease both';
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
      b.setAttribute('data-idx', a.idx);
      b.textContent = a.title;
      b.addEventListener('click', function() { showArticle(a.idx); });
      navList.appendChild(b);
    });
    showArticle(categories[activeCat].items[0].idx);
  }

  function renderCats() {
    navCats.innerHTML = '';
    categories.forEach(function(cat, ci) {
      var b = document.createElement('button');
      b.className = 'blog-cat' + (ci === activeCat ? ' active' : '');
      b.textContent = cat.name;
      b.addEventListener('click', function() {
        activeCat = ci;
        renderCats();
        renderList();
      });
      navCats.appendChild(b);
    });
  }

  renderCats();
  renderList();
})();

var _tr_usler_md = document.querySelector('[data-tr-usler]');

var _tr_usler_md = document.querySelector("[data-tr-usler]");
