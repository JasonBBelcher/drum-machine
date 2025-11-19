/**
 * Audio Effects System
 * 
 * Provides effects processing chains using Web Audio API.
 * Designed for per-drum and master bus routing.
 */

/**
 * EffectsChain - Chain of audio effects
 * 
 * Creates a routing chain: input → [effects] → output
 * Effects can be enabled/disabled/bypassed individually.
 */
export class EffectsChain {
  constructor(audioContext) {
    this.context = audioContext;
    
    // Create input and output nodes
    this.input = audioContext.createGain();
    this.output = audioContext.createGain();
    
    // Effect nodes (null when not active)
    this.filterNode = null;
    this.filterEnabled = false;
    
    this.delayNode = null;
    this.delayFeedback = null;
    this.delayWet = null;
    this.delayEnabled = false;
    
    this.reverbNode = null;
    this.reverbWet = null;
    this.reverbEnabled = false;
    
    // Current routing
    this.activeChain = [this.input, this.output];
    
    // Connect input directly to output initially
    this.input.connect(this.output);
  }

  /**
   * Enable filter effect
   * @param {string} type - Filter type: 'lowpass', 'highpass', 'bandpass', 'notch'
   * @param {number} frequency - Frequency in Hz (20 - 20000)
   * @param {number} q - Resonance/Q factor (0.1 - 20)
   */
  enableFilter(type = 'lowpass', frequency = 1000, q = 1) {
    // Create filter if doesn't exist
    if (!this.filterNode) {
      this.filterNode = this.context.createBiquadFilter();
    }
    
    // Configure filter
    this.filterNode.type = type;
    this.filterNode.frequency.value = frequency;
    this.filterNode.Q.value = q;
    
    // Rebuild chain if not already active
    if (!this.filterEnabled) {
      this.filterEnabled = true;
      this._rebuildChain();
    }
  }

  /**
   * Update filter parameters
   * @param {Object} params - { type, frequency, q }
   */
  updateFilter(params) {
    if (!this.filterNode) return;
    
    if (params.type !== undefined) {
      this.filterNode.type = params.type;
    }
    if (params.frequency !== undefined) {
      this.filterNode.frequency.value = params.frequency;
    }
    if (params.q !== undefined) {
      this.filterNode.Q.value = params.q;
    }
  }

  /**
   * Disable filter effect
   */
  disableFilter() {
    if (!this.filterEnabled) return;
    
    this.filterEnabled = false;
    this._rebuildChain();
  }

  /**
   * Get current filter state
   * @returns {Object|null}
   */
  getFilterState() {
    if (!this.filterNode || !this.filterEnabled) return null;
    
    return {
      type: this.filterNode.type,
      frequency: this.filterNode.frequency.value,
      q: this.filterNode.Q.value
    };
  }

  /**
   * Enable delay effect
   * @param {number} time - Delay time in seconds (0.01 - 2.0)
   * @param {number} feedback - Feedback amount (0 - 0.9)
   * @param {number} wet - Wet/dry mix (0 - 1.0)
   */
  enableDelay(time = 0.3, feedback = 0.4, wet = 0.5) {
    // Create delay nodes if they don't exist
    if (!this.delayNode) {
      this.delayNode = this.context.createDelay(2.0);
      this.delayFeedback = this.context.createGain();
      this.delayWet = this.context.createGain();
      
      // Connect delay feedback loop
      this.delayNode.connect(this.delayFeedback);
      this.delayFeedback.connect(this.delayNode);
      this.delayNode.connect(this.delayWet);
    }
    
    // Configure delay
    this.delayNode.delayTime.value = time;
    this.delayFeedback.gain.value = feedback;
    this.delayWet.gain.value = wet;
    
    // Rebuild chain if not already active
    if (!this.delayEnabled) {
      this.delayEnabled = true;
      this._rebuildChain();
    }
  }

  /**
   * Update delay parameters
   * @param {Object} params - { time, feedback, wet }
   */
  updateDelay(params) {
    if (!this.delayNode) return;
    
    if (params.time !== undefined) {
      this.delayNode.delayTime.value = params.time;
    }
    if (params.feedback !== undefined) {
      this.delayFeedback.gain.value = params.feedback;
    }
    if (params.wet !== undefined) {
      this.delayWet.gain.value = params.wet;
    }
  }

