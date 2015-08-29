---
title: JavaScript 基本语法
author: cnsystem
layout: post
permalink: /js-basic-grammer.html
categories:
  - JavaScript
---
今天下了一本《JavaScript高级程序设计》来看，终于明白以前一些不明白的问题。

在说这那些不明白的问题之前，不得不说一下JavaScript与EMCAScript。

ECMAScript是由ECMA-262标准化的脚本语言的名称。JavaScript和JScript与ECMAScript相容，但包含超出ECMAScript的功能。JavaScript是ECMA-262标准的实现和扩展。正是因为JavaScript符合ECMA-262标准，才让它看起来有点晦涩。ECMA-262标准和C、C++差别，我们用C、C++的编程习惯去看待JavaScript才会看得云里雾里。

1.变量

JavaScript分原始值和引用值。原始类型Undefined,Null,Number,String,Boolean。Undefined类型只有一个值undefined,变量没有初始化即为undefined。

JavaScript中变量是弱类型。

变量在初始化时可以不用声明，为全局变量。如oTest=&#8221;asdfasdf&#8221;，这里没有用var声明oTest，但oTest是一个全局变量。

2.Function

JavaScript中函数没有重载。

argument对象。在函数代码中，使用特殊对象argument，开发者可以无需指出参数名，也可访问它们。argument[0]访问第一个参数，argument[1]访问第二个。。。。如

function alertArg(){

var n=argument.length;

for(var i=0;i<n;i++) alert(argument[i]);

}

alertArg(&#8216;hello&#8217;,&#8217;zhengbo&#8217;)//&#8212;-将弹出&#8217;hello&#8217;消息框，然后再弹出&#8217;zhengbo&#8217;消息框。

Function类。在JavaScript里，所有的东西都可以看成对象，函数也不例外。

var function_name=new Function(argument1,argument2,&#8230;&#8230;argument1N,functionbody);

每个argument都是一个参数，最后一个参数是函数主体。所以下面两种函数声明是等效的。

function sayHi(name){ alert(&#8220;hello,&#8221;+name); }

var sayHi=new Function( name, &#8221; alert( \&#8221; hello, \&#8221; +name); &#8220;) ;

这里函数sayHi是一个对象，也是一个引用类型变量，而sayHi引用函数的地址。既然sayHi是一个地址，自然可以做为参数。如

function callAnthorFn(fnArg,sName) { fnArg(sName); }

callAnthorFn(sayHi,&#8221;zhengbo&#8221;);//&#8211;输出hello,zhengbo

闭包。所谓闭包，是指词法表示包括不必计算的变量的函数，也就是说，该函数能使用函数外定义的变量。