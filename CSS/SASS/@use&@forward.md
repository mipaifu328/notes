# @use & @forward

## @use

`@import正在被更明确@use的@forward规则所取代`。

@import 的一些问题：

- @import 也是一个 CSS 特性，并且差异可能会令人困惑
- 如果@import 多次使用同一个文件，它会减慢编译速度，导致覆盖冲突，并生成重复输出。
- 一切都在全局命名空间中，包括第三方包——所以我的 color()函数可能会覆盖你现有的 color()函数，反之亦然。
- 当您使用类似 color(). 不可能确切地知道它是在哪里定义的。@import 它来自哪个？

@use 特点：

- 该文件只导入一次，无论您@use 在项目中导入多少次。
- 以下划线 (\_) 或连字符 (-)开头的 变量, mixins, and functions（Sass 称之为“成员”）会被认为是私有的，并且不被导入。
- 当前导入的文件变量方法等（例如@use buttons.scss 里的成员）仅在页面可以使用，不会传递给后面导入文件使用。
- 同样，@extends 只会申请上链；在导入的文件中扩展选择器，但不扩展导入该文件的文件。
- 默认情况下，所有导入的成员都有命名空间。

```scss
// foundation/_code.scss
code {
  padding: 0.25em;
  line-height: 0;
}

// src/_corners.scss
$radius: 3px;

@mixin rounded {
  border-radius: $radius;
}

// foundation/_lists.scss
ul,
ol {
  text-align: left;

  & & {
    padding: {
      bottom: 0;
      left: 0;
    }
  }
}

// style.scss
@use 'foundation/code';
@use 'foundation/lists';
@use 'src/corners' as c;
// 使用时需加入命名空间如 corners.$radius
// 或者直接@use ‘src/corners’ as *
.button {
  @include c.rounded;
  padding: 5px + c.$radius;
}
```

编译后如下：

```css
code {
  padding: 0.25em;
  line-height: 0;
}

ul,
ol {
  text-align: left;
}
ul ul,
ol ol {
  padding-bottom: 0;
  padding-left: 0;
}

.button {
  border-radius: 3px;
  padding: 8px;
}
```

## @forword

@use 只能当前文件使用，若要多个文件共享则需要使用@forward

```scss
// src/_list.scss
@mixin list-reset {
  margin: 0;
  padding: 0;
  list-style: none;
}

// bootstrap.scss
@forward 'src/list';

// styles.scss
@use 'bootstrap';

li {
  @include bootstrap.list-reset;
}
```

编译后：

```css
li {
  margin: 0;
  padding: 0;
  list-style: none;
}
```

## 参考

[sass @use 文档](https://sass.bootcss.com/documentation/at-rules/use)

[介绍 Sass 模块 | CSS-TRICKS](https://css-tricks.com/introducing-sass-modules/)
