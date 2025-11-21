/**
 * SceneModel - Manages clips for scene-based arrangement
 * 
 * A scene contains multiple clips (pattern references) that can be launched together.
 * Part of Phase 8: Clip/Scene Grid implementation.
 */

/**
 * Clip - Represents a pattern reference within a scene
 */
export class Clip {
  constructor(patternName, trackIndex = 0) {
    this.patternName = patternName;
    this.trackIndex = trackIndex; // Which "track" or slot in the scene
    this.isPlaying = false;
  }

  /**
   * Serialize to JSON
   * @returns {Object}
   */
  toJSON() {
    return {
      patternName: this.patternName,
      trackIndex: this.trackIndex
    };
  }

  /**
   * Deserialize from JSON
   * @param {Object} data - Serialized clip data
   * @returns {Clip}
   */
  static fromJSON(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid clip data');
    }

    if (!data.patternName) {
      throw new Error('Pattern name is required');
    }

    return new Clip(data.patternName, data.trackIndex || 0);
  }
}

/**
 * Scene - Container for multiple clips
 */
export class Scene {
  constructor(name = 'Scene', maxTracks = 8) {
    this.name = name;
    this.maxTracks = maxTracks;
    this.clips = []; // Array of Clip instances
    this.color = '#4CAF50'; // Default color for visual identification
  }

  /**
   * Add a clip to the scene
   * @param {string} patternName - Name of the pattern
   * @param {number} trackIndex - Track slot (0-7 by default)
   * @returns {Clip} The created clip
   */
  addClip(patternName, trackIndex = 0) {
    if (!patternName || patternName.trim() === '') {
      throw new Error('Pattern name cannot be empty');
    }

    if (trackIndex < 0 || trackIndex >= this.maxTracks) {
      throw new Error(`Track index must be between 0 and ${this.maxTracks - 1}`);
    }

    // Check if track slot is already occupied
    const existingClip = this.getClipAtTrack(trackIndex);
    if (existingClip) {
      throw new Error(`Track ${trackIndex} already has a clip`);
    }

    const clip = new Clip(patternName, trackIndex);
    this.clips.push(clip);
    return clip;
  }

  /**
   * Remove a clip from the scene
   * @param {number} trackIndex - Track index
   */
  removeClip(trackIndex) {
    const index = this.clips.findIndex(clip => clip.trackIndex === trackIndex);
    
    if (index === -1) {
      throw new Error(`No clip at track ${trackIndex}`);
    }

    this.clips.splice(index, 1);
  }

  /**
   * Get clip at specific track
   * @param {number} trackIndex - Track index
   * @returns {Clip|null}
   */
  getClipAtTrack(trackIndex) {
    return this.clips.find(clip => clip.trackIndex === trackIndex) || null;
  }

  /**
   * Get all clips
   * @returns {Clip[]}
   */
  getClips() {
    return [...this.clips]; // Return copy
  }

  /**
   * Check if scene has any clips
   * @returns {boolean}
   */
  isEmpty() {
    return this.clips.length === 0;
  }

  /**
   * Clear all clips
   */
  clear() {
    this.clips = [];
  }

  /**
   * Get number of clips in scene
   * @returns {number}
   */
  getClipCount() {
    return this.clips.length;
  }

  /**
   * Serialize to JSON
   * @returns {Object}
   */
  toJSON() {
    return {
      name: this.name,
      maxTracks: this.maxTracks,
      clips: this.clips.map(clip => clip.toJSON()),
      color: this.color
    };
  }

  /**
   * Deserialize from JSON
   * @param {Object} data - Serialized scene data
   * @returns {Scene}
   */
  static fromJSON(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid scene data');
    }

    const scene = new Scene(data.name || 'Scene', data.maxTracks || 8);
    scene.color = data.color || '#4CAF50';

    if (Array.isArray(data.clips)) {
      scene.clips = data.clips.map(clipData => Clip.fromJSON(clipData));
    }

    return scene;
  }
}

/**
 * SceneGrid - Manages a collection of scenes
 */
export class SceneGrid {
  constructor(maxScenes = 8, maxTracks = 8) {
    this.maxScenes = maxScenes;
    this.maxTracks = maxTracks;
    this.scenes = [];
    this.currentSceneIndex = -1;
  }

  /**
   * Add a scene to the grid
   * @param {string} name - Scene name
   * @returns {Scene} The created scene
   */
  addScene(name = 'Scene') {
    if (this.scenes.length >= this.maxScenes) {
      throw new Error(`Maximum ${this.maxScenes} scenes allowed`);
    }

    const scene = new Scene(name, this.maxTracks);
    this.scenes.push(scene);
    return scene;
  }

  /**
   * Remove a scene
   * @param {number} sceneIndex - Scene index
   */
  removeScene(sceneIndex) {
    if (sceneIndex < 0 || sceneIndex >= this.scenes.length) {
      throw new Error(`Invalid scene index: ${sceneIndex}`);
    }

    this.scenes.splice(sceneIndex, 1);

    // Adjust current scene index if necessary
    if (this.currentSceneIndex === sceneIndex) {
      this.currentSceneIndex = -1;
    } else if (this.currentSceneIndex > sceneIndex) {
      this.currentSceneIndex--;
    }
  }

  /**
   * Get scene by index
   * @param {number} sceneIndex - Scene index
   * @returns {Scene|null}
   */
  getScene(sceneIndex) {
    if (sceneIndex < 0 || sceneIndex >= this.scenes.length) {
      return null;
    }
    return this.scenes[sceneIndex];
  }

  /**
   * Get current scene
   * @returns {Scene|null}
   */
  getCurrentScene() {
    return this.getScene(this.currentSceneIndex);
  }

  /**
   * Set current scene
   * @param {number} sceneIndex - Scene index
   */
  setCurrentScene(sceneIndex) {
    if (sceneIndex < -1 || sceneIndex >= this.scenes.length) {
      throw new Error(`Invalid scene index: ${sceneIndex}`);
    }
    this.currentSceneIndex = sceneIndex;
  }

  /**
   * Check if grid is empty
   * @returns {boolean}
   */
  isEmpty() {
    return this.scenes.length === 0;
  }

  /**
   * Clear all scenes
   */
  clear() {
    this.scenes = [];
    this.currentSceneIndex = -1;
  }

  /**
   * Serialize to JSON
   * @returns {Object}
   */
  toJSON() {
    return {
      maxScenes: this.maxScenes,
      maxTracks: this.maxTracks,
      scenes: this.scenes.map(scene => scene.toJSON()),
      currentSceneIndex: this.currentSceneIndex
    };
  }

  /**
   * Deserialize from JSON
   * @param {Object} data - Serialized grid data
   * @returns {SceneGrid}
   */
  static fromJSON(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid scene grid data');
    }

    const grid = new SceneGrid(data.maxScenes || 8, data.maxTracks || 8);
    
    if (Array.isArray(data.scenes)) {
      grid.scenes = data.scenes.map(sceneData => Scene.fromJSON(sceneData));
    }

    grid.currentSceneIndex = data.currentSceneIndex ?? -1;

    return grid;
  }
}
