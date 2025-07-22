import { AsyncCallHandler } from "../handler";

const worker = new Worker(new URL("./module.ts", import.meta.url), {
  type: "module",
});

const handler = new AsyncCallHandler(worker);

export const calculator = {
  add: (a: number, b: number) => handler.call({ func: "add", args: [a, b] }),
  subtract: (a: number, b: number) =>
    handler.call({ func: "subtract", args: [a, b] }),
  multiply: (a: number, b: number) =>
    handler.call({ func: "multiply", args: [a, b] }),
  divide: (a: number, b: number) =>
    handler.call({ func: "divide", args: [a, b] }),
  modulus: (a: number, b: number) =>
    handler.call({ func: "modulus", args: [a, b] }),
};
