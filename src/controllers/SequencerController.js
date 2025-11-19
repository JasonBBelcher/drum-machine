/**
 * SequencerController - Coordinates Model and View
 * 
 * Implements the Controller in MVC pattern.
 * Handles user interactions, updates the model, and refreshes the view.
 */

import { SequenceModel } from '../models/SequenceModel.js';
import { SequencerView, ControlsView, VolumeControlsView } from '../views/SequencerView.js';
import { SampleControlsView } from '../views/SampleControlsView.js';
import { AudioEngine } from '../libs/audio-engine.js';
import { AudioScheduler } from '../libs/audio-scheduler.js';
import { DrumPlayer } from '../libs/audio-player.js';
import { SampleLoader } from '../utils/SampleLoader.js';

export class SequencerController {
  constructor(config) {
    // Configuration
    this.audioPlayer = config.audioPlayer; // DrumPlayer instance (replaces Howler)
    this.sequencerContainer = config.sequencerContainer;
    this.controlsElements = config.controlsElements;
    this.volumeSliders = config.volumeSliders;
    this.volumeOutputContainer = config.volumeOutputContainer;
    this.sampleControlsContainer = config.sampleControlsContainer; // Phase 4

    // Create Model
    this.model = config.model || new SequenceModel();

    // Create Views
    this.sequencerView = new SequencerView(this.sequencerContainer);
    this.controlsView = new ControlsView(this.controlsElements);
    this.volumeView = new VolumeControlsView(this.volumeSliders, this.volumeOutputContainer);
    
    // Phase 4: Sample controls view
    if (this.sampleControlsContainer) {
      this.sampleControlsView = new SampleControlsView(
        this.sampleControlsContainer,
        this.model.getDrumNames()
      );
      this.sampleLoader = null; // Initialized when audio engine starts
    }

    // Audio system
    this.audioEngine = config.audioEngine || null;
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
    this.controlsView.on('loadPattern', this.handleLoadPattern.bind(this));

    // Volume view events
    this.volumeView.on('volumeChange', this.handleVolumeChange.bind(this));

    // Phase 4: Sample control events
    if (this.sampleControlsView) {
      this.sampleControlsView.on('sampleLoad', this.handleSampleLoad.bind(this));
      this.sampleControlsView.on('pitchChange', this.handlePitchChange.bind(this));
      this.sampleControlsView.on('detuneChange', this.handleDetuneChange.bind(this));
      this.sampleControlsView.on('pitchReset', this.handlePitchReset.bind(this));
    }
  }

