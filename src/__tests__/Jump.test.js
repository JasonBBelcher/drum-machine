/**
 * @jest-environment node
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { SongModel, ChainStep, Jump } from '../models/SongModel.js';

describe('Jump', () => {
  describe('constructor', () => {
    test('creates a jump with required parameters', () => {
      const jump = new Jump(0, 2);
      
      expect(jump.fromIndex).toBe(0);
      expect(jump.toIndex).toBe(2);
      expect(jump.label).toBe('');
      expect(jump.condition).toBe('always');
    });

    test('creates a jump with label and condition', () => {
      const jump = new Jump(1, 3, 'Chorus', 'on-first');
      
      expect(jump.fromIndex).toBe(1);
      expect(jump.toIndex).toBe(3);
      expect(jump.label).toBe('Chorus');
      expect(jump.condition).toBe('on-first');
    });
  });

  describe('shouldJump()', () => {
    test('always condition returns true', () => {
      const jump = new Jump(0, 2, '', 'always');
      
      expect(jump.shouldJump(0, 4)).toBe(true);
      expect(jump.shouldJump(1, 4)).toBe(true);
      expect(jump.shouldJump(3, 4)).toBe(true);
    });

    test('on-first condition returns true only on first repeat', () => {
      const jump = new Jump(0, 2, '', 'on-first');
      
      expect(jump.shouldJump(0, 4)).toBe(true);
      expect(jump.shouldJump(1, 4)).toBe(false);
      expect(jump.shouldJump(2, 4)).toBe(false);
    });

    test('on-last condition returns true only on last repeat', () => {
      const jump = new Jump(0, 2, '', 'on-last');
      
      expect(jump.shouldJump(0, 4)).toBe(false);
      expect(jump.shouldJump(2, 4)).toBe(false);
      expect(jump.shouldJump(3, 4)).toBe(true); // Last repeat (0-indexed)
    });

    test('specific repeat number condition', () => {
      const jump = new Jump(0, 2, '', '3');
      
      expect(jump.shouldJump(0, 4)).toBe(false);
      expect(jump.shouldJump(1, 4)).toBe(false);
      expect(jump.shouldJump(2, 4)).toBe(true); // 3rd repeat (0-indexed = 2)
      expect(jump.shouldJump(3, 4)).toBe(false);
    });
  });

  describe('getConditionText()', () => {
    test('returns display text for always', () => {
      const jump = new Jump(0, 2, '', 'always');
      expect(jump.getConditionText()).toBe('Always');
    });

    test('returns display text for on-first', () => {
      const jump = new Jump(0, 2, '', 'on-first');
      expect(jump.getConditionText()).toBe('On first');
    });

    test('returns display text for on-last', () => {
      const jump = new Jump(0, 2, '', 'on-last');
      expect(jump.getConditionText()).toBe('On last');
    });

    test('returns display text for specific repeat', () => {
      const jump = new Jump(0, 2, '', '5');
      expect(jump.getConditionText()).toBe('On repeat 5');
    });
  });

  describe('JSON serialization', () => {
    test('serializes to JSON', () => {
      const jump = new Jump(1, 3, 'Verse', 'on-first');
      const json = jump.toJSON();
      
      expect(json).toEqual({
        fromIndex: 1,
        toIndex: 3,
        label: 'Verse',
        condition: 'on-first'
      });
    });

    test('deserializes from JSON', () => {
      const json = {
        fromIndex: 2,
        toIndex: 4,
        label: 'Bridge',
        condition: 'on-last'
      };
      
      const jump = Jump.fromJSON(json);
      
      expect(jump.fromIndex).toBe(2);
      expect(jump.toIndex).toBe(4);
      expect(jump.label).toBe('Bridge');
      expect(jump.condition).toBe('on-last');
    });

    test('throws error for invalid JSON data', () => {
      expect(() => Jump.fromJSON(null)).toThrow('Invalid jump data');
      expect(() => Jump.fromJSON({})).toThrow('Jump requires fromIndex and toIndex');
    });
  });
});

describe('SongModel Jump Methods', () => {
  let song;

  beforeEach(() => {
    song = new SongModel('Test Song');
    song.addPattern('intro', 2);
    song.addPattern('verse', 4);
    song.addPattern('chorus', 2);
    song.addPattern('outro', 1);
  });

  describe('addJump()', () => {
    test('adds a jump marker', () => {
      const jump = song.addJump(1, 0, 'Repeat verse');
      
      expect(song.jumps.length).toBe(1);
      expect(jump.fromIndex).toBe(1);
      expect(jump.toIndex).toBe(0);
      expect(jump.label).toBe('Repeat verse');
    });

    test('adds multiple jumps', () => {
      song.addJump(1, 0);
      song.addJump(2, 1);
      
      expect(song.jumps.length).toBe(2);
    });

    test('throws error for invalid from index', () => {
      expect(() => song.addJump(-1, 2)).toThrow('Invalid from index');
      expect(() => song.addJump(10, 2)).toThrow('Invalid from index');
    });

    test('throws error for invalid to index', () => {
      expect(() => song.addJump(1, -1)).toThrow('Invalid to index');
      expect(() => song.addJump(1, 10)).toThrow('Invalid to index');
    });

    test('throws error for same source and target', () => {
      expect(() => song.addJump(1, 1)).toThrow('Jump source and target cannot be the same');
    });
  });

  describe('removeJump()', () => {
    beforeEach(() => {
      song.addJump(1, 0);
      song.addJump(2, 1);
    });

    test('removes a jump', () => {
      song.removeJump(0);
      
      expect(song.jumps.length).toBe(1);
      expect(song.jumps[0].fromIndex).toBe(2);
    });

    test('throws error for invalid jump index', () => {
      expect(() => song.removeJump(-1)).toThrow('Invalid jump index');
      expect(() => song.removeJump(5)).toThrow('Invalid jump index');
    });
  });

  describe('getJumpsFrom()', () => {
    beforeEach(() => {
      song.addJump(1, 0);
      song.addJump(1, 2);
      song.addJump(2, 0);
    });

    test('returns jumps from specific step', () => {
      const jumps = song.getJumpsFrom(1);
      
      expect(jumps.length).toBe(2);
      expect(jumps[0].toIndex).toBe(0);
      expect(jumps[1].toIndex).toBe(2);
    });

    test('returns empty array when no jumps from step', () => {
      const jumps = song.getJumpsFrom(3);
      
      expect(jumps).toEqual([]);
    });
  });

  describe('getJump()', () => {
    beforeEach(() => {
      song.addJump(1, 0);
      song.addJump(2, 1);
    });

    test('returns jump by index', () => {
      const jump = song.getJump(1);
      
      expect(jump).toBeTruthy();
      expect(jump.fromIndex).toBe(2);
      expect(jump.toIndex).toBe(1);
    });

    test('returns null for invalid index', () => {
      expect(song.getJump(-1)).toBeNull();
      expect(song.getJump(5)).toBeNull();
    });
  });

  describe('updateJumpIndices()', () => {
    beforeEach(() => {
      song.addJump(0, 2); // intro -> chorus
      song.addJump(1, 0); // verse -> intro
      song.addJump(2, 3); // chorus -> outro
    });

    test('updates jump indices when pattern moved', () => {
      song.moveStep(0, 2); // Move intro from 0 to 2
      
      // Jump from original 0 (intro) should now be from 2
      const jump1 = song.jumps[0];
      expect(jump1.fromIndex).toBe(2);
      
      // Jump to original 0 (intro) should now be to 2 (intro moved to position 2)
      const jump2 = song.jumps[1];
      expect(jump2.toIndex).toBe(2);
    });

    test('handles complex reordering', () => {
      song.moveStep(1, 3); // Move verse from 1 to 3
      
      // Verify all jumps are updated correctly
      expect(song.validateJumps()).toBe(true);
    });
  });

  describe('validateJumps()', () => {
    test('returns true for valid jumps', () => {
      song.addJump(0, 2);
      song.addJump(1, 0);
      
      expect(song.validateJumps()).toBe(true);
    });

    test('returns false for invalid jump indices', () => {
      song.addJump(0, 2);
      // Manually corrupt jump
      song.jumps[0].toIndex = 10;
      
      expect(song.validateJumps()).toBe(false);
    });

    test('returns false for self-referencing jump', () => {
      song.addJump(0, 2);
      // Manually corrupt jump
      song.jumps[0].toIndex = 0;
      
      expect(song.validateJumps()).toBe(false);
    });
  });

  describe('clearJumps()', () => {
    test('removes all jumps', () => {
      song.addJump(0, 2);
      song.addJump(1, 0);
      
      song.clearJumps();
      
      expect(song.jumps.length).toBe(0);
    });
  });

  describe('JSON serialization with jumps', () => {
    test('serializes song with jumps', () => {
      song.addJump(0, 2, 'Skip to chorus');
      song.addJump(2, 1, 'Back to verse', 'on-last');
      
      const json = song.toJSON();
      
      expect(json.version).toBe('1.2'); // Phase 8 updated version
      expect(json.jumps.length).toBe(2);
      expect(json.jumps[0].fromIndex).toBe(0);
      expect(json.jumps[0].label).toBe('Skip to chorus');
    });

    test('deserializes song with jumps', () => {
      const json = {
        name: 'Jump Song',
        chain: [
          { patternName: 'intro', repeats: 2 },
          { patternName: 'verse', repeats: 4 }
        ],
        jumps: [
          { fromIndex: 0, toIndex: 1, label: 'Test', condition: 'always' }
        ],
        isLooping: true,
        version: '1.1'
      };
      
      const loadedSong = SongModel.fromJSON(json);
      
      expect(loadedSong.jumps.length).toBe(1);
      expect(loadedSong.jumps[0].fromIndex).toBe(0);
      expect(loadedSong.jumps[0].label).toBe('Test');
    });

    test('handles songs without jumps (backwards compatibility)', () => {
      const json = {
        name: 'Old Song',
        chain: [
          { patternName: 'intro', repeats: 2 }
        ],
        isLooping: true,
        version: '1.0'
      };
      
      const loadedSong = SongModel.fromJSON(json);
      
      expect(loadedSong.jumps).toEqual([]);
    });
  });
});
