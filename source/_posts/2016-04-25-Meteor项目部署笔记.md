---
title: Meteor项目部署笔记
date: 2016-04-25 15:15:30
tags: Meteor
categories: Front-end
---

![meteor](/images/cover/meteorbg2.png)
记一次Meteor项目部署配置,使用 `CentOS` + `Meteor` + `React` + `Mongdb` + `Nginx`。
node版本与Meteor依赖一致`v0.10.43`
自定义服务配置比较麻烦，给出配置文件示例。

<!-- more -->

环境变量配置参数
_`/etc/profile`_
```sh
export PATH=/usr/local/mongodb/bin:$PATH
export MONGO_URL=mongodb://localhost:27017/chat
export ROOT_URL=http://chat.haoduoshipin.com
export PORT=9000
export PATH=/home/vagrant/.nvm/v0.10.43/bin:$PATH
export PATH=/usr/pgsql-9.4/bin/:$PATH
export PATH=/usr/bin:$PATH
export PATH=/usr/include/proj_api.h:$PATH
```

自定义服务:mongod
_`/etc/init/mongod.conf`_
```sh
# upstart service file at /etc/init/mongod.conf

# When to start the service
start on started sshd and runlevel [2345]

# When to stop the service
stop on shutdown

# Automatically restart process if crashed
respawn
respawn limit 10 5

script
    export PATH=/usr/local/mongodb/bin:/opt/local/bin:/opt/local/sbin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
    exec mongod >> /home/vagrant/logs/mongod.log
end script
```

自定义服务:chat
_`/etc/init/chat.conf`_
```sh
# upstart service file at /etc/init/chat.conf

# When to start the service
start on started mongod and runlevel [2345]

# When to stop the service
stop on shutdown

# Automatically restart process if crashed
respawn
respawn limit 10 5

script
    export PATH=/home/vagrant/.nvm/v0.10.43/bin:/opt/local/bin:/opt/local/sbin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

    # set to home directory of the user Meteor will be running as
    export PWD=/home/vagrant
    export HOME=/home/vagrant
    # leave as 127.0.0.1 for security
    export BIND_IP=127.0.0.1
    # the port nginx is proxying requests to
    export PORT=9000
    # this allows Meteor to figure out correct IP address of visitors
    export HTTP_FORWARDED_COUNT=1
    # MongoDB connection string using meteor as database name
    export MONGO_URL=mongodb://localhost:27017/chat
    # The domain name as configured previously as server_name in nginx
    export ROOT_URL=http://chat.haoduoshipin.com
    exec node /home/vagrant/chat/bundle/main.js >> /home/vagrant/chat/chat.log
end script
```

nginx代理配置
_`/usr/local/nginx/conf/vhost/chat.conf`_
```sh
server {
  listen         80;
  server_name chat.com;
  location / {
    proxy_pass http://localhost:9000;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Host $http_x_forwarded_host;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_read_timeout 3m;
    proxy_send_timeout 3m;
  }
}

```

在CentOS6.5中启动自定义服务
```console
$ initctl
```

启动自定义mongdb服务
```console
$ sudo initctl start mongod
```

启动chat服务
```console
$ sudo initctl chat mongod
```

启动nginx服务
```console
$ sudo service nginx start
```

mongdb使用
```console
$ mongo
> show dbs
chat   0.000GB
local  0.000GB
> use chat
switched to db chat
> show collections
users
.
.
.
> db.users.find()
```

nginx 代理监听端口`9000`

外部访问地址`http://chat.com:8080`