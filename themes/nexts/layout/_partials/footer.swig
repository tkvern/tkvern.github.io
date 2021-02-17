<div class="copyright" >
  {% set current = date(Date.now(), "YYYY") %}
  &copy; {% if theme.since and theme.since != current %} {{ theme.since }} - {% endif %}
  <span itemprop="copyrightYear">{{ current }}</span>
  <span class="with-love">
    <i class="fa fa-heart"></i>
  </span>
  <span class="author" itemprop="copyrightHolder">{{ config.author }}</span>
  <span class="with-love">
    <i class="fa fa-eye"></i>
  </span>
  <span id="visitors" itemprop="copyrightHolder"></span>
  <br/>
  {{ __('footer.powered', '<a class="theme-link" href="http://hexo.io" rel="external nofollow">Hexo</a>') }}
  <a class="theme-link" href="https://github.com/iissnan/hexo-theme-next" rel="external nofollow">NexT</a>
  <span>本站所有内容除特别声明外，均采用 <a target="_blank" href="https://zh.wikipedia.org/wiki/%E7%9F%A5%E8%AF%86%E5%85%B1%E4%BA%AB%E8%AE%B8%E5%8F%AF%E5%8D%8F%E8%AE%AE" rel="external nofollow">©️©️ BY-NC-SA </a>许可协议。转载请注明出处！</span>
</div>
