/**
 * AudioPlayer - Play audio buffers with sample-accurate timing
 * 
 * Replaces Howler.js with Web Audio API for perfect synchronization.
 * Uses AudioBufferSourceNode with precise time scheduling.
 */

export class AudioPlayer {
  constructor(audioContext) {
    this.context = audioContext;
    this.buffers = new Map(); // AudioBuffer storage
    this.volumes = new Map(); // Volume per sound
    this.pitchOffsets = new Map(); // Semitones per sound (Phase 4)
    this.detuneOffsets = new Map(); // Cents per sound (Phase 4)
    this.activeSources = []; // Track playing sources for cleanup
  }

  /**
   * Load an audio buffer
   * @param {string} name - Sound identifier
   * @param {AudioBuffer} buffer - Audio buffer to load
   * @param {number} volume - Initial volume (0.0 - 1.0)
   */
  loadBuffer(name, buffer, volume = 1.0) {
    this.buffers.set(name, buffer);
    this.volumes.set(name, volume);
  }

  /**
   * Load multiple buffers
   * @param {Object} bufferMap - Map of {name: AudioBuffer}
   * @param {number} defaultVolume - Default volume for all
   */
  loadBuffers(bufferMap, defaultVolume = 1.0) {
    Object.entries(bufferMap).forEach(([name, buffer]) => {
      this.loadBuffer(name, buffer, defaultVolume);
    });
  }

  /**
   * Play a sound at a specific time
   * @param {string} name - Sound identifier
   * @param {number} time - When to play (AudioContext time, 0 = now)
   * @param {Object} options - Playback options
   * @returns {AudioBufferSourceNode|null} Source node for control
   */
  play(name, time = 0, options = {}) {
    const buffer = this.buffers.get(name);
    if (!buffer) {
      console.warn(`Sound "${name}" not loaded`);
      return null;
    }

    // Create source node
    const source = this.context.createBufferSource();
    source.buffer = buffer;

    // Apply pitch control (Phase 4)
    const totalDetune = this.getTotalDetune(name);
    source.detune.value = totalDetune;

    // Create gain node for volume control
    const gainNode = this.context.createGain();
    const volume = options.volume !== undefined ? options.volume : this.volumes.get(name);
    gainNode.gain.value = volume;

    // Connect: source -> gain -> destination
    source.connect(gainNode);
    gainNode.connect(this.context.destination);

    // Calculate start time
    const startTime = time === 0 ? this.context.currentTime : time;

    // Apply playback options
    if (options.offset !== undefined || options.duration !== undefined) {
      const offset = options.offset || 0;
      const duration = options.duration || (buffer.duration - offset);
      source.start(startTime, offset, duration);
    } else {
      source.start(startTime);
    }

    // Track active source
    this.activeSources.push(source);

    // Cleanup when finished
    source.onended = () => {
      source.disconnect();
      gainNode.disconnect();
      this._removeActiveSource(source);
    };

    return source;
  }

  /**
   * Play sound immediately (convenience method)
   * @param {string} name - Sound identifier
   * @param {Object} options - Playback options
   * @returns {AudioBufferSourceNode|null}
   */
  playNow(name, options = {}) {
    return this.play(name, 0, options);
  }

  /**
   * Schedule multiple sounds at once
   * @param {Array} schedule - Array of {name, time, options}
   * @returns {AudioBufferSourceNode[]} Array of source nodes
   */
  playMultiple(schedule) {
    return schedule
      .map(({ name, time, options }) => this.play(name, time, options))
      .filter(source => source !== null);
  }

  /**
   * Set volume for a sound
   * @param {string} name - Sound identifier
   * @param {number} volume - Volume (0.0 - 1.0)
   */
  setVolume(name, volume) {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.volumes.set(name, clampedVolume);
  }

  /**
   * Get volume for a sound
   * @param {string} name - Sound identifier
   * @returns {number} Volume (0.0 - 1.0)
   */
  getVolume(name) {
    return this.volumes.get(name) || 0;
  }

  /**
   * Check if sound is loaded
   * @param {string} name - Sound identifier
   * @returns {boolean}
   */
  has(name) {
    return this.buffers.has(name);
  }

  /**
   * Get buffer info
   * @param {string} name - Sound identifier
   * @returns {Object|null} {duration, sampleRate, channels}
   */
  getBufferInfo(name) {
    const buffer = this.buffers.get(name);
    if (!buffer) return null;

    return {
      duration: buffer.duration,
      sampleRate: buffer.sampleRate,
      channels: buffer.numberOfChannels,
      length: buffer.length
    };
  }

  /**
   * Get all loaded sound names
   * @returns {string[]}
   */
  getLoadedSounds() {
    return Array.from(this.buffers.keys());
  }

  /**
   * Stop all currently playing sounds
   */
  stopAll() {
    this.activeSources.forEach(source => {
      try {
        source.stop();
        source.disconnect();
      } catch (e) {
        // Already stopped
      }
    });
    this.activeSources = [];
  }

  /**
   * Remove a source from active list
   * @param {AudioBufferSourceNode} source
   */
  _removeActiveSource(source) {
    const index = this.activeSources.indexOf(source);
    if (index > -1) {
      this.activeSources.splice(index, 1);
    }
  }

  /**
   * Clear specific buffer
   * @param {string} name - Sound identifier
   * @returns {boolean} True if removed
   */
  clear(name) {
    this.volumes.delete(name);
    return this.buffers.delete(name);
  }

  /**
   * Clear all buffers
   */
  clearAll() {
    this.stopAll();
    this.buffers.clear();
    this.volumes.clear();
  }

  /**
   * Get active sources count
   * @returns {number}
   */
  getActiveCount() {
    return this.activeSources.length;
  }

