/** Stub filesystem paths used by dashboard / downloads. */
const RNFS = {
  ExternalDirectoryPath: "/tmp/etoh-external",
  DocumentDirectoryPath: "/tmp/etoh-documents",
  CachesDirectoryPath: "/tmp/etoh-caches",
  readFile: async () => "",
  writeFile: async () => {},
  mkdir: async () => {},
  exists: async () => false,
  unlink: async () => {},
  copyFile: async () => {},
  scanFile: async () => {},
};

module.exports = RNFS;
module.exports.default = RNFS;
