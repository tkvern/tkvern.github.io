---
title: 为你的博客添加SSL
date: 2016-04-25 19:58:20
tags: hexo
categories: Front-end
---

![https&http](http://pgl9fxcdp.bkt.clouddn.com/https&http.png)
# 为什么添加SSL
好奇心总会驱使你去探索未知的东西，当完成Hexo博客构建之后，是不是给自己的博客添加SSL呢？
在一定程度上HTTPS比HTTP更安全这是众所周知的，当然，使用HTTPS连接后，网页的第一次加载速度会较HTTP稍慢一些，但是并不影响后续请求的速度。所以SSL你还是值得一试。

<!-- more -->
# 开始
本文使用的是[CloudFlare](https://www.cloudflare.com/)的免费SSL证书，如果你使用的是别的签书机构话，本文也可供参考。

## 注册CloudFlare
注册传送门[Sign-up](https://www.cloudflare.com/a/sign-up)。(如果地址无法打开，请确认你已翻墙。)

## 添加站点
输入你的域名地址，点击`Begin Scan`
![searchdomain](http://pgl9fxcdp.bkt.clouddn.com/searchdomain.png)

## 继续设置
等待进度条完成，点击`Continue Setup`进行站点设置
![setdomain](http://pgl9fxcdp.bkt.clouddn.com/setdomain.png)

## 设置DNS
使用CloudFlare CDN加速设置`Type A`即可，设置相应的GitPages IP，完成后继续下一步。
![dnsset](http://pgl9fxcdp.bkt.clouddn.com/dnsset.png)

## 选择Plan
选择第一个`Free`，然后继续下一步
![setfree](http://pgl9fxcdp.bkt.clouddn.com/setfree.png)

## 设置DNS解析地址
将给出的DNS设置的相应的域名上
![updatednsset](http://pgl9fxcdp.bkt.clouddn.com/updatednsset.png)

下面的我在[阿里云](https://www.aliyun.com/)设置后下效果
![setaliyundns](http://pgl9fxcdp.bkt.clouddn.com/setaliyundns.png)

## 配置CNAME
如果你的GitPages还没有配置，请在`source`目录下添加`CNAME`文件。
![cnamebg](http://pgl9fxcdp.bkt.clouddn.com/cnamebg.png)

## 站点`config`配置
如果你的站点有用到HTTP的资源，请修改为HTTPS。参考下面示例代码配置你的站点
```conf
.
.
.
# URL
## If your site is put in a subdirectory, set url as 'http://yoursite.com/child' and root as '/child/'
url: https://tkvern.com   #填写你的域名
enforce_ssl: tkvern.com   #填写你的域名
root: /
permalink: :year:month:day/:title/
permalink_defaults:
.
.
.
```

## 重新部署
```console
$ hexo clean
$ hexo g -d
```

## 补充
当配置完成后，等待一段时间，访问你的站点可能浏览器会提示HTTPS连接不安全，不用理会，继续等待24小时左右你就可以在你的站点看到绿色小钥匙了。
![yaoshilist](http://pgl9fxcdp.bkt.clouddn.com/yaoshilist.png)