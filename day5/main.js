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
    const title = lines.shift().split(" ")[0].replaceAll("-", "_");
    if (title === "") return sum;

    sum[title] = lines.map((l) => l.split(" ").map((num) => parseInt(num)));
    return sum;
  }, {});

function convertMapVal(val, mapVal) {
  for (const row of mapVal) {
    const dest = row[0];
    const src = row[1];
    const rlen = row[2];
    if (src <= val && val < src + rlen) {
      const dif = dest - src;
      return val + dif;
    }
  }
  return val;
}

const getLocationFromSeed = (seed) => {
  let res = convertMapVal(seed, maps.seed_to_soil);
  res = convertMapVal(res, maps.soil_to_fertilizer);
  res = convertMapVal(res, maps.fertilizer_to_water);
  res = convertMapVal(res, maps.water_to_light);
  res = convertMapVal(res, maps.light_to_temperature);
  res = convertMapVal(res, maps.temperature_to_humidity);
  res = convertMapVal(res, maps.humidity_to_location);
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
    const end = seeds[i + 1] + seeds[i];
    const mid = Math.round((seeds[i] + end) / 2) - 1;
    makeWorker({ start: seeds[i], max: mid }, resArray, onExit);
    makeWorker({ start: mid + 1, max: end }, resArray, onExit);
  }
} else {
  parentPort.once("message", ({ start, max }) => {
    let min = -1;
    console.log("processing", start, max);
    for (let s = start; s < max; s++) {
      let loc = getLocationFromSeed(s);
      if (min === -1 || loc < min) {
        min = loc;
      }
    }
    parentPort.postMessage(min);
  });
}
