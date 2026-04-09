/** Migration shim: saga middleware is inert (root saga not running in this path). */
export default function createSagaMiddleware() {
  const middleware = (_store) => (next) => (action) => next(action);
  middleware.run = function run() {};
  middleware.setContext = function setContext() {};
  middleware.getContext = function getContext() {
    return {};
  };
  return middleware;
}
