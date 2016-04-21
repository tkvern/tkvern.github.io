---
title: 从WordPress到hexo的必经之路
tags: hexo
categories: Front-end
date: 2016-04-20 21:26:49
---
![NexT](http://7xs0pm.com1.z0.glb.clouddn.com/hexo-theme-next.png)
## 前言
本来不打算写关于hexo教程的，Google上关于hexo的文章到处都有，重复造轮子的事情本身意义不大。之前的博客一直使用的是WordPress，朋友说用WordPress来做博客会存在种种问题，WP就像是一把瑞士军刀，在灵巧以及功能性上已经失去了平衡。然后去尝试了各种博客构建方案，折腾完后发现，Hexo已经在简洁之道上了。
<!-- more -->

## 开始构建
node和npm的环境肯定是必不可少的

 1. node使用nvm安装，方便快捷 》》[nvm安装详解](https://github.com/creationix/nvm)

 2. npm是随同node一起的包管理工具，如果安装的是最新版的node就不用安装了，但是需要了解一些关于npm的命令》》[npm命令详解](http://www.runoob.com/nodejs/nodejs-npm.html)

 3. 准备好环境后就可以传送到hexo到官网》》[hexo安装详解](https://hexo.io/zh-cn/)

如果不着急到话，可以先看看下面的内容，能帮你避免一些hexo的问题。

## 使用
安装完成后就可以创建你的博客了。
### 执行`hexo g --watch`资源无法同步
如果你想在文章资源更新后能马上同步资源，那就不要在虚拟机运行就行了。
下面给出代码示例：

```console
$ hexo g --watch
```

```console
$ hexo server
```

### 配置`_config.yml`文件
打开`localhost:4000`后会有一个`hello world`文件，那么恭喜你，你已经构建好了一个博客。对于大多数人来说看到hexo的文件目录都会有些困惑。该从哪里入手？

![listblog](http://7xs0pm.com1.z0.glb.clouddn.com/listblog.png)

打开`_config.yml`文件，大部分的参数默认即可。简单晒下我的配置文件

```yml
# Hexo Configuration
## Docs: https://hexo.io/docs/configuration.html
## Source: https://github.com/hexojs/hexo/

# Site
title:                  #站点名称
subtitle:               #副标题
description:            #站点描述
author:                 #作者名称
language:               #语言默认en， 可设置为 zh-Hans
timezone:               #时区，可设置为 Asia/Shanghai

# URL
## If your site is put in a subdirectory, set url as 'http://yoursite.com/child' and root as '/child/'
url:                    #站点域名
root: /                 #博客根目录
permalink:              #持久链接格式，可设置为 :year:month:day/:title/ 
permalink_defaults:     #同上，不过可以忽略

# Directory
source_dir: source      #文章目录
public_dir: public      #编译目录
tag_dir: tags           #标签目录
archive_dir: archives   #档案目录
category_dir: categories#类别目录
code_dir: downloads/code#代码下载目录
i18n_dir: :lang 
skip_render:

# Writing
new_post_name: :title.md # File name of new posts
default_layout: post
titlecase: false         # Transform title into titlecase
external_link: true      # Open external links in new tab
filename_case: 0
render_drafts: false
post_asset_folder: true
relative_link: false
future: true
highlight:
  enable: true
  line_number: true
  auto_detect: false
  tab_replace:

# Category & Tag
default_category: uncategorized
category_map:
tag_map:

# Date / Time format
## Hexo uses Moment.js to parse and display date
## You can customize the date format as defined in
## http://momentjs.com/docs/#/displaying/format/
date_format: YYYY-MM-DD
time_format: HH:mm:ss

# Pagination
## Set per_page to 0 to disable pagination
per_page: 10
pagination_dir: page

# Extensions
## Plugins: https://hexo.io/plugins/
## Themes: https://hexo.io/themes/
theme: nexts
stylus:
  compress: true

# Avatar
avatar: https://avatars1.githubusercontent.com/u/10667077?v=3&s=460

#duoshuo
duoshuo_shortname: 


# Deployment
## Docs: https://hexo.io/docs/deployment.html
## 部署必须配置，填写相应都仓库地址，最好把本机都ssh密匙添加到github中
deploy:
  type: git
  repo: 
  branch: master
  message:

swiftype_key: 

google_site_verification: 

sitemap:
  path: sitemap.xml

qiniu:
  offline: true
  sync: true
  bucket: blog
  access_key: 
  secret_key:
  dirPrefix: static
  urlPrefix: 
  # urlPrefix:
  local_dir: public
  update_exist: true
  image: 
    folder: images
    extend: 
  js:
    folder: js
  css:
    folder: css
```

然后你就可以开始写作了，如果还想配置更多自定义的内容，可以安装一些插件，主题推荐使用[NexT](http://theme-next.iissnan.com/)。其他的不建议折腾了。

## 文章列表显示摘要
在需要截取的地方加上`<!-- more -->`即可。

## 使用七牛云存储CDN
如果你看到有文章推荐你使用`hexo-qiniu-sync`这个插件，千万不要去尝试这个插件，并发问题非常多，简直会让你奔溃。如果真的要使用建议做好文件备份，以免意外发生。那怎么办呢？
去下载[qrsync 命令行上传同步工具](http://developer.qiniu.com/code/v6/tool/qrsync.html)。通过手动方式将`public`目录传到七牛云存储，再修改所使用主题到`link` `script`地址配置。

## 使用多说
多说到加载速度是比较慢，自己权衡利弊吧。NexT主题集成了多说到配置，去多说添加个站点就好了，把多说到`name`填写到`duoshuo_shortname`即可。

## 使用站内搜索
 Next也集成了[swiftype](https://swiftype.com/)到站内搜索，由于swiftype是国外的资源，所以加载也会比较慢。填写`swiftype_key`参数完成配置

## 使用打赏
在主题配置文件中加入以下字段，获取[支付宝二维码](https://fama.alipay.com/qrcode/index.htm)
```yml
reward_comment:             #打赏内容描述
alipay:                     #自己的支付宝二维码图片地址
```

## 配置`gulp.coffee`文件
主题目录下的`gulp.coffee`定义了一个js检查任务，如果需要对主题对静态资源做处理请查看[gulp详解](http://gulpjs.com/)。对于新手来说，一般不建议再处理这些资源。

## 添加`robots.txt`
当需要对爬虫抓取做些处理时，在项目根目录的`source`中创建`robots.txt`即可，下面是示例代码:
```txt
# hexo robots.txt
User-agent: *
Allow: /
Allow: /archives/
Allow: /categories/
Allow: /tags/
Allow: /about/

Disallow: /vendors/
Disallow: /js/
Disallow: /css/
Disallow: /fonts/
Disallow: /vendors/
Disallow: /fancybox/

Sitemap: #填写完整域名地址 http://example.com/sitemap.xml
```

## 映射域名
在根目录的`source`下面创建`CNAME`文件，在其中填写你要映射的域名。将域名解析到统一地址`103.245.222.133`。之后需要等待一段时间DNS才能解析完成。

## 部署
如果没有改动主题资源，那么部署的时候不用每次都`hexo clean`。
直接执行下面都命令完成部署。
```
$ hexo g -d
```