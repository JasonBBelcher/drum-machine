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

    const shouldAdvance = this.currentStep.incrementRepeat();

    if (shouldAdvance) {
      // All repeats complete, move to next pattern
      this.currentStep.reset();
      this.songModel.advance();
    }

    // Play next (might be same pattern if repeating)
    this.playNextStep();
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
   * @param {Function} callback - Called with (stepIndex) when step changes
   */
  onStepChange(callback) {
    this.onStepChangeCallback = callback;
  }

  /**
   * Notify listeners of step change
   * @param {number|null} stepIndex - Current step index or null if stopped
   */
  notifyStepChange(stepIndex) {
    if (this.onStepChangeCallback) {
      this.onStepChangeCallback(stepIndex);
    }
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
   * Clean up resources
   */
  destroy() {
    this.stop();
    this.onStepChangeCallback = null;
  }
}
