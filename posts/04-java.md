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
