---
title: Linux内核的原子操作
author: cnsystem
layout: post
permalink: /atomic-operation.html
categories:
  - Linux
  - 操作系统
tags:
  - Linux
  - Linux编程
  - 操作系统
---
目录

  1. [基本概念][1]
  2. [原子整数操作][2]
  3. [原子位操作][3]

<a name="basic-concept"></a>  
<span>1、基本概念</span>

原子操作可以保证指令以原子的方式执行，执行过程不被打断。它通过把读取和修改变量的行为包含在一个单步中执行，从而防止了竞争的发生，保证操作结果总是一致的。

例如：

int i=9;

<div style="width: 50%; float: left;">
  <p>
    线程1：
  </p>
  
  <p>
    i++
  </p>
  
  <p>
    i=9 OR i=8
  </p>
</div>

<div style="width: 50%; float: left; clear: right;">
  <p>
    线程2
  </p>
  
  <p>
    i&#8211;;
  </p>
  
  <p>
    i=9 OR i=8
  </p>
</div>

两个线程并发的执行，导致结果不确定性。原子操作的作用和信号量机制是一样，都是为了防止同时访问临界资源，保证结果的一致性。大多数硬件体系结构要么本来就支持简单的原子操作，要么就为音频执行提供了锁内在总线的指令，例如x86平台上，就支持CPU锁总线操作，汇编指令前缀“LOCK&#8221;就可以将总线锁作，直到指令结束时锁打开；而有些硬件体系结构本身就不太支持原子操作，比如SPARC，但是Linux内核通过一些方法，做到了原子操作。

原子操作在Linux内核里分为原子整数操作和原子位操作，下面我们来看看这两个操作用法。  
<a name="integer"></a>  
<span>2、原子整数操作</span>

针对整数的原子操作只能对atomic_t类型的数据进行处理，之所以没有用C语言的int类型，主要有两个原因：

1、让原子函数只接受atomic_t类型的操作数，可以确保原子操作只与这种特殊类型数据一起使用，防止该类型数据不会传给其它非原子操作

2、使用atomic_t类型确保编译器不对相应的值进行访问优化

3、在不同体系结构上实现原子操作的时候，使用atomic_t可以屏蔽其间的差异。

尽管Linux的整型数据都是32位的，但是使用atomic\_t的代码只能将将该类型的数据当作24位来用，我们看看atomic\_t的数据

<div style="width: 100%; text-align: center; float: clear;">
  <p>
    ｜＋－＋－＋－＋－＋－＋－＋－＋－＋－＋－＋－＋－＋－＋－＋－＋－｜
  </p>
  
  <p>
    ｜　　　　　　带符号２４位整形数据　　　　　　　　｜　　　锁　　　｜
  </p>
  
  <p>
    ｜＋－＋－＋－＋－＋－＋－＋－＋－＋－＋－＋－＋－＋－＋－＋－＋－｜
  </p>
  
  <p>
    ｜１０９８７６５４３２１０９８７６５４３２１０９８７６５４３２１０｜
  </p>
  
  <p>
    ｜　３　　　　　　　　　２　　　　　　　　　１　　　　　　　　　　｜
  </p>
  
  <p>
    ｜　　　　　　　　　　　　３２位ａｔｍｏｉｃ＿ｔ　　　　　　　　　｜
  </p>
  
  <p>
    ｜＋－＋－＋－＋－＋－＋－＋－＋－＋－＋－＋－＋－＋－＋－＋－＋－｜
  </p>
</div>

我们看到atomic_t中嵌入了一个8bit的锁，因为SPARC体系结构对原子操作缺乏指令级的支持，所以只能使用利用该锁来避免对原子类型数据的并发访问，对于原子操作的使用，看下面例子：

<pre class="brush:c">int a=3;
atomic_t v=ATOMIC_INIT(a);
atomic_add(&v,a);
atomic_inc(&v);</pre>

在上面例子中，我们先定义并初始化了一个atomic_t变量，再对其进行了加法、自加操作。在Linux内核中提供了一系统的原子整数操作函数。

