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
