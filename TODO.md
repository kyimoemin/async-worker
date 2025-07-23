# Asynchronous Web Worker

## TODO

- [x] Error serialization: JavaScript `Error` objects lose their prototype when posted via postMessage. Consider serializing errors (e.g., send `{ message, name, stack }`) and reconstructing them on the main thread.

- [x] Timeout handling: Optionally add a timeout to reject unresolved calls if the worker hangs.

- [x] Clean up: If the worker is terminated, reject all pending promises to avoid memory leaks.

- [ ] Type safety: The current use of `any` is pragmatic, but you could further tighten types for better safety.

- [ ]
