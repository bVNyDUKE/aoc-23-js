import * as fs from "node:fs";

const f = fs.readFileSync("./input.txt").toString().trim().split("\n");

const commands = f
  .shift()
  ?.split("")
  .filter(Boolean)
  .map((d) => (d === "L" ? 0 : 1)) as (1 | 0)[];

f.shift();
const path = f.reduce(
  (p, curr) => {
    const [key, dirs] = curr.split(" = ");
    p[key] = dirs.slice(1, -1).split(", ");
    return p;
  },
  {} as Record<string, string[]>,
);

console.log("PATH", path);
console.log(commands);

let key = "AAA";
let steps = 0;

while (key !== "ZZZ") {
  console.log(key);
  const dir = commands[steps % commands.length];
  key = path[key][dir];
  ++steps;
}

console.log(steps);
