/**
 * SampleControlsView - UI for custom sample loading and pitch control
 * 
 * Provides interface for:
 * - Loading custom audio files per drum
 * - Adjusting pitch (semitones)
 * - Fine tuning (cents)
 * - Resetting pitch to default
 */

export class SampleControlsView {
  constructor(container, drumNames) {
    this.container = container;
    this.drumNames = drumNames;
    this.eventHandlers = new Map();
    this.controls = new Map(); // Store control elements per drum
  }

  /**
   * Render all drum sample controls
   */
  render() {
    this.container.innerHTML = '';
    this.container.className = 'sample-controls-container';
    
    this.drumNames.forEach(drumName => {
      const drumControl = this.createDrumControl(drumName);
      this.container.appendChild(drumControl);
      this.controls.set(drumName, drumControl);
    });
  }

  /**
   * Create control panel for a single drum
   * @param {string} drumName - Drum identifier
   * @returns {HTMLElement}
   */
  createDrumControl(drumName) {
    const control = document.createElement('div');
    control.className = 'drum-sample-control';
    control.dataset.drum = drumName;
    
    control.innerHTML = `
      <div class="drum-control-header">
        <span class="drum-label">${drumName}</span>
        <button class="load-sample-btn" data-drum="${drumName}" title="Load custom sample">
          📁 Load
        </button>
      </div>
      
      <input type="file" 
             id="file-${drumName}" 
             accept="audio/wav,audio/mp3,audio/ogg,audio/mpeg"
             class="sample-file-input"
             style="display: none;">
      
      <div class="pitch-controls">
        <div class="pitch-control">
          <label for="pitch-${drumName}">
            <span>Pitch</span>
            <output class="pitch-output">0 st</output>
          </label>
          <input type="range" 
                 id="pitch-${drumName}"
                 class="pitch-slider"
                 data-drum="${drumName}"
                 min="-12" max="12" value="0" step="1">
        </div>
        
        <div class="detune-control">
          <label for="detune-${drumName}">
            <span>Fine</span>
            <output class="detune-output">0 ¢</output>
          </label>
          <input type="range"
                 id="detune-${drumName}"
                 class="detune-slider" 
                 data-drum="${drumName}"
                 min="-100" max="100" value="0" step="1">
        </div>
        
        <button class="reset-pitch-btn" 
                data-drum="${drumName}" 
                title="Reset pitch and fine tune">
          ↻
        </button>
      </div>
    `;

    // Bind events
    this.bindControlEvents(control, drumName);
    
    return control;
  }

  /**
   * Bind events for a drum control
   * @param {HTMLElement} control - Control element
   * @param {string} drumName - Drum identifier
   */
  bindControlEvents(control, drumName) {
    // Load sample button
    const loadBtn = control.querySelector('.load-sample-btn');
    const fileInput = control.querySelector(`#file-${drumName}`);
    
    loadBtn.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        this.emit('sampleLoad', { drumName, file });
        // Show feedback
        loadBtn.textContent = `✓ ${file.name.substring(0, 10)}...`;
        loadBtn.classList.add('loaded');
      }
    });

    // Pitch slider
    const pitchSlider = control.querySelector('.pitch-slider');
    const pitchOutput = control.querySelector('.pitch-output');
    
    pitchSlider.addEventListener('input', (e) => {
      const semitones = parseInt(e.target.value);
      pitchOutput.textContent = `${semitones > 0 ? '+' : ''}${semitones} st`;
      this.emit('pitchChange', { drumName, semitones });
    });

    // Detune slider
    const detuneSlider = control.querySelector('.detune-slider');
    const detuneOutput = control.querySelector('.detune-output');
    
    detuneSlider.addEventListener('input', (e) => {
      const cents = parseInt(e.target.value);
      detuneOutput.textContent = `${cents > 0 ? '+' : ''}${cents} ¢`;
      this.emit('detuneChange', { drumName, cents });
    });

    // Reset button
    const resetBtn = control.querySelector('.reset-pitch-btn');
    resetBtn.addEventListener('click', () => {
      pitchSlider.value = 0;
      pitchOutput.textContent = '0 st';
      detuneSlider.value = 0;
      detuneOutput.textContent = '0 ¢';
      this.emit('pitchReset', { drumName });
    });
  }

  /**
   * Update pitch display from model
   * @param {string} drumName - Drum identifier
   * @param {number} semitones - Pitch in semitones
   */
  setPitch(drumName, semitones) {
    const control = this.controls.get(drumName);
    if (!control) return;

    const slider = control.querySelector('.pitch-slider');
    const output = control.querySelector('.pitch-output');
    
    if (slider) {
      slider.value = semitones;
      output.textContent = `${semitones > 0 ? '+' : ''}${semitones} st`;
    }
  }

  /**
   * Update detune display from model
   * @param {string} drumName - Drum identifier
   * @param {number} cents - Detune in cents
   */
  setDetune(drumName, cents) {
    const control = this.controls.get(drumName);
    if (!control) return;

    const slider = control.querySelector('.detune-slider');
    const output = control.querySelector('.detune-output');
    
    if (slider) {
      slider.value = cents;
      output.textContent = `${cents > 0 ? '+' : ''}${cents} ¢`;
    }
  }

  /**
   * Show loading status for a drum
   * @param {string} drumName - Drum identifier
   * @param {string} filename - Loaded file name
   */
  showLoadedSample(drumName, filename) {
    const control = this.controls.get(drumName);
    if (!control) return;

    const loadBtn = control.querySelector('.load-sample-btn');
    const shortName = filename.length > 15 
      ? filename.substring(0, 12) + '...' 
      : filename;
    
    loadBtn.textContent = `✓ ${shortName}`;
    loadBtn.classList.add('loaded');
    loadBtn.title = `Loaded: ${filename}`;
  }

  /**
   * Show error for a drum
   * @param {string} drumName - Drum identifier
   * @param {string} message - Error message
   */
  showError(drumName, message) {
    const control = this.controls.get(drumName);
    if (!control) return;

    const loadBtn = control.querySelector('.load-sample-btn');
    loadBtn.textContent = '✗ Error';
    loadBtn.classList.add('error');
    loadBtn.title = message;
    
    setTimeout(() => {
      loadBtn.textContent = '📁 Load';
      loadBtn.classList.remove('error');
      loadBtn.title = 'Load custom sample';
    }, 3000);
  }

  /**
   * Clear all controls
   */
  clear() {
    this.container.innerHTML = '';
    this.controls.clear();
  }

  /**
   * Register event handler
   * @param {string} event - Event name
   * @param {Function} handler - Handler function
   */
  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(handler);
  }

  /**
   * Emit event
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    const handlers = this.eventHandlers.get(event) || [];
    handlers.forEach(handler => handler(data));
  }

  /**
   * Remove event handler
   * @param {string} event - Event name
   * @param {Function} handler - Handler to remove
   */
  off(event, handler) {
    const handlers = this.eventHandlers.get(event) || [];
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }
}
