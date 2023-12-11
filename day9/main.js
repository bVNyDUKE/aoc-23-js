const fs = require("fs");

function getDiff(line) {
  const sum = [line];
  while (!sum[sum.length - 1].every((l) => l === 0)) {
    const l = sum[sum.length - 1];
    const res = [];
    for (let i = 0; i < l.length - 1; i++) {
      res.push((l[i + 1] || 0) - (l[i] || 0));
    }
    sum.push(res);
  }

  const res = sum.reduceRight((t, _, i, arr) => {
    return arr[i].shift() - t;
  }, 0);

  return res;
}

const res = fs
  .readFileSync("./input.txt")
  .toString()
  .split("\n")
  .filter(Boolean)
  .map((line) => {
    return line.split(" ").map((l) => parseInt(l));
  })
  .reduce((prev, curr) => {
    return prev + getDiff(curr);
  }, 0);

console.log(res);
