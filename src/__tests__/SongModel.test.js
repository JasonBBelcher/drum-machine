/**
 * @jest-environment node
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { SongModel, ChainStep } from '../models/SongModel.js';

describe('ChainStep', () => {
  describe('constructor', () => {
    test('creates step with valid pattern name and repeats', () => {
      const step = new ChainStep('pattern1', 4);
      expect(step.patternName).toBe('pattern1');
      expect(step.repeats).toBe(4);
      expect(step.currentRepeat).toBe(0);
    });

    test('defaults to 1 repeat if not specified', () => {
      const step = new ChainStep('pattern1');
      expect(step.repeats).toBe(1);
    });

    test('allows empty pattern name', () => {
      const step = new ChainStep('', 1);
      expect(step.patternName).toBe('');
    });

    test('clamps repeats < 1 to 1', () => {
      const step = new ChainStep('pattern1', 0);
      expect(step.repeats).toBe(1);
    });

    test('clamps repeats > 99 to 99', () => {
      const step = new ChainStep('pattern1', 100);
      expect(step.repeats).toBe(99);
    });
  });

  describe('incrementRepeat', () => {
    test('returns false when not complete (first repeat)', () => {
      const step = new ChainStep('pattern1', 3);
      expect(step.incrementRepeat()).toBe(false);
      expect(step.currentRepeat).toBe(1);
    });

    test('returns false when not complete (middle repeat)', () => {
      const step = new ChainStep('pattern1', 3);
      step.incrementRepeat();
      expect(step.incrementRepeat()).toBe(false);
      expect(step.currentRepeat).toBe(2);
    });

    test('returns true when complete (last repeat)', () => {
      const step = new ChainStep('pattern1', 3);
      step.incrementRepeat();
      step.incrementRepeat();
      expect(step.incrementRepeat()).toBe(true);
      expect(step.currentRepeat).toBe(3);
    });

    test('handles single repeat correctly', () => {
      const step = new ChainStep('pattern1', 1);
      expect(step.incrementRepeat()).toBe(true);
      expect(step.currentRepeat).toBe(1);
    });
  });

  describe('reset', () => {
    test('resets currentRepeat to 0', () => {
      const step = new ChainStep('pattern1', 3);
      step.incrementRepeat();
      step.incrementRepeat();
      expect(step.currentRepeat).toBe(2);
      step.reset();
      expect(step.currentRepeat).toBe(0);
    });
  });

  describe('isComplete', () => {
    test('returns false when not complete', () => {
      const step = new ChainStep('pattern1', 3);
      step.incrementRepeat();
      expect(step.isComplete()).toBe(false);
    });

    test('returns true when complete', () => {
      const step = new ChainStep('pattern1', 3);
      step.currentRepeat = 3;
      expect(step.isComplete()).toBe(true);
    });
  });

  describe('getProgress', () => {
    test('returns correct progress ratio', () => {
      const step = new ChainStep('pattern1', 5);
      expect(step.getProgress()).toBe(0);
      step.incrementRepeat();
      expect(step.getProgress()).toBe(0.2);
      step.incrementRepeat();
      expect(step.getProgress()).toBe(0.4);
    });
  });

  describe('toJSON / fromJSON', () => {
    test('serializes step correctly', () => {
      const step = new ChainStep('pattern1', 4);
      step.incrementRepeat();
      const json = step.toJSON();
      expect(json).toEqual({
        patternName: 'pattern1',
        repeats: 4,
      });
    });

    test('deserializes step correctly', () => {
      const json = {
        patternName: 'pattern2',
        repeats: 3,
      };
      const step = ChainStep.fromJSON(json);
      expect(step.patternName).toBe('pattern2');
      expect(step.repeats).toBe(3);
      expect(step.currentRepeat).toBe(0); // Runtime state always starts at 0
    });

    test('round-trip serialization preserves structure', () => {
      const original = new ChainStep('pattern1', 5);
      original.incrementRepeat();
      original.incrementRepeat();
      const json = original.toJSON();
      const restored = ChainStep.fromJSON(json);
      expect(restored.patternName).toBe(original.patternName);
      expect(restored.repeats).toBe(original.repeats);
      expect(restored.currentRepeat).toBe(0); // Runtime state not preserved
    });
  });
});

describe('SongModel', () => {
  let song;

  beforeEach(() => {
    song = new SongModel('Test Song');
  });

  describe('constructor', () => {
    test('creates song with name', () => {
      expect(song.name).toBe('Test Song');
      expect(song.chain).toEqual([]);
      expect(song.currentStepIndex).toBe(0);
      expect(song.isLooping).toBe(true);
      expect(song.isPlaying).toBe(false);
    });

    test('defaults to "Untitled Song" if no name provided', () => {
      const unnamed = new SongModel();
      expect(unnamed.name).toBe('Untitled Song');
    });
  });

  describe('addPattern', () => {
    test('adds pattern to chain', () => {
      song.addPattern('pattern1', 2);
      expect(song.chain.length).toBe(1);
      expect(song.chain[0].patternName).toBe('pattern1');
      expect(song.chain[0].repeats).toBe(2);
    });

    test('adds multiple patterns', () => {
      song.addPattern('pattern1', 2);
      song.addPattern('pattern2', 1);
      song.addPattern('pattern3', 4);
      expect(song.chain.length).toBe(3);
      expect(song.chain.map(s => s.patternName)).toEqual(['pattern1', 'pattern2', 'pattern3']);
    });

    test('defaults to 1 repeat', () => {
      song.addPattern('pattern1');
      expect(song.chain[0].repeats).toBe(1);
    });

    test('throws error for empty pattern name', () => {
      expect(() => song.addPattern('', 1)).toThrow('Pattern name cannot be empty');
    });

    test('throws error for invalid repeat count', () => {
      expect(() => song.addPattern('pattern1', 0)).toThrow('Repeats must be between 1 and 99');
      expect(() => song.addPattern('pattern1', 100)).toThrow('Repeats must be between 1 and 99');
    });
  });

  describe('removeStep', () => {
    beforeEach(() => {
      song.addPattern('pattern1', 1);
      song.addPattern('pattern2', 2);
      song.addPattern('pattern3', 3);
    });

    test('removes step at index', () => {
      song.removeStep(1);
      expect(song.chain.length).toBe(2);
      expect(song.chain[0].patternName).toBe('pattern1');
      expect(song.chain[1].patternName).toBe('pattern3');
    });

    test('adjusts currentStepIndex when removing before current', () => {
      song.currentStepIndex = 2;
      song.removeStep(0);
      expect(song.currentStepIndex).toBe(1);
    });

    test('adjusts currentStepIndex when removing at current', () => {
      song.currentStepIndex = 1;
      song.removeStep(1);
      expect(song.currentStepIndex).toBe(1);
    });

    test('throws error for invalid index', () => {
      expect(() => song.removeStep(-1)).toThrow('Invalid step index');
      expect(() => song.removeStep(3)).toThrow('Invalid step index');
    });
  });

  describe('moveStep', () => {
    beforeEach(() => {
      song.addPattern('pattern1', 1);
      song.addPattern('pattern2', 2);
      song.addPattern('pattern3', 3);
      song.addPattern('pattern4', 4);
    });

    test('moves step forward in chain', () => {
      song.moveStep(1, 3);
      expect(song.chain.map(s => s.patternName)).toEqual(['pattern1', 'pattern3', 'pattern4', 'pattern2']);
    });

    test('moves step backward in chain', () => {
      song.moveStep(3, 1);
      expect(song.chain.map(s => s.patternName)).toEqual(['pattern1', 'pattern4', 'pattern2', 'pattern3']);
    });

    test('moves step to front', () => {
      song.moveStep(2, 0);
      expect(song.chain.map(s => s.patternName)).toEqual(['pattern3', 'pattern1', 'pattern2', 'pattern4']);
    });

    test('moving to same position does nothing', () => {
      song.moveStep(1, 1);
      expect(song.chain.map(s => s.patternName)).toEqual(['pattern1', 'pattern2', 'pattern3', 'pattern4']);
    });

    test('throws error for invalid fromIndex', () => {
      expect(() => song.moveStep(-1, 0)).toThrow('Invalid from index');
      expect(() => song.moveStep(4, 0)).toThrow('Invalid from index');
    });

    test('throws error for invalid toIndex', () => {
      expect(() => song.moveStep(0, -1)).toThrow('Invalid to index');
      expect(() => song.moveStep(0, 4)).toThrow('Invalid to index');
    });
  });

  describe('clear', () => {
    test('removes all steps and resets state', () => {
      song.addPattern('pattern1', 1);
      song.addPattern('pattern2', 2);
      song.currentStepIndex = 1;
      song.clear();
      expect(song.chain.length).toBe(0);
      expect(song.currentStepIndex).toBe(0);
    });
  });

  describe('isEmpty', () => {
    test('returns true for empty chain', () => {
      expect(song.isEmpty()).toBe(true);
    });

    test('returns false for non-empty chain', () => {
      song.addPattern('pattern1', 1);
      expect(song.isEmpty()).toBe(false);
    });
  });

  describe('getTotalLength', () => {
    test('returns 0 for empty chain', () => {
      expect(song.getTotalLength()).toBe(0);
    });

    test('calculates total repeats across chain', () => {
      song.addPattern('pattern1', 2);
      song.addPattern('pattern2', 1);
      song.addPattern('pattern3', 4);
      expect(song.getTotalLength()).toBe(7);
    });
  });

  describe('getCurrentStep', () => {
    test('returns null for empty chain', () => {
      expect(song.getCurrentStep()).toBe(null);
    });

    test('returns current step', () => {
      song.addPattern('pattern1', 1);
      song.addPattern('pattern2', 2);
      const step = song.getCurrentStep();
      expect(step.patternName).toBe('pattern1');
    });

    test('returns step at currentStepIndex', () => {
      song.addPattern('pattern1', 1);
      song.addPattern('pattern2', 2);
      song.currentStepIndex = 1;
      const step = song.getCurrentStep();
      expect(step.patternName).toBe('pattern2');
    });
  });

  describe('getNextStep', () => {
    test('returns null for empty chain', () => {
      expect(song.getNextStep()).toBe(null);
    });

    test('returns first step when starting', () => {
      song.addPattern('pattern1', 1);
      song.addPattern('pattern2', 2);
      const step = song.getNextStep();
      expect(step.patternName).toBe('pattern1');
    });

    test('loops back to start when looping enabled', () => {
      song.addPattern('pattern1', 1);
      song.isLooping = true;
      song.currentStepIndex = 1;
      const step = song.getNextStep();
      expect(step.patternName).toBe('pattern1');
      expect(song.currentStepIndex).toBe(0);
    });

    test('returns null at end when looping disabled', () => {
      song.addPattern('pattern1', 1);
      song.isLooping = false;
      song.currentStepIndex = 1;
      const step = song.getNextStep();
      expect(step).toBe(null);
    });
  });

  describe('advance', () => {
    beforeEach(() => {
      song.addPattern('pattern1', 1);
      song.addPattern('pattern2', 2);
      song.addPattern('pattern3', 3);
    });

    test('advances to next step', () => {
      expect(song.currentStepIndex).toBe(0);
      song.advance();
      expect(song.currentStepIndex).toBe(1);
      song.advance();
      expect(song.currentStepIndex).toBe(2);
    });

    test('loops back to start when looping enabled', () => {
      song.isLooping = true;
      song.currentStepIndex = 2;
      song.advance();
      expect(song.currentStepIndex).toBe(0);
    });

    test('stops at end when looping disabled', () => {
      song.isLooping = false;
      song.currentStepIndex = 2;
      song.advance();
      expect(song.currentStepIndex).toBe(3);
    });
  });

  describe('reset', () => {
    test('resets currentStepIndex to 0', () => {
      song.addPattern('pattern1', 1);
      song.addPattern('pattern2', 2);
      song.currentStepIndex = 1;
      song.reset();
      expect(song.currentStepIndex).toBe(0);
    });

    test('resets all steps', () => {
      song.addPattern('pattern1', 3);
      song.addPattern('pattern2', 2);
      song.chain[0].incrementRepeat();
      song.chain[1].incrementRepeat();
      song.reset();
      expect(song.chain[0].currentRepeat).toBe(0);
      expect(song.chain[1].currentRepeat).toBe(0);
    });
  });

  describe('toJSON / fromJSON', () => {
    test('serializes song correctly', () => {
      song.addPattern('pattern1', 2);
      song.addPattern('pattern2', 1);
      song.isLooping = false;
      song.currentStepIndex = 1;
      
      const json = song.toJSON();
      expect(json.version).toBe('1.0');
      expect(json.name).toBe('Test Song');
      expect(json.isLooping).toBe(false);
      expect(json.chain.length).toBe(2);
      expect(json.chain[0].patternName).toBe('pattern1');
      // currentStepIndex and isPlaying not serialized (runtime state)
    });

    test('deserializes song correctly', () => {
      const json = {
        version: '1.0',
        name: 'Restored Song',
        chain: [
          { patternName: 'pattern1', repeats: 2 },
          { patternName: 'pattern2', repeats: 1 },
        ],
        isLooping: false,
      };
      
      const restored = SongModel.fromJSON(json);
      expect(restored.name).toBe('Restored Song');
      expect(restored.isLooping).toBe(false);
      expect(restored.currentStepIndex).toBe(0); // Runtime state always resets
      expect(restored.chain.length).toBe(2);
      expect(restored.chain[0].patternName).toBe('pattern1');
      expect(restored.chain[0] instanceof ChainStep).toBe(true);
    });

    test('round-trip serialization preserves structure', () => {
      song.addPattern('pattern1', 3);
      song.addPattern('pattern2', 2);
      song.addPattern('pattern3', 1);
      song.currentStepIndex = 1;
      song.isLooping = false;
      song.chain[0].incrementRepeat();
      
      const json = song.toJSON();
      const restored = SongModel.fromJSON(json);
      
      expect(restored.name).toBe(song.name);
      expect(restored.chain.length).toBe(song.chain.length);
      expect(restored.currentStepIndex).toBe(0); // Runtime state resets
      expect(restored.isLooping).toBe(song.isLooping);
      expect(restored.chain[0].currentRepeat).toBe(0); // Runtime state resets
    });
  });
});
