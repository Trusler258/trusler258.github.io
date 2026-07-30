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
