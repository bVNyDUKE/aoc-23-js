const fs = require("fs");

function convertMapVal(val, map) {
  for (const row of map) {
    const [dest, src, rlen] = row;
    if (src <= val && val < src + rlen) {
      const dif = dest - src;
      return val + dif;
    }
  }
  return val;
}

async function main() {
  const alm = fs.readFileSync("./input.txt").toString().split("\n");

  const seeds = alm
    .shift()
    .split(": ")
    .pop()
    .split(" ")
    .map((seed) => parseInt(seed));

  const maps = alm
    .slice(1)
    .toString()
    .split(",,")
    .reduce((sum, line) => {
      const lines = line.split(",");
      const title = lines.shift().split(" ")[0];
      if (title === "") return sum;

      sum[title] = lines.map((l) => l.split(" ").map((num) => parseInt(num)));
      return sum;
    }, {});

  const getLocationFromSeed = (seed) => {
    let res = seed;
    for (const k in maps) {
      res = convertMapVal(res, maps[k]);
    }
    return res;
  };

  let min = -1;
  for (const s of seeds) {
    const loc = getLocationFromSeed(s);
    if (min === -1 || loc < min) {
      min = loc;
    }
  }
  console.log(min);
}

main();
