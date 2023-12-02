const fs = require("fs");

const res = fs
  .readFileSync("./input.txt")
  .toString()
  .split("\n")
  .reduce((res, line) => {
    let first = null;
    let last = null;
    for (let i = 0; i < line.length; i++) {
      if (first && last) break;
      if (!first && parseInt(line[i])) {
        first ??= parseInt(line[i]);
      }
      if (!last && parseInt(line[line.length - 1 - i]))
        last ??= parseInt(line[line.length - 1 - i]);
    }
    res += first * 10 + last;
    return res;
  }, 0);

console.log(res);
