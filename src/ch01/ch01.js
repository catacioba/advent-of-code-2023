"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
class DigitMatch {
    constructor(digit, index) {
        this.digit = digit;
        this.index = index;
    }
}
function SolvePart1() {
    const file = fs.readFileSync('./test.txt', 'utf-8');
    const lines = file.split(os.EOL);
    console.log(lines.map(l => {
        const first = getFirstDigit(l).digit;
        const last = getLastDigit(l).digit;
        return first * 10 + last;
    })
        .reduce((accum, cur) => {
        return accum + cur;
    }));
}
function getFirstDigit(s) {
    for (let i = 0; i < s.length; i++) {
        const n = parseInt(s[i]);
        if (!Number.isNaN(n)) {
            return new DigitMatch(n, i);
        }
    }
    return null;
}
function getLastDigit(s) {
    for (let i = s.length - 1; i >= 0; i--) {
        const n = parseInt(s[i]);
        if (!Number.isNaN(n)) {
            return new DigitMatch(n, i);
        }
    }
    return null;
}
function SolvePart2() {
    const file = fs.readFileSync('./test.txt', 'utf-8');
    const lines = file.split(os.EOL);
    console.log(lines.map(l => {
        return getCalibrationValue(l);
    }).reduce((accum, cur) => {
        return accum + cur;
    }));
}
function getCalibrationValue(l) {
    const first = getFirstDigit(l);
    const firstSpelled = findFirstDigitSpelled(l);
    const last = getLastDigit(l);
    const lastSpelled = findLastDigitSpelled(l);
    return min(first, firstSpelled) * 10 + max(last, lastSpelled);
}
function max(a, b) {
    if (a == null) {
        return b.digit;
    }
    if (b == null) {
        return a.digit;
    }
    if (a.index > b.index) {
        return a.digit;
    }
    return b.digit;
}
function min(a, b) {
    if (a == null) {
        return b.digit;
    }
    if (b == null) {
        return a.digit;
    }
    if (a.index < b.index) {
        return a.digit;
    }
    return b.digit;
}
const spelledDigits = new Map([
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
function findFirstDigitSpelled(s) {
    let bestIdx = 1000000;
    let best = null;
    for (let [spelledDigit, value] of spelledDigits) {
        let idx = s.indexOf(spelledDigit);
        if (idx != -1 && idx < bestIdx) {
            bestIdx = idx;
            best = value;
        }
    }
    if (best != null) {
        return new DigitMatch(best, bestIdx);
    }
    return null;
}
function findLastDigitSpelled(s) {
    let bestIdx = -1;
    let best = null;
    for (let [spelledDigit, value] of spelledDigits) {
        let idx = s.lastIndexOf(spelledDigit);
        if (idx > bestIdx) {
            bestIdx = idx;
            best = value;
        }
    }
    if (best != null) {
        return new DigitMatch(best, bestIdx);
    }
    return null;
}
SolvePart1();
SolvePart2();
