import * as fs from "node:fs";

const f = fs.readFileSync("./input.txt").toString().trim().split("\n");

const commands = f[0]
  .split("")
  .filter(Boolean)
  .map((d) => (d === "L" ? 0 : 1));

const path = f.slice(2).reduce<Record<string, string[]>>((p, curr) => {
  console.log("CURRENT", curr);
  const [key, dirs] = curr.split(" = ");
  p[key] = dirs
    .slice(1, -1)
    .trim()
    .split(", ")
    .map((d) => d.trim());
  return p;
}, {});

console.log("PATH", path);
console.log(commands);

const keys = Object.keys(path).filter((k) => k.endsWith("A"));
const ts = [];

function gcd(x: number, y: number): number {
  if (y === 0) return x;
  return gcd(y, x % y);
}

function lcm(x: number, y: number): number {
  return (x * y) / gcd(x, y);
}

for (const k of keys) {
  let steps = 0;
  let key = k;
  while (!key.endsWith("Z")) {
    key = path[key][commands[steps % commands.length]];
    ++steps;
  }
  ts.push(steps);
}

const res = ts.reduce((prev, curr) => lcm(prev, curr));
console.log(ts);
console.log(res);
