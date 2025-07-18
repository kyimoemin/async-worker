export function asynchronize<T>(fn: () => T): Promise<T> {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        const result = fn();
        resolve(result);
      }, 0);
    } catch (error) {
      reject(error);
    }
  });
}
