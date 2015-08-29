---
title: 微内核的实现
author: cnsystem
layout: post
permalink: /microkernel-implementation.html
categories:
  - 操作系统
tags:
  - 保护模式
  - 微内核
  - 操作系统
---
毕业设计是微内核的分析与实现。  
其实说到分析还没有那个水平，为了题目好看才加上去的。

先前一直在看书，也没有更新博客。目前基础知识也算告一段落了，不甚仔细的看了一遍。有些地方不是很明白，再看看别人的代码，再理解反思。准备写一系列博文：先是基础篇，梳理理论知识；然后是实战篇，纪录coding过程。  
基础知识主要有以下几个部分：

  1. 操作系统原理 （《计算机操作系统》汤子赢） 
      * 进程概念(Process Description)
      * 进程同步(Concurrency)
      * 进程通信(IPC)
      * 进程调度(Process Scheduling)
      * 内存分配(Memory Allocation)
      * 内存管理(Memory Management)
      * 虚拟内存(Virtual Memory)
  2. 保护模式  （《80X86汇编语言程序设计教程》杨季文） 
      * 386的寄存器
      * 描述符分类
      * 操作系统类指令
      * 保护之分段管理机制
      * 保护之特权级变换
      * 输入输出保护
  3. 系统引导及初始化 
      * 系统引导  以前有一篇博文，很简单 [《简易引导扇区》][1]
      * 初始化  实模式和保护模式之间的切换

其他参考资料：

  1. 《自己动手写操作系统》 于渊
  2. 《操作系统精髓与设计原理》 william stallings
  3. 《IA-32 intel架构软件开发人员手册》

&nbsp;

<span style="color: #ff0000;">PS:本着毕业设计，并限于个人能力，以上内容仅供参考。此不涉及内容：文件系统，图形界面，设备驱动；基于386、单核心（single processor）、多任务（multi task)，输入输出仅限于键盘、显示器。</span>

 [1]: http://blog.cnsystem.org/easy-boot-section.html