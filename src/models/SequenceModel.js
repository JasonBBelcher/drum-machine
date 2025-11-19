/**
 * SequenceModel - Pure state management for drum sequences
 * 
 * Handles all sequence data without any UI or audio concerns.
 * Implements the Model in MVC pattern.
 */

export class SequenceModel {
  constructor(length = 16) {
    this.length = length;
    this.steps = [];
    this.tempo = 120;
    this.swing = 0;
    this.name = 'Untitled';
    this.drumEffects = {}; // Per-drum effects settings
    this.initialize();
  }

  /**
   * Initialize the sequence with empty steps
   */
  initialize() {
    this.steps = Array.from({ length: this.length }, (_, i) => 
      new StepState(i)
    );
  }

  /**
   * Toggle a drum on/off at a specific step
   * @param {number} stepIndex - Step number (0-based)
   * @param {string} drumName - Name of the drum ('kick', 'snare', etc.)
   */
  toggleDrum(stepIndex, drumName) {
    if (!this.isValidStep(stepIndex)) {
      throw new Error(`Invalid step index: ${stepIndex}`);
    }

    const step = this.steps[stepIndex];
    if (!step.drums[drumName]) {
      throw new Error(`Invalid drum name: ${drumName}`);
    }

    step.drums[drumName].on = !step.drums[drumName].on;
  }

  /**
   * Set drum state explicitly
   * @param {number} stepIndex - Step number
   * @param {string} drumName - Drum name
   * @param {boolean} on - Active state
   */
  setDrumState(stepIndex, drumName, on) {
    if (!this.isValidStep(stepIndex)) {
      throw new Error(`Invalid step index: ${stepIndex}`);
    }

    const step = this.steps[stepIndex];
    if (!step.drums[drumName]) {
      throw new Error(`Invalid drum name: ${drumName}`);
    }

    step.drums[drumName].on = on;
  }

  /**
   * Set volume for a drum across all steps
   * @param {string} drumName - Drum name
   * @param {number} volume - Volume level (0.0 - 1.0)
   */
  setDrumVolume(drumName, volume) {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    
    this.steps.forEach(step => {
      if (step.drums[drumName]) {
        step.drums[drumName].volume = clampedVolume;
      }
    });
  }

  /**
   * Get volume for a specific drum
   * @param {string} drumName - Drum name
   * @returns {number} Volume level
   */
  getDrumVolume(drumName) {
    const firstStep = this.steps[0];
    return firstStep?.drums[drumName]?.volume || 0.5;
  }

  /**
   * Set pitch for a drum across all steps (Phase 4)
   * @param {string} drumName - Drum name
   * @param {number} semitones - Pitch shift in semitones (-12 to +12)
   */
  setDrumPitch(drumName, semitones) {
    const clampedPitch = Math.max(-12, Math.min(12, semitones));
    
    this.steps.forEach(step => {
      if (step.drums[drumName]) {
        step.drums[drumName].pitch = clampedPitch;
      }
    });
  }

  /**
   * Get pitch for a specific drum (Phase 4)
   * @param {string} drumName - Drum name
   * @returns {number} Pitch in semitones
   */
  getDrumPitch(drumName) {
    const firstStep = this.steps[0];
    return firstStep?.drums[drumName]?.pitch || 0;
  }

  /**
   * Set detune for a drum across all steps (Phase 4)
   * @param {string} drumName - Drum name
   * @param {number} cents - Fine tune in cents (-100 to +100)
   */
  setDrumDetune(drumName, cents) {
    const clampedDetune = Math.max(-100, Math.min(100, cents));
    
    this.steps.forEach(step => {
      if (step.drums[drumName]) {
        step.drums[drumName].detune = clampedDetune;
      }
    });
  }

  /**
   * Get detune for a specific drum (Phase 4)
   * @param {string} drumName - Drum name
   * @returns {number} Detune in cents
   */
  getDrumDetune(drumName) {
    const firstStep = this.steps[0];
    return firstStep?.drums[drumName]?.detune || 0;
  }

  /**
   * Set tempo
   * @param {number} bpm - Beats per minute
   */
  setTempo(bpm) {
    this.tempo = Math.max(40, Math.min(300, bpm));
  }

  /**
   * Set swing amount
   * @param {number} amount - Swing percentage (0-75)
   */
  setSwing(amount) {
    this.swing = Math.max(0, Math.min(75, amount));
  }

