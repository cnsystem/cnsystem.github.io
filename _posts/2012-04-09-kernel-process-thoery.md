---
title: 内核实现理论篇之进程基本概念
author: cnsystem
layout: post
permalink: /kernel-process-thoery.html
categories:
  - 操作系统
---
进程是计算机中已运行程序的实体，是操作系统进行资源分配和调度的一个独立单位。多任务操作系统中存在多个进程，通过时间共享（在微观上一个或若干个时间片内处理器由一个进程占有，时间片用完则进行调度），以实现在一个处理器上多个程序宏观并发执行。

目录：

  1. [进程的提出][1]
  2. [基本概念][2]
  3. [进程状态][3]
  4. [进程原语][4]
  5. [进程实体][5]

<span id="propose">1、进程的提出</span>  
并发、共享、虚拟和异步是操作系统的四个基本特征，计算机上的并发性是指在同一个时间里运行多个程序。在单核计算机里，只有一个处理器，操作系统把处理器的使用按时间片分配给各个运行中的程序，当时间片小到一程度，宏观上看来就是在同一时间内运行多个程序，以达到并发。显然这里的并发是宏观上的并发，微观上是分时的。

<span id="basic-concept">2、基本概念</span>  
那么“运行中的程序”就是进程，所以进程概念的提出是实现了在单核计算机里并发运行多个程序。<span style="color: #ff0000;">进程是在系统中能独立运行并作为资源资源分配的基本单位。</span>进程是运行中的程序，一个活动的实体，它包含程序的指令、数据、堆栈以及一些寄存器的值。而与之对应一个概念“程序”，我们可以理解为静态的二进制（或其它中间语言）的代码和数据。当程序被调入内存后，即程序运行后，就成了进程，被操作系统所调度、管理。

<div id="attachment_769" style="width: 490px" class="wp-caption aligncenter">
  <a href="http://blog.cnsystem.org/wp-content/uploads/2012/04/进程与程序.jpg"><img class=" wp-image-769 " title="进程与程序关系" src="http://blog.cnsystem.org/wp-content/uploads/2012/04/进程与程序.jpg" alt="进程与程序关系" width="480" height="135" /></a>
  
  <p class="wp-caption-text">
    图1 进程与程序关系
  </p>
</div>

<span id="status">3、进程的状态</span>  
处理器在一个时间片里只能有一个进程在运行，其它的进程都处于等调度状态中。那么进程就有状态，最简单的二状态模型，如图2所示。

<div id="attachment_775" style="width: 494px" class="wp-caption aligncenter">
  <a href="http://blog.cnsystem.org/wp-content/uploads/2012/04/二状态模型.jpg"><img class=" wp-image-775 " title="二状态模型" src="http://blog.cnsystem.org/wp-content/uploads/2012/04/二状态模型.jpg" alt="二状态模型" width="484" height="220" /></a>
  
  <p class="wp-caption-text">
    图2 二状态模型
  </p>
</div>

在这个模型中，一个进程只有两种状态，一种是运行状态（即当前运行），一种是非运行状态（即待调度）。运行状态的进程，单独占有处理器，执行其代码指令。运行状态的进程释放处理器，切换为非运行状态有三种情景：**1.主动释放，如请求的资源无法得到分配；2.时间片耗完；3.被中断，如优先级高的进程抢占。**非运行状态的进程等待当前运行状态的进程释放处理器，然后调度程序根据调度算法从进程队列中选择一个进程，占有处理器并切换状态。

对于待调度状态的进程，操作系统得有一个数据结构将其组织进行调度。所有待调度的进程组成了一队列，进程队列，如图3所示。

<div id="attachment_777" style="width: 540px" class="wp-caption aligncenter">
  <a href="http://blog.cnsystem.org/wp-content/uploads/2012/04/二模型进程队列.jpg"><img class=" wp-image-777 " title="二模型进程队列" src="http://blog.cnsystem.org/wp-content/uploads/2012/04/二模型进程队列.jpg" alt="二模型进程队列" width="530" height="128" /></a>
  
  <p class="wp-caption-text">
    图3 二状态进程队列
  </p>
