---
title: 七牛云存储使用教程(Ruby-on-Rails-+-JavaScript)
tags: 七牛云存储
categories: Ruby on Rails
date: 2016-02-18 21:26:49
---

![qiniu](/images/cover/qiniubg.png)
## 吐槽
写教程之前不得不吐槽一下[七牛](http://developer.qiniu.com/docs/v6/sdk/index.html)的官方文档，API的说明是很全面，但是读起来超蛋疼。为什么这么说呢，按照我以往的看API的文档都会有示例代码跑起来帮助理解，而七牛的API文档对于刚接触这种第三方服务商SDK的开发者来说不是太友好。建议七牛借鉴下[百度地图SDK](http://developer.baidu.com/map/index.php?title=jspopular)的文档写法。

<!-- more -->

---

## 初识
七牛云存储是一家专注云存储领域的技术公司，提供云存储、云处理、云加速分发一站式服务，持续追求高可靠、高可用、高性能、高响应速度，推动客户健康稳定地快速发展。（前面是广告）

以往开发项目时总会遇到上传文件的问题，譬如上传速度、断点续传、资源服务器部署等等。存在自己的服务器上面，维护成本高。那如何解决这些问题呢，有需求就有市场，云存储应运而生，把这些处理统统放到云存储上，只需要进行API调用即可，而这次我们选中了七牛云存储，便宜，好用，快速。（广告打了一大堆，进入正题吧）

---

## 使用
教程正式开始

### 注册

使用前得先注册一个七牛云存储的账号，[-->注册传送门<--](https://portal.qiniu.com/signup)

### 登录认证

登录之后查看你的账号身份认证，完成认证解锁更多功能

### 获取AK, SK,空间域名
这两个KEY值是用来生成上传凭证的

### 配置服务器环境
在使用七牛云存储前我们先要配置好`上传凭证`的生成环境

代码清单3.6.1: 导入七牛云存储的`gem`包
*`Gemfile`*
```ruby
source 'https://rubygems.org'


# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~>4.2.3'
# Use postgresql as the database for Active Record
.
.
.
gem 'qiniu' #加入七牛云存储gem包
.
.
.
```

代码清单3.6.2: 然后重新`bundle`我们的项目会看到安装了很多`gem`包

```console
$ bundle install
.
.
.
Using qiniu 6.5.1
.
.
.
Bundle complete! 17 Gemfile dependencies, 66 gems now installed.
Use `bundle show [gemname]` to see where a bundled gem is installed.
```

如果有提示安装失败或是无法安装一些国外的镜像可修改`Gemfile`的源到淘宝源或是自行翻墙，推荐一款翻墙工具[Shadowsocks](https://shadowsocks.com/)

### 配置AccessKey/SecretKey
代码清单3.7.1: 新建`qiniu_sdk.rb`文件,将3.3节获取到的AK,SK,空间域名地址输入下面代码
*`config/initializers/qiniu_sdk.rb`*
```ruby
#!/usr/bin/env ruby

require 'qiniu'

Qiniu.establish_connection! :access_key => '<输入你的AK>',
                            :secret_key => '<输入你的SK>'

Rails.application.config.qiniu_domain = "<空间域名地址>"
```

### 生成上传凭证
代码清单3.8.1: 这个方法我会包装到Helper里面
*`app/helpers/application_helper.rb`*
```ruby
module ApplicationHelper
  private
    def uptoken

      put_policy = Qiniu::Auth::PutPolicy.new(
        "<你的空间名称>",                    # 存储空间
        nil,                           # 最终资源名，可省略，即缺省为“创建”语义
        1800,                          # 相对有效期，可省略，缺省为3600秒后 uptoken 过期
        (Time.now + 30.minutes).to_i  # 绝对有效期，可省略，指明 uptoken 过期期限（绝对值），通常用于调试，这里表示半小时
      )

      uptoken = Qiniu::Auth.generate_uptoken(put_policy) #生成凭证

    end
end

```
到目前为止我们以及完成了服务端的所有配置,当我们的文件上传时,是不经过我们自己的服务器的,由客户端通过Ajax请求七牛的API再将返回的文件名存入我们的服务器。接下来就是客户端的配置

### 导入七牛JavaScriptSDK
[-->下载JavaScriptSDK传送门<--](http://developer.qiniu.com/docs/v6/sdk/javascript-sdk.html)

代码清单3.9.1: 为了代码易于管理我们将七牛的JavaScriptSDK文件放到*`app/assets/javascripts/plugins`*目录

```file
- app
  - assets
    + fonts
    + images
    - javascript
      - plugins
        - plupload
            moxie.js
            plupload.dev.js
            plupload.full.min.js
        - qiniu
            qiniu.js
            qiniu.min.js
      application.js
    + stylesheets
```
代码清单3.9.2: 引用SDK到`application.js`
*`app/assets/javascripts/application.js`*
```js
// # Place all the behaviors and hooks related to the matching controller here.
// # All this logic will automatically be available in application.js.
// # You can use CoffeeScript in this file: http://coffeescript.org/

//= require plugins/plupload/moxie
//= require plugins/plupload/plupload.dev
//= require plugins/qiniu/qiniu
```

### 初始化javascript
在完成以上操作之后我们就可以正式使用七牛云存储了

代码清单3.9.3: 在`controller`中引入`helper`方法，传入上传凭证
*`app/controllers/uploads_controller.rb`*
```ruby
class UploadsController < ActionController::BaseController
  include ApplicationHelper
  
  def index
    # 获取上传凭证
    @uptoken = uptoken
  end
end
```

代码清单3.9.4: 代码清单在视图文件中使用
*`app/views/upload/index.html.erb`*
```html
<!-- 初始化按钮 start -->
<div class="col-md-12">
    <div id="container" style="position: absolute; top: 50px;">
        <a class="btn btn-default btn-lg " id="pickfiles" href="#" style="position: relative; z-index: 1;">
            <i class="fa fa-plus"></i>
            <span>选择文件</span>
        </a>
    </div>
</div>
<!-- 初始化按钮 end -->

<!-- 初始化配置 start -->
<script type="text/javascript">
  var uploader = Qiniu.uploader({
    runtimes: 'html5,html4',          //上传模式,依次退化
    browse_button: 'pickfiles',       //上传选择的点选按钮，**必需**
    uptoken : '<%= @uptoken %>',
        //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
    unique_names: true,
        // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
    save_key: true,
        // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
    domain: '<%= Rails.application.config.qiniu_domain %>',
        //bucket 域名，下载资源时用到，**必需**
    container: 'container',           //上传区域DOM ID，默认是browser_button的父元素，
    max_file_size: '5mb',           //最大文件体积限制
    // flash_swf_url: 'js/plupload/Moxie.swf',  //引入flash,相对路径
    max_retries: 3,                   //上传失败最大重试次数
    dragdrop: true,                   //开启可拖曳上传
    drop_element: 'container',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
    chunk_size: '1mb',                //分块上传时，每片的体积
    auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
    init: {
        'FilesAdded': function(up, files) {
            plupload.each(files, function(file) {
                // 文件添加进队列后,处理相关的事情
            });
        },
        'BeforeUpload': function(up, file) {
               // 每个文件上传前,处理相关的事情
        },
        'UploadProgress': function(up, file) {
               // 每个文件上传时,处理相关的事情
        },
        'FileUploaded': function(up, file, info) {
               // 每个文件上传成功后,处理相关的事情
               // 其中 info 是文件上传成功后，服务端返回的json，形式如
               // {
               //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
               //    "key": "gogopher.jpg"
               //  }
               // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
               var domain = up.getOption('domain');
               var res = $.parseJSON(info);
               var sourceLink = domain + res.key; //获取上传成功后的文件的Url
               console.log(info);
               console.log(sourceLink);
        },
        'Error': function(up, err, errTip) {
               //上传出错时,处理相关的事情
        },
        'UploadComplete': function() {
               //队列文件处理完毕后,处理相关的事情
        },
        'Key': function(up, file) {
            // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
            // 该配置必须要在 unique_names: false , save_key: false 时才生效
            var key = "";
            // do something with key here
            return key
        }
    }
});
</script>
<!-- 初始化配置 end -->
```

代码清单3.9.5: 完成了这么多复杂的操作后终于可以试试效果了，启动Rails服务器看看吧
```console
$ rails server -b $IP -p $PORT
```

## 作者

如果教程里面有什么纰漏的地方请给我留言
