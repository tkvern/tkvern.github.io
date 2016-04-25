---
title: Gulp构建实例
tags: Gulp
categories: Front-end
date: 2015-12-10 21:26:49
---

![gulp](https://o5zglbuyp.qnssl.com/gulpbg.png)
## 结构说明

`assets`项目资源目录，`dev`开发目录，`dist`编译输出目录，`gulpfile.js`自动化工具API

<!-- more -->
## gulp的使用

### 安装node环境(自行goole即可)

### 全局安装gulp
```console
$ npm install gulp -g
```

### 进入到需要gulp管理的项目路径, 如 `/gulp` 再安装一遍
```console
$ npm install gulp --save-dev
```
  
### 安装gulp插件

 
```console
$ npm install --save-dev gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del
```

```javascript
  sass的编译 (`gulp-ruby-sass`)
  自动添加css前缀（`gulp-autoprefixer`）
  压缩css（`gulp-minify-css`）
  js代码校验（`gulp-jshint`）
  合并js文件（`gulp-concat`）
  压缩js代码（`gulp-uglify`）
  压缩图片（`gulp-imagemin`）
  自动刷新页面（`gulp-livereload`）
  图片缓存，只有图片替换了才压缩（`gulp-cache`）
  更改提醒（`gulp-notify`）
  清除文件（`del`）
```

  
  
5.运行task任务
```console
$ gulp
```
  
  监听文档实现实时编译
  
```console
$ gulp watch
```
  
### gulp的API请查看gulpfile.js文件


## scss文件规范以及说明
### 各个小模块以下划线开头全小写命名
多单词以 `-` 符号分隔，总模块正常，以该模块文件夹命名，在其中导入需要的小模块(详细规则请查看`font-awesome`的scss源码，更多内容google脑补)
例：
`_path.scss`路径配置文件，`_mixins.scss`预编译文件，`_variables.scss`变量定义文件，`font-awesome.scss`模块导入文件

## 脚本使用说明
### 基本组件
#### `error.js`
用途：低版本浏览器访问限制
用法：在`head`标签中最先引入下列代码
```javascript
    <!--[if lt IE 9]>
      <script src="dist/js/error.min.js"></script>
    <![endif]-->
```
#### `mian.js`
用途：javascript入口文件负责渲染数据处理交互
用法：引入即可，涉及模块较多后续完善模块说明

#### `date.js`
用途：解析处理日期数据，支持多种日期格式
用法：调用`Date`方法
```javascript
Date.today()                    // Returns today's date, with time set to 00:00 (start of day).

Date.today().next().friday()    // Returns the date of the next Friday.
Date.today().last().monday()    // Returns the date of the previous Monday.

new Date().next().march()       // Returns the date of the next March.
new Date().last().week()        // Returns the date one week ago. 

Date.today().is().friday()      // Returns true|false if the day-of-week matches.
Date.today().is().fri()         // Abbreviated day names. 

Date.today().is().november()    // Month names.
Date.today().is().nov()         // Abbreviated month names.
```

#### `daterange-picker.js`
用途：基于bootstrapt的日期范围选择器

#### `modernizr.custom.js`
用途：提供过渡动画支持


### jQuery组件
#### `jquery.bootstrap.wizard.js`
用途：基于jQuery的Bootstrap向导式插件

#### `jquery.dataTables.js`
用途：表格处理插件，包括排序分页，宽度自动处理
用法：引入后，以下结构绘制表格
例：
```html
<table class="table table-bordered" id="dataTable1">
	<thead>
		<th class="check-header">
			<label><input id="checkAll" name="checkAll" type="checkbox"><span></span></label>
		</th>
		<th>字段1</th>
		<th>字段2</th>
		<th>字段3</th>
		<th>字段4</th>
		<th>字段5</th>
		<th>字段6</th>
		<th></th>
	</thead>
	<tbody>
	...
	...
	...
	</tbody>
</table>
```

```javascript
/*
    根据ID初始化表格，以下 .table 类用于实现单选和多选
*/
$("#dataTable1").dataTable({
  "sPaginationType": "full_numbers",
  aoColumnDefs: [
    {
      bSortable: false,
      aTargets: [0, -1]
    }
  ]
});
$('.table').each(function() {
  return $(".table #checkAll").click(function() {
    if ($(".table #checkAll").is(":checked")) {
      return $(".table input[type=checkbox]").each(function() {
        return $(this).prop("checked", true);
      });
    } else {
      return $(".table input[type=checkbox]").each(function() {
        return $(this).prop("checked", false);
      });
    }
  });
});
```

#### `jquery.easy-pie-chart.js`
用途：饼状图绘制工具
用法：引入文件后，按ID初始化DOM元素
传送门：[rendro.github.io](http://rendro.github.io/easy-pie-chart/?utm_source=jquer.in&utm_medium=website&utm_campaign=content-curation)
例：
```html
<!-- Donut Charts -->
<div class="col-lg-8">
<div class="widget-container">
  <div class="heading">
    <i class="fa fa-bar-chart"></i> 优惠券使用率
  </div>
  <div class="widget-content clearfix">
    <div class="col-sm-4">
      <div class="pie-chart1 pie-chart pie-number easyPieChart" data-percent="60" style="width: 200px; height: 200px; line-height: 200px;">
        60%
      <canvas width="200" height="200"></canvas><p class="h6">总使用率</p></div>
    </div>
    <div class="col-sm-4">
      <div class="pie-chart2 pie-chart pie-number easyPieChart" data-percent="86" style="width: 200px; height: 200px; line-height: 200px;">
        86%
      <canvas width="200" height="200"></canvas><p class="h6">代金券使用率</p></div>
    </div>
    <div class="col-sm-4">
      <div class="pie-chart3 pie-chart pie-number easyPieChart" data-percent="34" style="width: 200px; height: 200px; line-height: 200px;">
        34%
      <canvas width="200" height="200"></canvas><p class="h6">折扣券使用率</p></div>
    </div>
  </div>
</div>
</div>
<!-- end Donut Charts -->
```

```javascript
/*
# =============================================================================
#   Easy Pie Chart
# =============================================================================
*/
/*  >60%          #81e970   green
    >=30% & <=60% #fab43b   yellow
    <30%          #f46f50   red
    
    size        图型大小
    lineWidth   线宽
    lineCap     线类型
    barColor    线颜色
    animate     动画速度
    scaleColor  选择色
*/
$(".pie-chart1").easyPieChart({
  size: 200,
  lineWidth: 12,
  lineCap: "square",
  barColor: "#81e970",
  animate: 800,
  scaleColor: false
});
$(".pie-chart2").easyPieChart({
  size: 200,
  lineWidth: 12,
  lineCap: "square",
  barColor: "#81e970",
  animate: 800,
  scaleColor: false
});
$(".pie-chart3").easyPieChart({
  size: 200,
  lineWidth: 12,
  lineCap: "square",
  barColor: "#f46f50",
  animate: 800,
  scaleColor: false
});
```

#### `jquery.sparkline.js`
用途：canvas图表绘制工具
用法：引入后按ID初始化，`ul`部分为横轴坐标，可在style.scss文件中配置宽度
传送门：[omnipotent.net](http://omnipotent.net/jquery.sparkline/#s-docs)
例：
```html
<div class="widget-container">
  <div class="heading">
    <i class="fa fa-area-chart"></i> 日活跃用户
  </div>
  <div class="widget-content padded">
    <div class="chart-graph line-chart">
      <div id="linechart-2-1"><canvas width="619" height="226" style="display: inline-block; width: 619px; height: 226px; vertical-align: top;"></canvas></div>
      <ul class="chart-text-axis day">
        <li>
          1
        </li>
        <li>
          5
        </li>
        <li>
          10
        </li>
        <li>
          15
        </li>
        <li>
          20
        </li>
        <li>
          25
        </li>
      </ul>
      <!-- end Line Chart -->
    </div>
  </div>
</div>
```

```javascript
(function() {
  var linechartResize;
  /*
    $(id).sparkline([number1, number2， ... ...],{
        options
    })
    
    
    type:                       线类型
    width:                      宽度
    height:                     高度
    lineColor:                  线颜色
    fillColor:                  填充色
    lineWidth:                  线宽
    spotColor:                  点色
    minSpotColor:               最小点色
    maxSpotColor:               最大点色
    highlightSpotColor:         高亮点色
    highlightLineColor:         高亮线色
    spotRadius:                 点半径
    chartRangeMin:              图最小范围
  */
  linechartResize = function() {
    $("#linechart-1").sparkline([160, 240, 120, 200, 230, 180, 350, 230, 200, 280, 380, 400, 360, 300, 220, 200, 150, 40, 70, 180, 110,200, 160, 200, 220, 350, 230, 200, 280, 380, 70], {
      type: "line",
      width: "100%",
      height: "226",
      lineColor: "#a5e1ff",
      fillColor: "rgba(241, 251, 255, 0.9)",
      lineWidth: 2,
      spotColor: "#a5e1ff",
      minSpotColor: "#bee3f6",
      maxSpotColor: "#a5e1ff",
      highlightSpotColor: "#80cff4",
      highlightLineColor: "#cccccc",
      spotRadius: 6,
      chartRangeMin: 0
    });
})
```
#### `jquery.validate.js`
用途：表单验证插件
用法：添加DOM元素自定义属性(具体内容见官方API)
传送门：[jqueryvalidation.org](http://jqueryvalidation.org/)
例:
```html
(1)required:true               必输字段
(2)remote:"check.php"          使用ajax方法调用check.php验证输入值
(3)email:true                  必须输入正确格式的电子邮件
(4)url:true                    必须输入正确格式的网址
(5)date:true                   必须输入正确格式的日期
(6)dateISO:true                必须输入正确格式的日期(ISO)，例如：2009-06-23，1998/01/22 只验证格式，不验证有效性
(7)number:true                 必须输入合法的数字(负数，小数)
(8)digits:true                 必须输入整数
(9)creditcard:                 必须输入合法的信用卡号
(10)equalTo:"#field"           输入值必须和#field相同
(11)accept:                    输入拥有合法后缀名的字符串（上传文件的后缀）
(12)maxlength:5                输入长度最多是5的字符串(汉字算一个字符)
(13)minlength:10               输入长度最小是10的字符串(汉字算一个字符)
(14)rangelength:[5,10]         输入长度必须介于 5 和 10 之间的字符串")(汉字算一个字符)
(15)range:[5,10]               输入值必须介于 5 和 10 之间
(16)max:5                      输入值不能大于5
(17)min:10                     输入值不能小于10
```