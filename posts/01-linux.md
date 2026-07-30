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
