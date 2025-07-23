import { AsyncCallHandler } from "../handler";
import type { Calculator } from "./worker";

const workerURL = new URL("./worker.ts", import.meta.url);

const handler = new AsyncCallHandler<Calculator>(workerURL);

export const calculator = {
  add: handler.func("add"),
  subtract: handler.func("subtract"),
  multiply: handler.func("multiply"),
  divide: handler.func("divide"),
  modulus: handler.func("modulus"),
  fibonacci: handler.func("fibonacci", 100),
};
