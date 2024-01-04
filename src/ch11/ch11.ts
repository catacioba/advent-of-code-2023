import * as fs from 'fs';
import * as os from 'os';

class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  diff(ot: Position): number {
    return Math.abs(this.x - ot.x) + Math.abs(this.y - ot.y);
  }
}

class Universe {
  private readonly board: string[];

  constructor(board: string[]) {
    this.board = board;
  }

  distances(noGalaxyMultiplier: number): number {
    const galaxies = new Map<number, Position>();
    let galaxyId = 1;

    const noGalaxiesRows = this.noGalaxiesRows();
    const noGalaxiesCols = this.noGalaxiesColumns();

    for (let row = 0; row < this.height(); row++) {
      for (let col = 0; col < this.width(); col++) {
        if (this.board[row][col] === '#') {
          galaxies.set(
            galaxyId++,
            new Position(
              row +
                this.countLower(noGalaxiesRows, row) * (noGalaxyMultiplier - 1),
              col +
                this.countLower(noGalaxiesCols, col) * (noGalaxyMultiplier - 1)
            )
          );
        }
      }
    }

    let s = 0;
    for (let x = 1; x < galaxyId - 1; x++) {
      for (let y = x + 1; y < galaxyId; y++) {
        s += galaxies.get(x)!.diff(galaxies.get(y)!);
      }
    }

    return s;
  }

  private countLower(arr: number[], n: number): number {
    return arr.filter(a => a < n).length;
  }

  private height(): number {
    return this.board.length;
  }

  private width(): number {
    return this.board[0].length;
  }

  private noGalaxiesRows(): number[] {
    const res = [];
    for (let row = 0; row < this.height(); row++) {
      let ok = true;
      for (let col = 0; col < this.width() && ok; col++) {
        if (this.board[row][col] === '#') {
          ok = false;
        }
      }
      if (ok) {
        res.push(row);
      }
    }
    return res;
  }

  private noGalaxiesColumns(): number[] {
    const res = [];
    for (let col = 0; col < this.width(); col++) {
      let ok = true;
      for (let row = 0; row < this.height() && ok; row++) {
        if (this.board[row][col] === '#') {
          ok = false;
        }
      }
      if (ok) {
        res.push(col);
      }
    }
    return res;
  }
}

function readInput(): Universe {
  const file = fs.readFileSync('./data/ch11.txt', 'utf-8');
  const lines = file.split(os.EOL);
  return new Universe(lines);
}

function SolvePart1(): void {
  const u = readInput();
  console.log(u.distances(2));
}

function SolvePart2(): void {
  const u = readInput();
  console.log(u.distances(1000000));
}

SolvePart1();
SolvePart2();