  /**
   * Disable delay effect
   */
  disableDelay() {
    if (!this.delayEnabled) return;
    
    this.delayEnabled = false;
    this._rebuildChain();
  }

  /**
   * Get current delay state
   * @returns {Object|null}
   */
  getDelayState() {
    if (!this.delayNode || !this.delayEnabled) return null;
    
    return {
      time: this.delayNode.delayTime.value,
      feedback: this.delayFeedback.gain.value,
      wet: this.delayWet.gain.value
    };
  }

  /**
   * Enable reverb effect
   * @param {number} duration - Reverb duration in seconds (0.5 - 5.0)
   * @param {number} wet - Wet/dry mix (0 - 1.0)
   */
  enableReverb(duration = 2.0, wet = 0.3) {
    // Create reverb nodes if they don't exist
    if (!this.reverbNode) {
      this.reverbNode = this.context.createConvolver();
      this.reverbWet = this.context.createGain();
      
      // Generate impulse response
      this._generateImpulseResponse(duration);
      
      this.reverbNode.connect(this.reverbWet);
    } else {
      // Update impulse response if duration changed
      this._generateImpulseResponse(duration);
    }
    
    // Configure reverb
    this.reverbWet.gain.value = wet;
    
    // Rebuild chain if not already active
    if (!this.reverbEnabled) {
      this.reverbEnabled = true;
      this._rebuildChain();
    }
  }

  /**
   * Update reverb parameters
   * @param {Object} params - { duration, wet }
   */
  updateReverb(params) {
    if (!this.reverbNode) return;
    
    if (params.duration !== undefined) {
      this._generateImpulseResponse(params.duration);
    }
    if (params.wet !== undefined) {
      this.reverbWet.gain.value = params.wet;
    }
  }

  /**
   * Disable reverb effect
   */
  disableReverb() {
    if (!this.reverbEnabled) return;
    
    this.reverbEnabled = false;
    this._rebuildChain();
  }

  /**
   * Get current reverb state
   * @returns {Object|null}
   */
  getReverbState() {
    if (!this.reverbNode || !this.reverbEnabled) return null;
    
    return {
      duration: this.reverbNode.buffer ? this.reverbNode.buffer.duration : 2.0,
      wet: this.reverbWet.gain.value
    };
  }

  /**
   * Generate impulse response for reverb
   * @param {number} duration - Duration in seconds
   * @private
   */
  _generateImpulseResponse(duration) {
    const sampleRate = this.context.sampleRate;
    const length = sampleRate * duration;
    const impulse = this.context.createBuffer(2, length, sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);
    
    for (let i = 0; i < length; i++) {
      const n = length - i;
      left[i] = (Math.random() * 2 - 1) * Math.pow(n / length, 2);
      right[i] = (Math.random() * 2 - 1) * Math.pow(n / length, 2);
    }
    
    this.reverbNode.buffer = impulse;
  }

  /**
   * Rebuild the effects chain
   * Disconnects all nodes and reconnects in proper order
   * @private
   */
  _rebuildChain() {
    // Disconnect everything
    this.input.disconnect();
    if (this.filterNode) this.filterNode.disconnect();
    if (this.delayWet) this.delayWet.disconnect();
    if (this.reverbWet) this.reverbWet.disconnect();
    
    // Build serial chain for filter
    let serialChain = this.input;
    
    if (this.filterEnabled && this.filterNode) {
      this.input.connect(this.filterNode);
      serialChain = this.filterNode;
    }
    
    // Create parallel routing for delay and reverb (both receive from serial chain)
    const needsParallel = this.delayEnabled || this.reverbEnabled;
    
    if (needsParallel) {
      // Connect serial chain to output directly (dry signal)
      serialChain.connect(this.output);
      
      // Connect delay (wet)
      if (this.delayEnabled && this.delayNode) {
        serialChain.connect(this.delayNode);
        this.delayWet.connect(this.output);
      }
      
      // Connect reverb (wet)
      if (this.reverbEnabled && this.reverbNode) {
        serialChain.connect(this.reverbNode);
        this.reverbWet.connect(this.output);
      }
    } else {
      // No parallel effects, just connect to output
      serialChain.connect(this.output);
    }
    
    this.activeChain = [this.input, this.output];
  }

