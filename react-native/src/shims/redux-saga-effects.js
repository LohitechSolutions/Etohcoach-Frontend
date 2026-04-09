/** Stubs so saga modules parse; logic never runs without real redux-saga runtime. */

export function takeLatest(_pattern, _saga, ..._args) {}

export function put(action) {
  return { type: "PUT", action };
}

export function call(_fn, ..._args) {
  return { type: "CALL" };
}

export function all(_effects) {
  return { type: "ALL" };
}
