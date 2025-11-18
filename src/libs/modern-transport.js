/**
 * Integration Bridge
 * 
 * This file shows how to integrate the new AudioScheduler with your existing
 * drum-machine.js code without breaking everything at once.
 * 
 * USAGE:
 * 1. Import this instead of using the old transport object
 * 2. Gradually migrate features over
 * 3. Eventually replace old transport completely
 */

import { audioEngine } from './audio-engine.js';
import { AudioScheduler } from './audio-scheduler.js';

export class ModernTransport {
  constructor() {
    this.audioEngine = audioEngine;
    this.scheduler = null;
    this.sequence = [];
    this.isInitialized = false;
  }

  /**
   * Initialize the transport (call on first user interaction)
   */
  async init() {
    if (this.isInitialized) return;

    try {
      // Initialize audio engine
      const audioContext = await this.audioEngine.initialize();
      
      // Create scheduler
      this.scheduler = new AudioScheduler(audioContext);
      
      // Set up callbacks
      this.scheduler.onStep((stepState, time) => {
        this.triggerSounds(stepState, time);
      });

      this.scheduler.onUIUpdate((stepNumber) => {
        this.updateUI(stepNumber);
      });

      this.isInitialized = true;
      console.log('✅ Modern transport initialized');
    } catch (error) {
      console.error('❌ Failed to initialize transport:', error);
      throw error;
    }
  }

  /**
   * Start playback
   * @param {Array} sequence - Sequence to play
   */
  async start(sequence) {
    // Ensure initialized
    if (!this.isInitialized) {
      await this.init();
    }

    // Unlock audio on mobile
    await this.audioEngine.unlock();

    // Set sequence and start
    this.sequence = sequence;
    this.scheduler.setSequence(sequence);
    this.scheduler.start();
  }

  /**
   * Stop playback
   */
  stop() {
    if (this.scheduler) {
      this.scheduler.stop();
    }
  }

  /**
   * Set tempo
   * @param {number} bpm - Beats per minute
   */
  setTempo(bpm) {
    if (this.scheduler) {
      this.scheduler.setTempo(bpm);
      
      // If playing, restart to apply new tempo smoothly
      if (this.scheduler.getIsPlaying()) {
        this.scheduler.restart();
      }
    }
  }

  /**
   * Trigger sounds for a step (integrates with existing Howler code)
   * @param {Object} dmState - Drum machine state for this step
   * @param {number} time - Scheduled time (for future: sprite scheduling)
   */
  triggerSounds(dmState, time) {
    // Play all active drums in this step
    for (let drum in dmState) {
      if (dmState.hasOwnProperty(drum) && drum !== 'id') {
        if (dmState[drum].on) {
          // For now, play immediately (Howler doesn't support precise scheduling)
          // Future: Use Web Audio API buffers or Howler sprites with timing
          dmState[drum].play();
        }
      }
    }
  }

  /**
   * Update UI to show current step
   * @param {number} stepNumber - Current step index
   */
  updateUI(stepNumber) {
    // Clear previous highlights
    document.querySelectorAll('.seq-playhead').forEach(el => {
      el.classList.remove('seq-playhead');
    });

    // Highlight current step
    document.querySelectorAll(`.col-seq${stepNumber}`).forEach(el => {
      el.classList.add('seq-playhead');
    });
  }

  /**
   * Check if playing
   * @returns {boolean}
   */
  isPlaying() {
    return this.scheduler ? this.scheduler.getIsPlaying() : false;
  }

  /**
   * Get current step
   * @returns {number}
   */
  getCurrentStep() {
    return this.scheduler ? this.scheduler.getCurrentStep() : 0;
  }
}

// Export singleton instance
export const modernTransport = new ModernTransport();
