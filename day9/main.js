const fs = require("fs");

function getDiff(l) {
  const last = l[l.length - 1];
  if (last.every((d) => d === 0)) {
    return l.reduceRight((t, _, i, arr) => arr[i].shift() - t, 0);
  }

  const res = [];
  for (let i = 0; i < last.length - 1; i++) {
    res.push((last[i + 1] || 0) - (last[i] || 0));
  }
  l.push(res);
  return getDiff(l);
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
    return prev + getDiff([curr]);
  }, 0);

console.log(res);
