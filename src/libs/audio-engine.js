/**
 * AudioEngine - Manages Web Audio API context and initialization
 * 
 * Handles browser autoplay policies and provides a clean interface
 * for initializing the audio system.
 */

export class AudioEngine {
  constructor() {
    this.context = null;
    this.initialized = false;
    this.unlocked = false;
  }

  /**
   * Initialize the AudioContext
   * Must be called from a user interaction (click, touch, etc.)
   * @returns {Promise<AudioContext>}
   */
  async initialize() {
    if (this.initialized) {
      return this.context;
    }

    try {
      // Create AudioContext (with vendor prefixes for older browsers)
      this.context = new (window.AudioContext || window.webkitAudioContext)();
      
      // Handle suspended state (autoplay policy)
      if (this.context.state === 'suspended') {
        await this.context.resume();
      }

      this.initialized = true;
      this.unlocked = true;

      console.log('✅ Audio engine initialized');
      console.log(`   Sample rate: ${this.context.sampleRate}Hz`);
      console.log(`   State: ${this.context.state}`);
      
      // Log latency info if available
      if (this.context.baseLatency !== undefined) {
        console.log(`   Base latency: ${(this.context.baseLatency * 1000).toFixed(2)}ms`);
      }
      if (this.context.outputLatency !== undefined) {
        console.log(`   Output latency: ${(this.context.outputLatency * 1000).toFixed(2)}ms`);
      }

      return this.context;
    } catch (error) {
      console.error('❌ Failed to initialize audio engine:', error);
      throw error;
    }
  }

  /**
   * Unlock audio (for mobile browsers)
   * Call this on first user interaction
   * @returns {Promise<AudioContext>}
   */
  async unlock() {
    if (!this.initialized) {
      await this.initialize();
    }

    if (this.context.state === 'suspended') {
      await this.context.resume();
      this.unlocked = true;
    }

    return this.context;
  }

  /**
   * Get the AudioContext (initializes if needed)
   * @returns {AudioContext|null}
   */
  getContext() {
    return this.context;
  }

  /**
   * Check if audio engine is ready
   * @returns {boolean}
   */
  isReady() {
    return this.initialized && this.unlocked && this.context.state === 'running';
  }

  /**
   * Get current audio time
   * @returns {number} Time in seconds
   */
  getCurrentTime() {
    return this.context ? this.context.currentTime : 0;
  }

  /**
   * Get estimated latency
   * @returns {number} Latency in milliseconds
   */
  getLatency() {
    if (!this.context) return 0;
    
    const baseLatency = this.context.baseLatency || 0;
    const outputLatency = this.context.outputLatency || 0;
    return (baseLatency + outputLatency) * 1000;
  }

  /**
   * Close the audio context (cleanup)
   */
  async close() {
    if (this.context) {
      await this.context.close();
      this.context = null;
      this.initialized = false;
      this.unlocked = false;
      console.log('🔇 Audio engine closed');
    }
  }
}

/**
 * Singleton instance for easy access
 */
export const audioEngine = new AudioEngine();
