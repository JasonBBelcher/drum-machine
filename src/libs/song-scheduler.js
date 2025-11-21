/**
 * SongScheduler - Manages pattern chain playback
 * 
 * Coordinates pattern transitions and repeat logic for song mode.
 * Integrates with SequencerController to load and play patterns.
 */

export class SongScheduler {
  constructor(sequencerController, songModel) {
    this.controller = sequencerController;
    this.songModel = songModel;
    this.currentStep = null;
    this.isPlaying = false;
    this.patternEndTimer = null;
    this.onStepChangeCallback = null;
    this.visitedJumps = new Set(); // Phase 7: Track jumps to prevent infinite loops
    this.maxJumpsPerPlaythrough = 100; // Phase 7: Safety limit
    this.activeClips = []; // Phase 8: Track currently playing clips in scene mode
    this.onSceneChangeCallback = null; // Phase 8: Scene change notification
  }

  /**
   * Start playing the song chain
   */
  start() {
    if (this.isPlaying) {
      console.warn('Song scheduler already playing');
      return;
    }

    if (this.songModel.isEmpty()) {
      console.warn('Cannot play empty song chain');
      return;
    }

    this.isPlaying = true;
    this.songModel.reset();
    this.songModel.isPlaying = true;
    this.visitedJumps.clear(); // Phase 7: Reset jump tracking
    this.playNextStep();
  }

  /**
   * Stop playing the song chain
   */
  stop() {
    this.isPlaying = false;
    this.songModel.isPlaying = false;

    if (this.patternEndTimer) {
      clearTimeout(this.patternEndTimer);
      this.patternEndTimer = null;
    }

    // Stop the currently playing pattern
    this.controller.handleStop();
  }

  /**
   * Pause playback (can be resumed)
   */
  pause() {
    this.isPlaying = false;
    this.songModel.isPlaying = false;

    if (this.patternEndTimer) {
      clearTimeout(this.patternEndTimer);
      this.patternEndTimer = null;
    }

    this.controller.handleStop();
  }

  /**
   * Resume playback from current position
   */
  resume() {
    if (this.isPlaying) {
      console.warn('Song scheduler already playing');
      return;
    }

    if (this.songModel.isEmpty()) {
      console.warn('Cannot resume empty song chain');
      return;
    }

    this.isPlaying = true;
    this.songModel.isPlaying = true;
    this.playCurrentStep();
  }

  /**
   * Play the next step in the chain
   */
  playNextStep() {
    if (!this.isPlaying) return;

    const step = this.songModel.getNextStep();

    if (!step) {
      // Chain complete and not looping
      this.stop();
      this.notifyStepChange(null);
      return;
    }

    this.currentStep = step;
    this.loadAndPlayPattern(step.patternName);
  }

  /**
   * Play the current step (for resume)
   */
  playCurrentStep() {
    const step = this.songModel.getCurrentStep();

    if (!step) {
      this.playNextStep();
      return;
    }

    this.currentStep = step;
    this.loadAndPlayPattern(step.patternName);
  }

  /**
   * Load a pattern and start playing it
   * @param {string} patternName - Name of pattern to load
   */
  loadAndPlayPattern(patternName) {
    // Load the pattern (this will also start playing it)
    const success = this.controller.loadPatternByName(patternName);

    if (!success) {
      console.error(`Failed to load pattern: ${patternName}`);
      // Skip to next pattern
      this.handlePatternComplete();
      return;
    }

    // Notify listeners of step change
    this.notifyStepChange(this.songModel.currentStepIndex);

    // Schedule pattern completion handler
    this.schedulePatternEnd();
  }

  /**
   * Schedule callback for when current pattern finishes
   */
  schedulePatternEnd() {
    if (this.patternEndTimer) {
      clearTimeout(this.patternEndTimer);
    }

    // Calculate pattern duration
    const patternLength = this.controller.model.length;
    const tempo = this.controller.model.tempo;
    const secondsPerBeat = 60 / tempo;
    const secondsPerSixteenth = secondsPerBeat / 4;
    const patternDuration = patternLength * secondsPerSixteenth;

    // Schedule next pattern (add small buffer for accuracy)
    this.patternEndTimer = setTimeout(() => {
      this.handlePatternComplete();
    }, patternDuration * 1000);
  }