<div style="width: 100%; float: clear;">
  <table style="border-bottom: solid 2px black; border-top: solid 2px black;">
    <tr>
      <th style="width: 45%;">
        原子整数操作
      </th>
      
      <th style="width: 55%;">
        描述
      </th>
    </tr>
    
    <tr>
      <td>
        ATOMIC_INIT(int i)
      </td>
      
      <td>
        在声明一个atmoic_t变量时，将它初始化为i
      </td>
    </tr>
    
    <tr>
      <td>
        ATOMIC_INIT(int i)
      </td>
      
      <td>
        在声明一个atmoic_t变量时，将它初始化为i
      </td>
    </tr>
    
    <tr>
      <td>
        int atmoic_read(atmoic_t *v)
      </td>
      
      <td>
        原子地读取整数变量v
      </td>
    </tr>
    
    <tr>
      <td>
        void atmoic_set(atmoic_t *v,int i)
      </td>
      
      <td>
        原子地设置v值为i
      </td>
    </tr>
    
    <tr>
      <td>
        void atmoic_add(atmoic_t *v,int i)
      </td>
      
      <td>
        原子地从v值加i
      </td>
    </tr>
    
    <tr>
      <td>
        void atmoic_sub(atmoic_t *v,int i)
      </td>
      
      <td>
        原子地从v值减i
      </td>
    </tr>
    
    <tr>
      <td>
        void atmoic_inc(atmoic_t *v)
      </td>
      
      <td>
        原子地从v值加1
      </td>
    </tr>
    
    <tr>
      <td>
        void atmoic_dec(atmoic_t *v)
      </td>
      
      <td>
        原子地从v值减1
      </td>
    </tr>
    
    <tr>
      <td>
        int atmoic_sub_and_test(int i,atmoic_t *v)
      </td>
      
      <td>
        原子地从v值减i，如果结果等于0返回真，否则返回假
      </td>
    </tr>
    
    <tr>
      <td>
        int atmoic_add_negative(int i,atmoic_t *v)
      </td>
      
      <td>
        原子地从v值减i，如果结果是负数返回真，否则返回假
      </td>
    </tr>
    
    <tr>
      <td>
        int atmoic_dec_and_test(atmoic_t *v)
      </td>
      
      <td>
        原子地给v减1，如果结果等于0返回真，否则返回假
      </td>
    </tr>
    
    <tr>
      <td>
        int atmoic_inc_and_test(atmoic_t *v)
      </td>
      
      <td>
        原子地给v加1，如果结果等于0返回真，否则返回假
      </td>
    </tr>
  </table>
</div>

原子操作最常见的用途就是实现计数器，使用复杂的锁机制来保护一个单纯的计数是很笨拙的，原子操作比起复杂的同步方法来说，给系统带来的开销小，对高速缓存行的影响也小。  
<a name="bit"></a>  
<span>3、原子位操作</span>

除了原子整数操作外，内核还提供了一组针对位这一级数据进行操作的函数，位操作函数是对普通的内在地址进行操作的，它的参数是一个指针和一个位号。由于是对普通的指针进程操作，所以没有像atomic_t这样的类型约束。

<pre class="brush:c">unsigned long word = 0;
set_bit(0,&word);
clear_bit(0,&word);
change_bit(0,&word);//翻转第0位的值</pre>

<div style="width: 100%; float: clear;">
  <table style="border-bottom: solid 2px black; border-top: solid 2px black;">
    <tr>
      <th style="width: 45%;">
        原子整数操作
      </th>
      
      <th style="width: 55%;">
        描述
      </th>
    </tr>
    
    <tr>
      <td>
        void set_bit(int nr,void *addr)
      </td>
      
      <td>
        原子地设置addr所指对象的第nr位
      </td>
    </tr>
    
    <tr>
      <td>
        void clear_bit(int nr,void *addr)
      </td>
      
      <td>
        原子地清空addr所指对象的第nr位
      </td>
    </tr>
    
    <tr>
      <td>
        void change_bit(int nr,void *addr)
      </td>
      
      <td>
        原子地翻转addr所指对象的第nr位
      </td>
    </tr>
    
    <tr>
      <td>
        int test_and_set_bit(int nr,void *addr)
      </td>
      
      <td>
        原子地设置addr所指对象的第nr位,并返回原先的值
      </td>
    </tr>
    
    <tr>
      <td>
        int test_and_clear_bit(int nr,void *addr)
      </td>
      
      <td>
        原子地清空addr所指对象的第nr位,并返回原先的值
      </td>
    </tr>
    
    <tr>
      <td>
        int test_and_change_bit(int nr,void *addr)
      </td>
      
      <td>
        原子地翻转addr所指对象的第nr位,并返回原先的值
      </td>
    </tr>
    
    <tr>
      <td>
        int test_bit(int nr,void *addr)
      </td>
      
      <td>
        原子地返回addr所指对象的第nr位
      </td>
    </tr>
  </table>
</div>

 [1]: #basic-concept
 [2]: #integer
 [3]: #bit