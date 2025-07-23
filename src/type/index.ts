export type RequestPayload<Params extends unknown[]> = {
  func: string | number | symbol;
  args: Params;
  id: string;
};

export type ResponsePayload<R = void> = {
  id: string;
  result?: R;
  error?: Error;
};
