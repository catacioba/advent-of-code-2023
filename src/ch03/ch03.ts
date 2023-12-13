import * as fs from 'fs';
import * as os from 'os';

function isDigit(s: string): boolean {
  return !isNaN(parseInt(s));
}

// Symbols: ['%', '=', '*', '#', '$', '@', '&', '/', '-', '+'].

class NumberMatch {
  val: number;
  row: number;
  start: number;
  end: number;

  constructor(val: number, row: number, start: number, end: number) {
    this.val = val;
    this.row = row;
    this.start = start;
    this.end = end;
  }
}

function getSymbols(lines: string[]): Set<string> {
  return lines
    .flatMap((l: string) => {
      const values = new Set<string>();
      for (const c of l) {
        if (!isDigit(c) && c != '.') {
          values.add(c);
        }
      }
      return values;
    })
    .reduce((accum: Set<string>, curr: Set<string>) => {
      for (const c of curr) {
        accum.add(c);
      }
      return accum;
    });
}

function getNumberMatches(lines: string[]): NumberMatch[] {
  const nums = new Array<NumberMatch>();

  for (let row = 0; row < lines.length; row++) {
    let accum = 0;
    let start = 0;
    for (let col = 0; col < lines[row].length; col++) {
      if (isDigit(lines[row][col])) {
        accum = accum * 10 + parseInt(lines[row][col]);
      } else {
        if (accum != 0) {
          nums.push(new NumberMatch(accum, row, start, col - 1));
        }
        accum = 0;
        start = col + 1;
      }
    }
    if (accum != 0) {
      nums.push(new NumberMatch(accum, row, start, lines[row].length - 1));
    }
  }

  return nums;
}

function SolvePart1(): void {
  const file = fs.readFileSync('data/ch03.txt', 'utf-8');
  const lines = file.split(os.EOL);

  const symbols = getSymbols(lines);
  const nums = getNumberMatches(lines);

  console.log(
    nums
      .filter(n => {
        for (let r = n.row - 1; r <= n.row + 1; r++) {
          if (r < 0) {
            continue;
          }
          if (r >= lines.length) {
            continue;
          }
          for (let c = n.start - 1; c <= n.end + 1; c++) {
            if (c < 0) {
              continue;
            }
            if (c >= lines[r].length) {
              continue;
            }
            if (symbols.has(lines[r][c])) {
              return true;
            }
          }
        }
        return false;
      })
      .map(n => n.val)
      .reduce((accum, curr) => accum + curr)
  );
}

function key(r: number, c: number): string {
  return `${r}-${c}`;
}

function SolvePart2(): void {
  const file = fs.readFileSync('data/ch03.txt', 'utf-8');
  const lines = file.split(os.EOL);

  const nums = getNumberMatches(lines);

  const adjacencyMap = new Map<string, number[]>();
  nums.forEach(n => {
    for (let r = n.row - 1; r <= n.row + 1; r++) {
      if (r < 0) {
        continue;
      }
      if (r >= lines.length) {
        continue;
      }
      for (let c = n.start - 1; c <= n.end + 1; c++) {
        if (c < 0) {
          continue;
        }
        if (c >= lines[r].length) {
          continue;
        }
        const k = key(r, c);
        if (!adjacencyMap.has(k)) {
          adjacencyMap.set(k, []);
        }
        const adj = adjacencyMap.get(k)!;
        adj.push(n.val);
      }
    }
    return false;
  });

  let gearRatios = 0;

  for (let r = 0; r < lines.length; r++) {
    for (let c = 0; c < lines[r].length; c++) {
      if (lines[r][c] == '*') {
        const adj = adjacencyMap.get(key(r, c)) ?? [];
        if (adj.length == 2) {
          gearRatios += adj[0] * adj[1];
        }
      }
    }
  }

  console.log(gearRatios);
}

SolvePart1();
SolvePart2();