  /**
   * Change sequence length
   * @param {number} newLength - New number of steps
   */
  setLength(newLength) {
    const oldLength = this.length;
    this.length = Math.max(1, Math.min(64, newLength));

    if (this.length > oldLength) {
      // Add new steps
      for (let i = oldLength; i < this.length; i++) {
        this.steps.push(new StepState(i));
      }
    } else if (this.length < oldLength) {
      // Remove steps
      this.steps = this.steps.slice(0, this.length);
    }
  }

  /**
   * Clear all drum hits in the sequence
   */
  clear() {
    this.steps.forEach(step => {
      Object.values(step.drums).forEach(drum => {
        drum.on = false;
      });
    });
  }

  /**
   * Clear a specific drum across all steps
   * @param {string} drumName - Drum to clear
   */
  clearDrum(drumName) {
    this.steps.forEach(step => {
      if (step.drums[drumName]) {
        step.drums[drumName].on = false;
      }
    });
  }

  /**
   * Set drum effect settings
   * @param {string} drumName - Drum name
   * @param {Object} effectStates - Effect states {filter, delay, reverb}
   */
  setDrumEffects(drumName, effectStates) {
    this.drumEffects[drumName] = effectStates;
  }

  /**
   * Get drum effect settings
   * @param {string} drumName - Drum name
   * @returns {Object|null} Effect states or null
   */
  getDrumEffects(drumName) {
    return this.drumEffects[drumName] || null;
  }

  /**
   * Clear drum effects
   * @param {string} drumName - Drum name
   */
  clearDrumEffects(drumName) {
    delete this.drumEffects[drumName];
  }

  /**
   * Validate step index
   * @param {number} index - Step index to check
   * @returns {boolean}
   */
  isValidStep(index) {
    return index >= 0 && index < this.length;
  }

  /**
   * Get list of all drum names
   * @returns {string[]}
   */
  getDrumNames() {
    if (this.steps.length === 0) return [];
    return Object.keys(this.steps[0].drums);
  }

  /**
   * Serialize to plain JSON (safe for localStorage)
   * @returns {Object}
   */
  toJSON() {
    return {
      name: this.name,
      tempo: this.tempo,
      swing: this.swing,
      length: this.length,
      drumEffects: this.drumEffects, // Save per-drum effects
      steps: this.steps.map(step => ({
        id: step.id,
        drums: Object.entries(step.drums).reduce((acc, [name, drum]) => {
          acc[name] = {
            on: drum.on,
            volume: drum.volume
          };
          return acc;
        }, {})
      }))
    };
  }

  /**
   * Deserialize from plain JSON
   * @param {Object} data - Serialized sequence data
   * @returns {SequenceModel}
   */
  static fromJSON(data) {
    const sequence = new SequenceModel(data.length);
    sequence.name = data.name;
    sequence.tempo = data.tempo;
    sequence.swing = data.swing || 0;
    sequence.drumEffects = data.drumEffects || {}; // Load drum effects (backward compatible)

    data.steps.forEach((stepData, i) => {
      Object.entries(stepData.drums).forEach(([drumName, drumData]) => {
        sequence.steps[i].drums[drumName].on = drumData.on;
        sequence.steps[i].drums[drumName].volume = drumData.volume;
        // Phase 4: Load pitch data if present
        sequence.steps[i].drums[drumName].pitch = drumData.pitch || 0;
        sequence.steps[i].drums[drumName].detune = drumData.detune || 0;
      });
    });

    return sequence;
  }

  /**
   * Clone this sequence
   * @returns {SequenceModel}
   */
  clone() {
    return SequenceModel.fromJSON(this.toJSON());
  }
}

/**
 * StepState - Represents a single step in the sequence
 */
class StepState {
  constructor(id) {
    this.id = id;
    this.drums = {
      kick: new DrumState('kick'),
      clap: new DrumState('clap'),
      snare: new DrumState('snare'),
      hat: new DrumState('hat'),
      shaker: new DrumState('shaker'),
      bongo1: new DrumState('bongo1'),
      congaz: new DrumState('congaz'),
      harmony: new DrumState('harmony')
    };
  }
}

/**
 * DrumState - Represents the state of a single drum at a step
 */
class DrumState {
  constructor(name) {
    this.name = name;
    this.on = false;
    this.volume = 0.5;
    this.pitch = 0;      // Phase 4: Semitones (-12 to +12)
    this.detune = 0;     // Phase 4: Cents (-100 to +100)
  }
}
