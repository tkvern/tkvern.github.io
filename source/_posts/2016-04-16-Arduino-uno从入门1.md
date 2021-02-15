---
title: Arduino-uno从入门1
tags: Arduino
categories: 智能硬件
date: 2016-04-16 21:26:49
---

![Ariduino](/images/cover/illu-arduino-UNO.png)
# 准备
学习物联网开发，我们需要有良好的社区支持，方便的配件采购渠道和便宜的价格。而Arduino刚好具备了这些条件。

## 知识储备
在开发Arduino之前你需要掌握基础的C语言知识。当然如果你已经有过Java，PHP，Ruby，Python，Javascript类似的语言开发经历的话请继续往下。除了编程基础以外你还需要了解基本的电学知识，大多数高中物理教材都有这些知识，你同样可以借助搜索引擎帮助你获得这些知识。<!-- more -->
这里推荐一个学习C语言的链接:
[慕课网-C语言入门](http://www.imooc.com/view/249)

## 学习资料
在[Arduino官网](http://www.arduino.cc/)提供了诸多的编程参考，社区贡献代码库和详细的文档。
如果觉得文档不够明白，没关系。
推荐到[极客学院-Arduino开发](http://www.jikexueyuan.com/path/arduino/) 查看相关视频。在硬件还没到货之前可以在极客学院先了解一些关于Arduino的知识。

## 硬件采购
在Arduino的官网提供了[购买链接](https://store.arduino.cc/)，但是如果你觉得麻烦的话推荐到淘宝店[慧净电子](https://hjmcu.taobao.com/)购买套装。
购买时请注意，慧净电子提供的Arduino uno有两种版本，一个是国产的相对便宜，一个是进口的相对贵一些。功能上没有区别只是一个是国内生产，一个是国外生产。如果不介意建议购买国产版本。
笔者购买的链接参考:[基于Arduino智能小车循迹避障智能小车 UNO R3入门 机器人套件](https://item.taobao.com/item.htm?spm=a1z10.5-c.w4002-1930577668.24.t9tQHB&id=36621044626)

# 环境搭建
如果你使用的是Windows，环境搭建想对简单，如果是Mac可能会存在Arduino uno连接后找不到端口的问题，稍后会给出解决方案。

## 下载ArduinoIDE
开源的Arduino软件（IDE）让编程和下载程序变得非常简单。这个软件能够运行在Windows、Mac OS X以及Linux上，软件基于Processing和其他的开源软件，使用java开发完成。这个软件适用于任何Arduino控制板
下载连接：[https://www.arduino.cc/en/Main/Software](https://www.arduino.cc/en/Main/Software)

## 安装Arduino驱动
解决在Mac上找不到端口问题
[How To Use Cheap Chinese Arduinos That Come With With CH340G / CH341G Serial/USB Chip](http://kig.re/2014/12/31/how-to-use-arduino-nano-mini-pro-with-CH340G-on-mac-osx-yosemite.html)
下载文件 [CH34x_Install.zip](http://kig.re/downloads/CH34x_Install.zip)
解压后安装，重启。重新插上Arduino数据线就可以在`ArduinoIDE`中看到设备了

## 温馨提示
如果你有使用SublimeText，千万不要安装插件`arduino-like IDE`。安装`arduino-cli`就足够了。代码编译下载最好是使用`ArduinoIDE`完成，如果需要使用SublimeText，在选项中开启使用外部编辑器就好了，不然你会浪费很多时间在编辑器上面。强烈建议先看完极客学院的Arduino课程后再实操，结合笔者的后续文档，少踩很多坑。。。
