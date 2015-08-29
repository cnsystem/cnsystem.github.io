---
title: 简易引导扇区
author: cnsystem
layout: post
permalink: /easy-boot-section.html
categories:
  - 操作系统
---
这里讲一讲引导扇区

计算机电源打开后，先进行加电自检，然后寻找启动盘，计算机会检查以0xAA55结束的盲区，BIOS认为它是一个引导扇区。

除了以0xAA55结束之外，还应该包含一段少于512B的执行码（包括代码及数据）。

一旦发现了引导扇区后，就会将这512B的内容装载到内存的0000:7c00处，然后跳转到0000：7c00处将控制权彻底交给这段引导代码。

见下面代码：

<div class="cnblogs_code">
  引导扇区占512B，以AA55结尾。</p> 
  
  <pre class="brush:bash">org 07c00h //对齐07c00h
mov ax,cs
mov ds,ax
mov es,ax
call DispStr
jmp $   //死循环
DispStr: //输出字符P到屏幕上
mov ax,BootMessage
mov bp,ax
mov cx,16
mov ax,01301h
mov bx,000ch
mov dl,0
int 10h
ret
BootMessage: db "Hello,Os World!"
times 510-($-$$) db 0   //未使用的字节以0填充
dw 0xaa55 //以0XAA55结尾</pre>
</div>

用NASM编译  
nasm boot.asm -o boot.bin  
然后新建一个虚拟机，从软盘启动，软盘装载boot.bin  
启动之后，一行红色的<span style="background-color: #ffffff; color: #ff0000;">Hello,Os World!</span>  
激动ing