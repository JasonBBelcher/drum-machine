/**
 * AudioBufferLoader - Load and decode audio files into AudioBuffers
 * 
 * Replaces Howler.js with native Web Audio API.
 * Provides efficient audio buffer loading with caching.
 */

export class AudioBufferLoader {
  constructor(audioContext) {
    this.context = audioContext;
    this.buffers = new Map(); // Cache loaded buffers
    this.loading = new Map(); // Track in-progress loads
  }

  /**
   * Load a single audio file
   * @param {string} name - Unique identifier for this buffer
   * @param {string} url - URL to audio file
   * @returns {Promise<AudioBuffer>}
   */
  async load(name, url) {
    // Return cached buffer if available
    if (this.buffers.has(name)) {
      return this.buffers.get(name);
    }

    // Return existing promise if already loading
    if (this.loading.has(name)) {
      return this.loading.get(name);
    }

    // Start loading
    const loadPromise = this._loadAudioFile(url);
    this.loading.set(name, loadPromise);

    try {
      const buffer = await loadPromise;
      this.buffers.set(name, buffer);
      this.loading.delete(name);
      return buffer;
    } catch (error) {
      this.loading.delete(name);
      throw new Error(`Failed to load audio file "${name}" from ${url}: ${error.message}`);
    }
  }

  /**
   * Load multiple audio files in parallel
   * @param {Object} soundMap - Map of {name: url}
   * @returns {Promise<Object>} Map of {name: AudioBuffer}
   */
  async loadAll(soundMap) {
    const entries = Object.entries(soundMap);
    const promises = entries.map(([name, url]) => 
      this.load(name, url).then(buffer => ({ name, buffer }))
    );

    try {
      const results = await Promise.all(promises);
      
      // Convert array to object
      const buffers = {};
      results.forEach(({ name, buffer }) => {
        buffers[name] = buffer;
      });

      return buffers;
    } catch (error) {
      throw new Error(`Failed to load audio files: ${error.message}`);
    }
  }

  /**
   * Internal method to fetch and decode audio file
   * @param {string} url - Audio file URL
   * @returns {Promise<AudioBuffer>}
   */
  async _loadAudioFile(url) {
    // Fetch the audio file
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Get array buffer
    const arrayBuffer = await response.arrayBuffer();

    // Decode audio data
    try {
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
      return audioBuffer;
    } catch (error) {
      throw new Error(`Failed to decode audio data: ${error.message}`);
    }
  }

  /**
   * Get a loaded buffer by name
   * @param {string} name - Buffer name
   * @returns {AudioBuffer|null}
   */
  get(name) {
    return this.buffers.get(name) || null;
  }

  /**
   * Check if buffer is loaded
   * @param {string} name - Buffer name
   * @returns {boolean}
   */
  has(name) {
    return this.buffers.has(name);
  }

  /**
   * Check if buffer is currently loading
   * @param {string} name - Buffer name
   * @returns {boolean}
   */
  isLoading(name) {
    return this.loading.has(name);
  }

  /**
   * Get all loaded buffer names
   * @returns {string[]}
   */
  getLoadedNames() {
    return Array.from(this.buffers.keys());
  }

  /**
   * Get loading progress
   * @returns {Object} {total, loaded, loading, percentage}
   */
  getProgress() {
    const total = this.buffers.size + this.loading.size;
    const loaded = this.buffers.size;
    const loading = this.loading.size;
    const percentage = total > 0 ? ((loaded / total) * 100).toFixed(0) : 0;

    return {
      total,
      loaded,
      loading,
      percentage: parseInt(percentage)
    };
  }

  /**
   * Clear specific buffer from cache
   * @param {string} name - Buffer name
   * @returns {boolean} True if buffer was removed
   */
  clear(name) {
    return this.buffers.delete(name);
  }

  /**
   * Clear all buffers from cache
   */
  clearAll() {
    this.buffers.clear();
    this.loading.clear();
  }

  /**
   * Get total memory used by buffers (approximate)
   * @returns {Object} {bytes, megabytes}
   */
  getMemoryUsage() {
    let bytes = 0;

    this.buffers.forEach(buffer => {
      // Calculate approximate size: channels * length * 4 bytes per sample (Float32)
      bytes += buffer.numberOfChannels * buffer.length * 4;
    });

    return {
      bytes,
      megabytes: (bytes / (1024 * 1024)).toFixed(2),
      formatted: this._formatBytes(bytes)
    };
  }

  /**
   * Format bytes for display
   * @param {number} bytes
   * @returns {string}
   */
  _formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get buffer info
   * @param {string} name - Buffer name
   * @returns {Object|null} {duration, sampleRate, channels, length}
   */
  getBufferInfo(name) {
    const buffer = this.buffers.get(name);
    if (!buffer) return null;

    return {
      duration: buffer.duration,
      sampleRate: buffer.sampleRate,
      channels: buffer.numberOfChannels,
      length: buffer.length,
      durationFormatted: `${buffer.duration.toFixed(2)}s`
    };
  }

  /**
   * Preload audio files with progress callback
   * @param {Object} soundMap - Map of {name: url}
   * @param {Function} onProgress - Callback (loaded, total, percentage)
   * @returns {Promise<Object>} Map of {name: AudioBuffer}
   */
  async loadAllWithProgress(soundMap, onProgress) {
    const entries = Object.entries(soundMap);
    const total = entries.length;
    let loaded = 0;

    const buffers = {};

    for (const [name, url] of entries) {
      try {
        const buffer = await this.load(name, url);
        buffers[name] = buffer;
        loaded++;
        
        if (onProgress) {
          const percentage = Math.round((loaded / total) * 100);
          onProgress(loaded, total, percentage, name);
        }
      } catch (error) {
        console.error(`Failed to load ${name}:`, error);
        throw error;
      }
    }

    return buffers;
  }
}
