---
title: EMACS简单操作
author: cnsystem
layout: post
permalink: /emacs-simple-control.html
categories:
  - Linux
tags:
  - EMACS
  - IDE
  - 编辑器
---
文件操作  
创建 C-x C-f  
打开 C-x C-f  
重命名 M-x rename-buffer  
删除  
保存 C-x C-s  
全部保存 C-x s

移动光标  
分为行，列，页，词，句移动  
上一行／下一行 C-p C-n  
上一列／下一列 C-b C-f  
上一页／下一页 M-v C-v  
上一词／下一词 M-b M-f  
句 首／句 尾 M-a M-e  
行 首／行 尾 C-a C-e

文本编辑  
删除  
删除光标前的一个字符  
C-d 删除光标后的一个字符

M-移除光标前的一个词  
M-d 移除光标后的一个词

C-k 移除从光标到“行尾”间的字符  
M-k 移除从光标到“句尾”间的字符

插入  
1、直接输入  
2、C-u 字符 (当字符为数字和空格，回车，注意）  
3、插入空行  
撤销 C-x u  
查找  
C-s 是向前搜索，C-r 是向后搜索  
替换  
M-x replace-string  
窗格  
添加垂直 C-x 3  
添加水平 C-x 2  
关闭其它 C-x 1