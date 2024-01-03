import * as fs from 'fs';
import * as os from 'os';

class Game {
  private readonly sequence: string;
  private readonly adj: Map<string, Direction>;

  constructor(sequence: string, adj: Map<string, Direction>) {
    this.sequence = sequence;
    this.adj = adj;
  }

  play(start: string): number {
    let step = 0;
    let curr = start;

    while (!curr.endsWith('Z')) {
      const instr = this.sequence[step % this.sequence.length];
      const dirs = this.adj.get(curr)!;

      if (instr === 'L') {
        curr = dirs.left;
      } else {
        curr = dirs.right;
      }

      step++;
    }

    return step;
  }

  playGhost(): number {
    const curr: string[] = this.getStartingNodes();

    const dists = curr.map(c => this.play(c));
    console.log(dists);

    let l = lcm(dists[0], dists[1]);
    for (let i = 2; i < dists.length; i++) {
      l = lcm(l, dists[i]);
    }

    return l;
  }

  private getStartingNodes(): string[] {
    const startingNodes = [];

    for (const node of this.adj.keys()) {
      if (node.endsWith('A')) {
        startingNodes.push(node);
      }
    }
    return startingNodes;
  }

  private isDone(nodes: string[]): boolean {
    return nodes.every(n => n.endsWith('Z'));
  }
}

function gcd(a: number, b: number): number {
  if (b === 0) {
    return a;
  }
  return gcd(b, a % b);
}

function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

class Direction {
  readonly left: string;
  readonly right: string;

  constructor(left: string, right: string) {
    this.left = left;
    this.right = right;
  }
}

function parseLine(l: string): [string, Direction] {
  const parts = l.split(' = ');
  const directions = parts[1].split(', ');
  return [
    parts[0],
    new Direction(
      directions[0].substring('('.length),
      directions[1].substring(0, directions[1].length - ')'.length)
    ),
  ];
}

function readInput(): Game {
  const file = fs.readFileSync('./data/ch08.txt', 'utf-8');
  const lines = file.split(os.EOL);

  const seq = lines[0];

  lines.shift();
  lines.shift();

  const adj = new Map(lines.map(l => parseLine(l)));

  return new Game(seq, adj);
}

function SolvePart1(): void {
  const game = readInput();
  console.log(game.play('AAA'));
}

function SolvePart2(): void {
  const game = readInput();
  console.log(game.playGhost());
}

SolvePart1();
SolvePart2();
