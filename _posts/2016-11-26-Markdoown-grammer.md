# Markdoown 语法

> 段落引用

tags： markdown

---
## 1. 基本语法

## 2. 流程图([flowchar.js][1])
[1]: https://github.com/adrai/flowchart.js
### 2.1 定义流程图元素
``` tag=>type: content:>url ```
1. tag就是一个标签，在第二段连接元素时用;

2. type是这个标签的类型，有6种类型，分别为：
- start
- end
- operation
- subroutine
- condition
- inputoutput

3. content就是在框框中要写的内容，中英文均可，但有一点需要特别注意，就是type后的冒号与文本之间一定要有个空格，没空格会出问题;

4. url就是一个连接，与框框中的文本相绑定.

### 2.2 连接流程图元素
连接流程图元素阶段的语法就简单多了，直接用 -> 来连接两个元素，需要注意的是condition类型，因为他有yes和no两个分支，所以要写成
```
cond(yes)->io->e
cond(no)->sub(right)->op
```
### 2.3 示例
```
st=>start: Start i=0
e=>end
op1=>operation: i++
sub1=>subroutine: i = i * i
cond=>condition: i > 10000 ?

io=>inputoutput: savefile
st->op1->cond
cond(yes)->io->e
cond(no)->sub1(right)->op1
```
```flow
st=>start:  i = 0
e=>end
op1=>operation: i++
sub1=>subroutine: i = i * i
cond=>condition: i > 10000 ?
io=>inputoutput: savefile

st(right)->op1->cond
cond(no, right)->sub1(right)->op1
cond(yes)->io->e
```

## 3 序列图（[js-sequence-diagrams][1]）
[1]:https://bramp.github.io/js-sequence-diagrams
### 3.1 语法规则
![语法规则](https://bramp.github.io/js-sequence-diagrams/images/grammar.png)
> Andrew->China: Says Hello
> Note right of China: China thinks\nabout it
> China-->Andrew: How are you?
> Andrew->>China: I am good thanks!

### 3.2 示例
```
Andrew->China: Says Hello
Note right of China: China thinks\nabout it
China-->Andrew: How are you?
Andrew->>China: I am good thanks!
```
```seq
Andrew->China: Says Hello
Note right of China: China thinks\nabout it
China-->Andrew: How are you?
Andrew->>China: I am good thanks!
```