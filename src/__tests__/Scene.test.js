/**
 * @jest-environment node
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { Clip, Scene, SceneGrid } from '../models/SceneModel.js';

describe('Clip', () => {
  describe('constructor', () => {
    test('creates clip with pattern name', () => {
      const clip = new Clip('intro');
      
      expect(clip.patternName).toBe('intro');
      expect(clip.trackIndex).toBe(0);
      expect(clip.isPlaying).toBe(false);
    });

    test('creates clip with track index', () => {
      const clip = new Clip('verse', 3);
      
      expect(clip.patternName).toBe('verse');
      expect(clip.trackIndex).toBe(3);
    });
  });

  describe('JSON serialization', () => {
    test('serializes to JSON', () => {
      const clip = new Clip('chorus', 2);
      const json = clip.toJSON();
      
      expect(json).toEqual({
        patternName: 'chorus',
        trackIndex: 2
      });
    });

    test('deserializes from JSON', () => {
      const json = { patternName: 'bridge', trackIndex: 4 };
      const clip = Clip.fromJSON(json);
      
      expect(clip.patternName).toBe('bridge');
      expect(clip.trackIndex).toBe(4);
    });

    test('throws error for invalid JSON data', () => {
      expect(() => Clip.fromJSON(null)).toThrow('Invalid clip data');
      expect(() => Clip.fromJSON({})).toThrow('Pattern name is required');
    });
  });
});

describe('Scene', () => {
  let scene;

  beforeEach(() => {
    scene = new Scene('Test Scene');
  });

  describe('constructor', () => {
    test('creates scene with name', () => {
      expect(scene.name).toBe('Test Scene');
      expect(scene.maxTracks).toBe(8);
      expect(scene.clips).toEqual([]);
      expect(scene.color).toBe('#4CAF50');
    });

    test('creates scene with custom max tracks', () => {
      const customScene = new Scene('Custom', 16);
      expect(customScene.maxTracks).toBe(16);
    });
  });

  describe('addClip()', () => {
    test('adds clip to scene', () => {
      const clip = scene.addClip('intro', 0);
      
      expect(scene.clips.length).toBe(1);
      expect(clip.patternName).toBe('intro');
      expect(clip.trackIndex).toBe(0);
    });

    test('adds multiple clips to different tracks', () => {
      scene.addClip('intro', 0);
      scene.addClip('verse', 1);
      scene.addClip('chorus', 2);
      
      expect(scene.clips.length).toBe(3);
    });

    test('throws error for empty pattern name', () => {
      expect(() => scene.addClip('', 0)).toThrow('Pattern name cannot be empty');
      expect(() => scene.addClip('   ', 0)).toThrow('Pattern name cannot be empty');
    });

    test('throws error for invalid track index', () => {
      expect(() => scene.addClip('intro', -1)).toThrow('Track index must be between');
      expect(() => scene.addClip('intro', 8)).toThrow('Track index must be between');
    });

    test('throws error for occupied track', () => {
      scene.addClip('intro', 0);
      expect(() => scene.addClip('verse', 0)).toThrow('Track 0 already has a clip');
    });
  });

  describe('removeClip()', () => {
    beforeEach(() => {
      scene.addClip('intro', 0);
      scene.addClip('verse', 1);
      scene.addClip('chorus', 2);
    });

    test('removes clip by track index', () => {
      scene.removeClip(1);
      
      expect(scene.clips.length).toBe(2);
      expect(scene.getClipAtTrack(1)).toBeNull();
    });

    test('throws error for invalid track', () => {
      expect(() => scene.removeClip(5)).toThrow('No clip at track 5');
    });
  });

  describe('getClipAtTrack()', () => {
    beforeEach(() => {
      scene.addClip('intro', 0);
      scene.addClip('verse', 2);
    });

    test('returns clip at track', () => {
      const clip = scene.getClipAtTrack(2);
      
      expect(clip).toBeTruthy();
      expect(clip.patternName).toBe('verse');
    });

    test('returns null for empty track', () => {
      expect(scene.getClipAtTrack(1)).toBeNull();
    });
  });

  describe('getClips()', () => {
    test('returns copy of clips array', () => {
      scene.addClip('intro', 0);
      const clips = scene.getClips();
      
      expect(clips.length).toBe(1);
      // Verify it's a copy
      clips.push(new Clip('test', 1));
      expect(scene.clips.length).toBe(1);
    });
  });

  describe('isEmpty()', () => {
    test('returns true for empty scene', () => {
      expect(scene.isEmpty()).toBe(true);
    });

    test('returns false for non-empty scene', () => {
      scene.addClip('intro', 0);
      expect(scene.isEmpty()).toBe(false);
    });
  });

  describe('clear()', () => {
    test('removes all clips', () => {
      scene.addClip('intro', 0);
      scene.addClip('verse', 1);
      
      scene.clear();
      
      expect(scene.clips.length).toBe(0);
      expect(scene.isEmpty()).toBe(true);
    });
  });

  describe('getClipCount()', () => {
    test('returns number of clips', () => {
      expect(scene.getClipCount()).toBe(0);
      
      scene.addClip('intro', 0);
      expect(scene.getClipCount()).toBe(1);
      
      scene.addClip('verse', 1);
      expect(scene.getClipCount()).toBe(2);
    });
  });

  describe('JSON serialization', () => {
    test('serializes scene with clips', () => {
      scene.addClip('intro', 0);
      scene.addClip('verse', 1);
      scene.color = '#FF5722';
      
      const json = scene.toJSON();
      
      expect(json.name).toBe('Test Scene');
      expect(json.maxTracks).toBe(8);
      expect(json.clips.length).toBe(2);
      expect(json.color).toBe('#FF5722');
    });

    test('deserializes scene from JSON', () => {
      const json = {
        name: 'Loaded Scene',
        maxTracks: 4,
        clips: [
          { patternName: 'intro', trackIndex: 0 },
          { patternName: 'verse', trackIndex: 1 }
        ],
        color: '#2196F3'
      };
      
      const loadedScene = Scene.fromJSON(json);
      
      expect(loadedScene.name).toBe('Loaded Scene');
      expect(loadedScene.maxTracks).toBe(4);
      expect(loadedScene.clips.length).toBe(2);
      expect(loadedScene.color).toBe('#2196F3');
      expect(loadedScene.getClipAtTrack(0).patternName).toBe('intro');
    });

    test('throws error for invalid JSON data', () => {
      expect(() => Scene.fromJSON(null)).toThrow('Invalid scene data');
    });
  });
});

describe('SceneGrid', () => {
  let grid;

  beforeEach(() => {
    grid = new SceneGrid();
  });

  describe('constructor', () => {
    test('creates grid with default settings', () => {
      expect(grid.maxScenes).toBe(8);
      expect(grid.maxTracks).toBe(8);
      expect(grid.scenes).toEqual([]);
      expect(grid.currentSceneIndex).toBe(-1);
    });

    test('creates grid with custom settings', () => {
      const customGrid = new SceneGrid(16, 4);
      expect(customGrid.maxScenes).toBe(16);
      expect(customGrid.maxTracks).toBe(4);
    });
  });

  describe('addScene()', () => {
    test('adds scene to grid', () => {
      const scene = grid.addScene('Scene 1');
      
      expect(grid.scenes.length).toBe(1);
      expect(scene.name).toBe('Scene 1');
      expect(scene.maxTracks).toBe(8);
    });

    test('adds multiple scenes', () => {
      grid.addScene('Scene 1');
      grid.addScene('Scene 2');
      grid.addScene('Scene 3');
      
      expect(grid.scenes.length).toBe(3);
    });

    test('throws error when max scenes exceeded', () => {
      for (let i = 0; i < 8; i++) {
        grid.addScene(`Scene ${i + 1}`);
      }
      
      expect(() => grid.addScene('Scene 9')).toThrow('Maximum 8 scenes allowed');
    });
  });

  describe('removeScene()', () => {
    beforeEach(() => {
      grid.addScene('Scene 1');
      grid.addScene('Scene 2');
      grid.addScene('Scene 3');
    });

    test('removes scene by index', () => {
      grid.removeScene(1);
      
      expect(grid.scenes.length).toBe(2);
      expect(grid.scenes[0].name).toBe('Scene 1');
      expect(grid.scenes[1].name).toBe('Scene 3');
    });

    test('adjusts current scene index when removing before current', () => {
      grid.setCurrentScene(2);
      grid.removeScene(1);
      
      expect(grid.currentSceneIndex).toBe(1);
    });

    test('resets current scene index when removing current scene', () => {
      grid.setCurrentScene(1);
      grid.removeScene(1);
      
      expect(grid.currentSceneIndex).toBe(-1);
    });

    test('throws error for invalid index', () => {
      expect(() => grid.removeScene(-1)).toThrow('Invalid scene index');
      expect(() => grid.removeScene(10)).toThrow('Invalid scene index');
    });
  });

  describe('getScene()', () => {
    beforeEach(() => {
      grid.addScene('Scene 1');
      grid.addScene('Scene 2');
    });

    test('returns scene by index', () => {
      const scene = grid.getScene(1);
      
      expect(scene).toBeTruthy();
      expect(scene.name).toBe('Scene 2');
    });

    test('returns null for invalid index', () => {
      expect(grid.getScene(-1)).toBeNull();
      expect(grid.getScene(10)).toBeNull();
    });
  });

  describe('getCurrentScene()', () => {
    beforeEach(() => {
      grid.addScene('Scene 1');
      grid.addScene('Scene 2');
    });

    test('returns current scene', () => {
      grid.setCurrentScene(1);
      const scene = grid.getCurrentScene();
      
      expect(scene).toBeTruthy();
      expect(scene.name).toBe('Scene 2');
    });

    test('returns null when no current scene', () => {
      expect(grid.getCurrentScene()).toBeNull();
    });
  });

  describe('setCurrentScene()', () => {
    beforeEach(() => {
      grid.addScene('Scene 1');
      grid.addScene('Scene 2');
    });

    test('sets current scene index', () => {
      grid.setCurrentScene(1);
      expect(grid.currentSceneIndex).toBe(1);
    });

    test('allows setting to -1 (no scene)', () => {
      grid.setCurrentScene(0);
      grid.setCurrentScene(-1);
      expect(grid.currentSceneIndex).toBe(-1);
    });

    test('throws error for invalid index', () => {
      expect(() => grid.setCurrentScene(-2)).toThrow('Invalid scene index');
      expect(() => grid.setCurrentScene(10)).toThrow('Invalid scene index');
    });
  });

  describe('isEmpty()', () => {
    test('returns true for empty grid', () => {
      expect(grid.isEmpty()).toBe(true);
    });

    test('returns false for non-empty grid', () => {
      grid.addScene('Scene 1');
      expect(grid.isEmpty()).toBe(false);
    });
  });

  describe('clear()', () => {
    test('removes all scenes', () => {
      grid.addScene('Scene 1');
      grid.addScene('Scene 2');
      grid.setCurrentScene(1);
      
      grid.clear();
      
      expect(grid.scenes.length).toBe(0);
      expect(grid.currentSceneIndex).toBe(-1);
    });
  });

  describe('JSON serialization', () => {
    test('serializes grid with scenes', () => {
      const scene1 = grid.addScene('Scene 1');
      scene1.addClip('intro', 0);
      
      const scene2 = grid.addScene('Scene 2');
      scene2.addClip('verse', 1);
      
      grid.setCurrentScene(1);
      
      const json = grid.toJSON();
      
      expect(json.maxScenes).toBe(8);
      expect(json.maxTracks).toBe(8);
      expect(json.scenes.length).toBe(2);
      expect(json.currentSceneIndex).toBe(1);
    });

    test('deserializes grid from JSON', () => {
      const json = {
        maxScenes: 16,
        maxTracks: 4,
        scenes: [
          {
            name: 'Scene 1',
            maxTracks: 4,
            clips: [{ patternName: 'intro', trackIndex: 0 }],
            color: '#4CAF50'
          }
        ],
        currentSceneIndex: 0
      };
      
      const loadedGrid = SceneGrid.fromJSON(json);
      
      expect(loadedGrid.maxScenes).toBe(16);
      expect(loadedGrid.maxTracks).toBe(4);
      expect(loadedGrid.scenes.length).toBe(1);
      expect(loadedGrid.currentSceneIndex).toBe(0);
      expect(loadedGrid.scenes[0].name).toBe('Scene 1');
    });

    test('throws error for invalid JSON data', () => {
      expect(() => SceneGrid.fromJSON(null)).toThrow('Invalid scene grid data');
    });
  });
});
