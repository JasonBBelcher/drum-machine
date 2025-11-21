/**
 * @jest-environment jsdom
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { SongView } from '../views/SongView.js';
import { SongModel } from '../models/SongModel.js';
import { SongScheduler } from '../libs/song-scheduler.js';
import { StorageManager } from '../utils/StorageManager.js';
import { SequenceModel } from '../models/SequenceModel.js';

// Mock localStorage for UI integration tests
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = value.toString();
  }

  removeItem(key) {
    delete this.store[key];
  }

  clear() {
    this.store = {};
  }
}

// Mock SequencerController for UI tests
class MockSequencerController {
  constructor() {
    this.loadedPatterns = [];
    this.currentPatternName = null;
    this.isPlayingValue = false;
    this.model = new SequenceModel(16);
    this.songModel = new SongModel();
    this.storage = new StorageManager();
  }

  async loadPatternByName(name) {
    // Simulate pattern loading
    if (!this.storage.songExists(name)) {
      console.error(`Pattern ${name} not found`);
      return false;
    }
    
    this.loadedPatterns.push(name);
    this.currentPatternName = name;
    this.isPlayingValue = true;
    return true;
  }

  handleStop() {
    this.isPlayingValue = false;
    this.currentPatternName = null;
  }

  async start() {
    this.isPlayingValue = true;
  }

  stop() {
    this.isPlayingValue = false;
  }
}

describe('Phase 6.2 UI Integration Tests', () => {
  let container;
  let songView;
  let mockLocalStorage;
  let controller;
  let songScheduler;
  let storage;

  beforeEach(() => {
    // Set up DOM
    container = document.createElement('div');
    document.body.appendChild(container);

    // Set up mocks
    mockLocalStorage = new LocalStorageMock();
    global.localStorage = mockLocalStorage;
    
    // Create controller and components
    controller = new MockSequencerController();
    storage = controller.storage;
    
    // Create some test patterns
    const pattern1 = new SequenceModel(16);
    pattern1.name = 'intro';
    storage.save('intro', pattern1);
    
    const pattern2 = new SequenceModel(16);
    pattern2.name = 'verse';
    storage.save('verse', pattern2);
    
    const pattern3 = new SequenceModel(16);
    pattern3.name = 'chorus';
    storage.save('chorus', pattern3);

    // Create song scheduler
    songScheduler = new SongScheduler(controller, controller.songModel);
    
    // Create song view
    songView = new SongView(container);
    songView.render();

    // Update view with available patterns
    const patternList = storage.list();
    songView.updatePatternList(patternList.map(p => p.name));
  });

  afterEach(() => {
    if (songView) {
      songView.destroy();
    }
    if (songScheduler) {
      songScheduler.stop();
    }
    document.body.removeChild(container);
    mockLocalStorage.clear();
  });

  describe('Song Creation Workflow', () => {
    test('user can create a new song with patterns', () => {
      // User adds first pattern
      songView.elements.patternSelect.value = 'intro';
      songView.elements.patternRepeatInput.value = '2';
      
      let addEventFired = false;
      songView.on('patternAdd', ({ patternName, repeats }) => {
        controller.songModel.addPattern(patternName, repeats);
        songView.renderChain(controller.songModel.chain);
        addEventFired = true;
      });
      
      songView.elements.btnAddPattern.click();
      
      expect(addEventFired).toBe(true);
      expect(controller.songModel.chain.length).toBe(1);
      expect(container.querySelectorAll('.chain-item').length).toBe(1);

      // User adds second pattern
      songView.elements.patternSelect.value = 'verse';
      songView.elements.patternRepeatInput.value = '4';
      songView.elements.btnAddPattern.click();
      
      expect(controller.songModel.chain.length).toBe(2);
      expect(container.querySelectorAll('.chain-item').length).toBe(2);

      // User adds third pattern
      songView.elements.patternSelect.value = 'chorus';
      songView.elements.patternRepeatInput.value = '2';
      songView.elements.btnAddPattern.click();
      
      expect(controller.songModel.chain.length).toBe(3);
      expect(controller.songModel.getTotalLength()).toBe(8);
    });

    test('user can reorder patterns in the chain', () => {
      // Set up initial chain
      controller.songModel.addPattern('intro', 1);
      controller.songModel.addPattern('verse', 1);
      controller.songModel.addPattern('chorus', 1);
      songView.renderChain(controller.songModel.chain);
      
      // Wire up move handlers
      songView.on('patternMoveDown', ({ index }) => {
        controller.songModel.moveStep(index, index + 1);
        songView.renderChain(controller.songModel.chain);
      });
      
      songView.on('patternMoveUp', ({ index }) => {
        controller.songModel.moveStep(index, index - 1);
        songView.renderChain(controller.songModel.chain);
      });

      // Move first pattern down
      const downButtons = container.querySelectorAll('.btn-chain-down');
      downButtons[0].click();
      
      expect(controller.songModel.chain[0].patternName).toBe('verse');
      expect(controller.songModel.chain[1].patternName).toBe('intro');

      // Move it back up
      const upButtons = container.querySelectorAll('.btn-chain-up');
      upButtons[1].click();
      
      expect(controller.songModel.chain[0].patternName).toBe('intro');
      expect(controller.songModel.chain[1].patternName).toBe('verse');
    });

    test('user can remove patterns from the chain', () => {
      // Set up chain
      controller.songModel.addPattern('intro', 1);
      controller.songModel.addPattern('verse', 1);
      controller.songModel.addPattern('chorus', 1);
      songView.renderChain(controller.songModel.chain);
      
      expect(controller.songModel.chain.length).toBe(3);

      // Wire up remove handler
      songView.on('patternRemove', ({ index }) => {
        controller.songModel.removeStep(index);
        songView.renderChain(controller.songModel.chain);
      });

      // Remove middle pattern
      const removeButtons = container.querySelectorAll('.btn-chain-remove');
      removeButtons[1].click();
      
      expect(controller.songModel.chain.length).toBe(2);
      expect(controller.songModel.chain[0].patternName).toBe('intro');
      expect(controller.songModel.chain[1].patternName).toBe('chorus');
    });

    test('user can modify repeat counts', () => {
      // Set up chain
      controller.songModel.addPattern('intro', 2);
      songView.renderChain(controller.songModel.chain);

      // Wire up repeat change handler
      songView.on('patternRepeatChange', ({ index, repeats }) => {
        controller.songModel.chain[index].repeats = repeats;
        songView.renderChain(controller.songModel.chain);
      });

      // Change repeat count
      const repeatInput = container.querySelector('.chain-repeat-input');
      repeatInput.value = '5';
      repeatInput.dispatchEvent(new Event('change'));
      
      expect(controller.songModel.chain[0].repeats).toBe(5);
    });
  });

  describe('Song Save/Load Workflow', () => {
    test('user can save a song', () => {
      // Build a song
      controller.songModel.addPattern('intro', 2);
      controller.songModel.addPattern('verse', 4);
      songView.renderChain(controller.songModel.chain);

      // Wire up save handler
      songView.on('songSave', ({ name }) => {
        controller.songModel.name = name;
        storage.saveSong(name, controller.songModel);
        const songNames = storage.getAllSongNames();
        songView.updateSongList(songNames);
        songView.showSuccess(`Song "${name}" saved`);
      });

      // Save the song
      songView.elements.songNameInput.value = 'My Test Song';
      songView.elements.btnSave.click();
      
      expect(storage.songExists('My Test Song')).toBe(true);
      
      // Verify song select was updated
      const songSelect = songView.elements.songSelect;
      const options = Array.from(songSelect.options).map(o => o.value);
      expect(options).toContain('My Test Song');
    });

    test('user can load a saved song', () => {
      // Save a song first
      const originalSong = new SongModel('Saved Song');
      originalSong.addPattern('intro', 2);
      originalSong.addPattern('verse', 4);
      storage.saveSong('Saved Song', originalSong);
      
      // Update song list
      const songNames = storage.getAllSongNames();
      songView.updateSongList(songNames);

      // Wire up load handler
      songView.on('songLoad', ({ name }) => {
        const loadedSong = storage.loadSong(name);
        if (loadedSong) {
          controller.songModel = loadedSong;
          songScheduler.setSong(loadedSong);
          songView.setSongName(name);
          songView.renderChain(loadedSong.chain);
        }
      });

      // Load the song
      songView.elements.songSelect.value = 'Saved Song';
      songView.elements.btnLoad.click();
      
      expect(controller.songModel.name).toBe('Saved Song');
      expect(controller.songModel.chain.length).toBe(2);
      expect(container.querySelectorAll('.chain-item').length).toBe(2);
    });

    test('user can delete a saved song', () => {
      // Save a song first
      const song = new SongModel('Song To Delete');
      song.addPattern('intro', 1);
      storage.saveSong('Song To Delete', song);
      
      const songNames = storage.getAllSongNames();
      songView.updateSongList(songNames);
      
      expect(storage.songExists('Song To Delete')).toBe(true);

      // Mock confirm dialog to always return true
      global.confirm = jest.fn(() => true);

      // Wire up delete handler
      songView.on('songDelete', ({ name }) => {
        storage.deleteSong(name);
        const updatedNames = storage.getAllSongNames();
        songView.updateSongList(updatedNames);
      });

      // Delete the song
      songView.elements.songSelect.value = 'Song To Delete';
      songView.elements.btnDelete.click();
      
      expect(storage.songExists('Song To Delete')).toBe(false);
    });
  });

  describe('Song Playback Workflow', () => {
    beforeEach(() => {
      // Set up a complete song
      controller.songModel.addPattern('intro', 2);
      controller.songModel.addPattern('verse', 4);
      controller.songModel.addPattern('chorus', 2);
      songView.renderChain(controller.songModel.chain);
    });

    test('user can play a song', () => {
      // Wire up play handler
      songView.on('songPlay', () => {
        if (!controller.songModel.isEmpty()) {
          songScheduler.start();
          songView.setPlaybackState('playing');
        }
      });

      songView.elements.btnPlay.click();
      
      expect(songScheduler.isPlaying).toBe(true);
      expect(songView.elements.btnPlay.disabled).toBe(true);
      expect(songView.elements.btnStop.disabled).toBe(false);
    });

    test('user can stop a playing song', () => {
      // Start playing first
      songScheduler.start();
      songView.setPlaybackState('playing');

      // Wire up stop handler
      songView.on('songStop', () => {
        songScheduler.stop();
        controller.stop();
        songView.setPlaybackState('stopped');
        songView.clear();
      });

      songView.elements.btnStop.click();
      
      expect(songScheduler.isPlaying).toBe(false);
      expect(songView.elements.btnPlay.disabled).toBe(false);
      expect(songView.elements.btnStop.disabled).toBe(true);
    });

    test('user can pause and resume a song', () => {
      // Start playing
      songScheduler.start();
      songView.setPlaybackState('playing');

      // Wire up pause handler
      songView.on('songPause', () => {
        songScheduler.pause();
        songView.setPlaybackState('paused');
      });

      // Wire up resume handler
      songView.on('songResume', () => {
        songScheduler.resume();
        songView.setPlaybackState('playing');
      });

      // Pause
      songView.elements.btnPause.click();
      expect(songScheduler.isPaused).toBe(true);
      
      // Resume
      songView.elements.btnResume.click();
      expect(songScheduler.isPaused).toBe(false);
    });

    test('user can skip to next pattern', () => {
      songScheduler.start();
      
      // Wire up skip handler
      songView.on('songSkipNext', () => {
        songScheduler.skipNext();
      });

      const initialStep = songScheduler.getState().currentStepIndex;
      songView.elements.btnSkipNext.click();
      
      const newStep = songScheduler.getState().currentStepIndex;
      expect(newStep).toBe(initialStep + 1);
    });

    test('user can skip to previous pattern', () => {
      songScheduler.start();
      songScheduler.skipNext(); // Move forward first
      
      // Wire up skip handler
      songView.on('songSkipPrev', () => {
        songScheduler.skipPrevious();
      });

      const initialStep = songScheduler.getState().currentStepIndex;
      songView.elements.btnSkipPrev.click();
      
      const newStep = songScheduler.getState().currentStepIndex;
      expect(newStep).toBe(Math.max(0, initialStep - 1));
    });

    test('user can enable loop mode', () => {
      // Wire up loop toggle handler
      songView.on('songLoopToggle', ({ loop }) => {
        songScheduler.setLoop(loop);
      });

      songView.elements.loopCheckbox.checked = true;
      songView.elements.loopCheckbox.dispatchEvent(new Event('change'));
      
      expect(songScheduler.loop).toBe(true);
    });
  });

  describe('UI State Updates During Playback', () => {
    test('current pattern display updates during playback', () => {
      controller.songModel.addPattern('intro', 1);
      controller.songModel.addPattern('verse', 1);
      songView.renderChain(controller.songModel.chain);

      // Set up callback for step changes
      songScheduler.onStepChange = (stepIndex) => {
        songView.highlightCurrentPattern(stepIndex);
        const step = controller.songModel.chain[stepIndex];
        if (step) {
          songView.setCurrentPattern(step.patternName);
        }
      };

      songScheduler.start();
      
      // Simulate step change
      songScheduler.onStepChange(0);
      expect(songView.elements.currentPatternName.textContent).toBe('intro');
      
      songScheduler.onStepChange(1);
      expect(songView.elements.currentPatternName.textContent).toBe('verse');
    });

    test('progress display updates during playback', () => {
      controller.songModel.addPattern('intro', 2);
      controller.songModel.addPattern('verse', 4);
      songView.renderChain(controller.songModel.chain);

      // Set up callback for state changes
      songScheduler.onStateChange = () => {
        const state = songScheduler.getState();
        songView.setSongProgress(state.currentStepIndex + 1, controller.songModel.chain.length);
      };

      songScheduler.start();
      
      // Simulate progress
      songScheduler.onStateChange();
      const progressText = songView.elements.songProgress.textContent;
      expect(progressText).toMatch(/\d+ \/ 2/);
    });

    test('chain item highlighting follows playback', () => {
      controller.songModel.addPattern('intro', 1);
      controller.songModel.addPattern('verse', 1);
      controller.songModel.addPattern('chorus', 1);
      songView.renderChain(controller.songModel.chain);

      // Highlight first pattern
      songView.highlightCurrentPattern(0);
      let items = container.querySelectorAll('.chain-item');
      expect(items[0].classList.contains('chain-item-active')).toBe(true);
      expect(items[1].classList.contains('chain-item-active')).toBe(false);
      expect(items[2].classList.contains('chain-item-active')).toBe(false);

      // Highlight second pattern
      songView.highlightCurrentPattern(1);
      items = container.querySelectorAll('.chain-item');
      expect(items[0].classList.contains('chain-item-active')).toBe(false);
      expect(items[1].classList.contains('chain-item-active')).toBe(true);
      expect(items[2].classList.contains('chain-item-active')).toBe(false);
    });
  });

  describe('Error Handling', () => {
    test('shows error when trying to play empty song', () => {
      // Wire up play handler with validation
      songView.on('songPlay', () => {
        if (controller.songModel.isEmpty()) {
          songView.showError('Song is empty. Add patterns first.');
          return;
        }
        songScheduler.start();
      });

      songView.elements.btnPlay.click();
      
      const errorMsg = container.querySelector('.song-error-message');
      expect(errorMsg).toBeTruthy();
      expect(errorMsg.textContent).toContain('empty');
    });

    test('shows error when trying to add pattern without selection', () => {
      // Wire up add handler with validation
      songView.on('patternAdd', ({ patternName }) => {
        if (!patternName) {
          songView.showError('Please select a pattern');
          return;
        }
        controller.songModel.addPattern(patternName, 1);
      });

      songView.elements.patternSelect.value = '';
      songView.elements.btnAddPattern.click();
      
      const errorMsg = container.querySelector('.song-error-message');
      expect(errorMsg).toBeTruthy();
    });

    test('shows error when trying to save without name', () => {
      // Wire up save handler with validation
      songView.on('songSave', ({ name }) => {
        if (!name) {
          songView.showError('Please enter a song name');
          return;
        }
        storage.saveSong(name, controller.songModel);
      });

      songView.elements.songNameInput.value = '';
      songView.elements.btnSave.click();
      
      const errorMsg = container.querySelector('.song-error-message');
      expect(errorMsg).toBeTruthy();
      expect(errorMsg.textContent).toContain('name');
    });
  });

  describe('Complete User Workflows', () => {
    test('complete workflow: create, edit, save, load, play', () => {
      // 1. Create new song
      let newEventFired = false;
      songView.on('songNew', () => {
        controller.songModel = new SongModel();
        songView.renderChain(controller.songModel.chain);
        newEventFired = true;
      });
      songView.elements.btnNew.click();
      expect(newEventFired).toBe(true);

      // 2. Add patterns
      songView.on('patternAdd', ({ patternName, repeats }) => {
        controller.songModel.addPattern(patternName, repeats);
        songView.renderChain(controller.songModel.chain);
      });
      
      songView.elements.patternSelect.value = 'intro';
      songView.elements.btnAddPattern.click();
      songView.elements.patternSelect.value = 'verse';
      songView.elements.btnAddPattern.click();
      
      expect(controller.songModel.chain.length).toBe(2);

      // 3. Save song
      songView.on('songSave', ({ name }) => {
        controller.songModel.name = name;
        storage.saveSong(name, controller.songModel);
        const songNames = storage.getAllSongNames();
        songView.updateSongList(songNames);
      });
      
      songView.elements.songNameInput.value = 'Complete Workflow Song';
      songView.elements.btnSave.click();
      expect(storage.songExists('Complete Workflow Song')).toBe(true);

      // 4. Clear and load it back
      controller.songModel = new SongModel();
      songView.renderChain(controller.songModel.chain);
      
      songView.on('songLoad', ({ name }) => {
        const loaded = storage.loadSong(name);
        controller.songModel = loaded;
        songView.setSongName(name);
        songView.renderChain(loaded.chain);
      });
      
      songView.elements.songSelect.value = 'Complete Workflow Song';
      songView.elements.btnLoad.click();
      expect(controller.songModel.chain.length).toBe(2);

      // 5. Play the song
      songView.on('songPlay', () => {
        songScheduler.setSong(controller.songModel);
        songScheduler.start();
        songView.setPlaybackState('playing');
      });
      
      songView.elements.btnPlay.click();
      expect(songScheduler.isPlaying).toBe(true);
    });
  });
});
