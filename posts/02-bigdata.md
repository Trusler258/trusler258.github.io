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

  