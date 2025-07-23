import { AsyncCallHandler } from "../handler";
import type { Calculator } from "./worker";

const worker = new Worker(new URL("./worker.ts", import.meta.url), {
  type: "module",
});

const handler = new AsyncCallHandler<Calculator>(worker);

export const calculator = {
  add: handler.func("add"),
  subtract: handler.func("subtract"),
  multiply: handler.func("multiply"),
  divide: handler.func("divide"),
  modulus: handler.func("modulus"),
  fibonacci: handler.func("fibonacci", 100),
};
