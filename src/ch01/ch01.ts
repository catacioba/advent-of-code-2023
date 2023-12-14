import * as fs from 'fs';
import * as os from 'os';

class DigitMatch {
  digit: number;
  index: number;

  constructor(digit: number, index: number) {
    this.digit = digit;
    this.index = index;
  }
}

function SolvePart1(): void {
  const file = fs.readFileSync('data/ch01.txt', 'utf-8');
  const lines = file.split(os.EOL);
  console.log(
    lines
      .map(l => {
        const first = getFirstDigit(l)!.digit;
        const last = getLastDigit(l)!.digit;
        return first * 10 + last;
      })
      .reduce((accum, cur) => {
        return accum + cur;
      })
  );
}

function getFirstDigit(s: string): DigitMatch | null {
  for (let i = 0; i < s.length; i++) {
    const n = parseInt(s[i]);
    if (!Number.isNaN(n)) {
      return new DigitMatch(n, i);
    }
  }
  return null;
}

function getLastDigit(s: string): DigitMatch | null {
  for (let i = s.length - 1; i >= 0; i--) {
    const n = parseInt(s[i]);
    if (!Number.isNaN(n)) {
      return new DigitMatch(n, i);
    }
  }
  return null;
}

function SolvePart2(): void {
  const file = fs.readFileSync('data/ch01.txt', 'utf-8');
  const lines = file.split(os.EOL);
  console.log(
    lines
      .map(l => {
        return getCalibrationValue(l);
      })
      .reduce((accum, cur) => {
        return accum + cur;
      })
  );
}

function getCalibrationValue(l: string): number {
  const first = getFirstDigit(l);
  const firstSpelled = findFirstDigitSpelled(l);
  const last = getLastDigit(l);
  const lastSpelled = findLastDigitSpelled(l);
  return min(first, firstSpelled) * 10 + max(last, lastSpelled);
}

function max(a: DigitMatch | null, b: DigitMatch | null): number {
  if (a === null) {
    return b!.digit;
  }
  if (b === null) {
    return a!.digit;
  }
  if (a!.index > b!.index) {
    return a!.digit;
  }
  return b!.digit;
}

function min(a: DigitMatch | null, b: DigitMatch | null): number {
  if (a === null) {
    return b!.digit;
  }
  if (b === null) {
    return a!.digit;
  }
  if (a!.index < b!.index) {
    return a!.digit;
  }
  return b!.digit;
}

const spelledDigits = new Map<string, number>([
  ['one', 1],
  ['two', 2],
  ['three', 3],
  ['four', 4],
  ['five', 5],
  ['six', 6],
  ['seven', 7],
  ['eight', 8],
  ['nine', 9],
]);

function findFirstDigitSpelled(s: string): DigitMatch | null {
  let bestIdx = 1000000;
  let best = null;
  for (const [spelledDigit, value] of spelledDigits) {
    const idx = s.indexOf(spelledDigit);
    if (idx !== -1 && idx < bestIdx) {
      bestIdx = idx;
      best = value;
    }
  }
  if (best !== null) {
    return new DigitMatch(best, bestIdx);
  }
  return null;
}

function findLastDigitSpelled(s: string): DigitMatch | null {
  let bestIdx = -1;
  let best = null;
  for (const [spelledDigit, value] of spelledDigits) {
    const idx = s.lastIndexOf(spelledDigit);
    if (idx > bestIdx) {
      bestIdx = idx;
      best = value;
    }
  }
  if (best !== null) {
    return new DigitMatch(best, bestIdx);
  }
  return null;
}

SolvePart1();
SolvePart2();
