import { AsyncCallHandler } from "../handler";
import type { Calculator } from "./module";

const worker = new Worker(new URL("./module.ts", import.meta.url), {
  type: "module",
});

const handler = new AsyncCallHandler(worker);

export const calculator = {
  add: (a: number, b: number) => handler.call<Calculator["add"]>("add")(a, b),
  subtract: (a: number, b: number) =>
    handler.call<Calculator["subtract"]>("subtract")(a, b),
  multiply: (a: number, b: number) =>
    handler.call<Calculator["multiply"]>("multiply")(a, b),
  divide: (a: number, b: number) =>
    handler.call<Calculator["divide"]>("divide")(a, b),
  modulus: (a: number, b: number) =>
    handler.call<Calculator["modulus"]>("modulus")(a, b),
};
