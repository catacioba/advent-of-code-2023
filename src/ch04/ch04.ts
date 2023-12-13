import * as fs from 'fs';
import * as os from 'os';

function parseNumbers(s: string): number[] {
  return s
    .split(' ')
    .filter(s => s != '')
    .map(s => parseInt(s));
}

class Card {
  id: number;
  winning: number[];
  actual: number[];

  constructor(id: number, winning: number[], actual: number[]) {
    this.id = id;
    this.winning = winning;
    this.actual = actual;
  }

  matching(): number[] {
    const winningSet = new Set<number>(this.winning);
    return this.actual.filter(n => winningSet.has(n));
  }

  score(): number {
    const match = this.matching();
    let score = 0;
    if (match.length > 0) {
      score = Math.pow(2, match.length - 1);
    }

    return score;
  }
}

function parseCard(s: string): Card {
  const cardParts = s.split(': ');
  const cardId = parseInt(cardParts[0].slice('Card '.length));
  const numberParts = cardParts[1].split(' | ');

  const winningNumbers = parseNumbers(numberParts[0]);
  const actualNumbers = parseNumbers(numberParts[1]);

  return new Card(cardId, winningNumbers, actualNumbers);
}

function SolvePart1(): void {
  const file = fs.readFileSync('data/ch04.txt', 'utf-8');
  const lines = file.split(os.EOL);

  console.log(
    lines
      .map(l => {
        const card = parseCard(l);
        return card.score();
      })
      .reduce((accum: number, curr: number) => accum + curr)
  );
}

function SolvePart2(): void {
  const file = fs.readFileSync('data/ch04.txt', 'utf-8');
  const lines = file.split(os.EOL);

  const cards = lines.map(l => parseCard(l));

  const cardCounts = new Map<number, number>();
  for (const card of cards) {
    cardCounts.set(card.id, 1);
  }

  cards.forEach(c => {
    const count = cardCounts.get(c.id)!;

    const matching = c.matching().length;

    for (let i = c.id + 1; i <= c.id + matching && i <= cards.length; i++) {
      const otherCount = cardCounts.get(i)!;
      cardCounts.set(i, otherCount + count);
    }
  });

  let c = 0;
  for (const count of cardCounts.values()) {
    c += count;
  }
  console.log(c);
}

SolvePart1();
SolvePart2();
