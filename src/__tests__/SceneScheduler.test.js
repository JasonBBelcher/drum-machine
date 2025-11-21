/**
 * Tests for Phase 8: Scene Scheduler functionality
 * @jest-environment node
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { SongScheduler } from '../libs/song-scheduler.js';
import { SongModel } from '../models/SongModel.js';
import { Scene, Clip } from '../models/SceneModel.js';

describe('SongScheduler - Phase 8: Scene Support', () => {
  let mockController;
  let songModel;
  let scheduler;

  beforeEach(() => {
    // Mock controller
    mockController = {
      loadPatternByName: (name) => {
        mockController.lastLoadedPattern = name;
        return true;
      },
      handleStop: () => {
        mockController.stopped = true;
      },
      lastLoadedPattern: null,
      stopped: false
    };

    songModel = new SongModel('Test Song');
    scheduler = new SongScheduler(mockController, songModel);
  });

  describe('launchScene', () => {
    test('should launch scene with clips', () => {
      const scene = new Scene('Test Scene');
      scene.addClip('Pattern1', 0);
      scene.addClip('Pattern2', 1);

      const result = scheduler.launchScene(scene);

      expect(result).toBe(true);
      expect(mockController.stopped).toBe(true);
      expect(mockController.lastLoadedPattern).toBe('Pattern1');
      expect(scheduler.activeClips).toHaveLength(1);
      expect(scheduler.activeClips[0].patternName).toBe('Pattern1');
    });

    test('should return false for empty scene', () => {
      const scene = new Scene('Empty Scene');

      const result = scheduler.launchScene(scene);

      expect(result).toBe(false);
      expect(mockController.lastLoadedPattern).toBeNull();
    });

    test('should return false for null scene', () => {
      const result = scheduler.launchScene(null);

      expect(result).toBe(false);
      expect(mockController.lastLoadedPattern).toBeNull();
    });

    test('should clear previous active clips', () => {
      const scene1 = new Scene('Scene 1');
      scene1.addClip('Pattern1', 0);

      const scene2 = new Scene('Scene 2');
      scene2.addClip('Pattern2', 0);

      scheduler.launchScene(scene1);
      expect(scheduler.activeClips).toHaveLength(1);
      expect(scheduler.activeClips[0].patternName).toBe('Pattern1');

      scheduler.launchScene(scene2);
      expect(scheduler.activeClips).toHaveLength(1);
      expect(scheduler.activeClips[0].patternName).toBe('Pattern2');
    });

    test('should call scene change callback', () => {
      let callbackScene = null;
      scheduler.onSceneChange((scene) => {
        callbackScene = scene;
      });

      const scene = new Scene('Test Scene');
      scene.addClip('Pattern1', 0);

      scheduler.launchScene(scene);

      expect(callbackScene).toBe(scene);
      expect(callbackScene.name).toBe('Test Scene');
    });

    test('should handle pattern load failure', () => {
      mockController.loadPatternByName = () => false;

      const scene = new Scene('Test Scene');
      scene.addClip('Pattern1', 0);

      const result = scheduler.launchScene(scene);

      expect(result).toBe(false);
      expect(scheduler.activeClips).toHaveLength(0);
    });
  });

  describe('launchSceneByIndex', () => {
    test('should launch scene from scene grid by index', () => {
      const scene = new Scene('Test Scene');
      scene.addClip('Pattern1', 0);
      songModel.sceneGrid.addScene('Test Scene');
      songModel.sceneGrid.scenes[0] = scene;

      const result = scheduler.launchSceneByIndex(0);

      expect(result).toBe(true);
      expect(mockController.lastLoadedPattern).toBe('Pattern1');
    });

    test('should return false for invalid scene index', () => {
      const result = scheduler.launchSceneByIndex(99);

      expect(result).toBe(false);
      expect(mockController.lastLoadedPattern).toBeNull();
    });

    test('should return false when scene grid is empty', () => {
      const result = scheduler.launchSceneByIndex(0);

      expect(result).toBe(false);
    });
  });

  describe('getActiveClips', () => {
    test('should return copy of active clips array', () => {
      const scene = new Scene('Test Scene');
      scene.addClip('Pattern1', 0);

      scheduler.launchScene(scene);

      const clips1 = scheduler.getActiveClips();
      const clips2 = scheduler.getActiveClips();

      expect(clips1).toHaveLength(1);
      expect(clips2).toHaveLength(1);
      expect(clips1).not.toBe(clips2); // Different array instances
      expect(clips1[0]).toBe(clips2[0]); // Same clip instance
    });

    test('should return empty array when no clips active', () => {
      const clips = scheduler.getActiveClips();

      expect(clips).toEqual([]);
      expect(Array.isArray(clips)).toBe(true);
    });
  });

  describe('onSceneChange', () => {
    test('should register scene change callback', () => {
      let called = false;
      scheduler.onSceneChange(() => {
        called = true;
      });

      const scene = new Scene('Test Scene');
      scene.addClip('Pattern1', 0);

      scheduler.launchScene(scene);

      expect(called).toBe(true);
    });

    test('should not fail if no callback registered', () => {
      const scene = new Scene('Test Scene');
      scene.addClip('Pattern1', 0);

      expect(() => {
        scheduler.launchScene(scene);
      }).not.toThrow();
    });
  });

  describe('destroy', () => {
    test('should clear active clips', () => {
      const scene = new Scene('Test Scene');
      scene.addClip('Pattern1', 0);

      scheduler.launchScene(scene);
      expect(scheduler.activeClips).toHaveLength(1);

      scheduler.destroy();

      expect(scheduler.activeClips).toHaveLength(0);
    });

    test('should clear scene change callback', () => {
      let called = false;
      scheduler.onSceneChange(() => {
        called = true;
      });

      scheduler.destroy();

      const scene = new Scene('Test Scene');
      scene.addClip('Pattern1', 0);
      scheduler.launchScene(scene);

      expect(called).toBe(false);
    });
  });

  describe('Scene integration with SongModel', () => {
    test('should serialize and deserialize scene grid', () => {
      const scene1 = new Scene('Scene 1');
      scene1.addClip('Pattern1', 0);
      scene1.addClip('Pattern2', 1);

      const scene2 = new Scene('Scene 2');
      scene2.addClip('Pattern3', 0);

      songModel.sceneGrid.addScene('Scene 1');
      songModel.sceneGrid.addScene('Scene 2');
      songModel.sceneGrid.scenes[0] = scene1;
      songModel.sceneGrid.scenes[1] = scene2;

      const json = songModel.toJSON();

      expect(json.sceneGrid).toBeDefined();
      expect(json.sceneGrid.scenes).toHaveLength(2);
      expect(json.sceneGrid.scenes[0].name).toBe('Scene 1');
      expect(json.sceneGrid.scenes[0].clips).toHaveLength(2);

      const restored = SongModel.fromJSON(json);

      expect(restored.sceneGrid.scenes).toHaveLength(2);
      expect(restored.sceneGrid.scenes[0].name).toBe('Scene 1');
      expect(restored.sceneGrid.scenes[0].clips).toHaveLength(2);
      expect(restored.sceneGrid.scenes[0].clips[0].patternName).toBe('Pattern1');
    });

    test('should handle scene mode in serialization', () => {
      songModel.setMode('scene');
      songModel.addSceneToChain(0);
      songModel.addSceneToChain(1);

      const json = songModel.toJSON();

      expect(json.mode).toBe('scene');
      expect(json.sceneChain).toEqual([0, 1]);

      const restored = SongModel.fromJSON(json);

      expect(restored.mode).toBe('scene');
      expect(restored.sceneChain).toEqual([0, 1]);
    });
  });
});