  /**
   * Handle pattern completion
   */
  handlePatternComplete() {
    if (!this.isPlaying || !this.currentStep) return;

    const currentStepIndex = this.songModel.currentStepIndex;
    const currentRepeat = this.currentStep.currentRepeat;
    
    const shouldAdvance = this.currentStep.incrementRepeat();

    if (shouldAdvance) {
      // All repeats complete, check for jumps before advancing
      const jump = this.checkForJump(currentStepIndex, currentRepeat);
      
      if (jump) {
        // Execute jump
        this.executeJump(jump);
      } else {
        // Normal advance to next pattern
        this.currentStep.reset();
        this.songModel.advance();
      }
    }

    // Play next (might be same pattern if repeating, or jumped pattern)
    this.playNextStep();
  }

  /**
   * Phase 7: Check if there's a valid jump from current position
   * @param {number} stepIndex - Current step index
   * @param {number} repeatIndex - Current repeat (before increment)
   * @returns {Jump|null} Jump to execute, or null
   */
  checkForJump(stepIndex, repeatIndex) {
    const jumps = this.songModel.getJumpsFrom(stepIndex);
    
    if (jumps.length === 0) return null;

    const step = this.songModel.chain[stepIndex];
    if (!step) return null;

    // Check each jump's condition
    for (const jump of jumps) {
      // Prevent infinite loops
      const jumpKey = `${jump.fromIndex}-${jump.toIndex}-${repeatIndex}`;
      if (this.visitedJumps.has(jumpKey)) {
        console.warn(`Skipping jump to prevent infinite loop: ${jumpKey}`);
        continue;
      }

      if (this.visitedJumps.size >= this.maxJumpsPerPlaythrough) {
        console.warn('Max jumps per playthrough reached, skipping jump');
        continue;
      }

      // Check if condition is met
      if (jump.shouldJump(repeatIndex, step.repeats)) {
        return jump;
      }
    }

    return null;
  }

  /**
   * Phase 7: Execute a jump
   * @param {Jump} jump - Jump to execute
   */
  executeJump(jump) {
    const jumpKey = `${jump.fromIndex}-${jump.toIndex}-${this.currentStep.currentRepeat}`;
    this.visitedJumps.add(jumpKey);

    console.log(`🔀 Executing jump: ${jump.label || `${jump.fromIndex} → ${jump.toIndex}`}`);

    // Reset current step
    this.currentStep.reset();

    // Jump to target
    this.songModel.currentStepIndex = jump.toIndex;

    // Notify listeners of jump
    if (this.onJumpCallback) {
      this.onJumpCallback(jump);
    }
  }

  /**
   * Skip to next pattern immediately
   */
  skipNext() {
    if (!this.isPlaying) return;

    if (this.patternEndTimer) {
      clearTimeout(this.patternEndTimer);
      this.patternEndTimer = null;
    }

    if (this.currentStep) {
      this.currentStep.reset();
    }

    this.songModel.advance();
    this.playNextStep();
  }

  /**
   * Skip to previous pattern
   */
  skipPrevious() {
    if (!this.isPlaying) return;

    if (this.patternEndTimer) {
      clearTimeout(this.patternEndTimer);
      this.patternEndTimer = null;
    }

    if (this.currentStep) {
      this.currentStep.reset();
    }

    // Move back in chain
    this.songModel.currentStepIndex = Math.max(0, this.songModel.currentStepIndex - 1);
    this.playNextStep();
  }

  /**
   * Jump to specific step in chain
   * @param {number} index - Step index to jump to
   */
  jumpToStep(index) {
    if (index < 0 || index >= this.songModel.chain.length) {
      console.error(`Invalid step index: ${index}`);
      return;
    }

    if (this.patternEndTimer) {
      clearTimeout(this.patternEndTimer);
      this.patternEndTimer = null;
    }

    if (this.currentStep) {
      this.currentStep.reset();
    }

    this.songModel.currentStepIndex = index;
    this.playNextStep();
  }

