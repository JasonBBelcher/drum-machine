/**
 * AudioScheduler - Precise timing engine using Web Audio API
 * 
 * Replaces setInterval with Web Audio clock for sample-accurate timing.
 * Uses lookahead scheduling to prevent audio glitches and drift.
 */

export class AudioScheduler {
  constructor(audioContext) {
    this.audioContext = audioContext;
    this.isPlaying = false;
    this.currentStep = 0;
    this.tempo = 120;
    this.sequenceLength = 16;
    this.swing = 0;                   // Swing amount (0-75, typically)
    
    // Timing precision settings
    this.lookahead = 25.0;           // How frequently to call scheduling (ms)
    this.scheduleAheadTime = 0.1;    // How far ahead to schedule audio (sec)
    this.nextNoteTime = 0.0;          // When the next note is due (AudioContext time)
    
    // Callbacks for external integration
    this.onStepCallback = null;       // Called when a step should play
    this.onUIUpdateCallback = null;   // Called for visual updates
    
    // Internal state
    this.timerID = null;
    this.sequence = [];
  }

  /**
   * Calculate the time duration of a single step based on tempo
   * @returns {number} Time in seconds per 16th note
   */
  getStepDuration() {
    const secondsPerBeat = 60.0 / this.tempo;
    const secondsPerSixteenth = secondsPerBeat / 4; // 16th notes
    return secondsPerSixteenth;
  }

  /**
   * Calculate swing offset for a given step
   * Swing delays even-numbered steps to create groove
   * @param {number} stepNumber - Current step index
   * @returns {number} Time offset in seconds
   */
  getSwingOffset(stepNumber) {
    if (this.swing === 0) return 0;
    
    // Apply swing to even steps (0, 2, 4, 6, 8...)
    // This creates the classic "swing" or "shuffle" feel
    if (stepNumber % 2 === 0) {
      const stepDuration = this.getStepDuration();
      // Swing range: 0-75% converts to 0-0.33 delay multiplier
      const swingAmount = (this.swing / 100) * 0.66;
      return stepDuration * swingAmount;
    }
    
    return 0;
  }

  /**
   * Advance to the next step in the sequence
   */
  nextNote() {
    this.nextNoteTime += this.getStepDuration();
    this.currentStep++;
    
    // Loop back to beginning
    if (this.currentStep >= this.sequenceLength) {
      this.currentStep = 0;
    }
  }

  /**
   * Schedule a single step to play at a precise time
   * @param {number} stepNumber - Index of the step to play
   * @param {number} time - AudioContext time when this should play
   */
  scheduleNote(stepNumber, time) {
    // Apply swing offset for groove
    const swingOffset = this.getSwingOffset(stepNumber);
    const adjustedTime = time + swingOffset;
    
    // Trigger the step callback (plays the sounds)
    // Check if sequence has this index (use !== undefined to handle step 0)
    if (this.onStepCallback && this.sequence[stepNumber] !== undefined) {
      this.onStepCallback(this.sequence[stepNumber], adjustedTime);
    }
    
    // Schedule UI update to sync with audio
    if (this.onUIUpdateCallback) {
      // Calculate delay until this step should be visually active
      const currentTime = this.audioContext.currentTime;
      const delay = (adjustedTime - currentTime) * 1000; // Convert to milliseconds
      
      // Schedule UI update slightly before audio for better perceived sync
      const uiAdvance = 50; // ms
      const visualDelay = Math.max(0, delay - uiAdvance);
      
      setTimeout(() => {
        this.onUIUpdateCallback(stepNumber);
      }, visualDelay);
    }
  }

  /**
   * Main scheduling loop - schedules all notes that need to play
   * before the next scheduling interval
   */
  scheduler() {
    // Schedule all notes that fall within our lookahead window
    while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.currentStep, this.nextNoteTime);
      this.nextNote();
    }
    
    // Continue scheduling if still playing
    if (this.isPlaying) {
      this.timerID = setTimeout(() => this.scheduler(), this.lookahead);
    }
  }

  /**
   * Start playback
   */
  start() {
    if (this.isPlaying) {
      return; // Already playing
    }

    // Ensure AudioContext is running (handle autoplay policies)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    
    this.isPlaying = true;
    this.currentStep = 0;
    // Add small buffer to ensure first note isn't scheduled in the past
    this.nextNoteTime = this.audioContext.currentTime + 0.005; // 5ms buffer
    this.scheduler(); // Start the scheduling loop
  }

  /**
   * Stop playback
   */
  stop() {
    this.isPlaying = false;
    this.currentStep = 0;
    
    if (this.timerID) {
      clearTimeout(this.timerID);
      this.timerID = null;
    }
  }

  /**
   * Set the tempo (BPM)
   * @param {number} bpm - Beats per minute
   */
  setTempo(bpm) {
    this.tempo = Math.max(40, Math.min(300, bpm)); // Clamp between 40-300 BPM
  }

  /**
   * Set swing amount for groove
   * @param {number} amount - Swing percentage (0-75, typically)
   */
  setSwing(amount) {
    this.swing = Math.max(0, Math.min(75, amount)); // Clamp between 0-75%
  }

  /**
   * Get current swing amount
   * @returns {number} Swing percentage
   */
  getSwing() {
    return this.swing;
  }

  /**
   * Set the sequence to play
   * @param {Array} sequence - Array of step states
   */
  setSequence(sequence) {
    this.sequence = sequence;
    this.sequenceLength = sequence.length;
  }

  /**
   * Set callback for when a step should play
   * @param {Function} callback - Function(stepState, time)
   */
  onStep(callback) {
    this.onStepCallback = callback;
  }

  /**
   * Set callback for UI updates
   * @param {Function} callback - Function(stepNumber)
   */
  onUIUpdate(callback) {
    this.onUIUpdateCallback = callback;
  }

  /**
   * Get current playback position (for external monitoring)
   * @returns {number} Current step index
   */
  getCurrentStep() {
    return this.currentStep;
  }

  /**
   * Check if currently playing
   * @returns {boolean}
   */
  getIsPlaying() {
    return this.isPlaying;
  }

  /**
   * Restart playback with current settings
   */
  restart() {
    const wasPlaying = this.isPlaying;
    this.stop();
    if (wasPlaying) {
      // Small delay to ensure clean restart
      setTimeout(() => this.start(), 10);
    }
  }
}