</div>

为了使操作系统具有更好的性能，在二状态模型基础上，一种更为稍复杂的五状态模型被提了出来，如图4所示。

<div id="attachment_778" style="width: 655px" class="wp-caption aligncenter">
  <a href="http://blog.cnsystem.org/wp-content/uploads/2012/04/五状态模型.jpg" target="_blank"><img class=" wp-image-778 " title="五状态模型" src="http://blog.cnsystem.org/wp-content/uploads/2012/04/五状态模型.jpg" alt="五状态模型" width="645" height="209" /></a>
  
  <p class="wp-caption-text">
    图4 五状态模型
  </p>
</div>

此模型在二状态模型上多加了三种状态：创建、退出、阻塞。

  * 创建状态：进程刚被创建还没有被调入进程池中
  * 就绪状态：等待合适时机，被调度运行的进程
  * 运行状态：正在运行的进程
  * 阻塞状态：等待某事件发生的进程，如键盘输入进程一般处于阻塞，等待键盘将其激活
  * 退出状态：从进程池中调出的进程

有此操作系统还有挂起状态，此处就不作论述。

<span id="control">4、进程原语</span>

  * 创建进程原语
  * 销毁进程原语
  * 阻塞进程原语
  * 唤醒进程原语

<span id="process-image">5、进程实体</span>  
进程在OS中，包含代码段、数据段、堆栈段及进程控制块（PCB）。

  * 代码段：要执行的代码
  * 数据段：进程执行中要用到的、可修改的数据。包括程序的数据、用户栈和可修改的数据
  * 系统段：每个进程都 有一个或多个系统栈，用于保存参数、过程调用地址和系统调用地址。注：每个特权都与之对应着一个系统栈，详细的会在保护模式里会提到。
  * **<span style="color: #ff0000;">进程控制块（PCB）</span>**：可能包括以下信息 
      * 进程标识 
          * 内部标识　即进程ID，方便系统使用
          * 父进程标识　父进程ID
          * 用户标识　由创建者提供，用户访问时使用
      * 处理器状态 
          * 用户可见寄存器　处于用户模式下的处理器执行机器指令可以访问的寄存器，即通用寄存器（EAX,EBX……）
          * 控制和状态寄存器　程序计数器（PC），条件码，状态信息（EFLAGS）
          * 栈指针
      * 进程控制信息 
          * 调度和状态信息　如进程状态、优先级、调度信息（依赖于调度算法）、事件（阻塞时等待发生的事件标识）
          * 数据结构　进程可以以队列、环、或某些别的结构形式与其他进程进行链接，如进程处在就绪队列中；子进程与父进程的关系
          * 进程间通信　与两个独立进程间的通信相关的有各种标记、信号和消息。进程控制块中维护着某些或全部此类信息
          * 进程特权　进程根据其可以访问的内存空间以及可以执行的指令类型被 赋予各种特权
          * 存储管理　描述分配给进程的虚拟内存的段表和页表的指针
          * 资源的所有权和使用情况　进程占有的资源以及使用情况，如文件、处理器、IO或其它

进程在系统中以进程实体（Process Image）出现，其中进程控制块是进程管理和进程调度的主要部分，进程控制块又描述了进程占有的资源：内存、文件、设备。操作系统中进程实体和资源关系如图5所示。

<div id="attachment_783" style="width: 440px" class="wp-caption aligncenter">
  <a href="http://blog.cnsystem.org/wp-content/uploads/2012/04/操作系统控制结构.jpg" target="_blank"><img class=" wp-image-783  " title="进程与资源" src="http://blog.cnsystem.org/wp-content/uploads/2012/04/操作系统控制结构-1024x481.jpg" alt="进程与资源" width="430" height="202" /></a>
  
  <p class="wp-caption-text">
    图5 进程与资源
  </p>
</div>

 [1]: #propose
 [2]: #basic-concept
 [3]: #status
 [4]: #control
 [5]: #process-image