  /**
   * Set pitch offset in semitones (Phase 4)
   * @param {string} name - Sound identifier
   * @param {number} semitones - Pitch shift (-12 to +12)
   */
  setPitch(name, semitones) {
    const clamped = Math.max(-12, Math.min(12, semitones));
    this.pitchOffsets.set(name, clamped);
  }

  /**
   * Set fine tuning in cents (Phase 4)
   * @param {string} name - Sound identifier
   * @param {number} cents - Fine tune (-100 to +100)
   */
  setDetune(name, cents) {
    const clamped = Math.max(-100, Math.min(100, cents));
    this.detuneOffsets.set(name, clamped);
  }

  /**
   * Get total detune in cents (Phase 4)
   * @param {string} name - Sound identifier
   * @returns {number} Total cents offset
   */
  getTotalDetune(name) {
    const semitones = this.pitchOffsets.get(name) || 0;
    const cents = this.detuneOffsets.get(name) || 0;
    return (semitones * 100) + cents;
  }

  /**
   * Get pitch settings (Phase 4)
   * @param {string} name - Sound identifier
   * @returns {Object} {semitones, cents}
   */
  getPitchSettings(name) {
    return {
      semitones: this.pitchOffsets.get(name) || 0,
      cents: this.detuneOffsets.get(name) || 0
    };
  }

  /**
   * Reset pitch to default (Phase 4)
   * @param {string} name - Sound identifier
   */
  resetPitch(name) {
    this.pitchOffsets.delete(name);
    this.detuneOffsets.delete(name);
  }
}

/**
 * DrumPlayer - Specialized player for drum sequencer
 * 
 * Extends AudioPlayer with drum-specific features.
 */
export class DrumPlayer extends AudioPlayer {
  constructor(audioContext) {
    super(audioContext);
    this.drumMap = new Map(); // Map sequencer drum names to buffer names
  }

  /**
   * Map sequencer drum name to buffer name
   * @param {string} drumName - Drum name from sequencer
   * @param {string} bufferName - Buffer name in player
   */
  mapDrum(drumName, bufferName) {
    this.drumMap.set(drumName, bufferName);
  }

  /**
   * Load drum buffers with mapping
   * @param {Object} config - {drumName: {buffer, volume}}
   */
  loadDrums(config) {
    Object.entries(config).forEach(([drumName, { buffer, volume }]) => {
      this.loadBuffer(drumName, buffer, volume);
      this.mapDrum(drumName, drumName); // Default 1:1 mapping
    });
  }

  /**
   * Play drum by sequencer name
   * @param {string} drumName - Drum name from sequencer
   * @param {number} time - When to play
   * @param {Object} options - Playback options
   * @returns {AudioBufferSourceNode|null}
   */
  playDrum(drumName, time = 0, options = {}) {
    const bufferName = this.drumMap.get(drumName) || drumName;
    return this.play(bufferName, time, options);
  }

  /**
   * Play multiple drums at once (e.g., full step)
   * @param {Array} drums - Array of {drumName, time, options}
   * @returns {AudioBufferSourceNode[]}
   */
  playDrums(drums) {
    return drums
      .map(({ drumName, time, options }) => this.playDrum(drumName, time, options))
      .filter(source => source !== null);
  }

  /**
   * Set drum volume
   * @param {string} drumName - Drum name from sequencer
   * @param {number} volume - Volume (0.0 - 1.0)
   */
  setDrumVolume(drumName, volume) {
    const bufferName = this.drumMap.get(drumName) || drumName;
    this.setVolume(bufferName, volume);
  }

  /**
   * Get drum volume
   * @param {string} drumName - Drum name from sequencer
   * @returns {number}
   */
  getDrumVolume(drumName) {
    const bufferName = this.drumMap.get(drumName) || drumName;
    return this.getVolume(bufferName);
  }

  /**
   * Check if drum is loaded
   * @param {string} drumName - Drum name from sequencer
   * @returns {boolean}
   */
  hasDrum(drumName) {
    const bufferName = this.drumMap.get(drumName) || drumName;
    return this.has(bufferName);
  }

  /**
   * Load custom sample for a drum (Phase 4)
   * @param {string} drumName - Drum name from sequencer
   * @param {AudioBuffer} audioBuffer - Audio buffer to load
   * @param {number} volume - Initial volume (0.0 - 1.0)
   */
  loadCustomSample(drumName, audioBuffer, volume = 1.0) {
    this.loadBuffer(drumName, audioBuffer, volume);
    this.mapDrum(drumName, drumName);
  }

  /**
   * Set drum pitch in semitones (Phase 4)
   * @param {string} drumName - Drum name from sequencer
   * @param {number} semitones - Pitch shift (-12 to +12)
   */
  setDrumPitch(drumName, semitones) {
    const bufferName = this.drumMap.get(drumName) || drumName;
    this.setPitch(bufferName, semitones);
  }

  /**
   * Set drum fine tuning in cents (Phase 4)
   * @param {string} drumName - Drum name from sequencer
   * @param {number} cents - Fine tune (-100 to +100)
   */
  setDrumDetune(drumName, cents) {
    const bufferName = this.drumMap.get(drumName) || drumName;
    this.setDetune(bufferName, cents);
  }

  /**
   * Get drum pitch settings (Phase 4)
   * @param {string} drumName - Drum name from sequencer
   * @returns {Object} {semitones, cents}
   */
  getDrumPitch(drumName) {
    const bufferName = this.drumMap.get(drumName) || drumName;
    return this.getPitchSettings(bufferName);
  }

  /**
   * Reset drum pitch to default (Phase 4)
   * @param {string} drumName - Drum name from sequencer
   */
  resetDrumPitch(drumName) {
    const bufferName = this.drumMap.get(drumName) || drumName;
    this.resetPitch(bufferName);
  }
}
