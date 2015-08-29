---
title: secureCRT 文件上传
author: cnsystem
layout: post
permalink: /securecrt-fileupload.html
categories:
  - Linux
tags:
  - Linux
  - SecureCRT
---
  * 下载  
    wget http://freeware.sgi.com/source/rzsz/rzsz-3.48.tar.gz
  * 解压  
    tar -zxvf rzsz-3.48.tar.gz
  * 安装  
    make posix  
    cp rz sz /usr/bin

然后在secureCRT中，使用rz,sz就可以上传文件了。  
以上是要在Linux有权限上网的情况下，如果Linux不能上网，那么就得用sftp把文件上传Linux。  
secureCRT自带sftp，使用以下命令上传  
sftp>put \[local\_file\] \[remote\_diretory\]  
与之对应是用sftp下载  
sftp>get \[remote\_file\] \[local\_diretory\]  
参考：

  1. <a href="http://www.51cto.com/art/200712/62867.htm" target="_blank">Linux系统手动安装rzsz 软件包</a>：http://www.51cto.com/art/200712/62867.htm
  2. <a href="http://wenku.baidu.com/view/42054b878762caaedd33d48a.html" target="_blank">sftp使用</a>:http://wenku.baidu.com/view/42054b878762caaedd33d48a.html

前一篇secureCRT的使用《<a href="http://blog.cnsystem.org/linux-remote-manage-console.html" target="_blank">远程管理Linux之命令界面</a>》