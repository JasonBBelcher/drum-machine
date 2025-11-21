/**
 * StorageManager - Safe localStorage wrapper for drum sequences
 * 
 * Replaces the dangerous JSONfn.parse() which uses eval().
 * Uses SequenceModel's safe JSON serialization instead.
 */

import { SequenceModel } from '../models/SequenceModel.js';
import { SongModel } from '../models/SongModel.js';

export class StorageManager {
  constructor(storageKey = 'drumSequences') {
    this.storageKey = storageKey;
    this.songStorageKey = 'drumSongs'; // Separate key for songs
    this.storageAvailable = this.checkStorageAvailability();
  }

  /**
   * Check if localStorage is available
   * @returns {boolean}
   */
  checkStorageAvailability() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('localStorage not available:', e);
      return false;
    }
  }

  /**
   * Save a sequence with a name
   * @param {string} name - Sequence name
   * @param {SequenceModel} model - Sequence model to save
   * @returns {boolean} Success status
   */
  save(name, model) {
    if (!this.storageAvailable) {
      console.error('Storage not available');
      return false;
    }

    if (!name || typeof name !== 'string') {
      console.error('Invalid sequence name');
      return false;
    }

    try {
      const sequences = this.loadAll();
      sequences[name] = {
        data: model.toJSON(),
        timestamp: Date.now(),
        version: '2.0'
      };

      localStorage.setItem(this.storageKey, JSON.stringify(sequences));
      return true;
    } catch (e) {
      console.error('Failed to save sequence:', e);
      return false;
    }
  }

  /**
   * Load a sequence by name
   * @param {string} name - Sequence name
   * @returns {SequenceModel|null}
   */
  load(name) {
    if (!this.storageAvailable) {
      return null;
    }

    try {
      const sequences = this.loadAll();
      const entry = sequences[name];

      if (!entry) {
        console.warn(`Sequence "${name}" not found`);
        return null;
      }

      // Handle old format (pre-2.0) if needed
      if (!entry.version || entry.version === '1.0') {
        console.warn(`Sequence "${name}" uses old format, creating new sequence`);
        return new SequenceModel();
      }

      return SequenceModel.fromJSON(entry.data);
    } catch (e) {
      console.error('Failed to load sequence:', e);
      return null;
    }
  }

  /**
   * Load all sequences
   * @returns {Object} Map of sequence names to entries
   */
  loadAll() {
    if (!this.storageAvailable) {
      return {};
    }

    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Failed to load sequences:', e);
      return {};
    }
  }

  /**
   * Delete a sequence
   * @param {string} name - Sequence name
   * @returns {boolean} Success status
   */
  delete(name) {
    if (!this.storageAvailable) {
      return false;
    }

    try {
      const sequences = this.loadAll();
      
      if (!sequences[name]) {
        console.warn(`Sequence "${name}" not found`);
        return false;
      }

      delete sequences[name];
      localStorage.setItem(this.storageKey, JSON.stringify(sequences));
      return true;
    } catch (e) {
      console.error('Failed to delete sequence:', e);
      return false;
    }
  }

  /**
   * List all sequence names with metadata
   * @returns {Array} Array of {name, timestamp, version}
   */
  list() {
    const sequences = this.loadAll();
    return Object.entries(sequences).map(([name, entry]) => ({
      name,
      timestamp: entry.timestamp,
      version: entry.version || '1.0',
      date: new Date(entry.timestamp).toLocaleString()
    }));
  }

  /**
   * Clear all sequences
   * @returns {boolean} Success status
   */
  clearAll() {
    if (!this.storageAvailable) {
      return false;
    }

    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (e) {
      console.error('Failed to clear sequences:', e);
      return false;
    }
  }

  /**
   * Export sequences as JSON file
   * @returns {string} JSON string
   */
  export() {
    const sequences = this.loadAll();
    return JSON.stringify(sequences, null, 2);
  }

  /**
   * Import sequences from JSON string
   * @param {string} jsonString - JSON data
   * @param {boolean} merge - Merge with existing (true) or replace (false)
   * @returns {boolean} Success status
   */
  import(jsonString, merge = true) {
    if (!this.storageAvailable) {
      return false;
    }

    try {
      const imported = JSON.parse(jsonString);
      
      if (merge) {
        const existing = this.loadAll();
        const merged = { ...existing, ...imported };
        localStorage.setItem(this.storageKey, JSON.stringify(merged));
      } else {
        localStorage.setItem(this.storageKey, JSON.stringify(imported));
      }

      return true;
    } catch (e) {
      console.error('Failed to import sequences:', e);
      return false;
    }
  }

  /**
   * Get storage usage statistics
   * @returns {Object} {used, available, percentage}
   */
  getStorageStats() {
    if (!this.storageAvailable) {
      return { used: 0, available: 0, percentage: 0 };
    }

    try {
      const data = localStorage.getItem(this.storageKey) || '';
      const used = new Blob([data]).size;
      const available = 5 * 1024 * 1024; // ~5MB typical localStorage limit
      const percentage = ((used / available) * 100).toFixed(2);

      return {
        used,
        available,
        percentage: parseFloat(percentage),
        usedFormatted: this.formatBytes(used),
        availableFormatted: this.formatBytes(available)
      };
    } catch (e) {
      console.error('Failed to get storage stats:', e);
      return { used: 0, available: 0, percentage: 0 };
    }
  }

  /**
   * Format bytes for display
   * @param {number} bytes
   * @returns {string}
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Check if sequence name exists
   * @param {string} name
   * @returns {boolean}
   */
  exists(name) {
    const sequences = this.loadAll();
    return sequences.hasOwnProperty(name);
  }

  /**
   * Rename a sequence
   * @param {string} oldName
   * @param {string} newName
   * @returns {boolean} Success status
   */
  rename(oldName, newName) {
    if (!this.storageAvailable) {
      return false;
    }

    if (this.exists(newName)) {
      console.error(`Sequence "${newName}" already exists`);
      return false;
    }

    try {
      const sequences = this.loadAll();
      
      if (!sequences[oldName]) {
        console.error(`Sequence "${oldName}" not found`);
        return false;
      }

      sequences[newName] = sequences[oldName];
      delete sequences[oldName];
      
      localStorage.setItem(this.storageKey, JSON.stringify(sequences));
      return true;
    } catch (e) {
      console.error('Failed to rename sequence:', e);
      return false;
    }
  }

  // ===== SONG MANAGEMENT METHODS =====

  /**
   * Save a song
   * @param {SongModel} song - Song to save
   * @returns {boolean} Success status
   */
  saveSong(song) {
    if (!this.storageAvailable) {
      console.error('Storage not available');
      return false;
    }

    if (!song.name || typeof song.name !== 'string') {
      console.error('Invalid song name');
      return false;
    }

    try {
      const songs = this.loadAllSongs();
      songs[song.name] = {
        data: song.toJSON(),
        timestamp: Date.now(),
        version: '1.0'
      };

      localStorage.setItem(this.songStorageKey, JSON.stringify(songs));
      return true;
    } catch (e) {
      console.error('Failed to save song:', e);
      return false;
    }
  }

  /**
   * Load a song by name
   * @param {string} name - Song name
   * @returns {SongModel|null}
   */
  loadSong(name) {
    if (!this.storageAvailable) {
      return null;
    }

    try {
      const songs = this.loadAllSongs();
      const entry = songs[name];

      if (!entry) {
        console.warn(`Song "${name}" not found`);
        return null;
      }

      return SongModel.fromJSON(entry.data);
    } catch (e) {
      console.error('Failed to load song:', e);
      return null;
    }
  }

  /**
   * Load all songs
   * @returns {Object} Songs object keyed by name
   */
  loadAllSongs() {
    if (!this.storageAvailable) {
      return {};
    }

    try {
      const data = localStorage.getItem(this.songStorageKey);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Failed to load songs:', e);
      return {};
    }
  }

  /**
   * Get array of all song names
   * @returns {Array<string>}
   */
  getAllSongNames() {
    const songs = this.loadAllSongs();
    return Object.keys(songs).sort();
  }

  /**
   * Delete a song
   * @param {string} name - Song name
   * @returns {boolean} Success status
   */
  deleteSong(name) {
    if (!this.storageAvailable) {
      return false;
    }

    try {
      const songs = this.loadAllSongs();
      
      if (!songs[name]) {
        console.warn(`Song "${name}" not found`);
        return false;
      }

      delete songs[name];
      localStorage.setItem(this.songStorageKey, JSON.stringify(songs));
      return true;
    } catch (e) {
      console.error('Failed to delete song:', e);
      return false;
    }
  }

  /**
   * Check if song name exists
   * @param {string} name
   * @returns {boolean}
   */
  songExists(name) {
    const songs = this.loadAllSongs();
    return songs.hasOwnProperty(name);
  }

  /**
   * Rename a song
   * @param {string} oldName
   * @param {string} newName
   * @returns {boolean} Success status
   */
  renameSong(oldName, newName) {
    if (!this.storageAvailable) {
      return false;
    }

    if (this.songExists(newName)) {
      console.error(`Song "${newName}" already exists`);
      return false;
    }

    try {
      const songs = this.loadAllSongs();
      
      if (!songs[oldName]) {
        console.error(`Song "${oldName}" not found`);
        return false;
      }

      songs[newName] = songs[oldName];
      delete songs[oldName];
      
      localStorage.setItem(this.songStorageKey, JSON.stringify(songs));
      return true;
    } catch (e) {
      console.error('Failed to rename song:', e);
      return false;
    }
  }

  /**
   * Export a song to JSON string
   * @param {string} name - Song name
   * @returns {string|null} JSON string
   */
  exportSong(name) {
    const song = this.loadSong(name);
    if (!song) return null;

    try {
      return JSON.stringify(song.toJSON(), null, 2);
    } catch (e) {
      console.error('Failed to export song:', e);
      return null;
    }
  }

  /**
   * Import a song from JSON string
   * @param {string} jsonString - JSON representation of song
   * @param {string} name - Optional name override
   * @returns {boolean} Success status
   */
  importSong(jsonString, name = null) {
    try {
      const data = JSON.parse(jsonString);
      const song = SongModel.fromJSON(data);
      
      if (name) {
        song.name = name;
      }

      return this.saveSong(song);
    } catch (e) {
      console.error('Failed to import song:', e);
      return false;
    }
  }
}
