/**
 * SongModel - Manages pattern chains for song arrangement
 * 
 * Handles song-level composition by chaining patterns together.
 * Part of Phase 6: Pattern Chaining implementation.
 */

export class SongModel {
  constructor(name = 'Untitled Song') {
    this.name = name;
    this.chain = [];              // Array of ChainStep instances
    this.currentStepIndex = 0;
    this.isLooping = true;        // Loop entire chain when complete
    this.isPlaying = false;
  }

  /**
   * Add a pattern to the chain
   * @param {string} patternName - Name of the pattern to add
   * @param {number} repeats - Number of times to repeat (1-99)
   */
  addPattern(patternName, repeats = 1) {
    if (!patternName || patternName.trim() === '') {
      throw new Error('Pattern name cannot be empty');
    }

    if (repeats < 1 || repeats > 99) {
      throw new Error('Repeats must be between 1 and 99');
    }

    this.chain.push(new ChainStep(patternName, repeats));
  }

  /**
   * Remove a step from the chain
   * @param {number} index - Index of step to remove
   */
  removeStep(index) {
    if (index < 0 || index >= this.chain.length) {
      throw new Error(`Invalid step index: ${index}`);
    }

    this.chain.splice(index, 1);

    // Adjust current index if necessary
    if (this.currentStepIndex >= this.chain.length && this.chain.length > 0) {
      this.currentStepIndex = this.chain.length - 1;
    }
  }

  /**
   * Move a step to a different position
   * @param {number} fromIndex - Current position
   * @param {number} toIndex - Target position
   */
  moveStep(fromIndex, toIndex) {
    if (fromIndex < 0 || fromIndex >= this.chain.length) {
      throw new Error(`Invalid from index: ${fromIndex}`);
    }

    if (toIndex < 0 || toIndex >= this.chain.length) {
      throw new Error(`Invalid to index: ${toIndex}`);
    }

    const [step] = this.chain.splice(fromIndex, 1);
    this.chain.splice(toIndex, 0, step);

    // Update current index if affected
    if (this.currentStepIndex === fromIndex) {
      this.currentStepIndex = toIndex;
    } else if (fromIndex < this.currentStepIndex && toIndex >= this.currentStepIndex) {
      this.currentStepIndex--;
    } else if (fromIndex > this.currentStepIndex && toIndex <= this.currentStepIndex) {
      this.currentStepIndex++;
    }
  }

  /**
   * Clear entire chain
   */
  clear() {
    this.chain = [];
    this.currentStepIndex = 0;
    this.isPlaying = false;
  }

  /**
   * Get the next step in the chain
   * @returns {ChainStep|null} Next step or null if chain complete
   */
  getNextStep() {
    if (this.chain.length === 0) {
      return null;
    }

    if (this.currentStepIndex >= this.chain.length) {
      if (this.isLooping) {
        this.currentStepIndex = 0;
      } else {
        return null; // End of chain
      }
    }

    return this.chain[this.currentStepIndex];
  }

  /**
   * Get current step without advancing
   * @returns {ChainStep|null}
   */
  getCurrentStep() {
    if (this.currentStepIndex < 0 || this.currentStepIndex >= this.chain.length) {
      return null;
    }

    return this.chain[this.currentStepIndex];
  }

  /**
   * Advance to next step in chain
   */
  advance() {
    this.currentStepIndex++;

    if (this.currentStepIndex >= this.chain.length) {
      if (this.isLooping) {
        this.currentStepIndex = 0;
      }
    }
  }

  /**
   * Reset to beginning of chain
   */
  reset() {
    this.currentStepIndex = 0;
    this.chain.forEach(step => step.reset());
  }

  /**
   * Get total length of chain (sum of all repeats)
   * @returns {number} Total pattern plays in full chain
   */
  getTotalLength() {
    return this.chain.reduce((sum, step) => sum + step.repeats, 0);
  }

  /**
   * Check if chain is empty
   * @returns {boolean}
   */
  isEmpty() {
    return this.chain.length === 0;
  }

  /**
   * Serialize to JSON
   * @returns {Object}
   */
  toJSON() {
    return {
      name: this.name,
      chain: this.chain.map(step => step.toJSON()),
      isLooping: this.isLooping,
      version: '1.0' // For future compatibility
    };
  }

  /**
   * Deserialize from JSON
   * @param {Object} data - Serialized song data
   * @returns {SongModel}
   */
  static fromJSON(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid song data');
    }

    const song = new SongModel(data.name || 'Untitled Song');
    song.isLooping = data.isLooping !== undefined ? data.isLooping : true;

    if (Array.isArray(data.chain)) {
      song.chain = data.chain.map(stepData => ChainStep.fromJSON(stepData));
    }

    return song;
  }
}

/**
 * ChainStep - Represents a single pattern in the chain
 */
export class ChainStep {
  constructor(patternName, repeats = 1) {
    this.patternName = patternName;
    this.repeats = Math.max(1, Math.min(99, repeats)); // Clamp 1-99
    this.currentRepeat = 0;
  }

  /**
   * Increment repeat counter
   * @returns {boolean} True if all repeats completed
   */
  incrementRepeat() {
    this.currentRepeat++;
    return this.currentRepeat >= this.repeats;
  }

  /**
   * Reset repeat counter
   */
  reset() {
    this.currentRepeat = 0;
  }

  /**
   * Check if step has completed all repeats
   * @returns {boolean}
   */
  isComplete() {
    return this.currentRepeat >= this.repeats;
  }

  /**
   * Get progress through repeats (0-1)
   * @returns {number}
   */
  getProgress() {
    return this.repeats > 0 ? this.currentRepeat / this.repeats : 0;
  }

  /**
   * Serialize to JSON
   * @returns {Object}
   */
  toJSON() {
    return {
      patternName: this.patternName,
      repeats: this.repeats
    };
  }

  /**
   * Deserialize from JSON
   * @param {Object} data - Serialized step data
   * @returns {ChainStep}
   */
  static fromJSON(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid chain step data');
    }

    if (!data.patternName) {
      throw new Error('Pattern name is required');
    }

    return new ChainStep(data.patternName, data.repeats || 1);
  }
}