  /**
   * Connect this effects chain to a destination
   * @param {AudioNode} destination - Destination node
   */
  connect(destination) {
    this.output.connect(destination);
  }

  /**
   * Disconnect this effects chain
   */
  disconnect() {
    this.output.disconnect();
  }

  /**
   * Clean up all nodes
   */
  destroy() {
    this.input.disconnect();
    this.output.disconnect();
    
    if (this.filterNode) {
      this.filterNode.disconnect();
      this.filterNode = null;
    }
    
    if (this.delayNode) {
      this.delayNode.disconnect();
      this.delayFeedback.disconnect();
      this.delayWet.disconnect();
      this.delayNode = null;
      this.delayFeedback = null;
      this.delayWet = null;
    }
    
    if (this.reverbNode) {
      this.reverbNode.disconnect();
      this.reverbWet.disconnect();
      this.reverbNode = null;
      this.reverbWet = null;
    }
    
    this.activeChain = [];
  }

  /**
   * Get the input node for connecting sources
   * @returns {GainNode}
   */
  getInput() {
    return this.input;
  }

  /**
   * Get the output node for connecting to destination
   * @returns {GainNode}
   */
  getOutput() {
    return this.output;
  }
}

/**
 * MasterBus - Master effects bus for all audio
 * 
 * All drum outputs route through this before final output.
 */
export class MasterBus {
  constructor(audioContext) {
    this.context = audioContext;
    
    // Master gain for overall volume
    this.masterGain = audioContext.createGain();
    this.masterGain.gain.value = 1.0;
    
    // Effects chain
    this.effectsChain = new EffectsChain(audioContext);
    
    // Route: effectsChain → masterGain → destination
    this.effectsChain.connect(this.masterGain);
    this.masterGain.connect(audioContext.destination);
  }

  /**
   * Get the input node (for connecting drums)
   * @returns {AudioNode}
   */
  getInput() {
    return this.effectsChain.input;
  }

  /**
   * Set master volume
   * @param {number} volume - Volume 0.0 - 1.0
   */
  setVolume(volume) {
    this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
  }

  /**
   * Get master volume
   * @returns {number}
   */
  getVolume() {
    return this.masterGain.gain.value;
  }

  /**
   * Enable master filter
   * @param {string} type - Filter type
   * @param {number} frequency - Frequency in Hz
   * @param {number} q - Resonance
   */
  enableFilter(type, frequency, q) {
    this.effectsChain.enableFilter(type, frequency, q);
  }

  /**
   * Update master filter
   * @param {Object} params - Filter parameters
   */
  updateFilter(params) {
    this.effectsChain.updateFilter(params);
  }

  /**
   * Disable master filter
   */
  disableFilter() {
    this.effectsChain.disableFilter();
  }

  /**
   * Get master filter state
   * @returns {Object|null}
   */
  getFilterState() {
    return this.effectsChain.getFilterState();
  }

  /**
   * Enable delay
   * @param {number} time - Delay time in seconds
   * @param {number} feedback - Feedback amount
   * @param {number} wet - Wet/dry mix
   */
  enableDelay(time, feedback, wet) {
    this.effectsChain.enableDelay(time, feedback, wet);
  }

  /**
   * Update delay
   * @param {Object} params - Delay parameters
   */
  updateDelay(params) {
    this.effectsChain.updateDelay(params);
  }

  /**
   * Disable delay
   */
  disableDelay() {
    this.effectsChain.disableDelay();
  }

  /**
   * Get delay state
   * @returns {Object|null}
   */
  getDelayState() {
    return this.effectsChain.getDelayState();
  }

  /**
   * Enable reverb
   * @param {number} duration - Reverb duration
   * @param {number} wet - Wet/dry mix
   */
  enableReverb(duration, wet) {
    this.effectsChain.enableReverb(duration, wet);
  }

  /**
   * Update reverb
   * @param {Object} params - Reverb parameters
   */
  updateReverb(params) {
    this.effectsChain.updateReverb(params);
  }

  /**
   * Disable reverb
   */
  disableReverb() {
    this.effectsChain.disableReverb();
  }

  /**
   * Get reverb state
   * @returns {Object|null}
   */
  getReverbState() {
    return this.effectsChain.getReverbState();
  }

  /**
   * Clean up
   */
  destroy() {
    this.masterGain.disconnect();
    this.effectsChain.destroy();
  }
}
