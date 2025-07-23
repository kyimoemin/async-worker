import { fibonacci } from "../../utils/fibonacci";
import { initWorker } from "../handler";

const add = (a: number, b: number) => a + b;

const subtract = (a: number, b: number) => a - b;

const multiply = (a: number, b: number) => a * b;

const divide = (a: number, b: number) => a / b;

const modulus = (a: number, b: number) => a % b;

const calculator = { add, subtract, multiply, divide, modulus, fibonacci };

initWorker(calculator);

export type Calculator = typeof calculator;
