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
