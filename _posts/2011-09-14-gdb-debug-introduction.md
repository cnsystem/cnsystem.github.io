---
title: GDB调试说明
author: cnsystem
layout: post
permalink: /gdb-debug-introduction.html
categories:
  - Linux
tags:
  - Linux编程
  - 调试
---
GDB可算做是Linux-GCC系列编译器附带的Debug工具.

要用GDB调试程序只需要在Shell-Command下输如类似 gdb xxx.exe即可.

(这里强调一点, 在编译的时候, 需要加入参数-g来支持debug, 例如gcc -g xxx.c -o xxx.exe)

出现gdb提示后, 可以先用 &#8220;l &#8221; (list) 来查看src, 然后在某行加上断点 &#8220;b 21&#8221; (break at line 21)

接下来, 运行程序 &#8220;r&#8221; (run) 即可, 这时程序会自动停留到断点处,

如果想继续运行, 则键入 &#8220;c&#8221; (continue)

查看变量用 p ( p var1)

设置变量用 set (set var1=&#8221;abc&#8221;)

跳到某行用 jump (jump 21)

进入一个Function内部, 用 s (step into)

Step-by-Step运行则用 n (next)

print 检查各个变量的值(gdb) print p (p为变量名)

whatis 显示某个变量的类型 (gdb) whatis p

断点(breakpoint)

break line-number 使程序恰好在执行给定行之前停止。

break function-name 使程序恰好在进入指定的函数之前停止。

break line-or-function if condition 如果condition（条件）是真，程序到达指定行或函数时停止。

break routine-name 在指定例程的入口处设置断点

(gdb) break filename:line-number 如果该程序是由很多原文件构成的，在各个原文件中设置断点

(gdb) break filename:function-name

要想设置一个条件断点，可以利用break if命令，如下所示：

(gdb) break line-or-function if expr 例：(gdb) break 46 if testsize==100

countinue 命令断点继续运行

显示当前gdb的断点信息： (gdb) info break

删除指定的某个断点： (gdb) delete breakpoint 1 该命令将会删除编号为1的断点，

如果不带编号参数，将删除所有的断点 (gdb) delete breakpoint

禁止使用某个断点 (gdb) disable breakpoint 1 该命令将禁止断点 1,同时断点信息的 (Enb)域将变为 n

允许使用某个断点 (gdb) enable breakpoint 1 该命令将允许断点 1,同时断点信息的 (Enb)域将变为 y

清除原文件中某一代码行上的所有断点 (gdb)clean number

注：number 为原文件的某个代码行的行号