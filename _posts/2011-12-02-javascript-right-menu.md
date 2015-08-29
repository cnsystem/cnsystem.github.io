---
title: Javascript打造右键菜单
author: cnsystem
layout: post
permalink: /javascript-right-menu.html
categories:
  - JavaScript
---
JAVASCRIPT代码

<pre class="brush:javascript" lang="javascript">var $G = function (id) {
    if (typeof id === "string")
        return document.getElementById(id);
    else
        return id;
};
var extend = function (a, b) {
    if (typeof b !== "object")
        return a;
    for (var key in b) {
        a[key] = b[key];
    }
    return a;
};
_obj = $G("div_RightMenu");
var config = {
    obj: _obj,
    showMenu: function (menu, top, left) {
        menu.style.top = top + "px";
        menu.style.left = left + "px";
        menu.style.display = "block";
    },
    hiddenMenu: function (menu) {
        menu.style.display = "none";
    }
};

var getOffset = function (menu, x, y) {
    var result = {};
    menu._width = menu.offsetWidth;
    menu._height = menu.offsetHeight;
    if (x + menu._width &gt; window.innerWidth)
        x = window.innerWidth - menu._width;
    if (y + menu._height &gt; window.innerHeight)
        y = window.innerHeight - menu._height;
    result.left = document.body.scrollLeft + x;
    result.top = document.body.scrollTop + y;
    return result;
};

function LoadMenu(con) {
    config = extend(config, con);
    var menu = config.obj;
    document.oncontextmenu = function (event) {
        event = event ¦¦ window.event;
        var position = getOffset(menu, event.clientX, event.clientY);
        config.showMenu(menu, position.top, position.left);
        event.preventDefault();
    };
    document.onclick = function () {
        config.hiddenMenu(menu);
    };
}</pre>

&nbsp;

HTML代码

<pre class="brush:html" lang="HTML">&lt;html xmlns="http://www.w3.org/1999/xhtml"&gt;
&lt;head runat="server"&gt;
    &lt;title&gt;Index&lt;/title&gt;
    &lt;style&gt;
        *{margin:0;padding:0;}
        .div_RightMenu
        {
            z-index: 30000;
            text-align: left;
            cursor: default;
            position: absolute;
            background-color: #FAFFF8;
            width: 160px;
            height: auto;
            border: 1px solid #333333;
            display: none;
            filter: progid:DXImageTransform.Microsoft.Shadow(Color=#333333,Direction=
120,strength=5);
        }

        .divMenuItem
        {
            height: 17px;
            color: Black;
            font-family: 宋体;
            vertical-align: middle;
            font-size: 10pt;
            margin-bottom: 3px;
            cursor: hand;
            padding-left: 30px;
            padding-top: 2px;
        }
        .mask
        {
            z-index:10;
            width:;
            height:99999px;
            position:absolute;
            background-color:Black;
            filter:alpha(opacity=0.7);
            opacity:0.5;
        }
    &lt;/style&gt;
&lt;/head&gt;
&lt;body style="position: relative"&gt;
    &lt;div id="div_RightMenu" class="div_RightMenu"&gt;
            &lt;div class="divMenuItem"&gt;
                我的首页&lt;/div&gt;
            &lt;div class="divMenuItem"&gt;
                删除记录&lt;/div&gt;
            &lt;div class="divMenuItem"&gt;
                详细信息&lt;/div&gt;
            &lt;div class="divMenuItem"&gt;
                刷新&lt;/div&gt;
            &lt;hr&gt;
            &lt;div class="divMenuItem"&gt;
                加入收藏夹&lt;/div&gt;
            &lt;div class="divMenuItem"&gt;
                复制&lt;/div&gt;
            &lt;div class="divMenuItem"&gt;
                全选&lt;/div&gt;
            &lt;hr&gt;
            &lt;div class="divMenuItem"&gt;
                联系作者&lt;/div&gt;
            &lt;div class="divMenuItem"&gt;
                关于此功能&lt;/div&gt;
            &lt;div class="divMenuItem" style="margin-bottom: 0px;"&gt;
                属性&lt;/div&gt;
        &lt;/div&gt;
    &lt;div id="mask" class="mask"&gt;
        &lt;div style=" background-color:Blue;"&gt;&lt;/div&gt;
    &lt;/div&gt;
    &lt;div&gt;
        心上十八添一目,
        单身贵族尔相思.
        春来人去无日月,
        一人相伴到白头.
        高兴只有一对脚,
        东西南北路遥遥.
        有人为伍吾口多,
        两人共枕非夫妻.
              猜8个字
    &lt;/div&gt;
&lt;/body&gt;
&lt;script src="../../Scripts/showMenu.js"&gt;&lt;/script&gt;
    &lt;script&gt;
        LoadMenu({});
    &lt;/script&gt;
&lt;/html&gt;</pre>

&nbsp;