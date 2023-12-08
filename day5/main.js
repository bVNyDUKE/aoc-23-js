const fs = require("fs");
const { Worker, isMainThread, parentPort } = require("node:worker_threads");

function makeWorker(workerData, resultArray, onExit) {
  const w = new Worker(__filename);

  w.on("message", (message) => {
    resultArray.push(message);
  });
  w.on("error", (err) => console.log(err));
  w.on("exit", onExit);
  w.postMessage(workerData);
  return w;
}

const alm = fs.readFileSync("./test.txt").toString().split("\n");

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

function convertMapVal(val, key) {
  for (const row of maps[key]) {
    const [dest, src, rlen] = row;
    if (src <= val && val < src + rlen) {
      const dif = dest - src;
      return val + dif;
    }
  }
  return val;
}

const keys = Object.keys(maps);

const getLocationFromSeed = (seed) => {
  let res = seed;
  for (let i = 0; i < keys.length; i++) {
    res = convertMapVal(res, keys[i]);
  }
  return res;
};

if (isMainThread) {
  const resArray = [];

  const onExit = () => {
    if (resArray.length === seeds.length) {
      console.log("HELLO RESULT:", Math.min(...resArray));
    }
  };

  for (let i = 0; i < seeds.length; i += 2) {
    const seed = seeds[i];
    const max = seed + seeds[i + 1];
    makeWorker({ start: seed, max }, resArray, onExit);
  }
} else {
  parentPort.once("message", ({ start, max }) => {
    let min = -1;
    for (let s = start; s < max; s++) {
      let loc = getLocationFromSeed(s);
      if (min === -1 || loc < min) {
        min = loc;
      }
    }
    parentPort.postMessage(min);
  });
}
