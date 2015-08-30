---
title: 远程管理Linux之命令界面
author: cnsystem
layout: post
permalink: /linux-remote-manage-console.html
categories:
  - Linux
tags:
  - Linux远程管理
  - SecureCRT
  - SSH
---
客户端：SecureCRT

服务端：开启SSH服务

客户端就不说，只是下载一个软件就是了。Linux服务器要开启SSH或Telnet，我用的是Ubuntu，开启SSH服务。具体见下文：

网上有很多介绍在Ubuntu下开启SSH服务的文章，但大多数介绍的方法测试后都不太理想，均不能实现远程登录到Ubuntu上，最后分析原因是都没有真正开启ssh-server服务。最终成功的方法如下：

sudo apt-get install openssh-server

Ubuntu缺省安装了openssh-client,所以在这里就不安装了，如果你的系统没有安装的话，再用apt-get安装上即可。

然后确认sshserver是否启动了：

ps -e |grep ssh

如果只有ssh-agent那ssh-server还没有启动，需要/etc/init.d/ssh start，如果看到sshd那说明ssh-server已经启动了。

ssh-server配置文件位于/ etc/ssh/sshd_config，在这里可以定义SSH的服务端口，默认端口是22，你可以自己定义成其他端口号，如222。然后重启SSH服务：

sudo /etc/init.d/ssh restart

ssh连接：ssh linuxidc@192.168.1.1

1. 首先在服务器上安装ssh的服务器端。

$ sudo aptitude install openssh-server

2. 启动ssh-server。

$ /etc/init.d/ssh restart

3. 确认ssh-server已经正常工作。

$ netstat -tlp

tcp6 0 0 \*:ssh \*:* LISTEN &#8211;

看到上面这一行输出说明ssh-server已经在运行了。

4. 在客户端通过ssh登录服务器。假设服务器的IP地址是192.168.0.103，登录的用户名是hyx。

$ ssh -l hyx 192.168.0.103

接下来会提示输入密码，然后就能成功登录到服务器上了

解决中文乱码问题：

（1）/var/lib/locales/supported.d/local文件中添加一行：zh_CN.UTF-8 UTF-8，执行sudo locale-gen下载文件

（2）在/etc/environment中增加两行分别为：LANG=&#8221;zh\_CN.UTF-8&#8243;和LC\_ALL=&#8221;zh_CN.UTF-8&#8243;

（3）~/.profile中增加两行分别为：export LANG=&#8221;zh\_CN.UTF-8&#8243;和export LC\_ALL=&#8221;zh_CN.UTF-8&#8243;，执行.profile

（4）在SecureCRT里设置，见下图  
<img class="alignnone size-full wp-image-584" title="http_imgload" src="http://blog.cnsystem.org/wp-content/uploads/2011/09/http_imgload.png" alt="" width="670" height="339" />