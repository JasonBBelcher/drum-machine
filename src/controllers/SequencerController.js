/**
 * SequencerController - Coordinates Model and View
 * 
 * Implements the Controller in MVC pattern.
 * Handles user interactions, updates the model, and refreshes the view.
 */

import { SequenceModel } from '../models/SequenceModel.js';
import { SequencerView, ControlsView, VolumeControlsView } from '../views/SequencerView.js';
import { AudioEngine } from '../libs/audio-engine.js';
import { AudioScheduler } from '../libs/audio-scheduler.js';

export class SequencerController {
  constructor(config) {
    // Configuration
    this.sounds = config.sounds; // Howler.js sound objects
    this.sequencerContainer = config.sequencerContainer;
    this.controlsElements = config.controlsElements;
    this.volumeSliders = config.volumeSliders;
    this.volumeOutputContainer = config.volumeOutputContainer;

    // Create Model
    this.model = config.model || new SequenceModel();

    // Create Views
    this.sequencerView = new SequencerView(this.sequencerContainer);
    this.controlsView = new ControlsView(this.controlsElements);
    this.volumeView = new VolumeControlsView(this.volumeSliders, this.volumeOutputContainer);

    // Audio system
    this.audioEngine = null;
    this.scheduler = null;
    this.isPlaying = false;

    // Bind event handlers
    this.bindEvents();

    // Initial render
    this.render();
  }

  /**
   * Bind all event handlers
   */
  bindEvents() {
    // Sequencer view events
    this.sequencerView.on('drumToggle', this.handleDrumToggle.bind(this));

    // Controls view events
    this.controlsView.on('play', this.handlePlay.bind(this));
    this.controlsView.on('reset', this.handleReset.bind(this));
    this.controlsView.on('tempoChange', this.handleTempoChange.bind(this));
    this.controlsView.on('lengthChange', this.handleLengthChange.bind(this));

    // Volume view events
    this.volumeView.on('volumeChange', this.handleVolumeChange.bind(this));
  }

  /**
   * Handle drum button toggle
   */
  handleDrumToggle({ stepIndex, drumName }) {
    const wasOn = this.model.steps[stepIndex].drums[drumName].on;
    this.model.toggleDrum(stepIndex, drumName);
    
    // Update view
    this.sequencerView.updateDrumButton(stepIndex, drumName, !wasOn);

    // Play preview sound
    if (!wasOn && this.sounds[drumName]) {
      this.sounds[drumName].play();
    }
  }

  /**
   * Handle play/stop button
   */
  async handlePlay() {
    if (!this.isPlaying) {
      await this.start();
    } else {
      this.stop();
    }
  }

  /**
   * Start playback
   */
  async start() {
    try {
      // Initialize audio engine if needed
      if (!this.audioEngine) {
        this.audioEngine = AudioEngine;
        await this.audioEngine.initialize();
      }

      // Create scheduler if needed
      if (!this.scheduler) {
        this.scheduler = new AudioScheduler(this.audioEngine.getContext());
        
        // Set up callbacks
        this.scheduler.onStep = this.handleSchedulerStep.bind(this);
        this.scheduler.onUIUpdate = this.handleUIUpdate.bind(this);
      }

      // Set sequence and tempo
      const sequence = this.buildSequenceArray();
      this.scheduler.setSequence(sequence);
      this.scheduler.setTempo(this.model.tempo);

      // Start playback
      this.scheduler.start();
      this.isPlaying = true;
      this.controlsView.setPlayButtonState(true);

    } catch (error) {
      console.error('Failed to start playback:', error);
      this.isPlaying = false;
      this.controlsView.setPlayButtonState(false);
    }
  }

  /**
   * Stop playback
   */
  stop() {
    if (this.scheduler) {
      this.scheduler.stop();
    }
    
    this.isPlaying = false;
    this.controlsView.setPlayButtonState(false);
    this.sequencerView.clearHighlights();
  }

  /**
   * Handle reset button
   */
  handleReset() {
    this.stop();
    this.model.clear();
    this.render();
  }

  /**
   * Handle tempo change
   */
  handleTempoChange({ tempo }) {
    this.model.setTempo(tempo);
    
    if (this.scheduler && this.isPlaying) {
      this.scheduler.setTempo(tempo);
    }
  }

  /**
   * Handle sequence length change
   */
  handleLengthChange({ length }) {
    const wasPlaying = this.isPlaying;
    
    if (wasPlaying) {
      this.stop();
    }

    this.model.setLength(length);
    this.render();

    if (wasPlaying) {
      this.start();
    }
  }

  /**
   * Handle volume change
   */
  handleVolumeChange({ drumName, volume }) {
    this.model.setDrumVolume(drumName, volume);

    // Update Howler volume if sound exists
    if (this.sounds[drumName]) {
      this.sounds[drumName].volume(volume);
    }
  }

  /**
   * Handle scheduler step callback (for triggering sounds)
   */
  handleSchedulerStep(stepIndex, time) {
    const step = this.model.steps[stepIndex];
    
    // Trigger all active drums for this step
    Object.entries(step.drums).forEach(([drumName, drumState]) => {
      if (drumState.on && this.sounds[drumName]) {
        // TODO: In Phase 3, use Web Audio API scheduling with time parameter
        // For now, use Howler immediate playback
        this.sounds[drumName].play();
      }
    });
  }

  /**
   * Handle UI update callback (for visual playhead)
   */
  handleUIUpdate(stepIndex) {
    this.sequencerView.highlightStep(stepIndex);
  }

  /**
   * Build sequence array for scheduler
   * Converts model to array of step indices where any drum is active
   */
  buildSequenceArray() {
    const sequence = [];
    for (let i = 0; i < this.model.length; i++) {
      // Include every step (scheduler needs full sequence)
      sequence.push(i);
    }
    return sequence;
  }

  /**
   * Render the entire view from model
   */
  render() {
    this.sequencerView.render(this.model);
    this.controlsView.setTempo(this.model.tempo);
    this.controlsView.setLength(this.model.length);
    
    // Sync volume controls with model
    this.model.getDrumNames().forEach(drumName => {
      const volume = this.model.getDrumVolume(drumName);
      this.volumeView.setVolume(drumName, volume);
    });
  }

  /**
   * Load a sequence from JSON
   */
  loadSequence(json) {
    const wasPlaying = this.isPlaying;
    
    if (wasPlaying) {
      this.stop();
    }

    this.model = SequenceModel.fromJSON(json);
    this.render();

    if (wasPlaying) {
      this.start();
    }
  }

  /**
   * Save current sequence to JSON
   */
  saveSequence() {
    return this.model.toJSON();
  }

  /**
   * Get current model
   */
  getModel() {
    return this.model;
  }

  /**
   * Clear specific drum track
   */
  clearDrum(drumName) {
    this.model.clearDrum(drumName);
    
    // Update all buttons for this drum
    for (let i = 0; i < this.model.length; i++) {
      this.sequencerView.updateDrumButton(i, drumName, false);
    }
  }

  /**
   * Cleanup
   */
  destroy() {
    this.stop();
    
    if (this.scheduler) {
      this.scheduler = null;
    }
    
    if (this.audioEngine) {
      this.audioEngine.close();
      this.audioEngine = null;
    }

    this.sequencerView.clear();
  }
}
