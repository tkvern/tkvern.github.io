const path = require("path");
const fontSpider = require("font-spider");
const { Console } = require("console");

function formatSize(size, pointLength, units) {
  var unit;
  units = units || ["B", "K", "M", "G", "TB"];
  while ((unit = units.shift()) && size > 1000) {
    size = size / 1000;
  }
  return (
    (unit === "B"
      ? size
      : size.toFixed(pointLength === undefined ? 2 : pointLength)) + unit
  );
}

const main = function () {
  return new Promise((resolve) => {
    fontSpider
      .spider([path.join(__dirname, "index.html")], {
        silent: false,
      })
      .then(function (webFonts) {
        return fontSpider.compressor(webFonts, { backup: true });
      })
      .then(function (webFonts) {
        console.log(`字体原大小: ${formatSize(webFonts[0].originalSize, 2)}`);
        console.log(`压缩后大小: ${formatSize(webFonts[0].files[0].size, 2)}`);
        console.log("字体压缩完成");
        resolve(true);
      })
      .catch(function (errors) {
        console.error(errors);
      });
  });
};

exports.main = main;
