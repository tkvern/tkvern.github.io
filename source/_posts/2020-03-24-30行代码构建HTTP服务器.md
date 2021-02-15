---
title: 30行代码构建HTTP服务器
date: 2020-03-24 19:50:56
tags:
---

![nodejs](/images/cover/Node-js.jpg)

前两天调代码，想查看测试覆盖率生成的网页报告文件，没有安装HTTP服务器客户端。就在VS Code中下载一个叫`Live Server`的插件，用来启动HTTP服务。感觉效果还不错，然后今天和大家用Node来实现一个。

<!-- more -->

## 开始

构建HTTP服务，需要先了解一下HTTP协议的基础知识

### HTTP工作原理

HTTP协议定义Web客户端如何从Web服务器请求Web页面，以及服务器如何把Web页面传送给客户端。HTTP协议采用了请求/响应模型。客户端向服务器发送一个请求报文，请求报文包含请求的方法、URL、协议版本、请求头部和请求数据。服务器以一个状态行作为响应，响应的内容包括协议的版本、成功或者错误代码、服务器信息、响应头部和响应数据。

### HTTP请求格式

![request](/images/http/http1.jpg)

### HTTP响应格式
![response](/images/http/http2.jpg)



## 编码

这里的需求比较简单，只要能GET即可，不需要POST

这里会用到Node的`http`和`fs`模块

**导入模块**

```javascript
const http = require("http");
const fs = require("fs");
```



**创建服务**

```javascript
const server = http.createServer(); // 创建服务
server.listen(8888); // 监听端口
```



**Content-Type的HashMap**

这里定义了我们网页中，常用的一些文件类型

```javascript
const CONTENT_TYPE_MAP = { // 定义Content-Type的HashMap
  html: "text/html; charset=UTF-8",
  htm: "text/html; charset=UTF-8",
  js: "application/javascript; charset=UTF-8",
  css: "text/css; charset=UTF-8",
  txt: "text/plain; charset=UTF-8",
  mainfest: "text/plain; charset=UTF-8"
};
```



**处理Request**

在返回response的时候，如果文件类型在`CONTENT_TYPE_MAP`中没有，我们则以`application/octet-stream`类型返回，浏览器端会直接将文件下载到本地。

```javascript
server.on("request", function(request, response) {
  const url = require("url").parse(request.url);
  const filename = url.pathname.substring(1);
  const suffix = filename.substring(filename.lastIndexOf(".") + 1); // 获取文件后缀
  fs.readFile(filename, function(err, content) {
    if (err) {
      response.writeHead(404, {
        "Content-Type": "text/plain; charset=UTF-8"
      });
      response.write(err.message);
    } else {
      response.writeHead(200, {
        "Content-Type": CONTENT_TYPE_MAP[suffix] || "application/octet-stream"
      });
      response.write(content);
    }
    response.end();
  });
});
```



到这里，借助Node V8引擎，一个极为轻量化、性能优异的基础HTTP服务器就开发完成了。需要本地启动HTTP服务器的时候，再也不用到网上下载啥客户端了，30行代码就搞定。需要的时候，直接命令行启动即可。

项目源码请访问: https://github.com/tkvern/node-http-server

