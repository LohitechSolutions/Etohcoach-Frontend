import React from "react";

/** No rehydration wait — renders children immediately (migration shim). */
export function PersistGate({ children, loading: _loading, persistor: _persistor }) {
  return <>{children}</>;
}
