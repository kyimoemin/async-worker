import { AsyncCallHandler } from "../handler";
import type { Calculator } from "./worker";

const worker = new Worker(new URL("./worker.ts", import.meta.url), {
  type: "module",
});

const handler = new AsyncCallHandler<Calculator>(worker);

export const calculator = {
  add: (a: number, b: number) => handler.func("add")(a, b),
  subtract: (a: number, b: number) => handler.func("subtract")(a, b),
  multiply: (a: number, b: number) => handler.func("multiply")(a, b),
  divide: (a: number, b: number) => handler.func("divide")(a, b),
  modulus: (a: number, b: number) => handler.func("modulus")(a, b),
  fibonacci: (n: number) => handler.func("fibonacci")(n, 500),
};
