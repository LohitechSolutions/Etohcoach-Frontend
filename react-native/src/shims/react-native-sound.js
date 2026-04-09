/**
 * Stub for `react-native-sound` (native audio). `require()` expects the constructor as module.exports.
 */
class SoundStub {
  constructor(_url, _basePath, onLoad) {
    this._playing = false;
    this._currentTime = 0;
    this._duration = 60;
    setTimeout(() => {
      if (typeof onLoad === "function") onLoad(null);
    }, 0);
  }

  getDuration() {
    return this._duration;
  }

  getNumberOfChannels() {
    return 1;
  }

  getCurrentTime(cb) {
    if (typeof cb === "function") cb(this._currentTime);
  }

  setCurrentTime(t) {
    this._currentTime = Number(t) || 0;
  }

  isPlaying() {
    return this._playing;
  }

  play() {
    this._playing = true;
  }

  pause() {
    this._playing = false;
  }

  release() {
    this._playing = false;
  }
}

module.exports = SoundStub;
