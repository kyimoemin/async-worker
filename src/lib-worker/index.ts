import { DynamicWorker } from "async-multi-worker";
import { Calculator } from "./worker";

const url = new URL("./worker.ts", import.meta.url);

const dy = new DynamicWorker<Calculator>(url);

const add = dy.func("add");
const subtract = dy.func("subtract");
const multiply = dy.func("multiply");
const divide = dy.func("divide");
const modulus = dy.func("modulus");

console.log("worker ", dy);

export const calculator = { add, subtract, multiply, divide, modulus };
