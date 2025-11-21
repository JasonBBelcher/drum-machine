/**
 * SequencerController - Coordinates Model and View
 * 
 * Implements the Controller in MVC pattern.
 * Handles user interactions, updates the model, and refreshes the view.
 */

import { SequenceModel } from '../models/SequenceModel.js';
import { SongModel } from '../models/SongModel.js';
import { SequencerView, ControlsView, VolumeControlsView } from '../views/SequencerView.js';
import { SampleControlsView } from '../views/SampleControlsView.js';
import { SongView } from '../views/SongView.js';
import { AudioEngine } from '../libs/audio-engine.js';
import { AudioScheduler } from '../libs/audio-scheduler.js';
import { SongScheduler } from '../libs/song-scheduler.js';
import { DrumPlayer } from '../libs/audio-player.js';
import { SampleLoader } from '../utils/SampleLoader.js';
import { StorageManager } from '../utils/StorageManager.js';

export class SequencerController {
  constructor(config) {
    // Configuration
    this.audioPlayer = config.audioPlayer; // DrumPlayer instance (replaces Howler)
    this.sequencerContainer = config.sequencerContainer;
    this.controlsElements = config.controlsElements;
    this.volumeSliders = config.volumeSliders;
    this.volumeOutputContainer = config.volumeOutputContainer;
    this.sampleControlsContainer = config.sampleControlsContainer; // Phase 4
    this.songViewContainer = config.songViewContainer; // Phase 6

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

    // Phase 6: Song view
    if (this.songViewContainer) {
      this.songView = new SongView(this.songViewContainer);
    }

    // Audio system
    this.audioEngine = config.audioEngine || null;
    this.scheduler = null;
    this.isPlaying = false;

    // Phase 6: Song mode
    this.songModel = config.songModel || new SongModel();
    this.songScheduler = null; // Initialized later
    this.storage = new StorageManager();

    // Bind event handlers
    this.bindEvents();

    // Initial render
    this.render();

    // Initialize song scheduler after construction
    this.songScheduler = new SongScheduler(this, this.songModel);
    
    // Initialize song view
    if (this.songView) {
      this.initializeSongView();
    }
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
    this.controlsView.on('swingChange', this.handleSwingChange.bind(this));
    this.controlsView.on('loadPattern', this.handleLoadPattern.bind(this));
    this.controlsView.on('save', this.handleSave.bind(this));
    this.controlsView.on('delete', this.handleDelete.bind(this));

    // Volume view events
    this.volumeView.on('volumeChange', this.handleVolumeChange.bind(this));

    // Phase 4: Sample control events
    if (this.sampleControlsView) {
      this.sampleControlsView.on('sampleLoad', this.handleSampleLoad.bind(this));
      this.sampleControlsView.on('pitchChange', this.handlePitchChange.bind(this));
      this.sampleControlsView.on('detuneChange', this.handleDetuneChange.bind(this));
      this.sampleControlsView.on('pitchReset', this.handlePitchReset.bind(this));
    }

    // Phase 6: Song view events
    if (this.songView) {
      // Song management
      this.songView.on('songNew', this.handleSongNew.bind(this));
      this.songView.on('songSave', this.handleSongSave.bind(this));
      this.songView.on('songLoad', this.handleSongLoad.bind(this));
      this.songView.on('songDelete', this.handleSongDelete.bind(this));
      
      // Playback control
      this.songView.on('songPlay', this.handleSongPlay.bind(this));
      this.songView.on('songStop', this.handleSongStop.bind(this));
      this.songView.on('songPause', this.handleSongPause.bind(this));
      this.songView.on('songResume', this.handleSongResume.bind(this));
      this.songView.on('songSkipPrev', this.handleSongSkipPrev.bind(this));
      this.songView.on('songSkipNext', this.handleSongSkipNext.bind(this));
      this.songView.on('songLoopToggle', this.handleSongLoopToggle.bind(this));
      
      // Pattern chain editing
      this.songView.on('patternAdd', this.handlePatternAdd.bind(this));
      this.songView.on('patternRemove', this.handlePatternRemove.bind(this));
      this.songView.on('patternMoveUp', this.handlePatternMoveUp.bind(this));
      this.songView.on('patternMoveDown', this.handlePatternMoveDown.bind(this));
      this.songView.on('patternRepeatChange', this.handlePatternRepeatChange.bind(this));
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

      // Set sequence, tempo, and swing
      const sequence = this.buildSequenceArray();
      this.scheduler.setSequence(sequence);
      this.scheduler.setTempo(this.model.tempo);
      this.scheduler.setSwing(this.model.swing);

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
      
      // Restore per-drum effects from saved pattern
      this.restoreDrumEffects();
      
      // Refresh drum effects UI to show loaded effects
      if (this.drumEffectsView) {
        this.drumEffectsView.refresh();
      }
      
      if (wasPlaying) {
        await this.start();
      }
      
      console.log(`✓ Loaded pattern: ${name}`);
    } else {
      console.error(`Failed to load pattern: ${name}`);
    }
  }

