import * as fs from 'fs';
import * as os from 'os';

class Hand {
  red: number;
  green: number;
  blue: number;

  constructor(red: number, green: number, blue: number) {
    this.red = red;
    this.green = green;
    this.blue = blue;
  }
}

class Game {
  id: number;
  hands: Array<Hand>;

  constructor(id: number, hands: Array<Hand>) {
    this.id = id;
    this.hands = hands;
  }

  extractMax(handExtractor: (h: Hand) => number): number {
    return Math.max(...this.hands.map(h => handExtractor(h)));
  }
}

const gamePrefix = 'Game ';

function parseGame(s: string): Game {
  const parts = s.split(': ');
  const gameId = parseInt(parts[0].slice(gamePrefix.length));
  const hands = parts[1].split('; ').map(h => parseHand(h));
  return new Game(gameId, hands);
}

const redPrefix = ' red';
const greenPrefix = ' green';
const bluePrefix = ' blue';

function parseHand(h: string): Hand {
  let red = 0;
  let green = 0;
  let blue = 0;

  h.split(', ').forEach(p => {
    const n = parseInt(p.slice(0, p.indexOf(' ')));
    if (p.indexOf(redPrefix) != -1) {
      red = n;
    }
    if (p.indexOf(greenPrefix) != -1) {
      green = n;
    }
    if (p.indexOf(bluePrefix) != -1) {
      blue = n;
    }
  });

  return new Hand(red, green, blue);
}

function parseGames(): Game[] {
  const file = fs.readFileSync('data/ch02.txt', 'utf-8');
  const lines = file.split(os.EOL);
  return lines.map(parseGame);
}

function SolvePart1(): void {
  const games = parseGames();
  console.log(
    games
      .filter(g =>
        g.hands.every(h => h.red <= 12 && h.green <= 13 && h.blue <= 14)
      )
      .map(g => g.id)
      .reduce((accum, curr) => accum + curr)
  );
}

function SolvePart2(): void {
  const games = parseGames();
  console.log(
    games
      .map(g => {
        return (
          g.extractMax((h: Hand) => h.red) *
          g.extractMax((h: Hand) => h.blue) *
          g.extractMax((h: Hand) => h.green)
        );
      })
      .reduce((accum, curr) => accum + curr)
  );
}

SolvePart1();
SolvePart2();
