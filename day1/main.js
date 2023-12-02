const fs = require("fs");

const re = new RegExp(
  "(one|two|three|four|five|six|seven|eight|nine|1|2|3|4|5|6|7|8|9)"
);

const vals = {
  one: 1,
  1: 1,
  two: 2,
  2: 2,
  three: 3,
  3: 3,
  four: 4,
  4: 4,
  five: 5,
  5: 5,
  six: 6,
  6: 6,
  seven: 7,
  7: 7,
  eight: 8,
  8: 8,
  nine: 9,
  9: 9,
};

function checkNumber(string) {
  const res = re.exec(string);
  if (res) {
    return vals[res[0]];
  }
}

const res = fs
  .readFileSync("./input.txt")
  .toString()
  .split("\n")
  .reduce((res, line) => {
    let first = null;
    let last = null;
    for (let i = 0; i < line.length; i++) {
      if (first && last) break;
      first ??= checkNumber(line.slice(0, i + 1));
      last ??= checkNumber(line.slice((i + 1) * -1));
    }
    res += first * 10 + last;
    return res;
  }, 0);

console.log(res);
