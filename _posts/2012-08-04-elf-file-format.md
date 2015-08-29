---
title: ELF文件格式
author: cnsystem
layout: post
permalink: /elf-file-format.html
categories:
  - Linux
  - 操作系统
---
ELF，Excuteable and Linkable Format，文件的结构图如下所示：

&nbsp;

<div id="attachment_801" style="width: 374px" class="wp-caption aligncenter">
  <a href="http://blog.cnsystem.org/wp-content/uploads/2012/05/ELF文件概览.jpg"><img class=" wp-image-801 " title="ELF文件概览" src="http://blog.cnsystem.org/wp-content/uploads/2012/05/ELF文件概览.jpg" alt="ELF文件概览" width="364" height="385" /></a>
  
  <p class="wp-caption-text">
    ELF文件概览
  </p>
</div>

文件由4部分组成：ELF头，Program Headers, Sections 和 Section Headers。只有ELF Header位置是固定的，其余部分位置、大小等信息由ELF头中的各项值来决定。ELF Header的格式如下所示

<pre class="brush:c">#define	EI_NIDENT	16
typedef	struct{
	unsigned char 	e_ident[EI_NIDENT];
	Elf32_Harlf		e_type;
	Elf32_Harlf		e_machine;
	Elf32_Word		e_version;
	Elf32_Addr 		e_entry;
	Elf32_Off		e_phofff;
	Elf32_Off		e_shoff;
	Elf32_Word		e_flags;
	Elf32_Harlf		e_ehsize;
	Elf32_Harlf		e_phentsize;
	Elf32_Harlf		e_phnum
	Elf32_Harlf		e_ehentsize;
	Elf32_Harlf		e_ehnum;
	Elf32_Harlf		e_shstrndx;
}Elf32_Ehdr;</pre>