  /**
   * Load pattern by name and start playing (for song mode)
   * @param {string} name - Pattern name
   * @returns {boolean} Success status
   */
  loadPatternByName(name) {
    const loadedModel = this.storage.load(name);
    
    if (!loadedModel) {
      console.error(`Failed to load pattern: ${name}`);
      return false;
    }

    // Stop current playback
    if (this.isPlaying) {
      this.stop();
    }

    // Load the pattern
    this.model = loadedModel;
    this.render();

    // Restore per-drum effects
    this.restoreDrumEffects();

    // Refresh drum effects UI
    if (this.drumEffectsView) {
      this.drumEffectsView.refresh();
    }

    // Start playing immediately (song scheduler expects this)
    this.start();

    return true;
  }

  /**
   * Handle save pattern
   */
  async handleSave({ name }) {
    const { StorageManager } = await import('../utils/StorageManager.js');
    const storage = new StorageManager();
    
    const wasPlaying = this.isPlaying;
    if (wasPlaying) {
      this.stop();
    }
    
    // Set pattern name
    this.model.name = name;
    
    // Capture drum effects before saving
    this.captureDrumEffects();
    
    // Save to storage
    storage.save(name, this.model);
    
    // Update dropdown
    const patternList = storage.list();
    this.controlsView.updateSequenceSelect(patternList.map(p => p.name));
    
    console.log(`✓ Saved pattern: ${name}`);
    
    if (wasPlaying) {
      await this.start();
    }
  }

