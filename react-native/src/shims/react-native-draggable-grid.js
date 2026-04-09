import React from "react";
import { View } from "react-native";

/**
 * Migration shim: static list only (no drag-and-drop). Unblocks bundling;
 * install the real package later for full behavior.
 */
export function DraggableGrid({
  style,
  itemHeight,
  numColumns: _numColumns,
  renderItem,
  data = [],
  onDragRelease: _onDragRelease
}) {
  if (typeof renderItem !== "function") {
    return <View style={style} />;
  }

  return (
    <View style={style}>
      {data.map((item, index) => (
        <View
          key={item?.key != null ? String(item.key) : `dg-${index}`}
          style={itemHeight != null ? { height: itemHeight } : undefined}
        >
          {renderItem(item, index)}
        </View>
      ))}
    </View>
  );
}

export default DraggableGrid;
