

import { DECIMAL_PRECISION } from "./App";

export class Fraction {
    numerator: number;
    denominator: number;
    isvalid: boolean;

    constructor(fracString: string) {
        let parts = fracString.split("|");
        let numerator: number = parseFloat(parts[0]);
        let denominator: number = 1;
        if (parts[1]) {
            denominator = parseFloat(parts[1]);
        }
        this.numerator = numerator;
        this.denominator = denominator;
        if(Number.isNaN(this.numerator) || Number.isNaN(this.denominator)) {
            this.isvalid = false;
        } else {
            this.isvalid = true;
        }
    }

    get() {
        return (this.numerator.toString() + "|" + this.denominator.toString());
    }

    getIsValid() {
        return this.isvalid;
    }

    getNumerator() {
        return this.numerator;
    }

    getDenominator() {
        return this.denominator;
    }

    simplify() {
        let gcdvar = gcd(this.numerator, this.denominator);
        this.numerator = this.numerator / gcdvar;
        this.denominator = this.denominator / gcdvar;
        if (this.denominator < 0) {
            this.numerator = -this.numerator;
            this.denominator = -this.denominator;
        }
    }

    invert() {

        let tmp = this.numerator;
        if (this.numerator < 0) {
            this.numerator = -this.denominator;
            this.denominator = -tmp;
        }
        else {
            this.numerator = this.denominator;
            this.denominator = tmp;
        }
    }

    addFractions(fracString: string) {

        let b = new Fraction(fracString);

        this.simplify();
        b.simplify();

        let gcdVal = gcd(this.denominator, b.denominator);
        if (gcdVal === 1) {
            this.numerator = this.numerator * b.denominator + this.denominator * b.numerator;
            this.denominator = this.denominator * b.denominator;
        }
        else {
            let tmp = this.numerator * (b.denominator / gcdVal) + b.numerator * (this.denominator / gcdVal);

            let gcdValTwo = gcd(tmp, gcdVal);
            this.numerator = tmp / gcdValTwo;
            this.denominator = (this.denominator / gcdVal) * (b.denominator / gcdValTwo);
        }
        this.simplify();
    }

    subtractFractions(fracString: string) {
        let b = new Fraction(fracString);

        b.numerator = -b.numerator;
        this.addFractions(b.get());
    }

    multiplyFractions(fracString: string) {
        let b = new Fraction(fracString);

        this.simplify();
        b.simplify();

        this.numerator = this.numerator * b.numerator;
        this.denominator = this.denominator * b.denominator;
        this.simplify();
    }

    divideFractions(fracString: string) {
        let b = new Fraction(fracString);

        b.invert();
        this.multiplyFractions(b.get());
    }

}


const REPEAT_DIGIT_PATTERN_LENGTH = 6;

export function DecimalToFraction(numberString: string) {
    let negative = false;
    if (numberString.charAt(0) === '-') {
        numberString = numberString.substring(1);
        negative = true;
    }
    let rtnString = myConversion(numberString);
    if (rtnString) {
        if (negative) {
            rtnString = "-" + rtnString;
        }
        return rtnString;
    } else {
        let number = parseFloat(numberString).toPrecision(DECIMAL_PRECISION);
        let intPart = Math.floor(parseInt(number));
        let fracPart: number = parseFloat(number) - intPart;
        let precisionVal = 1000000000;
        let gcdVal = gcd(Math.round(fracPart * precisionVal), precisionVal);
        let numerator = Math.round(fracPart * precisionVal) / gcdVal;
        let denominator = precisionVal / gcdVal;
        let rtnString = ((intPart * denominator) + numerator) + "|" + denominator;
        if (negative) {
            rtnString = "-" + rtnString;
        }
        let fraction = new Fraction(rtnString);
        fraction.simplify();
        return fraction.get();
    }
}





function gcd(a: number, b: number): number {
    if (a < 0) {
        a = -a;
    }
    if (b < 0) {
        b = -b;
    }
    if (a === 0)
        return b;
    else if (b === 0)
        return a;
    if (a < b)
        return gcd(a, b % a);
    else
        return gcd(b, a % b);
}

function myConversion(numberString: string) {
    let parts: string[] = numberString.split(".");
    let intPart: string = parts[0];
    if(intPart === '1' && parts[1] === undefined) {
        return "1|1";
    }
    if (parts[1] === undefined) {
        parts[1] = "000000000";
    }
    let pat1flag = true;
    let pat2flag = true;
    let pat3flag = true;
    let pat4flag = true;

    let pat1: number = 0;
    let pat2: number = 0;
    let pat3: number = 0;
    let pat4: number = 0;

    if (parts[1]) {
        pat1 = parseInt(parts[1].substr(0, 1));
        pat2 = parseInt(parts[1].substr(0, 2));
        pat3 = parseInt(parts[1].substr(0, 3));
        pat4 = parseInt(parts[1].substr(0, 4));
        let pat5: number = pat4;
        if(pat1 >= 5) {
            pat5 = pat4 + 1;
        }
        // repeating single digit pattern. ex: 0.333333333
        for (let i = 1, j = 1; i < REPEAT_DIGIT_PATTERN_LENGTH; i++) {
            if (parseInt(parts[1].substr(i, j)) !== pat1) {
                pat1flag = false;
            }
        }
        // repeating single digit pattern. ex: 0.252525252
        for (let i = 2, j = 2; i < REPEAT_DIGIT_PATTERN_LENGTH; i += 2) {
            if (parseInt(parts[1].substr(i, j)) !== pat2) {
                pat2flag = false;
            }
        }
        // repeating single digit pattern. ex: 0.213213213
        for (let i = 3, j = 3; i < REPEAT_DIGIT_PATTERN_LENGTH; i += 3) {
            if (parseInt(parts[1].substr(i, j)) !== pat3) {
                pat3flag = false;
            }
        }
        if (parseInt(parts[1].substr(4, 4)) !== pat4 && parseInt(parts[1].substr(4, 4)) !== pat5) {
            pat4flag = false;
        }
    }
    let rtnString = null;
    let numerator: number = 0;
    let denominator: number = 1;

    if (pat1flag) {
        numerator = pat1;
        denominator = 9;
        if (parseInt(intPart) > 0) {
            numerator = (parseInt(intPart) * denominator) + numerator;
        }
        rtnString = (numerator + "|" + denominator);
    } else if (pat2flag) {
        numerator = pat2;
        denominator = 99;
        if (parseInt(intPart) > 0) {
            numerator = (parseInt(intPart) * denominator) + numerator;
        }
        rtnString = (numerator + "|" + denominator);
    } else if (pat3flag) {
        numerator = pat3;
        denominator = 999;
        if (parseInt(intPart) > 0) {
            numerator = (parseInt(intPart) * denominator) + numerator;
        }
        rtnString = (numerator + "|" + denominator);
    } else if (pat4flag) {
        numerator = pat4;
        denominator = 9999;
        if (parseInt(intPart) > 0) {
            numerator = (parseInt(intPart) * denominator) + numerator;
        }
        rtnString = (numerator + "|" + denominator);
    }
    if (rtnString) {
        let fraction = new Fraction(rtnString);
        fraction.simplify();
        return fraction.get();
    }
    return rtnString;

}
