const fs = require("fs");
const path = require("path");
const moveFile = function () {
  return new Promise((resolve) => {
    fs.rename(
      path.join(__dirname, "./fonts/Yanzhi.ttf"),
      path.join(__dirname, "../themes/nexts/source/fonts/Yanzhi.ttf"),
      function (err) {
        if (err) {
          throw err;
        }
        console.log("字体覆盖完成");
        resolve(true);
      }
    );
  });
};
exports.main = moveFile;
