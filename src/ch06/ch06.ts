import * as fs from 'fs';
import * as os from 'os';

function parseNumbers(s: string): number[] {
  return s
    .split(' ')
    .filter(s => s !== '')
    .map(s => parseInt(s));
}

function solve(t: number, dist: number): number {
  const delta = t * t - 4 * dist;
  const sqDelta = Math.sqrt(delta);
  let start = (t - sqDelta) / 2;
  let end = (t + sqDelta) / 2;
  if (start === Math.ceil(start)) {
    start = start + 1;
  } else {
    start = Math.ceil(start);
  }
  if (end === Math.floor(end)) {
    end = end - 1;
  } else {
    end = Math.floor(end);
  }
  return end - start + 1;
}

function SolvePart1(): void {
  const file = fs.readFileSync('./data/ch06.txt', 'utf-8');
  const lines = file.split(os.EOL);

  const times = parseNumbers(lines[0].slice('Time:'.length));
  const dist = parseNumbers(lines[1].slice('Distance:'.length));

  let res = 1;
  for (let idx = 0; idx < times.length; idx++) {
    res *= solve(times[idx], dist[idx]);
  }

  console.log(res);
}

function SolvePart2(): void {
  const file = fs.readFileSync('./data/ch06.txt', 'utf-8');
  const lines = file.split(os.EOL);

  const time = parseInt(
    lines[0]
      .slice('Time:'.length)
      .split(' ')
      .filter(s => s !== '')
      .join('')
  );
  const dist = parseInt(
    lines[1]
      .slice('Distance:'.length)
      .split(' ')
      .filter(s => s !== '')
      .join('')
  );

  console.log(solve(time, dist));
}

SolvePart1();
SolvePart2();
