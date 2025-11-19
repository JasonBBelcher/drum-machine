/**
 * SampleLoader - Load and validate audio files from user uploads
 * 
 * Handles custom sample loading with format and size validation.
 */

export class SampleLoader {
  constructor(audioContext) {
    this.context = audioContext;
    this.supportedFormats = ['audio/wav', 'audio/mpeg', 'audio/ogg', 'audio/mp3'];
    this.maxFileSize = 5 * 1024 * 1024; // 5MB
  }

  /**
   * Load audio file from File object
   * @param {File} file - File object from input
   * @returns {Promise<Object>} {name, buffer, size, duration}
   */
  async loadFromFile(file) {
    // Validate file format
    if (!this.isValidFormat(file)) {
      throw new Error(`Unsupported format: ${file.type}. Supported: WAV, MP3, OGG`);
    }

    // Validate file size
    if (file.size > this.maxFileSize) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const maxMB = (this.maxFileSize / (1024 * 1024)).toFixed(0);
      throw new Error(`File too large: ${sizeMB}MB (max ${maxMB}MB)`);
    }

    try {
      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Decode audio data
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
      
      return {
        name: file.name,
        buffer: audioBuffer,
        size: file.size,
        duration: audioBuffer.duration,
        sampleRate: audioBuffer.sampleRate,
        channels: audioBuffer.numberOfChannels
      };
    } catch (error) {
      throw new Error(`Failed to decode audio file: ${error.message}`);
    }
  }

  /**
   * Load multiple files
   * @param {FileList} files - FileList from input
   * @returns {Promise<Array>} Array of loaded samples
   */
  async loadMultiple(files) {
    const promises = Array.from(files).map(file => 
      this.loadFromFile(file).catch(error => ({
        name: file.name,
        error: error.message
      }))
    );

    return await Promise.all(promises);
  }

  /**
   * Check if file format is supported
   * @param {File} file
   * @returns {boolean}
   */
  isValidFormat(file) {
    // Check MIME type
    if (this.supportedFormats.includes(file.type)) {
      return true;
    }

    // Check file extension as fallback
    const ext = file.name.split('.').pop().toLowerCase();
    return ['wav', 'mp3', 'ogg'].includes(ext);
  }

  /**
   * Load from URL (for default samples)
   * @param {string} url - Audio file URL
   * @returns {Promise<AudioBuffer>}
   */
  async loadFromURL(url) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      return await this.context.decodeAudioData(arrayBuffer);
    } catch (error) {
      throw new Error(`Failed to load from URL: ${error.message}`);
    }
  }

  /**
   * Get file size in human-readable format
   * @param {number} bytes
   * @returns {string}
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get supported formats list
   * @returns {string[]}
   */
  getSupportedFormats() {
    return ['WAV', 'MP3', 'OGG'];
  }

  /**
   * Get max file size in MB
   * @returns {number}
   */
  getMaxSizeMB() {
    return this.maxFileSize / (1024 * 1024);
  }
}
