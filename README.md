The name does not matter
========

#### (Javascript确有奇怪之处)

作用域只有全局和函数两种，没有「命名空间」或者「包」，这是向C靠拢。

提供了模板系统，却没有要求构成模板的要素在物理上临近，这是对齐C++。

#### (但nodejs也是一朵奇葩)

现代语言都需要封装，不愿污染全局命名空间，于是nodejs看向了java，才有了「把整个文件当作一个「模块」，将其内容作为构造函数，记录返回的对象作为模块实例」的做法。

这个构造函数的封装是nodejs约定的，用户看不到，也就没法让浏览器看到。

还不提供include。

于是，想要打通前后端的nodejs，却未能实现前后端文件级别的复用。:-)

### CANNOT BE MORE STUPID

Around 2014 I have an abstraction, as elegant as it could ever be.

```js
P.ask("mod1", "mod2", ...).answer("newMod", function(mod1Result, mod2Result, ...) {
    ...
});
```

I implement it in javascript for web pages.

I implement it in lua as an addon framework for _World of Warcraft_.

I am satisfied with it for years.

UNTIL I SEE _REQUIREJS_.

### But there are something different, I believe

整体较为精致小巧，事件依赖的设计逻辑上有些许可观之处，用定时器的实现的自调度也显简明。

Also, the thoughts and code fragments came to me during these years, converge into this library.

> 做了一些简化和优化，作为纪念，以及思想的一点证明。
