export type RequestPayload<Funcs extends string, Params extends unknown[]> = {
  func: Funcs;
  args: Params;
  id: string;
};

export type ResponsePayload<R = void> = {
  id: string;
  result?: R;
  error?: Error;
};
