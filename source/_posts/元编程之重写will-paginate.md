---
title: 元编程之重写will_paginate
date: 2016-05-07 17:01:40
tags: will_paginate
categories: Ruby on Rails
---

![will-paginate-bg](http://pgl9fxcdp.bkt.clouddn.com/will-paginate-bg.png)
## 为什么重写will_paginate
相信很多同学在使用`will_paginate`的时候都会遇到这样一个问题：
自带分页样式太LOW了，有木有好看一点的，能不能自己定制呢。于是我们在[RubyGems](https://rubygems.org/search?utf8=%E2%9C%93&query=will_paginate)搜索will_paginate的主题gem包。发现有各种各样主题的，但却找不到你想要的，怎么办？

<!-- more -->
本着自己动手丰衣足食的理念，我们开始动手改造`will_paginate`。
（注：笔者使用的是`Materialize`的前端框架，下文将以`Materialize`的分页为例）

## 预览效果
先来看看`will_paginate`默认的效果是怎么样？为了方便后续区分，默认效果叫`Old`，修改后效果叫`New`
![will-paginate-pagelist](http://pgl9fxcdp.bkt.clouddn.com/will-paginate-pagelist.png)
上图中的`Old`分页稍显简陋。

下图是修改后需要`New`的效果
![will-paginate-materiaizepg](http://pgl9fxcdp.bkt.clouddn.com/will-paginate-materiaizepg.png)

## 分析结构
`Old`代码结构
```html
<div class="pagination">
    <a class="previous_page" rel="prev" href="/admins/admins?page=5">← Previous</a>
    <a rel="start" href="/admins/admins?page=1">1</a>
    <a href="/admins/admins?page=2">2</a>
    <a href="/admins/admins?page=3">3</a> 
    <a href="/admins/admins?page=4">4</a>
    <a rel="prev" href="/admins/admins?page=5">5</a>
    <em class="current">6</em>
    <a rel="next" href="/admins/admins?page=7">7</a>
    <a href="/admins/admins?page=8">8</a>
    <a href="/admins/admins?page=9">9</a>
    <a href="/admins/admins?page=10">10</a>
    <span class="gap">…</span>
    <a href="/admins/admins?page=24">24</a>
    <a href="/admins/admins?page=25">25</a>
    <a class="next_page" rel="next" href="/admins/admins?page=7">Next →</a>
</div>
```
从代码结构中可以知道，共有5种形式DOM:
 1. previous_page
 2. next_page
 3. current
 4. gap
 5. default

了解结构后，需要将`Old`修改成下面的结构才能有`New`的效果
```html
 <ul class="pagination">
    <li class="disabled"><a href="#!"><i class="material-icons">chevron_left</i></a></li>
    <li class="active"><a href="#!">1</a></li>
    <li class="waves-effect"><a href="#!">2</a></li>
    <li class="waves-effect"><a href="#!">3</a></li>
    <li class="waves-effect"><a href="#!">4</a></li>
    <li class="waves-effect"><a href="#!">5</a></li>
    <li class="waves-effect"><a href="#!"><i class="material-icons">chevron_right</i></a></li>
</ul>
```

## 分析`will_paginate`源码
将[will_paginate](https://github.com/mislav/will_paginate)的源码`Clone`到本地。
进入*`lib`*目录下，这里就不介绍`will_paginate`到源码结构了，有时间自己看看。我们直奔主题，打开*`link_renderer.rb`*文件。我在里面添加了部分代码中文解释，对于修改结构已经够用了
*`lib/will_paginate/view_helpers/link_renderer.rb`*
```ruby
require 'cgi'
require 'will_paginate/core_ext'
require 'will_paginate/view_helpers'
require 'will_paginate/view_helpers/link_renderer_base'

module WillPaginate
  module ViewHelpers
    # This class does the heavy lifting of actually building the pagination
    # links. It is used by +will_paginate+ helper internally.
    class LinkRenderer < LinkRendererBase
      
      # * +collection+ is a WillPaginate::Collection instance or any other object
      #   that conforms to that API
      # * +options+ are forwarded from +will_paginate+ view helper
      # * +template+ is the reference to the template being rendered
      def prepare(collection, options, template)
        super(collection, options)
        @template = template
        @container_attributes = @base_url_params = nil
      end

      # Process it! This method returns the complete HTML string which contains
      # pagination links. Feel free to subclass LinkRenderer and change this
      # method as you see fit.
      def to_html
        html = pagination.map do |item|
          item.is_a?(Fixnum) ?
            page_number(item) :
            send(item)
        end.join(@options[:link_separator])
        
        @options[:container] ? html_container(html) : html
      end

      # Returns the subset of +options+ this instance was initialized with that
      # represent HTML attributes for the container element of pagination links.
      def container_attributes
        @container_attributes ||= @options.except(*(ViewHelpers.pagination_options.keys + [:renderer] - [:class]))
      end
      
    protected
        
      # page_number方法显示分页元素
      def page_number(page)
        unless page == current_page
          link(page, page, :rel => rel_value(page))
        else
          tag(:em, page, :class => 'current')
        end
      end
      
      # gap方法在页数超过设定值时用...代替
      def gap
        text = @template.will_paginate_translate(:page_gap) { '&hellip;' }
        %(<span class="gap">#{text}</span>)
      end
      
      # previous_page方法显示上一页
      def previous_page
        num = @collection.current_page > 1 && @collection.current_page - 1
        previous_or_next_page(num, @options[:previous_label], 'previous_page')
      end
      
      # next_page方法显示下一页
      def next_page
        num = @collection.current_page < total_pages && @collection.current_page + 1
        previous_or_next_page(num, @options[:next_label], 'next_page')
      end
      
      # 边界值按钮
      def previous_or_next_page(page, text, classname)
        if page
          link(text, page, :class => classname)
        else
          tag(:span, text, :class => classname + ' disabled')
        end
      end
      
      def html_container(html)
        tag(:div, html, container_attributes)
      end
      
      # Returns URL params for +page_link_or_span+, taking the current GET params
      # and <tt>:params</tt> option into account.
      def url(page)
        raise NotImplementedError
      end
      
    private

      def param_name
        @options[:param_name].to_s
      end

      # 私有方法, 构建a标签
      def link(text, target, attributes = {})
        if target.is_a? Fixnum
          attributes[:rel] = rel_value(target)
          target = url(target)
        end
        attributes[:href] = target
        tag(:a, text, attributes)
      end
      
      # 私有方法, 包裹标签
      def tag(name, value, attributes = {})
        string_attributes = attributes.inject('') do |attrs, pair|
          unless pair.last.nil?
            attrs << %( #{pair.first}="#{CGI::escapeHTML(pair.last.to_s)}")
          end
          attrs
        end
        "<#{name}#{string_attributes}>#{value}</#{name}>"
      end

      def rel_value(page)
        case page
        when @collection.current_page - 1; 'prev' + (page == 1 ? ' start' : '')
        when @collection.current_page + 1; 'next'
        when 1; 'start'
        end
      end

      def symbolized_update(target, other)
        other.each do |key, value|
          key = key.to_sym
          existing = target[key]
          
          if value.is_a?(Hash) and (existing.is_a?(Hash) or existing.nil?)
            symbolized_update(existing || (target[key] = {}), value)
          else
            target[key] = value
          end
        end
      end
    end
  end
end
```

## 打开类
通过分析我们已经了解需要修改哪些方法
 1. `page_number`
 2. `previous_page`
 3. `next_page`
 4. `previous_or_next_page`
 
同时我们还将使用两个私有方法 
 1. `link(text, target, attributes = {})`
 2. `tag(name, value, attributes = {})`
 
回到工作项目，新建文件。下面使用了元编程的法术——打开类。这也是作为动态语言的优点。修改过的地方我加了注释。
*`lib/materialize_renderer.rb`*
```ruby
require 'cgi'
require 'will_paginate/core_ext'
require 'will_paginate/view_helpers'
require 'will_paginate/view_helpers/link_renderer_base'

module WillPaginate
  module ViewHelpers
    # This class does the heavy lifting of actually building the pagination
    # links. It is used by +will_paginate+ helper internally.
    class LinkRenderer < LinkRendererBase
      
      # * +collection+ is a WillPaginate::Collection instance or any other object
      #   that conforms to that API
      # * +options+ are forwarded from +will_paginate+ view helper
      # * +template+ is the reference to the template being rendered
      def prepare(collection, options, template)
        super(collection, options)
        @template = template
        @container_attributes = @base_url_params = nil
      end

      # Process it! This method returns the complete HTML string which contains
      # pagination links. Feel free to subclass LinkRenderer and change this
      # method as you see fit.
      def to_html
        html = pagination.map do |item|
          item.is_a?(Fixnum) ?
            page_number(item) :
            send(item)
        end.join(@options[:link_separator])
        
        @options[:container] ? html_container(html) : html
      end

      # Returns the subset of +options+ this instance was initialized with that
      # represent HTML attributes for the container element of pagination links.
      def container_attributes
        @container_attributes ||= @options.except(*(ViewHelpers.pagination_options.keys + [:renderer] - [:class]))
      end
      
    protected
    
      # 修改后，我使用私有方法tag，在link外面套了一层li，同时修改了class属性
      def page_number(page)
        unless page == current_page
          # link(page, page, :rel => rel_value(page))
          tag :li, link(page, page, :rel => rel_value(page)), :class => 'waves-effect'
        else
          # tag(:em, page, :class => 'current')
          tag(:li, link(page, '#!', :rel => rel_value(page)), :class => 'active')
        end
      end
      
      def gap
        text = @template.will_paginate_translate(:page_gap) { '&hellip;' }
        %(<span class="gap">#{text}</span>)
      end
      
      # 这里没有修改全局变量@options，使用打开类最好不要修改全局变量。所以直接改了icon
      def previous_page
        num = @collection.current_page > 1 && @collection.current_page - 1
        # previous_or_next_page(num, @options[:previous_label], 'previous_page')
        previous_or_next_page(num, 'chevron_left', 'previous_page')
      end
      
      
      # 这里没有修改全局变量@options，使用打开类最好不要修改全局变量。所以直接改了icon
      def next_page
        num = @collection.current_page < total_pages && @collection.current_page + 1
        # previous_or_next_page(num, @options[:next_label], 'next_page')
        previous_or_next_page(num, 'chevron_right', 'next_page')
      end
      
      # 修改了边界值的按钮，增加了局部变量icon_item用于google icon
      def previous_or_next_page(page, text, classname)
        icon_item = tag :i, text, :class => 'material-icons' 
        if page
          # link(text, page, :class => classname)
          tag(:li, link(icon_item, page), :class => 'waves-effect')
        else
          # tag(:span, text, :class => classname + ' disabled')
          tag(:li, link(icon_item, '#!'), :class => 'disabled')
        end
      end
      
      def html_container(html)
        tag(:div, html, container_attributes)
      end
      
      # Returns URL params for +page_link_or_span+, taking the current GET params
      # and <tt>:params</tt> option into account.
      def url(page)
        raise NotImplementedError
      end
      
    private

      def param_name
        @options[:param_name].to_s
      end

      def link(text, target, attributes = {})
        if target.is_a? Fixnum
          attributes[:rel] = rel_value(target)
          target = url(target)
        end
        attributes[:href] = target
        tag(:a, text, attributes)
      end
      
      def tag(name, value, attributes = {})
        string_attributes = attributes.inject('') do |attrs, pair|
          unless pair.last.nil?
            attrs << %( #{pair.first}="#{CGI::escapeHTML(pair.last.to_s)}")
          end
          attrs
        end
        "<#{name}#{string_attributes}>#{value}</#{name}>"
      end

      def rel_value(page)
        case page
        when @collection.current_page - 1; 'prev' + (page == 1 ? ' start' : '')
        when @collection.current_page + 1; 'next'
        when 1; 'start'
        end
      end

      def symbolized_update(target, other)
        other.each do |key, value|
          key = key.to_sym
          existing = target[key]
          
          if value.is_a?(Hash) and (existing.is_a?(Hash) or existing.nil?)
            symbolized_update(existing || (target[key] = {}), value)
          else
            target[key] = value
          end
        end
      end
    end
  end
end
```

## 加入到`initializers`
完成上面的修改后，是不起作用的，还需要加入到`initializers`中，才会加载我们的打开类，新建文件
*`config/initializers/will_pagination_materialize.rb`*
```ruby
require 'materialize_renderer'
```

## 完成
完成这些操作之后，重启服务器。恭喜你，完成了对`will_paginate`的修改。看看`New`吧
![will-paginate-done](http://pgl9fxcdp.bkt.clouddn.com/will-paginate-done.png)