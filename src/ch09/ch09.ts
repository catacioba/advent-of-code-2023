import * as fs from 'fs';
import * as os from 'os';

function readInput(): number[][] {
  const file = fs.readFileSync('./data/ch09.txt', 'utf-8');
  const lines = file.split(os.EOL);
  return lines.map(l => l.split(' ').map(s => parseInt(s)));
}

function buildRows(
  values: number[],
  extrapolateValues: (rows: number[][]) => void,
  valueExtractor: (rows: number[][]) => number
): number {
  const rows: number[][] = [];
  let it = 0;
  rows.push([]);

  for (const v of values) {
    rows[it].push(v);
  }

  let ok = true;
  while (ok) {
    const next = nextRow(rows[it]);
    rows.push(next);
    it++;
    ok = isOk(next);
  }

  extrapolateValues(rows);

  return valueExtractor(rows);
}

function nextRow(values: number[]): number[] {
  const res: number[] = [];

  for (let i = 0; i < values.length - 1; i++) {
    res.push(values[i + 1] - values[i]);
  }

  return res;
}

function isOk(values: number[]): boolean {
  return !values.every(v => v === 0);
}

function addNextValues(rows: number[][]) {
  for (let idx = rows.length - 1; idx >= 0; idx--) {
    const last =
      idx === rows.length - 1 ? 0 : rows[idx + 1][rows[idx + 1].length - 1];
    rows[idx].push(rows[idx][rows[idx].length - 1] + last);
  }
}

function addPreviousValues(rows: number[][]) {
  for (let idx = rows.length - 1; idx >= 0; idx--) {
    const last = idx === rows.length - 1 ? 0 : rows[idx + 1][0];
    rows[idx].unshift(rows[idx][0] - last);
  }
}

function SolvePart1(): void {
  const lines = readInput();
  console.log(
    lines
      .map(l =>
        buildRows(l, addNextValues, rows => rows[0][rows[0].length - 1])
      )
      .reduce((curr: number, accum: number) => accum + curr)
  );
}

function SolvePart2(): void {
  const lines = readInput();
  console.log(
    lines
      .map(l => buildRows(l, addPreviousValues, rows => rows[0][0]))
      .reduce((curr: number, accum: number) => accum + curr)
  );
}

SolvePart1();
SolvePart2();
