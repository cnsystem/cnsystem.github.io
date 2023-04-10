---
title: Javascript打造右键菜单
author: cnsystem
layout: post
permalink: /javascript-right-menu.html
categories:
  - JavaScript
---
JAVASCRIPT代码

```javascript
var $G = function (id) {
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
}
```



HTML代码

```html
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Index</title>
    <style>
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
    </style>
</head>
<body style="position: relative">
    <div id="div_RightMenu" class="div_RightMenu">
            <div class="divMenuItem">
                我的首页</div>
            <div class="divMenuItem">
                删除记录</div>
            <div class="divMenuItem">
                详细信息</div>
            <div class="divMenuItem">
                刷新</div>
            <hr>
            <div class="divMenuItem">
                加入收藏夹</div>
            <div class="divMenuItem">
                复制</div>
            <div class="divMenuItem">
                全选</div>
            <hr>
            <div class="divMenuItem">
                联系作者</div>
            <div class="divMenuItem">
                关于此功能</div>
            <div class="divMenuItem" style="margin-bottom: 0px;">
                属性</div>
        </div>
    <div id="mask" class="mask">
        <div style=" background-color:Blue;"></div>
    </div>
    <div>
        心上十八添一目,
        单身贵族尔相思.
        春来人去无日月,
        一人相伴到白头.
        高兴只有一对脚,
        东西南北路遥遥.
        有人为伍吾口多,
        两人共枕非夫妻.
              猜8个字
    </div>
</body>
<script src="../../Scripts/showMenu.js"></script>
    <script>
        LoadMenu({});
    </script>
</html>

```
