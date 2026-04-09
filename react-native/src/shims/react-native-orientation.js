const Orientation = {
  lockToLandscape: () => {},
  lockToPortrait: () => {},
  getOrientation: (callback) => {
    if (typeof callback === "function") {
      callback(null, "PORTRAIT");
    }
  },
};

export default Orientation;
