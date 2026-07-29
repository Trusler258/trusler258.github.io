
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
  return fn.toString().slice(15, -4);
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

  /* ---- 2: 大数据竞赛 ---- */
  raw(function(){/*
# 大数据省赛全流程复盘

> 参赛时间：2026 年 3 月，团队 3 人。赛题围绕 Hadoop 集群搭建 + 共享单车数据分析（bike_rides.csv），分三大模块，限时完成。

<div class="timeline">
  <div class="timeline-item active">
    <div class="timeline-date">Day 1</div>
    <div class="timeline-content">模块一：Hadoop 完全分布式搭建 — master / slave1 / slave2 三节点集群</div>
  </div>
  <div class="timeline-item active">
    <div class="timeline-date">Day 2</div>
    <div class="timeline-content">模块二：Python 数据获取、7 步清洗流水线、距离分类 + 时段热度标注</div>
  </div>
  <div class="timeline-item active">
    <div class="timeline-date">Day 3</div>
    <div class="timeline-content">模块二续：HDFS 文件操作 + MapReduce 统计分析（WordCount / Pi / Grep / TeraSort）</div>
  </div>
  <div class="timeline-item active">
    <div class="timeline-date">Day 4</div>
    <div class="timeline-content">模块三：5 项业务分析 + 5 张 Matplotlib 可视化图表 + 截图提交</div>
  </div>
</div>

---

## 模块一：Hadoop 完全分布式搭建

比赛给三台虚拟机：master（10.30.30.31）、slave1（10.30.30.32）、slave2（10.30.30.33）。需要从零开始，全部用 root 用户。

集群角色规划如下：

| 组件 | master | slave1 | slave2 |
|---|---|---|---|
| NameNode | 是 | — | — |
| SecondaryNameNode | 是 | — | — |
| DataNode | 是 | 是 | 是 |
| ResourceManager | 是 | — | — |
| NodeManager | 是 | 是 | 是 |
| JobHistoryServer | 是 | — | — |

> 注意：NameNode 和 ResourceManager 都在 master 上，不要分开放，否则后续 HDFS 和 YARN 通信会出问题。

### 1.1 设置主机名

为什么先做这一步？因为 Hadoop 各组件之间靠**主机名**互相发现，如果 IP 和主机名对不上，DataNode 注册不到 NameNode，集群根本起不来。

三台机器分别执行，改完后记得 **重新登录** 或执行 `bash` 让新主机名生效：

```bash
hostnamectl set-hostname master
bash
```

> 改完后终端提示符会从 `[root@localhost ~]#` 变成 `[root@master ~]#`，说明生效了。slave1 和 slave2 同理。

### 1.2 配置 hosts 映射

修改 hosts 文件，这样主机名才能解析到正确的 IP。**只在 master 上改**，然后 scp 到另外两台：

```bash
vim /etc/hosts
```

在文件末尾追加三行（IP 用比赛提供的实际地址）：

```
10.30.30.31     master
10.30.30.32     slave1
10.30.30.33     slave2
```

> 为什么 IP 在前、主机名在后？这是 hosts 文件的标准格式：`ip  hostname  [alias...]`，顺序反了解析会失败。

改完后分发到 slave 节点：

```bash
scp /etc/hosts root@slave1:/etc/
```

```bash
scp /etc/hosts root@slave2:/etc/
```

> `scp` 是安全拷贝命令，走 SSH 协议传输。这里用 root 用户是因为我们还没创建 hadoop 用户。目标路径写成 `/etc/` 而不是 `/etc/hosts` 是因为 `/etc/` 末尾带斜杠表示"放到这个目录下"。

### 1.3 安装 JDK

Hadoop 是 Java 写的，必须先装 JDK。比赛给的包是 `jdk-21_linux-x64_bin.tar.gz`，放在 `/opt/software/` 下。

先看看这个路径存不存在：

```bash
ls /opt/software/
```

如果不存在就创建：

```bash
mkdir -p /opt/software
mkdir -p /opt/module
```

> `/opt/software` 放安装包，`/opt/module` 放解压后的程序。这是 Hadoop 生态的常见约定，别搞混。

解压到 `/opt/module`：

```bash
tar -zxf /opt/software/jdk-21_linux-x64_bin.tar.gz -C /opt/module/
```

> **绝对不要加 `-v` 参数！** `tar -zvxf` 会逐行打印所有解压文件，瞬间刷满整个屏幕，你截图的区域什么关键信息都看不到。血的教训。

验证解压结果：

```bash
ls /opt/module/
```

把 JDK 分发到 slave 节点：

```bash
scp -r /opt/module/jdk-21.0.11 root@slave1:/opt/module/
```

```bash
scp -r /opt/module/jdk-21.0.11 root@slave2:/opt/module/
```

> `scp -r` 递归拷贝整个目录。注意版本号 `jdk-21.0.11` 是解压后自动生成的目录名，**先用 `ls` 确认一下**，别照抄，不同比赛包的版本号可能不一样。

### 1.4 配置 JDK 环境变量

**关键原则：不要在 `/etc/profile` 里直接写，创建单独文件。**

为什么？因为 `/etc/profile` 是系统级配置，改坏了会影响所有用户。单独文件出问题删掉就行。

```bash
vim /etc/profile.d/myenv.sh
```

写入以下内容：

```bash
export JAVA_HOME=/opt/module/jdk-21.0.11
export PATH=$PATH:$JAVA_HOME/bin
```

> **`$PATH:` 必须放在前面！** 你如果写成 `PATH=$JAVA_HOME/bin`，等于把系统原有的 `/usr/bin`、`/usr/sbin` 全干掉了，之后连 `ls`、`vim` 都用不了。这就是为什么前面要加 `$PATH:`——它的意思是"在原有 PATH 后面追加新路径"。

让配置立即生效：

```bash
source /etc/profile
```

> 如果不小心配错了导致命令全都 Not Found，急救命令：
> 
> ```bash
> export PATH=/usr/bin:/usr/sbin
> ```
>
> 这会把 PATH 恢复到系统最小可用状态，然后就能 `vim` 回去改了。

分发到 slave 节点：

```bash
scp /etc/profile.d/myenv.sh root@slave1:/etc/profile.d/
```

然后在 slave1 和 slave2 上分别执行 `source /etc/profile`。

### 1.5 验证 JDK

确认安装成功，看版本号是否正确：

```bash
java -version
```

> 如果提示 `command not found`，说明 `JAVA_HOME/bin` 没在 PATH 里，回去检查 `/etc/profile.d/myenv.sh` 的内容和 `source` 是否执行了。

如果提示 `Permission denied`，检查 JDK 目录权限：

```bash
ls -la /opt/module/jdk-21.0.11/bin/java
```

### 1.6 创建 hadoop 用户

为什么需要单独用户？**安全隔离**：Hadoop 各组件如果用 root 跑，一旦有漏洞就是最高权限沦陷。用普通用户跑是生产环境的标配做法。

三台机器都要创建：

```bash
useradd hadoop
```

```bash
passwd hadoop
```

> 密码设置简单点，比赛环境不涉及安全审计，别给自己添麻烦。

给 hadoop 用户加 sudo 权限。**必须加 `NOPASSWD:ALL`**，否则后续脚本里调 `sudo` 会卡住等输入密码：

```bash
vim /etc/sudoers
```

在 `root ALL=(ALL) ALL` 下面加一行：

```
hadoop  ALL=(ALL)  NOPASSWD:ALL
```

> `/etc/sudoers` 这个文件不要用普通编辑器改！一定要用 `visudo` 或直接用 `vim`。语法错误会导致整个 sudo 系统挂掉。这里用 `vim` 是因为 `visudo` 有些系统默认绑定 nano，操作不熟反而容易出错。

分发到 slave 节点：

```bash
scp /etc/sudoers root@slave1:/etc/
```

```bash
scp /etc/sudoers root@slave2:/etc/
```

### 1.7 关闭防火墙 & SELinux

Hadoop 组件之间通过多个端口通信（8020、50070、8088 等），防火墙开着会挡掉一切。比赛环境没有外部网络威胁，直接全关：

```bash
systemctl stop firewalld
```

```bash
systemctl disable firewalld
```

> `stop` 是立即关闭当前运行的防火墙；`disable` 是禁止开机自启。两个都要执行，不然重启后防火墙又回来了。

关闭 SELinux：

```bash
setenforce 0
```

> `setenforce 0` 是临时关闭，重启失效。要永久关闭还需要改配置文件：
>
> ```bash
> vim /etc/selinux/config
> ```
> 
> 把 `SELINUX=enforcing` 改成 `SELINUX=disabled`。
>
> 改完后**重启生效**，`getenforce` 将输出 `Disabled`（而不是 `Permissive`）。
>
> 注意区分：`setenforce 0` 只是临时放宽（输出 `Permissive`），改配置文件才是永久关闭（输出 `Disabled`）。

**三台机器都要做！** slave 节点也别漏，否则 DataNode 可能注册不上。

### 1.8 配置 SSH 免密登录

Hadoop 的启动脚本（`start-dfs.sh`）靠 SSH 远程启动其他节点的守护进程。如果每次都要输密码，脚本直接卡死。

生成密钥对（一路回车，不设密码）：

```bash
ssh-keygen -t rsa
```

> `-t rsa` 指定密钥类型。一路回车表示：默认路径 `~/.ssh/id_rsa`、不设 passphrase（空密码）。比赛环境不设 passphrase 是标准操作。

把公钥拷到所有节点（**包括自己**）：

```bash
ssh-copy-id master
```

```bash
ssh-copy-id slave1
```

```bash
ssh-copy-id slave2
```

> 为什么要拷给自己？Hadoop 的某些组件（如 ResourceManager）在本机启动时也是通过 SSH 连接的。如果自己连自己都要密码，看似本地启动，实际也会卡。

**换 hadoop 用户再做一轮**。先切换用户：

```bash
su - hadoop
```

然后重复上面的三步 `ssh-keygen` + 三次 `ssh-copy-id`。

> root 和 hadoop 两个用户的免密都要配，缺一个后面就有组件起不来。这是最常见的翻车点之一。

验证免密是否成功：

```bash
ssh slave1
```

如果直接进去了（不提示输密码），说明成功。`exit` 退回。

### 1.9 解压 & 配置 Hadoop

用 root 解压到 `/opt/module`，然后改属主为 hadoop：

```bash
tar -zxf /opt/software/hadoop-3.5.0.tar.gz -C /opt/module/
```

> 再次强调：**别加 -v**，刷屏截不了图。

重命名（缩短路径，方便后续操作）：

```bash
mv /opt/module/hadoop-3.5.0 /opt/module/hadoop
```

改属主和属组为 hadoop：

```bash
chown -R hadoop:hadoop /opt/module/hadoop
```

> `-R` 递归修改目录下所有文件，`hadoop:hadoop` 表示 属主:属组。之后 Hadoop 进程用 hadoop 用户跑，如果文件属于 root 会报权限拒绝。

### 1.10 配置 hadoop-env.sh

切换到 hadoop 用户，进入配置目录：

```bash
su - hadoop
cd /opt/module/hadoop/etc/hadoop
```

编辑 hadoop-env.sh，配置 JDK 路径和用户身份：

```bash
vim hadoop-env.sh
```

找到 `JAVA_HOME` 那一行（通常在文件末尾附近），改成：

```bash
export JAVA_HOME=/opt/module/jdk-21.0.11
```

然后追加以下用户身份声明（防止 Hadoop 用 root 跑）：

```bash
export HDFS_NAMENODE_USER=hadoop
export HDFS_DATANODE_USER=hadoop
export HDFS_SECONDARYNAMENODE_USER=hadoop
export YARN_RESOURCEMANAGER_USER=hadoop
export YARN_NODEMANAGER_USER=hadoop
```

> 这五行是 **必写** 的。Hadoop 3.x 默认拒绝 root 启动这些守护进程。不写会报 `ERROR: Attempting to operate on hdfs namenode as root`。

### 1.11 配置 core-site.xml

这个文件定义 HDFS 的核心参数——NameNode 地址和临时目录：

```bash
vim core-site.xml
```

在 `<configuration>` 标签内写入：

```xml
<property>
  <name>fs.defaultFS</name>
  <value>hdfs://master:8020</value>
</property>
<property>
  <name>hadoop.tmp.dir</name>
  <value>/opt/module/hadoop/tmp</value>
</property>
```

> `fs.defaultFS` 的值 `hdfs://master:8020` 是整个集群的"入口地址"。所有客户端通过这个地址找 NameNode。
>
> `hadoop.tmp.dir` 是 NameNode 和 DataNode 存元数据和数据块的目录。**必须指定**，否则默认存到 `/tmp` 下，重启就被系统清掉了，所有 HDFS 数据丢失。

### 1.12 配置 hdfs-site.xml

这里只配一个参数——SecondaryNameNode 的位置：

```bash
vim hdfs-site.xml
```

```xml
<property>
  <name>dfs.namenode.secondary.http-address</name>
  <value>master:50090</value>
</property>
```

> SecondaryNameNode 不是 NameNode 的"热备"，它的作用是**定期合并 edits log 和 fsimage**，减少 NameNode 重启时的恢复时间。放在 master 上因为根据角色规划表它就在 master。

### 1.13 配置 mapred-site.xml

MapReduce 跑在 YARN 上，所以要指定框架为 yarn：

```bash
vim mapred-site.xml
```

```xml
<property>
  <name>mapreduce.framework.name</name>
  <value>yarn</value>
</property>
```

> `mapreduce.framework.name` 有三个可选值：`local`（本地模式，单机）、`classic`（老 MRv1）、`yarn`（MRv2）。比赛用完全分布式，必须写 `yarn`。

### 1.14 配置 yarn-site.xml

YARN 的 ResourceManager 地址和 NodeManager 辅助服务：

```bash
vim yarn-site.xml
```

```xml
<property>
  <name>yarn.resourcemanager.hostname</name>
  <value>master</value>
</property>
<property>
  <name>yarn.nodemanager.aux-services</name>
  <value>mapreduce_shuffle</value>
</property>
```

> `mapreduce_shuffle` 是 MapReduce 的 shuffle 阶段需要的辅助服务。**不写这行，Map 的输出没法传给 Reduce**，所有 MR 作业全部失败。这是配置里最容易被忽略但后果最严重的参数。

### 1.15 配置 workers 文件

告诉 Hadoop 哪些节点跑 DataNode 和 NodeManager：

```bash
vim workers
```

写上三行（每行一个主机名）：

```
master
slave1
slave2
```

> 旧版本的 Hadoop 这个文件叫 `slaves`，3.x 改名为 `workers`。注意 master 也要写上——根据角色规划表，master 同时也是 DataNode。

### 1.16 分发配置到 slave 节点

所有配置文件在 master 上改好后，scp 到 slave：

```bash
scp -r /opt/module/hadoop/etc/hadoop/* root@slave1:/opt/module/hadoop/etc/hadoop/
```

```bash
scp -r /opt/module/hadoop/etc/hadoop/* root@slave2:/opt/module/hadoop/etc/hadoop/
```

> 为什么用 `*` 通配符？因为配置文件有七八个，一个个传容易漏。`*` 一把全过去最稳妥。

别忘记 slave 节点上也要改属主：

```bash
# 在 slave1 和 slave2 上分别执行
chown -R hadoop:hadoop /opt/module/hadoop
```

### 1.17 格式化 NameNode 并启动集群

**首次启动必须格式化**，否则 NameNode 没有元数据无法工作：

```bash
hdfs namenode -format
```

> **格式化只能做一次！** 如果集群已经在运行、存了数据，再次格式化会清空所有 HDFS 数据。看到日志末尾出现 `Storage directory ... has been successfully formatted` 就说明成功了。

启动所有 Hadoop 进程：

```bash
start-all.sh
```

> `start-all.sh` 同时启动 HDFS（NameNode + DataNode + SecondaryNameNode）和 YARN（ResourceManager + NodeManager）。也可以分开用 `start-dfs.sh` 和 `start-yarn.sh`，比赛用前者更快。

验证所有进程是否都在：

```bash
jps
```

> `jps`（Java Process Status）列出所有 Java 进程。master 上应该看到 6 个：NameNode、DataNode、SecondaryNameNode、ResourceManager、NodeManager、Jps 自身。slave 上应该看到 3 个：DataNode、NodeManager、Jps。
>
> 缺了某个进程？回去逐项检查对应配置文件，最常见的原因：
> - DataNode 没起来 → 检查 `workers` 文件
> - ResourceManager 没起来 → 检查 `yarn-site.xml` 的 `yarn.resourcemanager.hostname`
> - 所有从节点都没起来 → 检查 SSH 免密

---

## 模块二：数据获取与清洗

比赛提供一个 CSV 文件 `bike_rides.csv`（共享单车骑行数据），字段包括：

> 骑行ID、单车编号、用户ID、开始时间、结束时间、起始位置、结束位置、骑行距离(km)、骑行时长(分钟)、天气状况、温度、周末标记

### 2.1 第一印象：看看数据长啥样

拿到数据不要急着写清洗逻辑，先用几行代码摸清底细：

**第一步，读取文件并看形状：**

```python
import pandas as pd
df = pd.read_csv('bike_rides.csv')
print(f"行数: {df.shape[0]}, 列数: {df.shape[1]}")
```

> `df.shape` 返回 `(行数, 列数)` 元组。如果行数是 0 说明文件读失败了，检查文件名和路径。

**第二步，看每列的数据类型：**

```python
print(df.dtypes)
```

> 关注两件事：1) 时间列是不是 object 类型（需要转 datetime）；2) 数值列是不是 int/float（如果不是说明里面有脏数据）。

**第三步，看前 10 行样本：**

```python
print(df.head(10).to_string())
```

> `.to_string()` 是保险措施——Pandas 默认会截断列宽，用 `to_string()` 能看到完整内容。在比赛里截图提交时尤其重要，截出来的图列多行少考官看不清就得扣分。

**第四步，检查缺失值：**

```python
print(df.isnull().sum())
```

> `.isnull().sum()` 统计每列缺了多少个值。哪个列缺失多，后面清洗就重点照顾它。

**第五步，看数值列的基本统计量：**

```python
print(df[['骑行距离(km)', '骑行时长(分钟)']].describe())
```

> `describe()` 输出 count、mean、std、min、25%、50%、75%、max。快速判断数据范围是否合理。

### 2.2 数据清洗（7 步流水线）

每条清洗规则单独执行、单独保存文件。

**C1 — 删除骑行距离缺失或为 0 的记录：**

```python
o_count = len(df)
df = df.dropna(subset=['骑行距离(km)'])
df = df[df['骑行距离(km)'] > 0]
deleted = o_count - len(df)
df.to_csv(f'cleaned_data_c1_{deleted}.csv', index=False, encoding='utf-8-sig')
```

> `dropna(subset=[...])` 只检查指定列的空值。`encoding='utf-8-sig'` 是为了 Excel 打开不乱码（BOM 头）。

**C2 — 补全天气状况缺失值：**

```python
most_common = df['天气状况'].mode()[0]
modified = df['天气状况'].isnull().sum()
df['天气状况'] = df['天气状况'].fillna(most_common)
df.to_csv(f'cleaned_data_c2_{modified}.csv', index=False, encoding='utf-8-sig')
```

> `.mode()[0]` 取第一个众数。用 `[0]` 是因为可能有多个众数（并列第一）。

**C3 — 删除异常骑行时长：**

```python
o_count = len(df)
df = df[(df['骑行时长(分钟)'] >= 1) & (df['骑行时长(分钟)'] <= 1440)]
deleted = o_count - len(df)
df.to_csv(f'cleaned_data_c3_{deleted}.csv', index=False, encoding='utf-8-sig')
```

> 少于 1 分钟可能是误触；超过 1440 分钟（24h）大概率是系统 bug。

**C4 — 删除异常骑行距离：**

```python
o_count = len(df)
df = df[(df['骑行距离(km)'] > 0) & (df['骑行距离(km)'] <= 50)]
deleted = o_count - len(df)
df.to_csv(f'cleaned_data_c4_{deleted}.csv', index=False, encoding='utf-8-sig')
```

> 超过 50km 对于共享单车极度不合理。

**C5 — 删除时间逻辑错误：**

```python
df['开始时间'] = pd.to_datetime(df['开始时间'])
df['结束时间'] = pd.to_datetime(df['结束时间'])
o_count = len(df)
df = df[df['结束时间'] >= df['开始时间']]
deleted = o_count - len(df)
df.to_csv(f'cleaned_data_c5_{deleted}.csv', index=False, encoding='utf-8-sig')
```

> **先转成 datetime 再比较**。如果直接按字符串比较结果不可靠。

**C6 — 去重：**

```python
o_count = len(df)
df = df.drop_duplicates()
deleted = o_count - len(df)
df.to_csv(f'cleaned_data_c6_{deleted}.csv', index=False, encoding='utf-8-sig')
```

**C7 — 删除同位长时间记录：**

```python
mask = (df['起始位置'] == df['结束位置']) & (df['骑行时长(分钟)'] > 5)
deleted = mask.sum()
df = df[~mask]
df.to_csv(f'cleaned_data_c7_{deleted}.csv', index=False, encoding='utf-8-sig')
```

> 起止位置相同且超过 5 分钟，很可能是骑了一圈回来或数据录入错误。

### 2.3 数据标注

**标注一：骑行距离分类**

```python
def classify_distance(d):
    if d < 2: return '短途'
    elif d <= 5: return '中途'
    else: return '长途'
df['距离分类'] = df['骑行距离(km)'].apply(classify_distance)
```

> 2-5 公里的"中途"是共享单车的核心场景——太短不如走路，太长不如打车。

**标注二：时段热度标注**

```python
df['开始时间'] = pd.to_datetime(df['开始时间'])

def classify_period(row):
    h = row['开始时间'].hour
    if row['周末标记'] == 1: return '低峰时段'
    if (7 <= h < 9) or (17 <= h < 19): return '高峰时段'
    elif (9 <= h < 17) or (19 <= h < 22): return '平峰时段'
    else: return '低峰时段'

df['时段热度'] = df.apply(classify_period, axis=1)
```

> `axis=1` 按行 apply，函数里能同时取到开始时间和周末标记两列。

### 2.4 HDFS & MapReduce 操作

**创建 HDFS 目录并上传：**

```bash
hdfs dfs -mkdir -p /bike_data/records /bike_data/statistics
hdfs dfs -chmod -R 777 /bike_data
hdfs dfs -put /tmp/bike_rides.csv /bike_data/records/
```

**WordCount 单词统计：**

```bash
hdfs dfs -mkdir -p /user/hadoop/input
hdfs dfs -put /var/log/dmesg /user/hadoop/input/
hadoop jar hadoop-mapreduce-examples-3.5.0.jar wordcount /user/hadoop/input/dmesg /user/hadoop/output
```

**查看 Top 10 高频词：**

```bash
hdfs dfs -cat /user/hadoop/output/part-r-* | sort -k2 -nr | head -10
```

**指定 2 个 Reducer：**

```bash
hadoop jar hadoop-mapreduce-examples-3.5.0.jar wordcount -D mapreduce.job.reduces=2 /user/hadoop/input/dmesg /user/hadoop/output2
```

> `-D mapreduce.job.reduces=2` 设置 Reducer 数量。越多并行度越高，但 shuffle 网络开销也增大。

**计算 Pi 值：**

```bash
hadoop jar hadoop-mapreduce-examples-3.5.0.jar pi 16 10000
```

> 参数 16=Map 任务数，10000=每个 Map 的采样点。演示蒙特卡洛算法。

**Grep 正则匹配：**

```bash
hdfs dfs -mkdir -p /user/hadoop/grep_input
hdfs dfs -put /var/log/dmesg /user/hadoop/grep_input/
hadoop jar hadoop-mapreduce-examples-3.5.0.jar grep /user/hadoop/grep_input /user/hadoop/grep_output "system.*"
```

> `"system.*"` 匹配以 system 开头的词。Hadoop 版 grep 分布式执行，展示"分而治之"思想。

**TeraSort 基准测试：**

```bash
hadoop jar hadoop-mapreduce-examples-3.5.0.jar teragen 100000 /user/hadoop/terasort-input
hadoop jar hadoop-mapreduce-examples-3.5.0.jar terasort /user/hadoop/terasort-input /user/hadoop/terasort-output
hadoop jar hadoop-mapreduce-examples-3.5.0.jar teravalidate /user/hadoop/terasort-output /user/hadoop/teravalidate-output
```

---

## 模块三：业务分析与可视化

基于清洗完成的 `final_cleaned_data.csv`，用 Pandas + Matplotlib 完成 5 项统计 + 5 张图表。

### 3.1 中文字体配置

```python
import matplotlib
matplotlib.rcParams['font.sans-serif'] = ['SimHei', 'Microsoft YaHei']
matplotlib.rcParams['axes.unicode_minus'] = False
```

### 3.2 五项统计分析

**分析一 — 每小时平均骑行量 Top 3：**

```python
df['小时'] = df['开始时间'].dt.hour
df['日期'] = df['开始时间'].dt.date
total = df.groupby('小时')['骑行ID'].count()
days = df.groupby('小时')['日期'].nunique()
avg = (total / days).sort_values(ascending=False)
print(avg.head(3))
```

**分析二 — 不同天气下的骑行表现：**

```python
weather_stats = df.groupby('天气状况').agg(
    平均骑行时长=('骑行时长(分钟)', 'mean'),
    平均骑行距离=('骑行距离(km)', 'mean')
).round(2)
```

**分析三 — 工作日 vs 周末对比：**

```python
comparison = df.groupby('周末标记').agg(
    骑行次数=('骑行ID', 'count'),
    平均时长=('骑行时长(分钟)', 'mean'),
    平均距离=('骑行距离(km)', 'mean')
).round(2)
```

**分析四 — 最热门区域 Top 5：**

```python
print('上车Top5:', df['起始位置'].value_counts().head(5))
print('下车Top5:', df['结束位置'].value_counts().head(5))
```

**分析五 — 温度对骑行量的影响：**

```python
bins = [-float('inf'), 0, 10, 20, 30, float('inf')]
labels = ['0度以下', '0-10度', '10-20度', '20-30度', '30度以上']
df['温度区间'] = pd.cut(df['温度'], bins=bins, labels=labels)
daily = df.groupby(['日期', '温度区间']).size().reset_index(name='日骑行量')
result = daily.groupby('温度区间')['日骑行量'].mean().round(2)
```

### 3.3 五张可视化图表

**图表一 — 柱状图：骑行量 Top 5 区域**

```python
top5 = df['起始位置'].value_counts().head(5)
fig, ax = plt.subplots(figsize=(12, 6))
bars = ax.bar(range(len(top5)), top5.values, color=['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7'])
ax.set_xticks(range(len(top5)))
ax.set_xticklabels(top5.index, rotation=15)
ax.set_title('主要区域骑行量统计', fontsize=16, fontweight='bold')
for bar, v in zip(bars, top5.values):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1, str(v), ha='center', fontweight='bold')
```

**图表二 — 折线图：连续 7 天骑行量趋势**

```python
daily_stats = df.groupby(['日期', '周末标记'])['骑行距离(km)'].sum().reset_index()
dates = sorted(daily_stats['日期'].unique())[:7]
# 蓝线工作日 marker='o'，红线周末 marker='s'
```

**图表三 — 水平条形图：四时段平均骑行时长**

```python
df['时间段'] = df['小时'].apply(lambda h: '早高峰' if 7<=h<9 else '日间' if 9<=h<17 else '晚高峰' if 17<=h<19 else '夜间')
period_avg = df.groupby('时间段')['骑行时长(分钟)'].mean().sort_values()
ax.barh(range(len(period_avg)), period_avg.values, color=['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4'])
```

**图表四 — 散点图：距离 vs 时长**

```python
ax.scatter(df['骑行距离(km)'], df['骑行时长(分钟)'], color='blue', alpha=0.3, s=10, edgecolors='white', linewidth=0.3)
```

> `alpha=0.3` 低透明度看密度分布，`s=10` 控制点大小。

**图表五 — 饼图：天气状况骑行量比例**

```python
weather_counts = df['天气状况'].value_counts()
ax.pie(weather_counts.values, labels=weather_counts.index, autopct='%1.1f%%', startangle=90)
```

> `autopct='%1.1f%%'` 标注百分比保留 1 位小数。`startangle=90` 从 12 点钟方向开始。

---

## 踩坑备忘（血泪总结）

**环境类：**

1. **JDK 路径用 `pwd` 复制，不要手写。** 手写少一个数字就找不到
2. **环境变量放单独文件** `/etc/profile.d/myenv.sh`，不要直接改 `/etc/profile`
3. **`$PATH:` 放前面，不是后面。** `PATH=$JAVA_HOME/bin` = 覆盖 = 全崩
4. **配错急救：`export PATH=/usr/bin:/usr/sbin`**，能恢复基础命令
5. **SSH 免密不要漏：root + hadoop 两个用户都要在三台机器之间互相免密**
6. **解压别加 -v，截图没法看**

**Hadoop 类：**

7. **格式化 NameNode 只能做一次。** 第二次格式化清空所有 HDFS 数据
8. **`yarn-site.xml` 的 `mapreduce_shuffle` 必须写。** 漏了它所有 MR 任务失败
9. **master 也要写进 `workers` 文件。** master 同时也是 DataNode
10. **`jps` 验证进程是关键步骤。** 缺哪个进程回去逐项查配置

**Python 类：**

11. **数据清洗记得先备份原始行数，再算删除量**
12. **时间列比较前必须先 `pd.to_datetime()`**
13. **Matplotlib 中文字体：头两行必须写 `font.sans-serif` 配置**
14. **截图只截关键区域**，整屏截考官看不清细节
*/})
];

function renderMarkdown(md) {
  var lines = md.split('\n');
  var html = '';
  var inCodeBlock = false, codeContent = '';
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
        html += '<pre><code>' + codeContent.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</code></pre>';
        codeContent = '';
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
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

    if (line.startsWith('> ')) {
      html += '<blockquote>' + parseInline(line.replace(/^>\s?/, '')) + '</blockquote>';
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

(function() {
  var navItems = document.querySelectorAll('.blog-nav-item');
  var content = document.getElementById('articleContent');

  function showArticle(idx) {
    content.innerHTML = renderMarkdown(articles[idx]);
    content.style.animation = 'none';
    content.offsetHeight;
    content.style.animation = 'fadeUp .4s ease both';
    navItems.forEach(function(item, i) {
      item.classList.toggle('active', i === idx);
    });
  }

  navItems.forEach(function(item) {
    item.addEventListener('click', function() {
      showArticle(parseInt(this.getAttribute('data-idx')));
    });
  });

  showArticle(0);
})();

var _tr_usler_md = document.querySelector('[data-tr-usler]');

var _tr_usler_md = document.querySelector("[data-tr-usler]");
