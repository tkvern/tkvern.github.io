---
title: 进击Drupal-2
tags: Drupal
categories: php
---

Author ：[tkvern](https://github.com/tkvern)

---

## 安装Drupal常用模块

- `ctools`其他模块会依赖这个模块
```console
$ drush dl ctools 
$ drush en ctools -y
```

- `views`用于创建各种形式的列表
```console
$ drush dl views 
$ drush en views views_ui -y
```

- `rules`执行设定任务
```console
$ drush dl rules 
$ drush en rules rules_admin -y
```

- `flag`标识模块
```console
$ drush dl flag 
$ drush en flag -y
```

- `token`依赖模块
```console
$ drush dl token 
$ drush en token -y
```

- `pathauto`定义内容地址模式
```console
$ drush dl pathauto 
$ drush en pathauto -y
```

- `jquery_update`升级Drupal自带jquery版本，这里选择`7.x-2.x-dev`版本
```console
$ drush dl jquery_update            //选择4
Choose one of the available releases for jquery_update:
 [0]  :  Cancel
 [1]  :  7.x-3.0-alpha3  -  2015-Oct-20  -  Supported
 [2]  :  7.x-3.x-dev     -  2015-Oct-20  -  Development
 [3]  :  7.x-2.7         -  2015-Oct-20  -  Security, Supported, Recommended
 [4]  :  7.x-2.x-dev     -  2015-Oct-20  -  Development
 [5]  :  7.x-1.x-dev     -  2013-Sep-30  -  Development
$ drush en jquery_update -y
```

- `libraries`共享类库
```console
$ drush dl libraries 
$ drush en libraries -y
```

- `module_filter`更友好的模块管理界面 
```console
$ drush dl module_filter 
$ drush en module_filter -y
```


- `l10n_update`翻译模块  
```console
$ drush dl l10n_update 
$ drush en l10n_update -y
```
使用`l10n_update`命令
```console
$ drush | grep l10n
$ drush l10n-update-refresh
$ drush l10n-update
```

## 管理主题
本节会配置一下基本的主题搭配
### 安装 `adminimal_theme` 开发版
输入下面命令，选择[1]

```console
$ drush dl adminimal_theme --select  //选择[1]
$ drush en adminimal -y
drush vset admin_theme adminimal    //设置主题
```
