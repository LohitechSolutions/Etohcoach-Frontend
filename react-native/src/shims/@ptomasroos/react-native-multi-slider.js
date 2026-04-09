import React from "react";
import { PanResponder, StyleSheet, Text, View } from "react-native";

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

const snapToStep = (v, step, minV) => {
  if (!step || step <= 0) return v;
  return minV + Math.round((v - minV) / step) * step;
};

function MultiSlider(props) {
  const {
    values: valuesProp = [0, 100],
    min = 0,
    max = 100,
    step = 1,
    sliderLength = 200,
    onValuesChange,
    onValuesChangeFinish,
    enableLabel
  } = props;

  const [values, setValues] = React.useState(() => [...valuesProp]);
  const valuesRef = React.useRef(values);
  React.useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  React.useEffect(() => {
    setValues([...valuesProp]);
  }, [valuesProp[0], valuesProp[1]]);

  const dragIndexRef = React.useRef(0);
  const startXRef = React.useRef(0);
  const startValsRef = React.useRef([0, 0]);

  const range = Math.max(max - min, 1);

  const valueFromPosition = React.useCallback(
    (x) => {
      const ratio = clamp(x / sliderLength, 0, 1);
      const raw = min + ratio * range;
      return clamp(snapToStep(raw, step, min), min, max);
    },
    [min, max, range, sliderLength, step]
  );

  const positionFromValue = React.useCallback(
    (v) => {
      const ratio = (clamp(v, min, max) - min) / range;
      return ratio * sliderLength;
    },
    [min, max, range, sliderLength]
  );

  const emit = React.useCallback(
    (next) => {
      let [a, b] = next;
      if (a > b) [a, b] = [b, a];
      const ordered = [a, b];
      setValues(ordered);
      onValuesChange?.(ordered);
    },
    [onValuesChange]
  );

  const finish = React.useCallback(() => {
    onValuesChangeFinish?.();
  }, [onValuesChangeFinish]);

  const pan0 = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          dragIndexRef.current = 0;
          startValsRef.current = [...valuesRef.current];
          startXRef.current = positionFromValue(startValsRef.current[0]);
        },
        onPanResponderMove: (_, gesture) => {
          const base = startXRef.current + gesture.dx;
          let nextVal = valueFromPosition(base);
          const other = startValsRef.current[1];
          nextVal = clamp(nextVal, min, other);
          const next = [nextVal, startValsRef.current[1]];
          emit(next);
        },
        onPanResponderRelease: finish,
        onPanResponderTerminate: finish
      }),
    [emit, finish, min, max, valueFromPosition, positionFromValue]
  );

  const pan1 = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          dragIndexRef.current = 1;
          startValsRef.current = [...valuesRef.current];
          startXRef.current = positionFromValue(startValsRef.current[1]);
        },
        onPanResponderMove: (_, gesture) => {
          const base = startXRef.current + gesture.dx;
          let nextVal = valueFromPosition(base);
          const other = startValsRef.current[0];
          nextVal = clamp(nextVal, other, max);
          const next = [startValsRef.current[0], nextVal];
          emit(next);
        },
        onPanResponderRelease: finish,
        onPanResponderTerminate: finish
      }),
    [emit, finish, min, max, valueFromPosition, positionFromValue]
  );

  const p0 = positionFromValue(values[0]);
  const p1 = positionFromValue(values[1]);

  return (
    <View style={styles.wrap}>
      {enableLabel ? (
        <Text style={styles.label}>
          {Math.round(values[0])} – {Math.round(values[1])}
        </Text>
      ) : null}
      <View style={[styles.track, { width: sliderLength }]}>
        <View
          style={[
            styles.activeTrack,
            {
              left: p0,
              width: Math.max(p1 - p0, 0)
            }
          ]}
        />
        <View
          style={[
            styles.thumb,
            { left: clamp(p0 - 10, -10, sliderLength - 10) }
          ]}
          {...pan0.panHandlers}
        />
        <View
          style={[
            styles.thumb,
            { left: clamp(p1 - 10, -10, sliderLength - 10) }
          ]}
          {...pan1.panHandlers}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: 8
  },
  label: {
    marginBottom: 6,
    fontSize: 12
  },
  track: {
    height: 28,
    justifyContent: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    position: "relative"
  },
  activeTrack: {
    position: "absolute",
    height: 4,
    top: 12,
    backgroundColor: "#888",
    borderRadius: 2
  },
  thumb: {
    position: "absolute",
    top: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#333"
  }
});

export default MultiSlider;
