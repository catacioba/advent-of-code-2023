import * as fs from 'fs';
import * as os from 'os';

class Almanac {
  private readonly seedToSoil: Mapping[];
  private readonly soilToFertilizer: Mapping[];
  private readonly fertilizerToWater: Mapping[];
  private readonly waterToLight: Mapping[];
  private readonly lightToTemperature: Mapping[];
  private readonly temperatureToHumidity: Mapping[];
  private readonly humidityToLocation: Mapping[];

  constructor(
    seedToSoil: Mapping[],
    soilToFertilizer: Mapping[],
    fertilizerToWater: Mapping[],
    waterToLight: Mapping[],
    lightToTemperature: Mapping[],
    temperatureToHumidity: Mapping[],
    humidityToLocation: Mapping[]
  ) {
    this.seedToSoil = seedToSoil;
    this.soilToFertilizer = soilToFertilizer;
    this.fertilizerToWater = fertilizerToWater;
    this.waterToLight = waterToLight;
    this.lightToTemperature = lightToTemperature;
    this.temperatureToHumidity = temperatureToHumidity;
    this.humidityToLocation = humidityToLocation;
  }

  private map(mappings: Mapping[], n: number): number {
    for (const mapping of mappings) {
      const mapped = mapping.map(n);
      if (mapped) {
        return mapped;
      }
    }
    return n;
  }

  location(seed: number): number {
    const soil = this.map(this.seedToSoil, seed);
    const fert = this.map(this.soilToFertilizer, soil);
    const water = this.map(this.fertilizerToWater, fert);
    const light = this.map(this.waterToLight, water);
    const temp = this.map(this.lightToTemperature, light);
    const humid = this.map(this.temperatureToHumidity, temp);
    return this.map(this.humidityToLocation, humid);
  }
}

class Mapping {
  readonly destRangeStart: number;
  readonly srcRangeStart: number;
  readonly len: number;

  constructor(destRangeStart: number, srcRangeStart: number, len: number) {
    this.destRangeStart = destRangeStart;
    this.srcRangeStart = srcRangeStart;
    this.len = len;
  }

  map(n: number): number | undefined {
    if (this.srcRangeStart <= n && n < this.srcRangeStart + this.len) {
      return this.destRangeStart + n - this.srcRangeStart;
    }
    return undefined;
  }
}

function extractMappings(
  lines: string[],
  startIdx: number
): [Mapping[], number] {
  const mappings = [];

  let idx = startIdx;
  for (; idx < lines.length && lines[idx] !== ''; idx++) {
    const parts = lines[idx].split(' ').map(s => parseInt(s));
    mappings.push(new Mapping(parts[0], parts[1], parts[2]));
  }

  return [mappings, idx + 2];
}

function readInput(): [number[], Almanac] {
  const file = fs.readFileSync('data/ch05.txt', 'utf-8');
  const lines = file.split(os.EOL);

  const seeds = lines[0]
    .slice('seeds: '.length)
    .split(' ')
    .map(s => parseInt(s));

  const [seedToSoil, soilIdx] = extractMappings(lines, 3);
  const [soilToFert, fertIdx] = extractMappings(lines, soilIdx);
  const [fertToWater, waterIdx] = extractMappings(lines, fertIdx);
  const [waterToLight, lightIdx] = extractMappings(lines, waterIdx);
  const [lightToTemp, tempIdx] = extractMappings(lines, lightIdx);
  const [tempToHumid, humidIdx] = extractMappings(lines, tempIdx);
  const [humidToLoc, _] = extractMappings(lines, humidIdx);

  const almanac = new Almanac(
    seedToSoil,
    soilToFert,
    fertToWater,
    waterToLight,
    lightToTemp,
    tempToHumid,
    humidToLoc
  );

  return [seeds, almanac];
}

function SolvePart1(): void {
  const [seeds, almanac] = readInput();

  console.log(
    seeds
      .map(s => {
        return almanac.location(s);
      })
      .reduce((min, curr) => (min = Math.min(min, curr)))
  );
}

function SolvePart2(): void {
  const [seeds, almanac] = readInput();

  let min = 1000000000;
  for (let idx = 0; idx < seeds.length; idx += 2) {
    for (let i = 0; i < seeds[idx + 1]; i++) {
      const n = seeds[idx] + i;
      // console.log(n, almanac.location(n));
      min = Math.min(min, almanac.location(n));
    }
  }

  console.log(min);
}

SolvePart1();
SolvePart2();
