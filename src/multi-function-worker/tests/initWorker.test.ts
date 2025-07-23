import { initWorker } from "../initWorker";
import type { WorkerObject } from "../initWorker";

describe("initWorker", () => {
  let originalOnMessage: ((event: MessageEvent) => void) | null;
  let postMessageMock: jest.Mock;

  beforeEach(() => {
    originalOnMessage = self.onmessage;
    postMessageMock = jest.fn();
    // self.postMessage is not typed in the test environment
    self.postMessage = postMessageMock;
  });

  afterEach(() => {
    self.onmessage = originalOnMessage;
    jest.clearAllMocks();
  });

  it("should call the correct function and post result", async () => {
    const obj: WorkerObject = {
      add: (a: number, b: number) => a + b,
    };
    initWorker(obj);
    const event = {
      data: { func: "add", args: [2, 3], id: 1 },
    };
    // @ts-expect-error: self.onmessage expects a Worker event, but we use a mock event for testing
    await self.onmessage(event);
    expect(postMessageMock).toHaveBeenCalledWith({ id: 1, result: 5 });
  });

  it("should post error if function not found", async () => {
    const obj: WorkerObject = {};
    initWorker(obj);
    const event = {
      data: { func: "notExist", args: [], id: 2 },
    };
    // @ts-expect-error: self.onmessage expects a Worker event, but we use a mock event for testing
    await self.onmessage(event);
    expect(postMessageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 2,
        error: expect.objectContaining({
          message: expect.stringContaining("not found"),
        }),
      })
    );
  });

  it("should post error if function throws", async () => {
    const obj: WorkerObject = {
      fail: () => {
        throw new Error("fail error");
      },
    };
    initWorker(obj);
    const event = {
      data: { func: "fail", args: [], id: 3 },
    };
    // @ts-expect-error: self.onmessage expects a Worker event, but we use a mock event for testing
    await self.onmessage(event);
    expect(postMessageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 3,
        error: expect.objectContaining({
          message: "fail error",
        }),
      })
    );
  });
});
