/**
 * Main Application Entry Point
 * Initializes MVC architecture with Web Audio API
 */

import { SequencerController } from './controllers/SequencerController.js';
import { DrumPlayer } from './libs/audio-player.js';
import { AudioEngine } from './libs/audio-engine.js';
import { AudioBufferLoader } from './libs/audio-buffer-loader.js';
import { SequenceModel } from './models/SequenceModel.js';
import { MasterBus } from './libs/audio-effects.js';
import { EffectsView } from './views/EffectsView.js';

// Sample file paths - using new URL for Parcel 2 compatibility
const SAMPLE_PATHS = {
  kick: new URL('./samples/bd_kick/bd_909dwsd.wav', import.meta.url).href,
  clap: new URL('./samples/clap/clp_analogue.wav', import.meta.url).href,
  snare: new URL('./samples/snare/snr_answer8bit.wav', import.meta.url).href,
  hat: new URL('./samples/hats/hat_analog.wav', import.meta.url).href,
  shaker: new URL('./samples/shaker_tambourine/shaker_quicky.wav', import.meta.url).href,
  bongo1: new URL('./samples/percussion/prc_bongodrm.wav', import.meta.url).href,
  congaz: new URL('./samples/percussion/prc_congaz.wav', import.meta.url).href,
  harmony: new URL('./samples/percussion/prc_harmony.wav', import.meta.url).href
};

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🥁 Initializing Drum Sequencer...');

  // Wait for user interaction to unlock audio
  const unlockAudio = () => {
    return new Promise((resolve) => {
      const unlock = async () => {
        document.removeEventListener('click', unlock);
        document.removeEventListener('touchstart', unlock);
        resolve();
      };
      document.addEventListener('click', unlock);
      document.addEventListener('touchstart', unlock);
    });
  };

  console.log('👆 Click anywhere to start...');
  await unlockAudio();

  try {
    // Initialize Audio Engine
    const audioEngine = new AudioEngine();
    const audioContext = await audioEngine.initialize();
    console.log('✅ Audio engine initialized');

    // Load audio samples
    const bufferLoader = new AudioBufferLoader(audioContext);
    console.log('⏳ Loading audio samples...');
    const buffers = await bufferLoader.loadAll(SAMPLE_PATHS);
    console.log('✅ Audio samples loaded');

    // Initialize Master Bus
    let masterBus = null;
    let masterBusInput = null;
    try {
      console.log('🔧 Creating Master Bus...');
      masterBus = new MasterBus(audioContext);
      masterBusInput = masterBus.getInput();
      console.log('✅ Master bus initialized');
    } catch (err) {
      console.error('❌ Failed to create master bus:', err);
      console.log('⚠️ Continuing without effects...');
    }

    // Import EffectsChain for per-drum effects
    const { EffectsChain } = await import('./libs/audio-effects.js');

    // Initialize DrumPlayer (route through master bus if available)
    const drumPlayer = new DrumPlayer(audioContext, masterBusInput, EffectsChain);
    drumPlayer.loadBuffers(buffers, 0.5);
    console.log('✅ DrumPlayer initialized (with per-track effects support)');

    // Get DOM elements for controller configuration
    const sequencerContainer = document.querySelector('.dm');
    const volumeOutputContainer = document.querySelector('.volume-output');
    
    const controlsElements = {
      playButton: document.getElementById('start'),
      resetButton: document.getElementById('reset'),
      saveButton: document.getElementById('save'),
      deleteButton: document.getElementById('delete'),
      sequenceSelect: document.querySelector('.saved-sequences'),
      sequenceInput: document.getElementById('input-save'),
      tempoSlider: document.querySelector('.seq-tempo-slider'),
      tempoOutput: document.querySelector('.seq-tempo-output'),
      lengthSlider: document.querySelector('.seq-length-slider'),
      lengthOutput: document.querySelector('.seq-length-output'),
      swingSlider: document.querySelector('.seq-swing-slider'),
      swingOutput: document.querySelector('.seq-swing-output')
    };

    const volumeSliders = document.querySelectorAll('.vol-slider');
    
    // Phase 4: Sample controls container (if it exists)
    const sampleControlsContainer = document.querySelector('.sample-controls-container');

    // Create model
    const model = new SequenceModel();

    // Initialize controller with all required configuration
    const controller = new SequencerController({
      audioPlayer: drumPlayer,
      audioEngine: audioEngine,
      model: model,
      sequencerContainer: sequencerContainer,
      controlsElements: controlsElements,
      volumeSliders: volumeSliders,
      volumeOutputContainer: volumeOutputContainer,
      sampleControlsContainer: sampleControlsContainer
    });

    console.log('✅ Drum Sequencer ready!');

    // Initialize Effects View
    if (masterBus) {
      const effectsContainer = document.querySelector('.effects-container');
      if (effectsContainer) {
        new EffectsView(effectsContainer, masterBus);
        console.log('✅ Effects panel initialized');
      }
    }

    // Load default patterns if none exist
    await controller.loadDefaultPatterns();

    // Expose for debugging (optional)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      window.drumSequencer = {
        controller,
        model,
        drumPlayer,
        masterBus
      };
      console.log('🔧 Debug mode: Access via window.drumSequencer');
    }

  } catch (error) {
    console.error('❌ Failed to initialize drum sequencer:', error);
    alert('Failed to initialize audio system. Please check console for details.');
  }
});
