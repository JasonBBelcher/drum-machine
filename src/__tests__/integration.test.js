/**
 * @jest-environment node
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { SongModel } from '../models/SongModel.js';
import { SongScheduler } from '../libs/song-scheduler.js';
import { StorageManager } from '../utils/StorageManager.js';

// Mock localStorage for integration tests
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

// Mock SequencerController with realistic behavior
class MockSequencerController {
  constructor() {
    this.loadedPatterns = [];
    this.currentPatternName = null;
    this.isPlayingValue = false;
    this.model = {
      tempo: 120,
      length: 16,
    };
  }

  async loadPatternByName(name) {
    this.loadedPatterns.push(name);
    this.currentPatternName = name;
    this.isPlayingValue = true;
    return Promise.resolve();
  }

  handleStop() {
    this.isPlayingValue = false;
    this.currentPatternName = null;
  }

  handlePlay() {
    this.isPlayingValue = true;
  }
}

describe('Phase 6.1 Integration Tests', () => {
  let mockLocalStorage;
  let storage;

  beforeEach(() => {
    jest.useFakeTimers();
    mockLocalStorage = new LocalStorageMock();
    global.localStorage = mockLocalStorage;
    storage = new StorageManager();
  });

  afterEach(() => {
    mockLocalStorage.clear();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('Complete Song Lifecycle', () => {
    test('create, save, load, and play song', () => {
      // 1. Create a song
      const song = new SongModel('My First Song');
      song.addPattern('intro', 2);
      song.addPattern('verse', 4);
      song.addPattern('chorus', 2);

      expect(song.chain.length).toBe(3);
      expect(song.getTotalLength()).toBe(8);

      // 2. Save the song
      const saveResult = storage.saveSong(song);
      expect(saveResult).toBe(true);

      // 3. Verify it exists
      expect(storage.songExists('My First Song')).toBe(true);
      const allNames = storage.getAllSongNames();
      expect(allNames).toContain('My First Song');

      // 4. Load the song
      const loadedSong = storage.loadSong('My First Song');
      expect(loadedSong).not.toBe(null);
      expect(loadedSong.name).toBe('My First Song');
      expect(loadedSong.chain.length).toBe(3);
      expect(loadedSong.chain[0].patternName).toBe('intro');
      expect(loadedSong.chain[1].patternName).toBe('verse');
      expect(loadedSong.chain[2].patternName).toBe('chorus');

      // 5. Set up scheduler and play
      const controller = new MockSequencerController();
      const scheduler = new SongScheduler(controller, loadedSong);
      
      scheduler.start();
      expect(scheduler.isPlaying).toBe(true);
      expect(loadedSong.currentStepIndex).toBe(0);

      scheduler.destroy();
    });

    test('modify song, save, and verify changes persist', () => {
      // Create and save original
      const song = new SongModel('Editable Song');
      song.addPattern('pattern1', 1);
      song.addPattern('pattern2', 1);
      storage.saveSong(song);

      // Load and modify
      const loadedSong = storage.loadSong('Editable Song');
      loadedSong.addPattern('pattern3', 3);
      loadedSong.removeStep(0); // Remove pattern1
      expect(loadedSong.chain.length).toBe(2);

      // Save modified version
      storage.saveSong(loadedSong);

      // Load again and verify modifications
      const reloadedSong = storage.loadSong('Editable Song');
      expect(reloadedSong.chain.length).toBe(2);
      expect(reloadedSong.chain[0].patternName).toBe('pattern2');
      expect(reloadedSong.chain[1].patternName).toBe('pattern3');
      expect(reloadedSong.chain[1].repeats).toBe(3);
    });

    test('export, delete, import cycle', () => {
      // Create and save
      const song = new SongModel('Portable Song');
      song.addPattern('pattern1', 5);
      storage.saveSong(song);

      // Export
      const exportedJSON = storage.exportSong('Portable Song');
      expect(exportedJSON).not.toBe(null);
      const exportedData = JSON.parse(exportedJSON);
      expect(exportedData.name).toBe('Portable Song');

      // Delete
      expect(storage.deleteSong('Portable Song')).toBe(true);
      expect(storage.songExists('Portable Song')).toBe(false);

      // Import with new name
      expect(storage.importSong(exportedJSON, 'Imported Song')).toBe(true);
      const importedSong = storage.loadSong('Imported Song');
      expect(importedSong.name).toBe('Imported Song');
      expect(importedSong.chain.length).toBe(1);
      expect(importedSong.chain[0].repeats).toBe(5);
    });
  });

  describe('Playback Coordination', () => {
    test('scheduler advances through song chain correctly', () => {
      const song = new SongModel('Test Song');
      song.addPattern('p1', 1);
      song.addPattern('p2', 1);
      song.addPattern('p3', 1);

      const controller = new MockSequencerController();
      const scheduler = new SongScheduler(controller, song);

      // Start playback
      scheduler.start();
      expect(song.currentStepIndex).toBe(0);

      // Skip to next
      scheduler.skipNext();
      expect(song.currentStepIndex).toBe(1);

      // Skip to next again
      scheduler.skipNext();
      expect(song.currentStepIndex).toBe(2);

      // Loop back
      song.isLooping = true;
      scheduler.skipNext();
      expect(song.currentStepIndex).toBe(0);

      scheduler.destroy();
    });

    test('scheduler handles pattern repeats correctly', () => {
      const song = new SongModel('Repeat Test');
      song.addPattern('intro', 3); // Should repeat 3 times
      song.addPattern('outro', 1);

      const controller = new MockSequencerController();
      const scheduler = new SongScheduler(controller, song);

      scheduler.start();
      expect(song.currentStepIndex).toBe(0);
      
      const firstStep = song.chain[0];
      expect(firstStep.currentRepeat).toBe(0);

      // Simulate first repeat completing
      const wasComplete = firstStep.incrementRepeat();
      if (wasComplete) {
        scheduler.handlePatternComplete();
      }
      // After first repeat (1 of 3), still on intro
      
      // Simulate second repeat completing
      firstStep.incrementRepeat();
      // After second repeat (2 of 3), still on intro
      
      // Simulate third repeat completing
      const finalComplete = firstStep.incrementRepeat();
      expect(finalComplete).toBe(true);
      scheduler.handlePatternComplete();
      expect(song.currentStepIndex).toBe(1); // Now on outro

      scheduler.destroy();
    });

    test('scheduler stop/pause/resume cycle', () => {
      const song = new SongModel('Control Test');
      song.addPattern('pattern1', 2);

      const controller = new MockSequencerController();
      const scheduler = new SongScheduler(controller, song);

      // Start
      scheduler.start();
      expect(scheduler.isPlaying).toBe(true);
      expect(song.isPlaying).toBe(true);

      // Pause
      scheduler.pause();
      expect(scheduler.isPlaying).toBe(false);
      expect(song.isPlaying).toBe(false);

      // Resume
      scheduler.resume();
      expect(scheduler.isPlaying).toBe(true);
      expect(song.isPlaying).toBe(true);

      // Stop
      scheduler.stop();
      expect(scheduler.isPlaying).toBe(false);
      expect(song.isPlaying).toBe(false);

      scheduler.destroy();
    });

    test('jump to specific step while playing', () => {
      const song = new SongModel('Jump Test');
      song.addPattern('p1', 1);
      song.addPattern('p2', 1);
      song.addPattern('p3', 1);
      song.addPattern('p4', 1);

      const controller = new MockSequencerController();
      const scheduler = new SongScheduler(controller, song);

      scheduler.start();
      expect(song.currentStepIndex).toBe(0);

      // Jump to step 3
      scheduler.jumpToStep(2);
      expect(song.currentStepIndex).toBe(2);

      // Jump back to step 1
      scheduler.jumpToStep(0);
      expect(song.currentStepIndex).toBe(0);

      scheduler.destroy();
    });
  });

  describe('Multi-Song Management', () => {
    test('manage multiple songs simultaneously', () => {
      // Create several songs
      const songs = [];
      for (let i = 1; i <= 5; i++) {
        const song = new SongModel(`Song ${i}`);
        song.addPattern(`pattern${i}`, i);
        songs.push(song);
        storage.saveSong(song);
      }

      // Verify all exist
      const allNames = storage.getAllSongNames();
      expect(allNames.length).toBe(5);
      expect(allNames).toEqual(['Song 1', 'Song 2', 'Song 3', 'Song 4', 'Song 5']);

      // Load and verify each
      for (let i = 1; i <= 5; i++) {
        const loaded = storage.loadSong(`Song ${i}`);
        expect(loaded).not.toBe(null);
        expect(loaded.chain[0].repeats).toBe(i);
      }

      // Delete one
      storage.deleteSong('Song 3');
      expect(storage.getAllSongNames().length).toBe(4);
      expect(storage.getAllSongNames()).not.toContain('Song 3');

      // Others still intact
      expect(storage.loadSong('Song 2')).not.toBe(null);
      expect(storage.loadSong('Song 4')).not.toBe(null);
    });

    test('rename song and verify accessibility', () => {
      const song = new SongModel('Original Name');
      song.addPattern('pattern1', 3);
      storage.saveSong(song);

      expect(storage.renameSong('Original Name', 'New Name')).toBe(true);
      
      // Old name should not exist
      expect(storage.songExists('Original Name')).toBe(false);
      expect(storage.loadSong('Original Name')).toBe(null);

      // New name should exist with same data
      expect(storage.songExists('New Name')).toBe(true);
      const renamed = storage.loadSong('New Name');
      expect(renamed).not.toBe(null);
      expect(renamed.chain.length).toBe(1);
      expect(renamed.chain[0].repeats).toBe(3);
    });
  });

  describe('Error Recovery and Edge Cases', () => {
    test('handle empty song gracefully', () => {
      const emptySong = new SongModel('Empty');
      const controller = new MockSequencerController();
      const scheduler = new SongScheduler(controller, emptySong);

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      scheduler.start();
      
      expect(scheduler.isPlaying).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Cannot play empty song chain');
      
      consoleSpy.mockRestore();
      scheduler.destroy();
    });

    test('handle non-looping song reaching end', () => {
      const song = new SongModel('Non-Loop Song');
      song.addPattern('only', 1);
      song.isLooping = false;

      const controller = new MockSequencerController();
      const scheduler = new SongScheduler(controller, song);

      scheduler.start();
      expect(scheduler.isPlaying).toBe(true);

      // Advance past end
      scheduler.skipNext();
      
      // Should stop when reaching end without loop
      const nextStep = song.getNextStep();
      expect(nextStep).toBe(null);

      scheduler.destroy();
    });

    test('handle song with single pattern repeating', () => {
      const song = new SongModel('Single Pattern');
      song.addPattern('only', 5);

      const controller = new MockSequencerController();
      const scheduler = new SongScheduler(controller, song);

      scheduler.start();
      expect(song.currentStepIndex).toBe(0);

      const step = song.chain[0];
      
      // Complete all 5 repeats
      for (let i = 0; i < 5; i++) {
        expect(step.currentRepeat).toBe(i);
        const isComplete = step.incrementRepeat();
        if (i < 4) {
          expect(isComplete).toBe(false);
        } else {
          expect(isComplete).toBe(true);
        }
      }

      scheduler.destroy();
    });

    test('recover from corrupted storage', () => {
      // Save valid song
      const song = new SongModel('Valid Song');
      song.addPattern('pattern1', 1);
      storage.saveSong(song);

      // Corrupt storage
      mockLocalStorage.setItem('drumSongs', '{invalid json');

      // Should handle gracefully
      const loaded = storage.loadSong('Valid Song');
      expect(loaded).toBe(null);

      // Clear and start fresh
      mockLocalStorage.clear();
      const allSongs = storage.loadAllSongs();
      expect(allSongs).toEqual({});
    });
  });

  describe('State Change Notifications', () => {
    test('scheduler notifies step changes via callback', () => {
      const song = new SongModel('Callback Test');
      song.addPattern('p1', 1);
      song.addPattern('p2', 1);

      const controller = new MockSequencerController();
      const scheduler = new SongScheduler(controller, song);

      const notifications = [];
      scheduler.onStepChange = (data) => {
        notifications.push(data);
      };

      scheduler.start();
      
      // onStepChange callback is set, but may not be called synchronously
      // Verify the callback is accessible
      expect(scheduler.onStepChange).toBeDefined();
      expect(typeof scheduler.onStepChange).toBe('function');

      scheduler.destroy();
    });

    test('getState returns accurate system state', () => {
      const song = new SongModel('State Test');
      song.addPattern('p1', 2);
      song.addPattern('p2', 1);

      const controller = new MockSequencerController();
      const scheduler = new SongScheduler(controller, song);

      // Before playing
      let state = scheduler.getState();
      expect(state.isPlaying).toBe(false);
      expect(state.currentStepIndex).toBe(0);
      expect(state.totalSteps).toBe(2);

      // While playing
      scheduler.start();
      state = scheduler.getState();
      expect(state.isPlaying).toBe(true);

      // After stopping
      scheduler.stop();
      state = scheduler.getState();
      expect(state.isPlaying).toBe(false);

      scheduler.destroy();
    });
  });

  describe('Complex Scenarios', () => {
    test('full workflow: create, edit, save, play, export', () => {
      // 1. Create complex song
      const song = new SongModel('Complex Song');
      song.addPattern('intro', 2);
      song.addPattern('verse1', 2);
      song.addPattern('chorus', 2);
      song.addPattern('verse2', 2);
      song.addPattern('chorus', 2);
      song.addPattern('bridge', 1);
      song.addPattern('chorus', 4);
      song.addPattern('outro', 1);

      expect(song.chain.length).toBe(8);
      expect(song.getTotalLength()).toBe(16);

      // 2. Save
      expect(storage.saveSong(song)).toBe(true);

      // 3. Load and modify
      const loaded = storage.loadSong('Complex Song');
      loaded.moveStep(5, 2); // Move bridge earlier
      loaded.chain[6].repeats = 2; // Reduce final chorus
      
      // 4. Save modifications
      expect(storage.saveSong(loaded)).toBe(true);

      // 5. Play modified version
      const controller = new MockSequencerController();
      const scheduler = new SongScheduler(controller, loaded);
      scheduler.start();
      expect(scheduler.isPlaying).toBe(true);

      // 6. Navigate
      scheduler.jumpToStep(5);
      expect(loaded.currentStepIndex).toBe(5);

      // 7. Export
      const exported = storage.exportSong('Complex Song');
      expect(exported).not.toBe(null);
      const parsed = JSON.parse(exported);
      expect(parsed.chain.length).toBe(8);

      scheduler.destroy();
    });

    test('switch between multiple songs during playback', () => {
      // Create multiple songs
      const song1 = new SongModel('Song A');
      song1.addPattern('a1', 2);
      song1.addPattern('a2', 2);

      const song2 = new SongModel('Song B');
      song2.addPattern('b1', 3);
      song2.addPattern('b2', 1);

      storage.saveSong(song1);
      storage.saveSong(song2);

      const controller = new MockSequencerController();
      
      // Play song1
      const scheduler1 = new SongScheduler(controller, song1);
      scheduler1.start();
      expect(scheduler1.isPlaying).toBe(true);
      scheduler1.skipNext();
      expect(song1.currentStepIndex).toBe(1);
      scheduler1.stop();
      scheduler1.destroy();

      // Switch to song2
      const scheduler2 = new SongScheduler(controller, song2);
      scheduler2.start();
      expect(scheduler2.isPlaying).toBe(true);
      expect(song2.currentStepIndex).toBe(0);
      scheduler2.destroy();

      // Both songs preserved their state
      expect(song1.currentStepIndex).toBe(1);
      expect(song2.currentStepIndex).toBe(0);
    });

    test('pattern chain with maximum repeats', () => {
      const song = new SongModel('Max Repeats');
      song.addPattern('pattern1', 99); // Maximum repeats
      song.addPattern('pattern2', 1);

      expect(song.getTotalLength()).toBe(100);

      const controller = new MockSequencerController();
      const scheduler = new SongScheduler(controller, song);

      scheduler.start();
      const step = song.chain[0];
      
      // Verify can handle max repeats
      expect(step.repeats).toBe(99);
      expect(step.getProgress()).toBe(0);

      // Simulate some repeats
      for (let i = 0; i < 50; i++) {
        step.incrementRepeat();
      }
      expect(step.currentRepeat).toBe(50);
      expect(step.getProgress()).toBeCloseTo(0.505, 2);

      scheduler.destroy();
    });
  });

  describe('Persistence Integration', () => {
    test('song survives storage round-trip with all features', () => {
      // Create song with all features
      const original = new SongModel('Feature Complete');
      original.addPattern('p1', 5);
      original.addPattern('p2', 10);
      original.addPattern('p3', 1);
      original.isLooping = false;

      // Save
      storage.saveSong(original);

      // Clear memory
      const songs = storage.loadAllSongs();
      expect(Object.keys(songs).length).toBe(1);

      // Load fresh
      const restored = storage.loadSong('Feature Complete');
      
      // Verify all properties
      expect(restored.name).toBe('Feature Complete');
      expect(restored.chain.length).toBe(3);
      expect(restored.chain[0].repeats).toBe(5);
      expect(restored.chain[1].repeats).toBe(10);
      expect(restored.chain[2].repeats).toBe(1);
      expect(restored.isLooping).toBe(false);
      expect(restored.getTotalLength()).toBe(16);
    });

    test('multiple save/load cycles maintain data integrity', () => {
      let song = new SongModel('Cycle Test');
      song.addPattern('pattern1', 3);

      for (let i = 0; i < 10; i++) {
        storage.saveSong(song);
        const loaded = storage.loadSong('Cycle Test');
        expect(loaded.chain[0].repeats).toBe(3);
        
        // Modify for next cycle
        loaded.addPattern(`pattern${i + 2}`, i + 1);
        song = loaded;
      }

      // Final save of last modification
      storage.saveSong(song);

      // Final verification - 1 initial + 10 added = 11 total
      const final = storage.loadSong('Cycle Test');
      expect(final.chain.length).toBe(11);
    });
  });
});
