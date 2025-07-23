import { AsyncCallHandler } from "../handler";

describe("AsyncCallHandler", () => {
  let mockWorker: any;
  let handler: AsyncCallHandler<any>;
  let postMessageSpy: jest.Mock;

  beforeEach(() => {
    postMessageSpy = jest.fn();
    mockWorker = {
      postMessage: postMessageSpy,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      terminate: jest.fn(),
    };
    handler = new AsyncCallHandler(mockWorker);
  });

  it("should resolve when worker posts a result", async () => {
    const promise = handler.func("add")(1, 2);
    // Simulate worker response
    const callId = postMessageSpy.mock.calls[0][0].id;
    mockWorker.onmessage({ data: { id: callId, result: 3 } });
    await expect(promise).resolves.toBe(3);
  });

  it("should reject when worker posts an error", async () => {
    const promise = handler.func("fail")(1);
    const callId = postMessageSpy.mock.calls[0][0].id;
    mockWorker.onmessage({
      data: { id: callId, error: { message: "fail error", name: "Error" } },
    });
    await expect(promise).rejects.toThrow("fail error");
  });

  it("should reject with timeout if worker does not respond in time", async () => {
    jest.useFakeTimers();
    const promise = handler.func("slow", 100)(1);
    jest.advanceTimersByTime(101);
    await expect(promise).rejects.toThrow("timed out");
    jest.useRealTimers();
  });

  it("should clean up and reject all pending calls on worker error event", async () => {
    const promise = handler.func("add")(1, 2);
    mockWorker.addEventListener.mock.calls.forEach(([event, cb]: any[]) => {
      if (["error", "exit", "close"].includes(event)) {
        cb();
      }
    });
    await expect(promise).rejects.toThrow("Worker was terminated");
  });

  it("should remove event listeners and terminate worker on terminate()", () => {
    handler.terminate();
    expect(mockWorker.removeEventListener).toHaveBeenCalledWith(
      "error",
      expect.any(Function)
    );
    expect(mockWorker.removeEventListener).toHaveBeenCalledWith(
      "exit",
      expect.any(Function)
    );
    expect(mockWorker.removeEventListener).toHaveBeenCalledWith(
      "close",
      expect.any(Function)
    );
    expect(mockWorker.terminate).toHaveBeenCalled();
  });
});
