/**
 * SongModel - Manages pattern chains for song arrangement
 * 
 * Handles song-level composition by chaining patterns together.
 * Part of Phase 6: Pattern Chaining implementation.
 */

import { SceneGrid } from './SceneModel.js';

export class SongModel {
  constructor(name = 'Untitled Song') {
    this.name = name;
    this.chain = [];              // Array of ChainStep instances
    this.currentStepIndex = 0;
    this.isLooping = true;        // Loop entire chain when complete
    this.isPlaying = false;
    this.jumps = [];              // Phase 7: Array of Jump instances
    this.mode = 'chain';          // Phase 8: 'chain' or 'scene' mode
    this.sceneChain = [];         // Phase 8: Array of scene indices for scene mode
    this.sceneGrid = new SceneGrid(); // Phase 8: Scene grid for scene mode
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

    // Phase 7: Update jump indices
    this.updateJumpIndices(fromIndex, toIndex);
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
   * Phase 7: Add a jump marker
   * @param {number} fromIndex - Source step index
   * @param {number} toIndex - Target step index
   * @param {string} label - Optional label for the jump
   * @param {string} condition - Optional condition ('always', 'on-first', 'on-last', or specific repeat number)
   * @returns {Jump} The created jump
   */
  addJump(fromIndex, toIndex, label = '', condition = 'always') {
    if (fromIndex < 0 || fromIndex >= this.chain.length) {
      throw new Error(`Invalid from index: ${fromIndex}`);
    }

    if (toIndex < 0 || toIndex >= this.chain.length) {
      throw new Error(`Invalid to index: ${toIndex}`);
    }

    if (fromIndex === toIndex) {
      throw new Error('Jump source and target cannot be the same');
    }

    const jump = new Jump(fromIndex, toIndex, label, condition);
    this.jumps.push(jump);
    return jump;
  }

  /**
   * Phase 7: Remove a jump marker
   * @param {number} jumpIndex - Index of jump to remove
   */
  removeJump(jumpIndex) {
    if (jumpIndex < 0 || jumpIndex >= this.jumps.length) {
      throw new Error(`Invalid jump index: ${jumpIndex}`);
    }

    this.jumps.splice(jumpIndex, 1);
  }

  /**
   * Phase 7: Get jumps for a specific step
   * @param {number} stepIndex - Step index to check for jumps
   * @returns {Jump[]} Array of jumps from this step
   */
  getJumpsFrom(stepIndex) {
    return this.jumps.filter(jump => jump.fromIndex === stepIndex);
  }

  /**
   * Phase 7: Get jump by index
   * @param {number} jumpIndex - Jump index
   * @returns {Jump|null}
   */
  getJump(jumpIndex) {
    if (jumpIndex < 0 || jumpIndex >= this.jumps.length) {
      return null;
    }
    return this.jumps[jumpIndex];
  }

  /**
   * Phase 7: Update jump indices when chain is reordered
   * @param {number} fromIndex - Original position
   * @param {number} toIndex - New position
   */
  updateJumpIndices(fromIndex, toIndex) {
    this.jumps.forEach(jump => {
      // Update from index
      if (jump.fromIndex === fromIndex) {
        jump.fromIndex = toIndex;
      } else if (fromIndex < jump.fromIndex && toIndex >= jump.fromIndex) {
        jump.fromIndex--;
      } else if (fromIndex > jump.fromIndex && toIndex <= jump.fromIndex) {
        jump.fromIndex++;
      }

      // Update to index
      if (jump.toIndex === fromIndex) {
        jump.toIndex = toIndex;
      } else if (fromIndex < jump.toIndex && toIndex >= jump.toIndex) {
        jump.toIndex--;
      } else if (fromIndex > jump.toIndex && toIndex <= jump.toIndex) {
        jump.toIndex++;
      }
    });
  }

  /**
   * Phase 7: Validate all jumps are within bounds
   * @returns {boolean} True if all jumps are valid
   */
  validateJumps() {
    return this.jumps.every(jump => {
      return jump.fromIndex >= 0 && jump.fromIndex < this.chain.length &&
             jump.toIndex >= 0 && jump.toIndex < this.chain.length &&
             jump.fromIndex !== jump.toIndex;
    });
  }

  /**
   * Phase 7: Clear all jumps
   */
  clearJumps() {
    this.jumps = [];
  }

  /**
   * Phase 8: Add scene to scene chain
   * @param {number} sceneIndex - Index of scene in scene grid
   */
  addSceneToChain(sceneIndex) {
    if (sceneIndex < 0) {
      throw new Error('Scene index must be non-negative');
    }
    this.sceneChain.push(sceneIndex);
  }

  /**
   * Phase 8: Remove scene from chain
   * @param {number} chainIndex - Index in scene chain
   */
  removeSceneFromChain(chainIndex) {
    if (chainIndex < 0 || chainIndex >= this.sceneChain.length) {
      throw new Error(`Invalid chain index: ${chainIndex}`);
    }
    this.sceneChain.splice(chainIndex, 1);
  }

  /**
   * Phase 8: Set playback mode
   * @param {string} mode - 'chain' or 'scene'
   */
  setMode(mode) {
    if (mode !== 'chain' && mode !== 'scene') {
      throw new Error('Mode must be "chain" or "scene"');
    }
    this.mode = mode;
  }

  /**
   * Serialize to JSON
   * @returns {Object}
   */
  toJSON() {
    return {
      name: this.name,
      chain: this.chain.map(step => step.toJSON()),
      jumps: this.jumps.map(jump => jump.toJSON()), // Phase 7
      sceneChain: this.sceneChain, // Phase 8
      mode: this.mode, // Phase 8
      sceneGrid: this.sceneGrid.toJSON(), // Phase 8
      isLooping: this.isLooping,
      version: '1.2' // Phase 8: Updated version
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

    // Phase 7: Load jumps
    if (Array.isArray(data.jumps)) {
      song.jumps = data.jumps.map(jumpData => Jump.fromJSON(jumpData));
    }

    // Phase 8: Load scene data
    if (Array.isArray(data.sceneChain)) {
      song.sceneChain = [...data.sceneChain];
    }
    
    if (data.mode) {
      song.mode = data.mode;
    }

    if (data.sceneGrid) {
      song.sceneGrid = SceneGrid.fromJSON(data.sceneGrid);
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

/**
 * Jump - Represents a jump marker in the song chain
 * Phase 7: Jump Mode implementation
 */
export class Jump {
  constructor(fromIndex, toIndex, label = '', condition = 'always') {
    this.fromIndex = fromIndex;
    this.toIndex = toIndex;
    this.label = label;
    this.condition = condition; // 'always', 'on-first', 'on-last', or specific repeat number
  }

  /**
   * Check if jump should be taken based on condition
   * @param {number} currentRepeat - Current repeat number (0-indexed)
   * @param {number} totalRepeats - Total repeats for the step
   * @returns {boolean} True if jump should be taken
   */
  shouldJump(currentRepeat, totalRepeats) {
    switch (this.condition) {
      case 'always':
        return true;
      
      case 'on-first':
        return currentRepeat === 0;
      
      case 'on-last':
        return currentRepeat === totalRepeats - 1;
      
      default:
        // Specific repeat number (1-indexed in UI, 0-indexed internally)
        const targetRepeat = parseInt(this.condition);
        if (!isNaN(targetRepeat) && targetRepeat > 0) {
          return currentRepeat === targetRepeat - 1;
        }
        return false;
    }
  }

  /**
   * Get display text for condition
   * @returns {string}
   */
  getConditionText() {
    switch (this.condition) {
      case 'always':
        return 'Always';
      case 'on-first':
        return 'On first';
      case 'on-last':
        return 'On last';
      default:
        const repeatNum = parseInt(this.condition);
        return !isNaN(repeatNum) ? `On repeat ${repeatNum}` : 'Always';
    }
  }

  /**
   * Serialize to JSON
   * @returns {Object}
   */
  toJSON() {
    return {
      fromIndex: this.fromIndex,
      toIndex: this.toIndex,
      label: this.label,
      condition: this.condition
    };
  }

  /**
   * Deserialize from JSON
   * @param {Object} data - Serialized jump data
   * @returns {Jump}
   */
  static fromJSON(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid jump data');
    }

    if (data.fromIndex === undefined || data.toIndex === undefined) {
      throw new Error('Jump requires fromIndex and toIndex');
    }

    return new Jump(
      data.fromIndex,
      data.toIndex,
      data.label || '',
      data.condition || 'always'
    );
  }
}
