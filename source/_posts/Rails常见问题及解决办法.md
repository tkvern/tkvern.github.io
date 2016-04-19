---
title: Rails常见问题及解决办法
tags: PostgreSQL
categories: Ruby on Rails
---
## No pg_config...
 *问题重现*: 在`bundle`的时候出现gem包`pg-0.18.4`安装出错的情况，错误代码如下:
```console
$ bundle
.
.
.
Gem::Ext::BuildError: ERROR: Failed to build gem native extension.

    current directory: /home/vagrant/.rvm/gems/ruby-2.3.0/gems/pg-0.18.4/ext
/home/vagrant/.rvm/rubies/ruby-2.3.0/bin/ruby -r ./siteconf20160415-7139-1cu08ba.rb extconf.rb
checking for pg_config... no
No pg_config... trying anyway. If building fails, please try again with
 --with-pg-config=/path/to/pg_config
checking for libpq-fe.h... no
Can't find the 'libpq-fe.h header
*** extconf.rb failed ***
Could not create Makefile due to some reason, probably lack of necessary
libraries and/or headers.  Check the mkmf.log file for more details.  You may
need configuration options.

Provided configuration options:
 --with-opt-dir
 --without-opt-dir
 --with-opt-include
 --without-opt-include=${opt-dir}/include
 --with-opt-lib
 --without-opt-lib=${opt-dir}/lib
 --with-make-prog
 --without-make-prog
 --srcdir=.
 --curdir
 --ruby=/home/vagrant/.rvm/rubies/ruby-2.3.0/bin/$(RUBY_BASE_NAME)
 --with-pg
 --without-pg
 --enable-windows-cross
 --disable-windows-cross
 --with-pg-config
 --without-pg-config
 --with-pg_config
 --without-pg_config
 --with-pg-dir
 --without-pg-dir
 --with-pg-include
 --without-pg-include=${pg-dir}/include
 --with-pg-lib
 --without-pg-lib=${pg-dir}/lib

To see why this extension failed to compile, please check the mkmf.log which can be found here:

  /home/vagrant/.rvm/gems/ruby-2.3.0/extensions/x86_64-linux/2.3.0/pg-0.18.4/mkmf.log

extconf failed, exit code 1

Gem files will remain installed in /home/vagrant/.rvm/gems/ruby-2.3.0/gems/pg-0.18.4 for inspection.
Results logged to /home/vagrant/.rvm/gems/ruby-2.3.0/extensions/x86_64-linux/2.3.0/pg-0.18.4/gem_make.out
.
.
.
An error occurred while installing pg (0.18.4), and Bundler cannot continue.
Make sure that `gem install pg -v '0.18.4'` succeeds before bundling.
```

 *解决方案*: 先不要急着按提示去执行，出现这个问题可能是你没有安装PostgreSQL或是没有指定pgsql的路径。如果没有安装PostgreSQL，点击[传送门](http://www.postgresql.org/download/)去安装(注意：执行`yum install postgresql-server`后继续往下看文档安装pgsql的扩展，建议最好安装的PostgreSQL是9.X以上版本，否则许多新特性无法使用)。英文不太好的同学可以到这篇博客[PostgreSQL新手入门](http://www.ruanyifeng.com/blog/2013/12/getting_started_with_postgresql.html)看看。
步骤1:
安装`libpq-dev`包
Ubuntu执行以下命令：
```console
$ apt-get install libpq-dev
```

CentOS/RetH执行以下命令：
```console
$ yum install postgresql-devel
```

步骤2:
找到你的pgsql安装目录
我的是在`/usr/pgsql-9.4`，也有可能会在`/usr/local/pgsql`，因系统而异。

步骤3:
`with-pg-config`后面接的就是pgsql目录下的pg_config文件，注意`--with-pg-config`前面还有两个`-`
```
$ gem install pg -v '0.18.4' -- --with-pg-config=/usr/pgsql-9.4/bin/pg_config
```

步骤4:
重新执行`bundle`命令


## 无法连接pgsql
*问题重现*: 运行`rails s -b 0.0.0.0 -p 3000`后，在浏览器打开项目首页出现下面问题

```console
PG::ConnectionBad (FATAL:  Ident authentication failed for user "postgres"
):
  activerecord (4.2.3) lib/active_record/connection_adapters/postgresql_adapter.rb:655:in `initialize'
  activerecord (4.2.3) lib/active_record/connection_adapters/postgresql_adapter.rb:655:in `new'
  activerecord (4.2.3) lib/active_record/connection_adapters/postgresql_adapter.rb:655:in `connect'
  activerecord (4.2.3) lib/active_record/connection_adapters/postgresql_adapter.rb:242:in `initialize'
  activerecord-postgis-adapter (3.1.0) lib/active_record/connection_adapters/postgis_adapter.rb:51:in `initialize'
.
.
.
```

*解决方案*: 
找到 `pg_hba.conf`文件, 一般是在`/var/lib/pgsql/data`目录下，如果修改后不生效看看`/var/lib/pgsql`目录下是否还有其他的数据目录。因系统环境而异。
使用`vim`或`vi`打开
步骤1:
```console
$ vim /var/lib/pgsql/data/pg_hba.conf
```

步骤2:
按住`shift` + `g` 将光标定位的文件底部，按`i`进入编辑模式，修改METHOP为md5验证。
完成后按`shift` + `:` 进入命令模式，输入`wq`完成编辑。
下面给出修改后效果
```conf
.
.
.
# TYPE  DATABASE    USER        CIDR-ADDRESS          METHOD

# "local" is for Unix domain socket connections only
local   all         all                               md5
# IPv4 local connections:
host    all         all         127.0.0.1/32          md5
# IPv6 local connections:
host    all         all         ::1/128               md5
                                                            
```

步骤3:
重启`postgresql`服务
```console
$ service postgresql restart
```

# type "json" does not exist

*问题重现*: 执行`rake db:migrate`时出现错误，错误代码如下：
```console
$ rake db:migrate
.
.
.
== 20151208044806 CreateShops: migrating ======================================
-- create_table(:shops)
rake aborted!
StandardError: An error has occurred, this and all later migrations canceled:

PG::UndefinedObject: ERROR:  type "json" does not exist
LINE 1: ...ying NOT NULL, "logo" character varying, "images" json, "reg...
.
.
.
```

*解决方案*：出现这种问题大多是因为安装了老版的PostgreSQL，在CentOS上面执行`yum install postgresql`默认是8.X版本。升级版本即可。

步骤1:删除旧版postgresql
```console
$ yum remove postgresql*
```
步骤2:更新yum
```console
$ yum update
```

步骤3: 到[http://yum.pgrpms.org/reporpms/](http://yum.pgrpms.org/reporpms/)选择9.X以上版本下载相应的rpm包
```console
$ wget https://download.postgresql.org/pub/repos/yum/9.4/redhat/rhel-6-x86_64/pgdg-centos94-9.4-2.noarch.rpm
```
 步骤4:使用下载好的rpm包
```console
$ rpm -ivh pgdg-centos94-9.4-2.noarch.rpm
```
步骤5:安装`postgresql94-server`
```console
yum -y install postgresql94-server
```
步骤6:重新启动`postgresql-94`服务
```console
$ service postgresql-9.4 start
```

# type "geography" does not exist
*问题重现*:执行`rake db:migrate`时出现错误，错误代码如下：

```console
$ rake db:migrate
.
.
.
rake aborted!
StandardError: An error has occurred, this and all later migrations canceled:

PG::UndefinedObject: ERROR:  type "geography" does not exist
LINE 1: ... "address" character varying NOT NULL, "location" geography(...
.
.
.
```

*解决方案*: 这是由于没有安装支持`geography`类型数据的扩展，笔者使用的是PostgreSQL-9.4版本，这里给出9.X版本的解决方案。为了后续用到其他扩展方便，这里也就一起安装了。

步骤1: `list`命令查看`postgresql`有哪些扩展，当你看到下面效果说明你的yum库中有这些扩展，如果没有请到[http://yum.pgrpms.org/reporpms/](http://yum.pgrpms.org/reporpms/)选择9.X以上版本下载相应的rpm包安装。如果不需要请跳过步骤1，步骤2
```console
$ yum list postgresql94-*
已加载插件：fastestmirror
Repository pgdg94 is listed more than once in the configuration
Repository pgdg94-source is listed more than once in the configuration
Loading mirror speeds from cached hostfile
 * base: mirrors.yun-idc.com
 * extras: mirrors.yun-idc.com
 * updates: mirrors.yun-idc.com
已安装的软件包
postgresql94.x86_64                                                               9.4.7-1PGDG.rhel6                                                    @pgdg94
postgresql94-libs.x86_64                                                          9.4.7-1PGDG.rhel6                                                    @pgdg94
postgresql94-server.x86_64                                                        9.4.7-1PGDG.rhel6                                                    @pgdg94
可安装的软件包
postgresql94-contrib.x86_64                                                       9.4.7-1PGDG.rhel6                                                    pgdg94 
postgresql94-debuginfo.x86_64                                                     9.4.7-1PGDG.rhel6                                                    pgdg94 
postgresql94-devel.x86_64                                                         9.4.7-1PGDG.rhel6                                                    pgdg94 
postgresql94-docs.x86_64                                                          9.4.7-1PGDG.rhel6                                                    pgdg94 
postgresql94-jdbc.x86_64                                                          9.3.1101-1PGDG.rhel6                                                 pgdg94 
postgresql94-jdbc-debuginfo.x86_64                                                9.3.1101-1PGDG.rhel6                                                 pgdg94 
postgresql94-odbc.x86_64                                                          09.03.0400-1PGDG.rhel6                                               pgdg94 
postgresql94-odbc-debuginfo.x86_64                                                09.03.0400-1PGDG.rhel6                                               pgdg94 
postgresql94-plperl.x86_64                                                        9.4.7-1PGDG.rhel6                                                    pgdg94 
postgresql94-plpython.x86_64                                                      9.4.7-1PGDG.rhel6                                                    pgdg94 
postgresql94-pltcl.x86_64                                                         9.4.7-1PGDG.rhel6                                                    pgdg94 
postgresql94-python.x86_64                                                        4.2-1PGDG.rhel6                                                      pgdg94 
postgresql94-python-debuginfo.x86_64                                              4.2-1PGDG.rhel6                                                      pgdg94 
postgresql94-tcl.x86_64                                                           2.1.1-1.rhel6                                                        pgdg94 
postgresql94-tcl-debuginfo.x86_64                                                 2.1.1-1.rhel6                                                        pgdg94 
postgresql94-test.x86_64      
```

步骤2:安装扩展
```console 
$ sudo yum install postgresql94-*
```

步骤3: 前往[postgis](http://postgis.net/source/)安装扩展。
友情提示：自行编译源码的话，如果系统编译环境不完全，会折腾很久，建议直接用yum安装。推荐一篇文章[[centos安装postgis
](http://www.icanx.cn/p/13)](http://www.icanx.cn/p/13)。
作者是为PostgreSQL源加上EPEL源，直接yum安装，无痛解决依赖问题。抓狂的同学速度get。如果依然报错，请执行`rake db:drop`，然后再创建一次数据库就行了。
