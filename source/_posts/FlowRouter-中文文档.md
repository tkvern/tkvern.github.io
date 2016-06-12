---
title: FlowRouter 中文文档
date: 2016-06-12 15:24:15
tags: FlowRo
categories: Front-end
---


 TKVERN 翻译 | 源文档链接[FlowRouter](https://github.com/kadirahq/flow-router/) 
 (如果你发现翻译中存在谬误的地方, 请留言, 我会继续造福社会. 建议结合源文档查看翻译)

为Meteor精心设计的客户端Router

FlowRouter 是 Meteor 一个非常简单的路由器.它为客户端程序routing,不处理渲染本身.

它为改变URL和获取数据获取提供了一个良好的API. 然而, 在router内部, 这不是reactive. 最重要的是, FlowRouter 的设计时考虑到性能和专注于自己最擅长的: **routing**.

> 如果你已经在使用 FlowRouter,我们发布了2.0版本,同时遵循 [migration guide](#migrating-into-20).

<!-- more -->

## TOC

* [Meteor Routing Guide](#meteor-routing-guide)
* [Getting Started](#getting-started)
* [Routes Definition](#routes-definition)
* [Group Routes](#group-routes)
* [Rendering and Layout Management](#rendering-and-layout-management)
* [Triggers](#triggers)
* [Not Found Routes](#not-found-routes)
* [API](#api)
* [Subscription Management](#subscription-management)
* [IE9 Support](#ie9-support)
* [Hashbang URLs](#hashbang-urls)
* [Prefixed paths](#prefixed-paths)
* [Add-ons](#add-ons)
* [Difference with Iron Router](#difference-with-iron-router)
* [Migrating into 2.0](#migrating-into-20)

## Meteor Routing Guide

[Meteor Routing Guide](https://kadira.io/academy/meteor-routing-guide) 是一个关于 Meteor **routing** 主题的完整指南 . 谈论了如何正确使用 FlowRouter 和 **Blaze and React**. 也显示了如何管理 **subscriptions** 和在视图实现 **auth logic**.

[![Meteor Routing Guide](https://cldup.com/AxlPfoxXmR.png)](https://kadira.io/academy/meteor-routing-guide)

## Getting Started

添加 FlowRouter 到你的app:

```shell
meteor add kadira:flow-router
```

让我们写第一个 route (添加文件到 `lib/router.js`):

```js
FlowRouter.route('/blog/:postId', {
    action: function(params, queryParams) {
        console.log("Yeah! We are on the post:", params.postId);
    }
});
```

在浏览器访问 `/blog/my-post-id`,  或从console调用下面的命令:

```js
FlowRouter.go('/blog/my-post-id');
```

然后,你就可以在console看到打印的消息了.

## Routes Definition

FlowRouter 的 routes 非常简单, [Express](http://expressjs.com/) 和 `iron:router`都有使用基于[path-to-regexp](https://github.com/pillarjs/path-to-regexp)的语法 

下面是一个简单的route语法:

```js
FlowRouter.route('/blog/:postId', {
    // do some action for this route
    action: function(params, queryParams) {
        console.log("Params:", params);
        console.log("Query Params:", queryParams);
    },

    name: "<name for the route>" // optional
});
```

那么,当你访问这个url的时候,这条route就会被激活:

```js
FlowRouter.go('/blog/my-post?comments=on&color=dark');
```

在你访问这条route之后, console会打印下面内容:

```
Params: {postId: "my-post"}
Query Params: {comments: "on", color: "dark"}
```

对于单个 interaction, router只会运行一次. 这意味着, 在你访问 route 后, 它会首先调用 `triggers`, 接着是 `subscriptions`, 最后调用 `action`. 出现没有这些方法这种情况后,route访问将会再次调用.

你可以在 `client` 任何目录定义routes. 但是, 我们推荐你添加到 `lib` 目录. 那么 `fast-render` 能够检测 subscriptions 和 send 它们给你 (我们会在这里谈论).

### Group Routes

你可以对routes分组来更好的组织route. 这是一个例子:

```js
var adminRoutes = FlowRouter.group({
  prefix: '/admin',
  name: 'admin',
  triggersEnter: [function(context, redirect) {
    console.log('running group triggers');
  }]
});

// handling /admin route
adminRoutes.route('/', {
  action: function() {
    BlazeLayout.render('componentLayout', {content: 'admin'});
  },
  triggersEnter: [function(context, redirect) {
    console.log('running /admin trigger');
  }]
});

// handling /admin/posts
adminRoutes.route('/posts', {
  action: function() {
    BlazeLayout.render('componentLayout', {content: 'posts'});
  }
});
```

**所有对于 `FlowRouter.group()` 的options都是可选的.**

你甚至可以像下面一样嵌套group routes:

```js
var adminRoutes = FlowRouter.group({
    prefix: "/admin",
    name: "admin"
});

var superAdminRoutes = adminRoutes.group({
    prefix: "/super",
    name: "superadmin"
});

// handling /admin/super/post
superAdminRoutes.route('/post', {
    action: function() {

    }
});
```

你可以判断当前的route是在使用哪个group:

```js
FlowRouter.current().route.group.name
```

如果当前的route是具体的group (e.g. *admin*, *public*, *loggedIn*) 无需使用前缀,如果你不想.如果它是一个嵌套的group, 你可以像这样获取父级group的name:

```js
FlowRouter.current().route.group.parent.name
```

如同所有的当前 route 属性, 都不是 reactive, 但是可以结合`FlowRouter.watchPathChange()` 获取group名.

## Rendering and Layout Management

FlowRouter 不处理渲染和布局管理. 为此, 你可以使用:

  * [Blaze Layout for Blaze](https://github.com/kadirahq/blaze-layout)
  * [React Layout for React](https://github.com/kadirahq/meteor-react-layout)

这样在一个route你可以从 `action` 的内部 method调用布局管理.

```js
FlowRouter.route('/blog/:postId', {
    action: function(params) {
        BlazeLayout.render("mainLayout", {area: "blog"});
    }
});
```

## Triggers

Triggers 是 FlowRouter 可以允许你在 **enter** 这个 route 之前和 **exit** 这个 route 之后执行相应的任务.

### Defining triggers for a route

这里是如何为一个 route 定义 triggers :

```js
FlowRouter.route('/home', {
  // calls just before the action
  triggersEnter: [trackRouteEntry],
  action: function() {
    // do something you like
  },
  // calls when when we decide to move to another route
  // but calls before the next route started
  triggersExit: [trackRouteClose]
});

function trackRouteEntry(context) {
  // context is the output of `FlowRouter.current()`
  Mixpanel.track("visit-to-home", context.queryParams);
}

function trackRouteClose(context) {
  Mixpanel.track("move-from-home", context.queryParams);
}
```

### Defining triggers for a group route

这里是如何在一个 group 定义里定义 triggers.

```js
var adminRoutes = FlowRouter.group({
  prefix: '/admin',
  triggersEnter: [trackRouteEntry],
  triggersExit: [trackRouteEntry]
});
```

> 你可以添加 triggers 到单个 routes 或是 group .

### Defining Triggers Globally

你同样可以定义全局 triggers. 这里是怎么做:

```js
FlowRouter.triggers.enter([cb1, cb2]);
FlowRouter.triggers.exit([cb1, cb2]);

// filtering
FlowRouter.triggers.enter([trackRouteEntry], {only: ["home"]});
FlowRouter.triggers.exit([trackRouteExit], {except: ["home"]});
```

如你所看到的最后两个例子, 你可以筛选 routes 使用 `only` 或者 `except` 关键字. 但是, 你不能同时使用 `only` and `except`.

> 如果你想了解更多关于 triggers 和 设计决策, 访问 [here](https://github.com/meteorhacks/flow-router/pull/59).

### Redirecting With Triggers

你可以使用 triggers 重定向到一个不同 route . 你可以在triggers enter 和 exit 做到这一点. 看看如何做的吧:

```js
FlowRouter.route('/', {
  triggersEnter: [function(context, redirect) {
    redirect('/some-other-path');
  }],
  action: function(_params) {
    throw new Error("this should not get called");
  }
});
```

每个 trigger callback 的第二个参数: 一个 function 你可以使用 redirect 到 一个不同的 route. Redirect 也有一些属性来确保不会阻止 router.

* redirect 必须是调用一个 URL
* redirect 必须在同一个event循环周期 (没有异步或调用内部 Tracker)
* redirect 不能多次调用

检查这个 [PR](https://github.com/meteorhacks/flow-router/pull/172) 以了解更多关于 redirect 的 API.

### Stopping the Callback With Triggers

在有些情况, 你也许需要停止使用 triggers 的 route callback. 你可以在 **before** triggers, 使用第三个参数: `stop` function. 例如, 你可以检查前缀, 如果失败, 在before action停止和显示 notFound layout.

```js
var localeGroup = FlowRouter.group({
  prefix: '/:locale?',
  triggersEnter: [localeCheck]
});

localeGroup.route('/login', {
  action: function (params, queryParams) {
    BlazeLayout.render('componentLayout', {content: 'login'});
  }
});

function localeCheck(context, redirect, stop) {
  var locale = context.params.locale;

  if (locale !== undefined && locale !== 'fr') {
    BlazeLayout.render('notFound');
    stop();
  }
}
```

 > **Note**: 当你使用 stop function,即使你不使用它,你应该通过第二个 **redirect** 参数.


## Not Found Routes

你可以像这样配置 Not Found 的 routes:

```js
FlowRouter.notFound = {
    // Subscriptions registered here don't have Fast Render support.
    subscriptions: function() {

    },
    action: function() {

    }
};
```

## API

FlowRouter 有丰富的 API 帮助你浏览这个 router 和获取这个 router 的信息.

### FlowRouter.getParam(paramName);

你可以使用 Reactive function 获取 URL 的一个参数.

```js
// route def: /apps/:appId
// url: /apps/this-is-my-app

var appId = FlowRouter.getParam("appId");
console.log(appId); // prints "this-is-my-app"
```

### FlowRouter.getQueryParam(queryStringKey);

你可以用Reactive function 的 queryString 查询你需要的value.

```js
// route def: /apps/:appId
// url: /apps/this-is-my-app?show=yes&color=red

var color = FlowRouter.getQueryParam("color");
console.log(color); // prints "red"
```

### FlowRouter.path(pathDef, params, queryParams)

从定义的path中生成path. 都有 `params` 和 `queryParams` 两个选项.

URL的特殊字符在 `params` 和 `queryParams` 中会被转码.

```js
var pathDef = "/blog/:cat/:id";
var params = {cat: "met eor", id: "abc"};
var queryParams = {show: "y+e=s", color: "black"};

var path = FlowRouter.path(pathDef, params, queryParams);
console.log(path); // prints "/blog/met%20eor/abc?show=y%2Be%3Ds&color=black"
```

如果没有 params 或 queryParams, 这将只会返回 pathDef.

#### Using Route name instead of the pathDef

你也可以使用 route's name 代替 pathDef. 那么, FlowRouter 会从给定的 route 选择 pathDef. 看下面的例子:

```js
FlowRouter.route("/blog/:cat/:id", {
    name: "blogPostRoute",
    action: function(params) {
        //...
    }
})

var params = {cat: "meteor", id: "abc"};
var queryParams = {show: "yes", color: "black"};

var path = FlowRouter.path("blogPostRoute", params, queryParams);
console.log(path); // prints "/blog/meteor/abc?show=yes&color=black"
```

### FlowRouter.go(pathDef, params, queryParams);

这将通过 `FlowRouter.path` 基于 arguments 和 re-route 到达相应的 path ,  .

你可以像这样调用 `FlowRouter.go` :

```js
FlowRouter.go("/blog");
```


### FlowRouter.url(pathDef, params, queryParams)

就像 `FlowRouter.path`, 但给出的是绝对路径. (在后端使用 `Meteor.absoluteUrl`.)

### FlowRouter.setParams(newParams)

这会改变当前的 params, re-route 到新的 path.

```js
// route def: /apps/:appId
// url: /apps/this-is-my-app?show=yes&color=red

FlowRouter.setParams({appId: "new-id"});
// Then the user will be redirected to the following path
//      /apps/new-id?show=yes&color=red
```

### FlowRouter.setQueryParams(newQueryParams)

就像 `FlowRouter.setParams`, 但是是 queryString params.

删除 query param 设置为 `null` 如下:

```js
FlowRouter.setQueryParams({paramToRemove: null});
```

### FlowRouter.getRouteName()

获取route reactively 的 name.

```js
Tracker.autorun(function() {
  var routeName = FlowRouter.getRouteName();
  console.log("Current route name is: ", routeName);
});
```

### FlowRouter.current()

获取 router 的当前状态. **This API is not reactive**.
如果你需要观察 path 的变化,可以使用 `FlowRouter.watchPathChange()`.

这给出来一个 object:

```js
// route def: /apps/:appId
// url: /apps/this-is-my-app?show=yes&color=red

var current = FlowRouter.current();
console.log(current);

// prints following object
// {
//     path: "/apps/this-is-my-app?show=yes&color=red",
//     params: {appId: "this-is-my-app"},
//     queryParams: {show: "yes", color: "red"}
//     route: {pathDef: "/apps/:appId", name: "name-of-the-route"}
// }
```

### FlowRouter.watchPathChange()

监听 path 的变化.如果你需要像使用 API 一样获得 params 或queryParams 可以用 `FlowRouter.getQueryParam()`.

```js
Tracker.autorun(function() {
  FlowRouter.watchPathChange();
  var currentContext = FlowRouter.current();
  // do anything with the current context
  // or anything you wish
});
```

### FlowRouter.withReplaceState(fn)
通常, 所有的 route 改变通过像 `FlowRouter.go` 和 `FlowRouter.setParams()` 这样的 APIs 添加 URL item 到浏览器的 history. 例如, 运行下面的代码:

```js
FlowRouter.setParams({id: "the-id-1"});
FlowRouter.setParams({id: "the-id-2"});
FlowRouter.setParams({id: "the-id-3"});
```

现在你可以点击浏览器的后退按钮2次. 这是常见的行为, 因为用户可以点击“后退”按钮, 并期待看到应用程序的前一个状态.

但是有些时候, 这不是你想要的. 你不需要污染浏览器 history. 那么, 你可以使用下面的语法.

```js
FlowRouter.withReplaceState(function() {
  FlowRouter.setParams({id: "the-id-1"});
  FlowRouter.setParams({id: "the-id-2"});
  FlowRouter.setParams({id: "the-id-3"});
});
```

现在, 没有任何 item 在浏览器 history 中了. 就像 `FlowRouter.setParams`, 你可以使用任何 FlowRouter 的 API 在 `FlowRouter.withReplaceState` 里面.

> 我们命名这个功能为 `withReplaceState` , 因为, replaceState 是 underline API 用于此功能. 阅读更多关于 [replace state & the history API](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Manipulating_the_browser_history).

### FlowRouter.reload()

FlowRouter routes 是幂等的. 这意味着, 即使你多次调用 `FlowRouter.go()` 到相同的 URL , 但是它只在第一次运行时激活. 这也是真实的直接点击路径.

因此, 如果你真的需要 reload 这个 route, 这个就是你想要的 API .

### FlowRouter.wait() and FlowRouter.initialize()

在默认情况下, FlowRouter 初始化这个路由 process 在 `Meteor.startup()` 中回调. 对大多数app而言是这样工作. 但是, 一些 app 自定义初始化需要在 FlowRouter 初始化之后.

因此, `FlowRouter.wait()` 可以帮助你.你需要直接在 JavaScript 文件里调用. 然后, 当时的 app 准备好后调用 `FlowRouter.initialize()`.

eg:-

```js
// file: app.js
FlowRouter.wait();
WhenEverYourAppIsReady(function() {
  FlowRouter.initialize();
});
```

查看更多信息访问 [issue #180](https://github.com/meteorhacks/flow-router/issues/180).

### FlowRouter.onRouteRegister(cb)

这个 API 是特地为开发人员开发插件设计的. 他们可以监听任何 registered route 和为 FlowRouter 添加自定义功能. 这都工作在服务器端和客户端.

```js
FlowRouter.onRouteRegister(function(route) {
  // do anything with the route object
  console.log(route);
});
```

让我们看一个为用户定义的route:

```js
FlowRouter.route('/blog/:post', {
  name: 'postList',
  triggersEnter: [function() {}],
  subscriptions: function() {},
  action: function() {},
  triggersExit: [function() {}],
  customField: 'customName'
});
```

这个 route 的 object 会这这样:

```js
{
  pathDef: '/blog/:post',
  name: 'postList',
  options: {customField: 'customName'}
}
```

因此, 这不是我们正在使用的内部 route object.

## Subscription Management

对于订阅管理,我们强烈建议你遵循 [Template/Component level subscriptions](https://kadira.io/academy/meteor-routing-guide/content/subscriptions-and-data-management). 在这里查看 [guide](https://kadira.io/academy/meteor-routing-guide/content/subscriptions-and-data-management).

FlowRouter 也有它自己的订阅管理机制. 我们将在 3.0 版本移除. 我们不排除 2.x 版本 因为这是实现你 APP FastRender 支持最简单的方法.在 3.0 版本我们更好的支持 FastRender 在服务端渲染.

FlowRouter 只涉及 registration 和 subscriptions. 它不用等待 subscription 完成. 这是如何注册一个 subscription.

```js
FlowRouter.route('/blog/:postId', {
    subscriptions: function(params, queryParams) {
        this.register('myPost', Meteor.subscribe('blogPost', params.postId));
    }
});
```

我们也可以像这样全局注册 subscriptions :

```js
FlowRouter.subscriptions = function() {
  this.register('myCourses', Meteor.subscribe('courses'));
};
```

所有的全局 subscriptions 都运行在每一个 route 上. 因此, 在注册订阅是要特别注意命名.

然后你可以注册你的 subscriptions, 完成之后你可以检查 subscriptions 的状态:

```js
Tracker.autorun(function() {
    console.log("Is myPost ready?:", FlowRouter.subsReady("myPost"));
    console.log("Are all subscriptions ready?:", FlowRouter.subsReady());
});
```

因此, 你可以使用 `FlowRouter.subsReady` 在 template helpers 内部显示加载状态和相应的行为.

### FlowRouter.subsReady() with a callback

有些时候, 我们需要使用 `FlowRouter.subsReady()` 在 autorun 中是不可用的. 这有一个事件处理的例子. 在这样的地方, 我们可以使用回调 API  `FlowRouter.subsReady()`.

```js
Template.myTemplate.events({
   "click #id": function(){
      FlowRouter.subsReady("myPost", function() {
         // do something
      });
  }
});
```

> Arunoda 有讨论更多关于订阅管理 FlowRouter, 在个博客里 [this](https://meteorhacks.com/flow-router-and-subscription-management.html#subscription-management) 这篇文章 [FlowRouter and Subscription Management](https://meteorhacks.com/flow-router-and-subscription-management.html).

> 他展示了如何构建一个app:

>![FlowRouter's Subscription Management](https://cldup.com/esLzM8cjEL.gif)

#### Fast Render
FlowRouter 支持 [Fast Render](https://github.com/meteorhacks/fast-render).

- `meteor add meteorhacks:fast-render`
- 把 `router.js` 放在共享目录. 我们建议 `lib/router.js`.

你可以排除 Fast Render 支持通过包装 subscription registration 在 `isClient` 块:

```js
FlowRouter.route('/blog/:postId', {
    subscriptions: function(params, queryParams) {
        // using Fast Render
        this.register('myPost', Meteor.subscribe('blogPost', params.postId));

        // not using Fast Render
        if(Meteor.isClient) {
            this.register('data', Meteor.subscribe('bootstrap-data');
        }
    }
});
```

#### Subscription Caching

你也可以使用 [Subs Manager](https://github.com/meteorhacks/subs-manager) 在客户端缓存 subscriptions . 我们没有有任何特别的事情来让它工作. 它应该像其他 routers 一样工作.

## IE9 Support

FlowRouter 支持 IE9. 但是它没有 **HTML5 history polyfill**. 因为大多数app不需要它.

如果你需要支持 IE9, 添加 **HTML5 history polyfill** 到你的packege.

```shell
meteor add tomwasd:history-polyfill
```

## Hashbang URLs

使用网址名 `mydomain.com/#!/mypath` 简单设置 `hashbang` 为 `true`在初始化的 function 中:

```js
// file: app.js
FlowRouter.wait();
WhenEverYourAppIsReady(function() {
  FlowRouter.initialize({hashbang: true});
});
```

## Prefixed paths

例如,你希望在同一域名下运行多个web应用程序, 你可能会想在子路径在运行特定的 meteor application 服务 (eg `example.com/myapp`). 在这种情况下只包括路径前缀在 meteor `ROOT_URL` 的环境变量, FlowRouter 将会透明的处理没有任何额外参数的配置.

## Add-ons

Router 是基于 package 的 app. 其他项目像 [useraccounts](http://useraccounts.meteor.com/)  需要 FlowRouter 支持. 否则,  FlowRouter 很难用在真实项目中. 先在有很多 packages 都有 [started to support FlowRouter](https://kadira.io/blog/meteor/addon-packages-for-flowrouter).

因此, 你可以使用你喜欢的 FlowRouter package. 如果不是, 有一个叫 [easy process](https://kadira.io/blog/meteor/addon-packages-for-flowrouter#what-if-project-xxx-still-doesn-t-support-flowrouter-) 的包可以将它们转换为 FlowRouter.

**Add-on API**

我们还发布了一个 [new API](https://github.com/kadirahq/flow-router#flowrouteronrouteregistercb) 去支持开发者开发插件. 当用户在应用程序中创建一个路由时, 可以得到一个通知.

如果你有更多关于插件 API 的想法, 查看 [let us know](https://github.com/kadirahq/flow-router/issues).

## Difference with Iron Router

FlowRouter 和 Iron Router 是两个不同的 routers. Iron Router 试图成为一个全功能的解决方案.它试图做每一件事包括 routing, subscriptions, rendering and layout management.

FlowRouter 是一个简单的解决方案在 routing , UI performance 上. 它公开了有关功能的 APIs.

让我们了解更多的差别:

### Rendering

FlowRouter 不处理渲染. 通过解耦渲染, 它可以使用任何渲染框架, 比如使用 [Blaze Layout](https://github.com/kadirahq/blaze-layout) 进行动态模版渲染 .在路由动作中, 可以调用像 [React](https://github.com/kadirahq/meteor-react-layout) 这样的布局框架.

### Subscriptions

对于 FlowRouter, 我们强烈建议你使用 template/component layer subscriptions. 但是,如果你需要在路由器层做路由, FlowRouter 有 [subscription registration](#subscription-management) 机制. 即使有, FlowRouter 永远不要等待 subscriptions 和 view layer 来做.

### Reactive Content

在 Iron Router 你可以在 reactive content 里面使用 router, 但是任何一个 hook 或 method 可以以一个不可预测的方式重新运行. FlowRouter 限制；  reactive 的数据源单个的运行; 当首先调用的时候.

我们认为这是可行当方法. Router 只是用户当 action. 我们可以在渲染层完成响应内容的工作.

### router.current() is evil

`Router.current()` 是邪恶的. 为什么? 让我们看看下面的这个例子.想象一下我们的 app 有这样一个 route:

```
/apps/:appId/:section
```

现在让我们说,我们需要从 URL 获取 `appId`. 我们会这样做,  像在 Iron Router 一样.

```js
Templates['foo'].helpers({
    "someData": function() {
        var appId = Router.current().params.appId;
        return doSomething(appId);
    }
});
```

我们在 route 中改变 `:section` . 那么上面的方法也会重新运行. 如果我们增加一个 query param 到 URL, 它也会重新运行. 这是因为 `Router.current()` 会寻找改变 route(or URL). 但是在任何情况下, `appId` 不会改变.

因为这个, 我们到应用程序很多部分会重新运行,重新渲染. 这将会出现不可预测到渲染行为.

FlowRouter 为修复次问题提供里 `Router.getParam()` API. 看看如何使用:

```js
Templates['foo'].helpers({
    "someData": function() {
        var appId = FlowRouter.getParam('appId');
        return doSomething(appId);
    }
});
```

### No data context

FlowRouter 没有 data context. Data context 会有像 `.current()` 这样到问题. 我们相信, 它可以直接在 template (component) 层获取数据.

### Built in Fast Render Support

FlowRouter 已构建 [Fast Render](https://github.com/meteorhacks/fast-render) 支持. 只要天骄 Fast Render 到你到 app 它就会工作里. router 不需要做任何改变.

更多关于 check 信息的文档, 查看 [docs](#fast-render).

### Server Side Routing

FlowRouter 是客户端 router 它不支持服务的路由. 但是 `subscriptions` 运行在服务的支持 Fast Render.

#### Reason behind that

Meteor 不是一个从服务器直接发送 HTML 到客户端的传统开发框架. Meteor 最初需要发送一个特殊的 HTML 到客户端. 因此, 你不能直接向客户端发送一些东西.

此外, 相比于客户端, 在服务器端我们需要寻找一些不同的东西. 例如:

* 在服务器端我们必须处理头文件.
* 在服务器端我们必须处理像 `GET`, `POST` 这样类似的方法.
* 还有 Cookies.

因此, 最好使用服务器端专用的 router 像 [`meteorhacks:picker`](https://github.com/meteorhacks/picker). 它支持连接和表达中间件, 并且它的 route 语法很简单.

### Server Side Rendering

FlowRouter 3.0 将有服务器端渲染的支持. 我们已经开始了初步版本, 查看这个branch [`ssr`](https://github.com/meteorhacks/flow-router/tree/ssr).

这目前是非常有用的, Kadira 的 <https://kadira.io> 已经有在使用.

### Better Initial Loading Support

在 Meteor 中, 我们要等到渲染之前发送所有到JS和其他资源. 这是一个问题. 在 3.0 版本, 在服务器端的支持下我们修复了它.

## Migrating into 2.0

迁移到 2.0 版本是很容易到, 你不需要改变应用到任何代码,因为你已经在使用 2.0 版本的 APIs 了. 在 2.0 版本, 我们改变了名字和删除了一些过时的 APIs.

以下是将应用迁移到 2.0 版本的步骤.

### Use the New FlowRouter Package
* Now FlowRouter comes as `kadira:flow-router`
* So, remove `meteorhacks:flow-router` with : `meteor remove meteorhacks:flow-router`
* Then, add `kadira:flow-router` with `meteor add kadira:flow-router`

### Change FlowLayout into BlazeLayout
* 我们重新命名了 FlowLayout 为 [BlazeLayout](https://github.com/kadirahq/blaze-layout).
* 因此, 移除 `meteorhacks:flow-layout` 和添加 `kadira:blaze-layout` 即可.
* 你需要使用 `BlazeLayout.render()` 代替 `FlowLayout.render()`

### Stop using deprecated Apis
* 这没有中间件支持. 使用 triggers 代替.
* 这没有 API 叫 `.reactiveCurrent()`, 使用 `.watchPathChange()` 代替.
* 早些时候,你可以用 `FlowRouter.current().params.query` 访问和查询params. 但是, 现在你不能这样总了. 使用 `FlowRouter.current().queryParams` 代替.
