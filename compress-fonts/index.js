const transform = require("./transform");
const fontSpider = require("./font-spider");
const cover = require("./cover");

const main = async () => {
  // 提取文章内容
  await transform.main();
  // font-spider 压缩字体
  await fontSpider.main();
  // 移动并覆盖字体文件
  await cover.main()
};

main();