  /**
   * Handle tempo change during playback
   */
  onTempoChange() {
    if (this.isPlaying && this.patternEndTimer) {
      // Reschedule pattern end with new tempo
      this.schedulePatternEnd();
    }
  }

  /**
   * Set callback for step change notifications
   * @param {Function} callback - Called with (stepIndex, progressInfo) when step changes
   */
  onStepChange(callback) {
    this.onStepChangeCallback = callback;
  }

  /**
   * Phase 7: Set callback for jump notifications
   * @param {Function} callback - Called with (jump) when jump executes
   */
  onJump(callback) {
    this.onJumpCallback = callback;
  }

  /**
   * Notify listeners of step change
   * @param {number|null} stepIndex - Current step index or null if stopped
   */
  notifyStepChange(stepIndex) {
    if (this.onStepChangeCallback) {
      // Calculate progress info
      const progressInfo = this.calculateProgress();
      this.onStepChangeCallback(stepIndex, progressInfo);
    }
  }

  /**
   * Calculate overall progress through the song
   * @returns {Object} Progress information
   */
  calculateProgress() {
    const chain = this.songModel.chain;
    let totalRepeats = 0;
    let completedRepeats = 0;

    chain.forEach((step, index) => {
      totalRepeats += step.repeats;
      
      if (index < this.songModel.currentStepIndex) {
        // Previous steps are fully complete
        completedRepeats += step.repeats;
      } else if (index === this.songModel.currentStepIndex && this.currentStep) {
        // Current step may be partially complete
        completedRepeats += this.currentStep.currentRepeat;
      }
    });

    return {
      totalRepeats,
      completedRepeats,
      percentComplete: totalRepeats > 0 ? (completedRepeats / totalRepeats) * 100 : 0
    };
  }

  /**
   * Get current playback state
   * @returns {Object} State information
   */
  getState() {
    return {
      isPlaying: this.isPlaying,
      currentStepIndex: this.songModel.currentStepIndex,
      currentStep: this.currentStep,
      totalSteps: this.songModel.chain.length,
      isLooping: this.songModel.isLooping
    };
  }

  /**
   * Phase 8: Launch a scene (play multiple patterns simultaneously)
   * @param {Scene} scene - The scene to launch
   * @returns {boolean} Success status
   */
  launchScene(scene) {
    if (!scene || !scene.clips || scene.clips.length === 0) {
      console.warn('Cannot launch empty scene');
      return false;
    }

    // Stop any currently playing patterns
    this.controller.handleStop();
    
    // Clear active clips
    this.activeClips = [];

    // For now, we'll play the first clip in the scene
    // In a full implementation, this would handle multi-pattern playback
    const firstClip = scene.clips[0];
    const success = this.controller.loadPatternByName(firstClip.patternName);
    
    if (success) {
      this.activeClips.push(firstClip);
      this.notifySceneChange(scene);
    }

    return success;
  }

  /**
   * Phase 8: Launch scene by index from the scene grid
   * @param {number} sceneIndex - Index of the scene to launch
   * @returns {boolean} Success status
   */
  launchSceneByIndex(sceneIndex) {
    const scene = this.songModel.sceneGrid?.getScene(sceneIndex);
    
    if (!scene) {
      console.warn(`Scene at index ${sceneIndex} not found`);
      return false;
    }

    return this.launchScene(scene);
  }

  /**
   * Phase 8: Register callback for scene changes
   * @param {Function} callback - Called when scene changes
   */
  onSceneChange(callback) {
    this.onSceneChangeCallback = callback;
  }

  /**
   * Phase 8: Notify listeners of scene change
   * @param {Scene} scene - The scene that was launched
   */
  notifySceneChange(scene) {
    if (this.onSceneChangeCallback) {
      this.onSceneChangeCallback(scene);
    }
  }

  /**
   * Phase 8: Get currently active clips
   * @returns {Array} Array of active Clip instances
   */
  getActiveClips() {
    return [...this.activeClips];
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.stop();
    this.onStepChangeCallback = null;
    this.onJumpCallback = null; // Phase 7
    this.onSceneChangeCallback = null; // Phase 8
    this.visitedJumps.clear(); // Phase 7
    this.activeClips = []; // Phase 8
  }
}
