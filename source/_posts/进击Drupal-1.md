---
title: 进击Drupal-1
tags: Drupal
categories: php
---

![Drupal1](http://7xs0pm.com1.z0.glb.clouddn.com/drupal1.png)
## 环境准备

首先我们需要有一台CentOS6.5以上的主机，如果你还没有使用过Linux的话，本教程就不太适用了。。

使用`Drupal`需要`Nginx` `PHP` `MySQL`这些东西，如果觉得安装麻烦可以使用lnmp进行一键安装，<!-- more -->

推荐两个安装链接:

1. [LNMP一键安装包](http://lnmp.org/)

2. [LNMP一键安装－支援PHP7](https://blog.linuxeye.com/31.html)

安装方法不再敖述，上面的链接附带教程。有了lnmp环境就可以开始下一步

## 安装PHP扩展

这些扩展在使用`drush`和`Drupal`的时候需要用到，所以一定要装好。

查看服务状态

```console

$ service php-fpm status

php-fpm (pid  4054) is running...

```

### 安装常用扩展

- `php-gd` 图像处理

- `php-mysqlnd` mysqlnd服务相关

- `php-pdo` 数据库相关

- `php-mcrypt` 加密相关

- `php-mbstring` 多子节字符处理

- `php-xmlrpc` xml相关

- `php-jsonc` json处理

```console

$ yum install php-gd php-mysqlnd php-pdo php-mcrypt php-mbstring php-xmlrpc php-jsonc -y

```

### 重启php-fpm服务

安装完扩展后需要重启服务生效

```console

$ service php-fpm restart

```

## 安装PHP包管理工具Composer

Composer可以方便的管理PHP的依赖

执行下面命令会下载一个叫`composer.phar`的文件

```console

$ cd ~

$ curl -sS https://getcomposer.org/installer | php

```

可以通过`php composer.phar`查看composer的命令帮助。为了方便使用composer命令，将`composer.phar`放到系统根目录执行。

```console

$ mv composer.phar /usr/local/bin/composer

```

### 安装Drush

`Drush`命令行主要为了管理Drupal，这里使用Drush开发版

```console

$ composer global require drush/drush:dev-master

```

查看`Drush`安装目录

```console

$ ll ~/.composer/vendor/drush/drush/

```

将`Drush`添加到环境变量中

```console

$ vim ~/.bash_profile

```

```sh

# .bash_profile

# Get the aliases and functions

if [ -f ~/.bashrc ]; then

^I. ~/.bashrc

fi

# User specific environment and startup programs

PATH=$PATH:$HOME/bin

# －－－－－－将drush到路径插入到环境变量－－－－－－

export PATH=$HOME/.composer/vendor/bin:$PATH

export PATH=$PATH:/usr/pgsql-9.4/bin

[[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm" # Load RVM into a shell session *as a function*

```

更新环境变量

```console

$ source ~/.bash_profile

```

使用drush，如果能看到命令提示代表你已经安装成功

```console

$ drush

Execute a drush command. Run `drush help [command]` to view command-specific help.  Run `drush topic` to read even more documentation.

Global options (see `drush topic core-global-options` for the full list):

.

.

.

```

## 开启Drupal

完成上面的准备后就可以开启Drupal了

### 创建Drupal项目

第一步,在项目目录下载drupal。目前有部分modules不支持8.x以上版本，所以我们在这里指定drupal-7.43

```console

$ drush dl drupal-7.43

```

第二步，进入到drupal目录下载中文简体语言包，并保存到`profiles/standard/translations/`。

如果需要更多语言支持，请查看－－[Drupal Translations](https://localize.drupal.org/)

```console

$ wget http://ftp.drupal.org/files/translations/7.x/drupal/drupal-7.43.zh-hans.po -P profiles/standard/translations/

```

第三步，创建drupal需要到数据库

```console

$ mysql -u root -p

Welcome to the MySQL monitor.

.

.

.

mysql> create database drupal;

mysql> grant all privileges on drupal.* to 'drupal'@'localhost' identified by '<你的密码>';

mysql>exit

```

第四步，配置Drupal站点，将`< >`符号的内容替换(包括`< >`)

```console

$ drush si standard --db-url=mysql://drupal:<数据库密码>@localhost/drupal --site-name=<站点名称> --site-mail=<站点邮箱> --locale=zh-hans --account-name=<管理员账号> --account-pass=<管理员密码> --account-mail=<管理员邮箱> -v

```

第五步，配置Nginx服务器

编辑`/usr/local/nginx/conf/drupal.conf`，如果没有就创建一个，然后将相应的`server_name` `root`填入。

`/usr/local/nginx/conf/drupal.conf`

```conf

server {

listen          80;

server_name    web-stack.drupal.local;

root            /vagrant_data/drupal;

index          index.php index.html;

access_log ^Ion;

location / {

try_files $uri $uri/ /index.php?$query_string;

}

location ~ \.php$ {

fastcgi_pass 127.0.0.1:9000;

fastcgi_index index.php;

include fastcgi.conf;

}

}

```

如果是在`vagrant` 虚拟机里面，需要将`drupal.conf`放到`/usr/local/nginx/conf/vhost/drupal.conf`。

然后修改`php-fpm`的配置，将默认的`listen.owner` `listen.group` `user` `group` 修改为`vagrant`。

将`listen`  改为 `127.0.0.1:9000`。

配置详细见下面代码片段

```console

$ sudo vim /usr/local/php/etc/php-fpm.conf

```

`/usr/local/php/etc/php-fpm.conf`

```conf

[global]

pid = /usr/local/php/var/run/php-fpm.pid

error_log = /usr/local/php/var/log/php-fpm.log

log_level = notice

[www]

listen = 127.0.0.1:9000

listen.backlog = -1

listen.allowed_clients = 127.0.0.1

listen.owner = vagrant

listen.group = vagrant

listen.mode = 0666

user = vagrant

group = vagrant

pm = dynamic

pm.max_children = 10

pm.start_servers = 2

pm.min_spare_servers = 1

pm.max_spare_servers = 6

request_terminate_timeout = 100

request_slowlog_timeout = 0

slowlog = var/log/slow.log

```

然后重启服务

```console

$ sudo lnmp restart

```

第六步，修改`hosts`

如果你已经配好了就可以省略。配置完成后就可以在浏览器通过`http://web-stack.drupal.local/`访问了

```console

$ sudo vim /etc/hosts

```

在末尾添加，代码如下：

`/etc/hosts`

```console

.

.

.

127.0.0.1  web-stack.drupal.local

```

温馨提示，如果是在`vagrant`虚拟机里面还需要修改端口映射，将80端口映射到主机中

完成之后就可以看到下图效果了

![drupal首页][2]

[1]: http://7xs0pm.com1.z0.glb.clouddn.com/6036FD39-C0DB-4DF1-928B-5C48D24C0F0C.png

[2]: http://7xs0pm.com1.z0.glb.clouddn.com/49F41CD9-7823-461E-A9FA-64CF30C7F641.png
