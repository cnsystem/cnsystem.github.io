---
title: 什么是TTL(Time To Live)
author: cnsystem
layout: post
permalink: /what-is-time-to-live.html
categories:
  - 网络
tags:
  - PING
  - TTL
  - 网络
  - 路由
---
在前面<a title="《PING解决上网问题》" href="http://blog.cnsystem.org/ping-network-problem.hml" target="_blank">《PING解决上网问题》</a>里说到了，用Ping命令解决无法上网问题，在回显的内容中有一项是TTL=53

那什么是TTL呢？Time To Live，存活时间。就是说一个IP报文在网络中传递的时间。为什么会有这个概念呢？有些情况下，目的地不可达的时候，例如某网站主机死掉了，用户发送的报文找不到目的地，但是总不能一直在网络里拼命的找吧，这样网络一定给挤爆。所以用TTL来将过期的报文给抛弃掉。但是TTL并不是时间，而与IP报文传输经过路由器的个数有关，IP报文有个初始的TTL值（下面会提到），然后没经过一个路由器减一，当TTL小于0的时候，该报文就被抛弃。

那么TTL有什么用呢？

1、查看访问速度的一个指标

在选空间的时候，此方法可以做为空间衡量标准之一。经过的路由器越多，访问速度就越慢。那么PING一下，从TTL就可以看到这个空间访问速度如何，至少从路由耗时没有那么多。

2、分析目标机操作系统

UNIX 及类 UNIX 操作系统 ICMP 回显应答的 TTL 字段值为 255

Compaq Tru64 5.0 ICMP 回显应答的 TTL 字段值为 64

WINXP-32bit 回显应答的 TTL 字段值为 64

微软 Windows NT/2K/2003操作系统 ICMP 回显应答的 TTL 字段值为 128

微软Windows 2008操作系统 ICMP 回显应答的 TTL 字段值为64

微软 Windows 95 操作系统 ICMP 回显应答的 TTL 字段值为 32(这个没人用了吧）

上面一些系统初始的TTL值，比如在命令行回显的TTL为124，那么基本可以确定为window2003了，NT、2K现在基本人用了。当然这个方法，得出来的结果不一定准确，假如命令行回显的TTL为53，那么是64-11=53还是128-75=63？

当然一般不会经过75个路由器的。