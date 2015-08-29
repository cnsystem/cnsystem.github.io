---
title: window注册表TCP/IP相关设置
author: cnsystem
layout: post
permalink: /regedit-network-safe.html
categories:
  - 小技巧
---
1)设置生存时间  
HKEY\_LOCAL\_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters

DefaultTTL REG_DWORD 0-0xff(0-255 十进制,默认值128)

说明:指定传出IP数据包中设置的默认生存时间(TTL)值.TTL决定了IP数据包在到达  
目标前在网络中生存的最大时间.它实际上限定了IP数据包在丢弃前允许通过的路由  
器数量.有时利用此数值来探测远程主机操作系统.

2)防止ICMP重定向报文的攻击  
HKEY\_LOCAL\_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters

EnableICMPRedirects REG_DWORD 0x0(默认值为0x1)

说明:该参数控制Windows 2000是否会改变其路由表以响应网络设备(如路由器)发送给它  
的ICMP重定向消息,有时会被利用来干坏事.Win2000中默认值为1,表示响应ICMP重定向报  
文.

3)禁止响应ICMP路由通告报文  
HKEY\_LOCAL\_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Inter  
faces\interface

PerformRouterDiscovery REG_DWORD 0x0(默认值为0x2)

说明:“ICMP路由公告”功能可造成他人计算机的网络连接异常,数据被窃听,计算机被  
用于流量攻击等严重后果.此问题曾导致校园网某些局域网大面积,长时间的网络异常.  
因此建议关闭响应ICMP路由通告报文.Win2000中默认值为2,表示当DHCP发送路由器发  
现选项时启用.

4)防止SYN洪水攻击  
HKEY\_LOCAL\_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters

SynAttackProtect REG_DWORD 0x2(默认值为0x0)

说明:SYN攻击保护包括减少SYN-ACK重新传输次数,以减少分配资源所保留的时  
间.路由缓存项资源分配延迟,直到建立连接为止.如果synattackprotect=2,  
则AFD的连接指示一直延迟到三路握手完成为止.注意,仅在TcpMaxHalfOpen和  
TcpMaxHalfOpenRetried设置超出范围时,保护机制才会采取措施.

5) 禁止C$、D$一类的缺省共享  
HKEY\_LOCAL\_MACHINE\SYSTEM\CurrentControlSet\Services\lanmanserver\parameters

AutoShareServer、REG_DWORD、0x0

6) 禁止ADMIN$缺省共享  
HKEY\_LOCAL\_MACHINE\SYSTEM\CurrentControlSet\Services\lanmanserver\parameters

AutoShareWks、REG_DWORD、0x0

7) 限制IPC$缺省共享  
HKEY\_LOCAL\_MACHINE\SYSTEM\CurrentControlSet\Control\Lsa

restrictanonymous REG_DWORD 0x0 缺省  
0x1 匿名用户无法列举本机用户列表  
0x2 匿名用户无法连接本机IPC$共享  
说明:不建议使用2，否则可能会造成你的一些服务无法启动，如SQL Server

8)不支持IGMP协议  
HKEY\_LOCAL\_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters

IGMPLevel REG_DWORD 0x0(默认值为0x2)

说明:记得Win9x下有个bug,就是用可以用IGMP使别人蓝屏,修改注册表可以修正这个  
bug.Win2000虽然没这个bug了,但IGMP并不是必要的,因此照样可以去掉.改成0后用  
route print将看不到那个讨厌的224.0.0.0项了.

9)设置arp缓存老化时间设置  
HKEY\_LOCAL\_MACHINE\SYSTEM\CurrentControlSet\Services:\Tcpip\Parameters

ArpCacheLife　REG_DWORD 0-0xFFFFFFFF(秒数,默认值为120秒)  
ArpCacheMinReferencedLife　REG_DWORD 0-0xFFFFFFFF(秒数,默认值为600)

说明:如果ArpCacheLife大于或等于ArpCacheMinReferencedLife,则引用或未引用的ARP  
缓存项在ArpCacheLife秒后到期.如果ArpCacheLife小于ArpCacheMinReferencedLife,  
未引用项在ArpCacheLife秒后到期,而引用项在ArpCacheMinReferencedLife秒后到期.  
每次将出站数据包发送到项的IP地址时,就会引用ARP缓存中的项。

10)禁止死网关监测技术  
HKEY\_LOCAL\_MACHINE\SYSTEM\CurrentControlSet\Services:\Tcpip\Parameters

EnableDeadGWDetect REG_DWORD 0x0(默认值为ox1)

说明:如果你设置了多个网关,那么你的机器在处理多个连接有困难时,就会自动改用备份  
网关.有时候这并不是一项好主意,建议禁止死网关监测.

11)不支持路由功能  
HKEY\_LOCAL\_MACHINE\SYSTEM\CurrentControlSet\Services:\Tcpip\Parameters

IPEnableRouter REG_DWORD 0x0(默认值为0x0)

说明:把值设置为0x1可以使Win2000具备路由功能,由此带来不必要的问题.

12)做NAT时放大转换的对外端口最大值  
HKEY\_LOCAL\_MACHINE\SYSTEM\CurrentControlSet\Services:\Tcpip\Parameters

MaxUserPort REG_DWORD 5000-65534(十进制)(默认值0x1388&#8211;十进制为5000)

说明:当应用程序从系统请求可用的用户端口数时,该参数控制所使用的最大端口数.正常  
情况下,短期端口的分配数量为1024-5000.将该参数设置到有效范围以外时,就会使用最  
接近的有效数值(5000或65534).使用NAT时建议把值放大点.

13)修改MAC地址  
HKEY\_LOCAL\_MACHINE\SYSTEM\CurrentControlSet\Control\Class\

找到右窗口的说明为网卡的目录,  
比如说是{4D36E972-E325-11CE-BFC1-08002BE10318}

展开之,在其下的0000,0001,0002&#8230;的分支中找到DriverDesc的键值为你网卡的说明,  
比如说DriverDesc的值为Intel(R) 82559 Fast Ethernet LAN on Motherboard  
然后在右窗口新建一字符串值,名字为Networkaddress,内容为你想要的MAC值，比如说  
是004040404040  
然后重起计算机，ipconfig /all看看.