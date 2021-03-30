# Vern 的个人博客

[![GitHub Actions status](https://github.com/tkvern/blog-source/workflows/Deploy%20CI/badge.svg)](https://github.com/tkvern/blog-source)

需要全局安装 hexo

```bash
npm install hexo-cli -g
```

运行项目

```bash
$ hexo g -w & hexo serve
```

在项目目录执行下面命令，对字体进行压缩

```bash
$ npm run font
```

## 部署
每次有更新诗词，部署前需要运行`npm run font`确保字体文件更新