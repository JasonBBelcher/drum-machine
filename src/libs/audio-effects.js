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
   * Rebuild the effects chain
   * Disconnects all nodes and reconnects in proper order
   * @private
   */
  _rebuildChain() {
    // Disconnect everything
    this.input.disconnect();
    if (this.filterNode) this.filterNode.disconnect();
    
    // Build new chain based on enabled effects
    const chain = [this.input];
    
    if (this.filterEnabled && this.filterNode) {
      chain.push(this.filterNode);
    }
    
    chain.push(this.output);
    
    // Connect chain
    for (let i = 0; i < chain.length - 1; i++) {
      chain[i].connect(chain[i + 1]);
    }
    
    this.activeChain = chain;
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
    
    this.activeChain = [];
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
   * Clean up
   */
  destroy() {
    this.masterGain.disconnect();
    this.effectsChain.destroy();
  }
}
