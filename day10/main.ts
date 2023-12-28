import fs from "node:fs";

//add the dist
type Node = {
  x: number;
  y: number;
}[];

let start: Node;
const map = fs
  .readFileSync("./test.txt")
  .toString()
  .split("\n")
  .filter(Boolean)
  .map((line, y) => {
    const mapLine: Node[] = line.split("").map((l, x) => {
      switch (true) {
        case l === "|":
          return [
            { x, y: y - 1 },
            { x, y: y + 1 },
          ];
        case l === "-":
          return [
            { x: x - 1, y },
            { x: x + 1, y },
          ];
        case l === "L":
          return [
            { x, y: y - 1 },
            { x: x + 1, y },
          ];
        case l === "J":
          return [
            { x, y: y - 1 },
            { x: x - 1, y },
          ];
        case l === "7":
          return [
            { x, y: y + 1 },
            { x: x - 1, y },
          ];
        case l === "F":
          return [
            { x, y: y + 1 },
            { x: x + 1, y },
          ];
        case l === "S":
          start = [{ x, y }];
          return null;
        default:
          return null;
      }
    });
    return mapLine;
  });

console.log(JSON.stringify(map, null, 4));
console.log(start);
