The name does not matter
========

## Whispers

### 见心见性

#### Javascript确有神奇之处

照抄Java却没有「命名空间」或「包」。

作用域只有全局和函数两种。自动提升变量的声明，并且不提升变量的定义。

有时需要typeof/instanceof/Object.prototype.toString联合才能判断基础数据类型。

类是函数，指回却依赖原型链上的可写变量。

各种无与伦比的隐式类型转换。

(太多了)

#### 但nodejs也是一朵奇葩

现代语言都需要封装，不愿污染全局命名空间。nodejs采用「文件内容作构造函数体」的做法。只不过传递结果时没敢用return，用的是调用时传入的变量module。

在浏览器上如何为每个文件分别模拟一个module变量？

说不得还得引别的库。或者，if (typeof(module) != "undefined") ... 唉。

#### 前端就是喜欢造轮子啊

没错。写javascript的时候我也喜欢。

### CANNOT BE MORE STUPID

Around 2014 I have an abstraction, as elegant as it could ever be.

```js
P.ask("mod1", "mod2", ...).answer("newMod", function(mod1Result, mod2Result, ...) {
    ...
});
```

I implement it in javascript for web pages.

I implement it in lua as an addon framework for _World of Warcraft_.

I am satisfied and pleased for years.

UNTIL I SEE _REQUIREJS_.

#### But there are something different, I believe

整体较为精致小巧，事件依赖的设计逻辑上有些许可观之处，用定时器的实现的自调度略显简明。

此外，这些年来对动态语言的一些思考和积累，也一并汇集到这里，作为纪念，以及思想的一点证明。

## Contents

#### Cmap.js

此扩充了以「集合」为主体的操作。

#### \_G.js

命名全局作用域并补充api。

#### import.js

重新设计的类与继承、对象的导入导出。
- class is kind of object rather than function
- class is object's prototype
- class' prototype is super class
- class supervises constructor
- class import() and export()

#### P.js

依赖、调度和加载框架。

#### adt/

一些(基本上)独立的类。