  /**
   * Handle delete pattern
   */
  async handleDelete({ name }) {
    const { StorageManager } = await import('../utils/StorageManager.js');
    const storage = new StorageManager();
    
    const wasPlaying = this.isPlaying;
    if (wasPlaying) {
      this.stop();
    }
    
    // Delete from storage
    storage.delete(name);
    
    // Update dropdown
    const patternList = storage.list();
    this.controlsView.updateSequenceSelect(patternList.map(p => p.name));
    
    // Clear input
    if (this.controlsView.sequenceInput) {
      this.controlsView.sequenceInput.value = '';
    }
    
    console.log(`✓ Deleted pattern: ${name}`);
    
    if (wasPlaying) {
      await this.start();
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
   * Handle swing change
   */
  handleSwingChange({ swing }) {
    this.model.setSwing(swing);
    
    if (this.scheduler) {
      this.scheduler.setSwing(swing);
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
      if (drumState.on && this.audioPlayer && this.audioPlayer.hasDrum(drumName)) {
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
    this.controlsView.setSwing(this.model.swing);
    
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
    
    // Restore per-drum effects from saved pattern
    this.restoreDrumEffects();
    
    // Refresh drum effects UI to show loaded effects
    if (this.drumEffectsView) {
      this.drumEffectsView.refresh();
    }

    if (wasPlaying) {
      this.start();
    }
  }

  /**
   * Save current sequence to JSON
   * Captures current drum effects state before saving
   */
  saveSequence() {
    // Capture current drum effects state
    this.captureDrumEffects();
    return this.model.toJSON();
  }

  /**
   * Capture current drum effects from drumPlayer into model
   */
  captureDrumEffects() {
    const drumsWithEffects = this.audioPlayer.getDrumsWithEffects();
    
    // Clear existing effects in model
    this.model.drumEffects = {};
    
    // Save current effect states
    drumsWithEffects.forEach(drumName => {
      const effectStates = this.audioPlayer.getDrumEffectStates(drumName);
      if (effectStates) {
        this.model.setDrumEffects(drumName, effectStates);
      }
    });
  }

  /**
   * Restore drum effects from model to drumPlayer
   */
  restoreDrumEffects() {
    // Clear all existing drum effects first
    const existingDrums = this.audioPlayer.getDrumsWithEffects();
    existingDrums.forEach(drumName => {
      this.audioPlayer.clearDrumEffects(drumName);
    });
    
    // Restore effects from model
    Object.entries(this.model.drumEffects).forEach(([drumName, effectStates]) => {
      // Restore filter (state is non-null when enabled)
      if (effectStates.filter) {
        this.audioPlayer.enableDrumFilter(
          drumName,
          effectStates.filter.type,
          effectStates.filter.frequency,
          effectStates.filter.q
        );
      }
      
      // Restore delay (state is non-null when enabled)
      if (effectStates.delay) {
        this.audioPlayer.enableDrumDelay(
          drumName,
          effectStates.delay.time,
          effectStates.delay.feedback,
          effectStates.delay.wet
        );
      }
      
      // Restore reverb (state is non-null when enabled)
      if (effectStates.reverb) {
        this.audioPlayer.enableDrumReverb(
          drumName,
          effectStates.reverb.duration,
          effectStates.reverb.wet
        );
      }
    });
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
   * Initialize song view with available patterns and songs
   */
  initializeSongView() {
    // Render the song view
    this.songView.render();
    
    // Load available patterns
    const patternList = this.storage.list();
    this.songView.updatePatternList(patternList.map(p => p.name));
    
    // Load available songs
    const songNames = this.storage.getAllSongNames();
    this.songView.updateSongList(songNames);
    
    // Render current song chain
    this.songView.renderChain(this.songModel.chain);
    
    // Set up song scheduler callbacks
    this.songScheduler.onStepChange = (stepIndex) => {
      this.songView.highlightCurrentPattern(stepIndex);
      const step = this.songModel.chain[stepIndex];
      if (step) {
        this.songView.setCurrentPattern(step.patternName);
      }
    };

    this.songScheduler.onStateChange = () => {
      const state = this.songScheduler.getState();
      this.songView.setSongProgress(state.currentStepIndex + 1, this.songModel.chain.length);
    };
  }

  /**
   * Handle song new - create a new empty song
   */
  handleSongNew() {
    this.songModel = new SongModel();
    this.songScheduler.setSong(this.songModel);
    this.songView.renderChain(this.songModel.chain);
    this.songView.setSongName('');
    this.songView.clear();
    console.log('✓ New song created');
  }

  /**
   * Handle song save
   */
  handleSongSave({ name }) {
    if (!name) {
      this.songView.showError('Please enter a song name');
      return;
    }

    this.songModel.name = name;
    this.storage.saveSong(name, this.songModel);
    
    // Update song list
    const songNames = this.storage.getAllSongNames();
    this.songView.updateSongList(songNames);
    
    this.songView.showSuccess(`Song "${name}" saved`);
    console.log(`✓ Saved song: ${name}`);
  }

  /**
   * Handle song load
   */
  handleSongLoad({ name }) {
    const loadedSong = this.storage.loadSong(name);
    
    if (!loadedSong) {
      this.songView.showError(`Failed to load song: ${name}`);
      return;
    }

    // Stop current playback
    if (this.songScheduler.isPlaying) {
      this.songScheduler.stop();
    }

    this.songModel = loadedSong;
    this.songScheduler.setSong(this.songModel);
    
    // Update view
    this.songView.setSongName(name);
    this.songView.renderChain(this.songModel.chain);
    this.songView.clear();
    
    this.songView.showSuccess(`Song "${name}" loaded`);
    console.log(`✓ Loaded song: ${name}`);
  }

  /**
   * Handle song delete
   */
  handleSongDelete({ name }) {
    if (!confirm(`Delete song "${name}"?`)) {
      return;
    }

    this.storage.deleteSong(name);
    
    // Update song list
    const songNames = this.storage.getAllSongNames();
    this.songView.updateSongList(songNames);
    
    this.songView.showSuccess(`Song "${name}" deleted`);
    console.log(`✓ Deleted song: ${name}`);
  }

  /**
   * Handle song play
   */
  handleSongPlay() {
    if (this.songModel.isEmpty()) {
      this.songView.showError('Song is empty. Add patterns first.');
      return;
    }

    this.songScheduler.start();
    this.songView.setPlaybackState('playing');
    console.log('▶ Playing song');
  }

  /**
   * Handle song stop
   */
  handleSongStop() {
    this.songScheduler.stop();
    this.songView.setPlaybackState('stopped');
    this.songView.clear();
    
    // Stop the pattern sequencer too
    if (this.isPlaying) {
      this.stop();
    }
    
    console.log('■ Stopped song');
  }

  /**
   * Handle song pause
   */
  handleSongPause() {
    this.songScheduler.pause();
    this.songView.setPlaybackState('paused');
    console.log('⏸ Paused song');
  }

  /**
   * Handle song resume
   */
  handleSongResume() {
    this.songScheduler.resume();
    this.songView.setPlaybackState('playing');
    console.log('▶ Resumed song');
  }

  /**
   * Handle skip to previous pattern
   */
  handleSongSkipPrev() {
    this.songScheduler.skipPrevious();
  }

  /**
   * Handle skip to next pattern
   */
  handleSongSkipNext() {
    this.songScheduler.skipNext();
  }

  /**
   * Handle loop toggle
   */
  handleSongLoopToggle({ loop }) {
    this.songScheduler.setLoop(loop);
    console.log(`Loop ${loop ? 'enabled' : 'disabled'}`);
  }

  /**
   * Handle pattern add to chain
   */
  handlePatternAdd({ patternName, repeats }) {
    // Validate pattern exists
    if (!this.storage.songExists(patternName)) {
      this.songView.showError(`Pattern "${patternName}" not found`);
      return;
    }

    this.songModel.addPattern(patternName, repeats);
    this.songView.renderChain(this.songModel.chain);
    console.log(`✓ Added pattern: ${patternName} (${repeats}x)`);
  }

  /**
   * Handle pattern remove from chain
   */
  handlePatternRemove({ index }) {
    const removed = this.songModel.removeStep(index);
    if (removed) {
      this.songView.renderChain(this.songModel.chain);
      console.log(`✓ Removed pattern at position ${index + 1}`);
    }
  }

  /**
   * Handle pattern move up in chain
   */
  handlePatternMoveUp({ index }) {
    if (index > 0) {
      this.songModel.moveStep(index, index - 1);
      this.songView.renderChain(this.songModel.chain);
      console.log(`✓ Moved pattern up`);
    }
  }

  /**
   * Handle pattern move down in chain
   */
  handlePatternMoveDown({ index }) {
    if (index < this.songModel.chain.length - 1) {
      this.songModel.moveStep(index, index + 1);
      this.songView.renderChain(this.songModel.chain);
      console.log(`✓ Moved pattern down`);
    }
  }

  /**
   * Handle pattern repeat count change
   */
  handlePatternRepeatChange({ index, repeats }) {
    const step = this.songModel.chain[index];
    if (step) {
      step.repeats = repeats;
      this.songView.renderChain(this.songModel.chain);
      console.log(`✓ Updated repeats to ${repeats}`);
    }
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
    
    if (this.songView) {
      this.songView.destroy();
    }
  }
}
