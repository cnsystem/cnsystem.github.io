---
title: Javascript画一个函数图像
author: cnsystem
layout: post
permalink: /javascript-draw-heart.html
categories:
  - JavaScript
  - 程序设计
---
这里写了一段代码，本想实现用javascript画了一个函数图像。直接上代码：  
<span style="color: #ff99cc;"><strong>***********************************华丽的分隔线***********************************</strong></span>

<pre class="brush:php">&lt;html&gt;
&lt;head&gt;
&lt;title&gt;8023&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;/body&gt;
&lt;script type="text/javascript"&gt;
var Each=function(data,func){
	for(var i=0;i&lt;data.length;i++)
		func(data,i);
};
//画个函数图像
function drawSomething(width,height){
	var backColor={'R':255,'G':255,'B':255};
	var frontColor={'R':255,'G':0,'B':0};
	var canvas=initialCanvas(width,height);	
        //修正width,height
        width=canvas.width;
	height=canvas.height;
	var g=canvas.getContext("2d");
	var imgd;
	if (g.createImageData) {
		imgd = g.createImageData(width, height);
	} else if (g.getImageData) {
		imgd = g.getImageData(0, 0, width, height);
	} else {
		imgd = {'width' : width, 'height' : height, 'data' : new Array(width*height*4)};
	}
	imgd = g.getImageData(0, 0, width, height);
	
	var O={'x':width/2,'y':height/2}
	//修改每一个像素，性能很差，将就实现一下啦
	Each(imgd.data,function(data,index){
		var position=GetPostion(index,width,height,O);
		if(isInSide(position,width,height)){
			setPix(data,index,frontColor);
		}
		else{
			setPix(data,index,backColor);
		}
	});
	g.putImageData(imgd,0,0);
}
//设置像素颜色
function setPix(pix,i,color,alpha)
{
	var n=i*4;
	pix[n  ]=color.R;
	pix[n+1]=color.G;
	pix[n+2]=color.B;
	if(alpha!=null)
		pix[n+3]=alpha;
	else pix[n+3]=255;
}
//初始化Canvas
function initialCanvas(width,height){
	var elem=document.createElement("canvas");
	elem.width=width;
        elem.height=height;
	elem.style.width=width+"px";
	elem.style.height=height+"px";
	document.body.insertBefore(elem,document.body.childNodes[0]);
	return elem;
}
//判断是否在图形内，这是一个函数图像
function isInSide(position,width,height){
	var x=position.x;
	var y=position.y;
	x=x*20.0/width/1.0;
	y=y*20.0/height/1.0;
	if(17*x*x-16*Math.abs(x)*y+7*y*y-225&lt;0)
		return 1;
	return 0;
}
//将索引转换为坐标
//O为坐标原点位置，这里只考虑原点在canvas内部
//因为Y轴方向变了，转换不严密
function GetPostion(index,width,height,O){
	var y=(height-index/width)-O.y;
	var x=index%width-O.x;
	return {'x':x,'y':y};
}
window.onload=function(){
	var width=64;
	var height=48;
	drawSomething(width,height);
};
&lt;/script&gt;
&lt;/html&gt;</pre>

<span style="color: #ff99cc;"><strong>***********************************华丽的分隔线***********************************</strong></span>  
<span style="color: #ff0000;">哈哈，猜猜你能看到什么？<a href="http://html5.cnsystem.org/demo/javascript/draw-heart.html"  target="_blank">点击查看</a></span>  
<span style="color: #ff99cc;"><strong>***********************************华丽的分隔线***********************************</strong></span>  
这里要的做是用函数17x^2-16|x|y+17y^2-225=0来画一个心形  
怎么用JS画一个函数呢？我看了一下HTML5的Canvas可以直接操作画布是的像素，一个很笨拙的方法产生，直接操作从像素从着手，一个像素一个像素的画。  
嗯，纯属心血来潮，哈哈。  
参考：

1、函数来自matrix67博客： <a href="http://www.matrix67.com/blog/archives/2247" target="_blank">http://www.matrix67.com/blog/archives/2247</a>  
2、HTML5 Canvas教程很详细的：<a href="http://blog.bingo929.com/html-5-canvas-the-basics-html5.html" target="_blank">http://blog.bingo929.com/html-5-canvas-the-basics-html5.html</a>  
<span style="color: #ff99cc;"><strong>***********************************华丽的分隔线***********************************</strong></span>  
PS：还要优化一下，坐标转换出了点问题，图像位置不对，画布设置大了一点就有问题