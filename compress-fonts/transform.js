const fs = require("fs");
const path = require("path");
const { arch } = require("process");
const postsDir = "../source/_posts"; // 文章所在目录

// 读取目录下的文件
const readDir = function () {
  return new Promise((resolve, reject) => {
    fs.readdir(path.join(__dirname, postsDir), function (err, files) {
      const dirs = [];
      (function iterator(i) {
        if (i == files.length) {
          // console.log(dirs);
          resolve(dirs);
          return;
        }
        fs.stat(path.join(__dirname, postsDir, files[i]), function (err, data) {
          if (data.isFile()) {
            dirs.push(path.join(__dirname, postsDir, files[i]));
          }
          iterator(i + 1);
        });
      })(0);
    });
  });
};

// 提取文章中所有的中文
const readChinese = function (dirs) {
  return new Promise((resolve) => {
    let reg = /[\u4e00-\u9fa5]/g; // 中文的正则匹配
    let strArr = [];
    (function iterator(i) {
      if (i == dirs.length) {
        resolve(Array.from(new Set(strArr)).sort());
        return;
      }
      fs.readFile(dirs[i], "utf8", function (err, data) {
        if (err) console.log("读取文件fail " + err);
        else {
          // 读取成功时
          // 输出字节数组
          // 有poem的才提取
          if(data.match(/class="poem"/g)){
            const str = data.match(reg);
            strArr = [...strArr, ...str];
          }
        }
        iterator(i + 1);
      });
    })(0);
  });
};

// 从读取模版内容，并格式化
const formatChinese = function (content) {
  return new Promise((resolve) => {
    fs.readFile(
      path.join(__dirname, "index.tmpl"),
      "utf8",
      function (err, data) {
        if (err) console.log("读取文件fail " + err);
        else {
          // 读取成功时
          const str = data.replace("{% content %}", content);
          resolve(str);
        }
      }
    );
  });
};

// 写入文本到index.html
const writeChinese = function (str) {
  return new Promise((resolve) => {
    fs.writeFile(path.join(__dirname, "index.html"), str, "utf8", (err) => {
      if (err) console.log("写入文件fail " + err);
      else {
        // 写入文件成功
        resolve(true);
      }
    });
  });
};
// 入口函数
const main = async () => {
  const dirs = await readDir();
  const strArr = await readChinese(dirs);
  const result = await formatChinese(strArr.join(""));
  await writeChinese(result);
  console.log("内容提取完成");
};

exports.main = main;
