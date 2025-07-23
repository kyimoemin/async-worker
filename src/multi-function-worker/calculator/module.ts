const add = (a: number, b: number) => a + b;

const subtract = (a: number, b: number) => a - b;

const multiply = (a: number, b: number) => a * b;

const divide = (a: number, b: number) => a / b;

const modulus = (a: number, b: number) => a % b;

export const calculator = { add, subtract, multiply, divide, modulus };

export type Calculator = typeof calculator;