  /**
   * Handle drum button toggle
   */
  handleDrumToggle({ stepIndex, drumName }) {
    const wasOn = this.model.steps[stepIndex].drums[drumName].on;
    this.model.toggleDrum(stepIndex, drumName);
    
    // Update view
    this.sequencerView.updateDrumButton(stepIndex, drumName, !wasOn);

    // Play preview sound with Web Audio API
    if (!wasOn && this.audioPlayer.hasDrum(drumName)) {
      this.audioPlayer.playDrum(drumName);
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
      // Get audio context from engine
      const audioContext = this.audioEngine ? this.audioEngine.getContext() : AudioEngine.getContext();

      // Create scheduler if needed
      if (!this.scheduler) {
        this.scheduler = new AudioScheduler(audioContext);
        
        // Set up callbacks using the proper methods
        this.scheduler.onStep(this.handleSchedulerStep.bind(this));
        this.scheduler.onUIUpdate(this.handleUIUpdate.bind(this));
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
   * Handle pattern load from dropdown
   */
  async handleLoadPattern({ name }) {
    const { StorageManager } = await import('../utils/StorageManager.js');
    const storage = new StorageManager();
    
    const loadedModel = storage.load(name);
    if (loadedModel) {
      const wasPlaying = this.isPlaying;
      if (wasPlaying) {
        this.stop();
      }
      
      this.model = loadedModel;
      this.render();
      
      if (wasPlaying) {
        await this.start();
      }
      
      console.log(`✓ Loaded pattern: ${name}`);
    } else {
      console.error(`Failed to load pattern: ${name}`);
    }
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

    // Update audio player volume
    if (this.audioPlayer.hasDrum(drumName)) {
      this.audioPlayer.setDrumVolume(drumName, volume);
    }
  }

  /**
   * Handle scheduler step callback (for triggering sounds)
   */
  handleSchedulerStep(stepIndex, time) {
    const step = this.model.steps[stepIndex];
    
    // Trigger all active drums for this step with precise timing
    Object.entries(step.drums).forEach(([drumName, drumState]) => {
      if (drumState.on && this.audioPlayer.hasDrum(drumName)) {
        // Use Web Audio API with scheduled time for perfect sync
        this.audioPlayer.playDrum(drumName, time);
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

    // Phase 4: Render sample controls and sync pitch data
    if (this.sampleControlsView) {
      this.sampleControlsView.render();
      
      this.model.getDrumNames().forEach(drumName => {
        const pitch = this.model.getDrumPitch(drumName);
        const detune = this.model.getDrumDetune(drumName);
        this.sampleControlsView.setPitch(drumName, pitch);
        this.sampleControlsView.setDetune(drumName, detune);
        
        // Sync audio player
        this.audioPlayer.setDrumPitch(drumName, pitch);
        this.audioPlayer.setDrumDetune(drumName, detune);
      });
    }
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
   * Load default patterns into storage if none exist
   */
  async loadDefaultPatterns() {
    const { StorageManager } = await import('../utils/StorageManager.js');
    const storage = new StorageManager();
    
    // Check if any patterns exist
    const existingPatterns = storage.list();
    if (existingPatterns && existingPatterns.length > 0) {
      console.log(`Found ${existingPatterns.length} existing patterns`);
      // Update dropdown with existing patterns
      this.controlsView.updateSequenceSelect(existingPatterns.map(p => p.name));
      return; // Patterns already exist
    }

    // Save default patterns using the model's built-in methods
    console.log('Creating default patterns...');
    
    // Basic house pattern
    const basicHouse = new SequenceModel(16);
    basicHouse.name = 'basic house';
    basicHouse.tempo = 120;
    basicHouse.setDrumState(0, 'kick', true);
    basicHouse.setDrumState(2, 'hat', true);
    basicHouse.setDrumState(4, 'kick', true);
    basicHouse.setDrumState(4, 'clap', true);
    basicHouse.setDrumState(4, 'snare', true);
    basicHouse.setDrumState(6, 'hat', true);
    basicHouse.setDrumState(8, 'kick', true);
    basicHouse.setDrumState(10, 'hat', true);
    basicHouse.setDrumState(12, 'kick', true);
    basicHouse.setDrumState(12, 'clap', true);
    basicHouse.setDrumState(12, 'snare', true);
    basicHouse.setDrumState(14, 'hat', true);
    storage.save('basic house', basicHouse);
    console.log('  ✓ Loaded: basic house');
    
    // Bongoz house pattern
    const bongozHouse = new SequenceModel(16);
    bongozHouse.name = 'bongoz house';
    bongozHouse.tempo = 120;
    bongozHouse.setDrumState(0, 'kick', true);
    bongozHouse.setDrumState(0, 'bongo1', true);
    bongozHouse.setDrumState(2, 'hat', true);
    bongozHouse.setDrumState(2, 'congaz', true);
    bongozHouse.setDrumState(4, 'kick', true);
    bongozHouse.setDrumState(4, 'clap', true);
    bongozHouse.setDrumState(4, 'snare', true);
    bongozHouse.setDrumState(5, 'bongo1', true);
    bongozHouse.setDrumState(6, 'hat', true);
    bongozHouse.setDrumState(7, 'congaz', true);
    bongozHouse.setDrumState(8, 'kick', true);
    bongozHouse.setDrumState(10, 'hat', true);
    bongozHouse.setDrumState(10, 'bongo1', true);
    bongozHouse.setDrumState(12, 'kick', true);
    bongozHouse.setDrumState(12, 'clap', true);
    bongozHouse.setDrumState(12, 'snare', true);
    bongozHouse.setDrumState(14, 'hat', true);
    // Set volumes
    bongozHouse.setDrumVolume('bongo1', 0.17);
    bongozHouse.setDrumVolume('congaz', 0.14);
    storage.save('bongoz house', bongozHouse);
    console.log('  ✓ Loaded: bongoz house');
    
    // Update dropdown with new patterns
    const patternList = storage.list();
    this.controlsView.updateSequenceSelect(patternList.map(p => p.name));
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
   * Handle custom sample load (Phase 4)
   */
  async handleSampleLoad({ drumName, file }) {
    try {
      // Initialize sample loader if needed
      if (!this.sampleLoader) {
        if (!this.audioEngine) {
          this.audioEngine = AudioEngine;
          await this.audioEngine.initialize();
        }
        this.sampleLoader = new SampleLoader(this.audioEngine.getContext());
      }

      // Load the file
      const sampleData = await this.sampleLoader.loadFromFile(file);
      
      // Load into audio player
      await this.audioPlayer.loadCustomSample(drumName, sampleData.buffer);
      
      // Update UI
      this.sampleControlsView.showLoadedSample(drumName, file.name);
      
      // Play preview
      this.audioPlayer.playDrum(drumName);
      
      console.log(`Loaded ${file.name} for ${drumName}`, {
        duration: `${sampleData.duration.toFixed(2)}s`,
        size: this.sampleLoader.formatFileSize(sampleData.size),
        sampleRate: `${sampleData.sampleRate}Hz`,
        channels: sampleData.channels
      });
    } catch (error) {
      console.error('Failed to load sample:', error);
      this.sampleControlsView.showError(drumName, error.message);
    }
  }

  /**
   * Handle pitch change (Phase 4)
   */
  handlePitchChange({ drumName, semitones }) {
    this.model.setDrumPitch(drumName, semitones);
    this.audioPlayer.setDrumPitch(drumName, semitones);
  }

  /**
   * Handle detune change (Phase 4)
   */
  handleDetuneChange({ drumName, cents }) {
    this.model.setDrumDetune(drumName, cents);
    this.audioPlayer.setDrumDetune(drumName, cents);
  }

  /**
   * Handle pitch reset (Phase 4)
   */
  handlePitchReset({ drumName }) {
    this.model.setDrumPitch(drumName, 0);
    this.model.setDrumDetune(drumName, 0);
    this.audioPlayer.resetDrumPitch(drumName);
  }

  /**
   * Cleanup
   */
  destroy() {
    this.stop();
    
    if (this.audioPlayer) {
      this.audioPlayer.stopAll();
      this.audioPlayer.clearAll();
    }
    
    if (this.scheduler) {
      this.scheduler = null;
    }
    
    if (this.audioEngine) {
      this.audioEngine.close();
      this.audioEngine = null;
    }

    this.sequencerView.clear();
    
    if (this.sampleControlsView) {
      this.sampleControlsView.clear();
    }
  }
}
