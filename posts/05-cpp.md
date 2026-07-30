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
