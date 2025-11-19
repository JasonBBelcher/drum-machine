/**
 * SequencerView - Pure UI rendering for the drum sequencer
 * 
 * Handles all DOM manipulation without any business logic.
 * Implements the View in MVC pattern.
 */

export class SequencerView {
  constructor(containerElement) {
    this.container = containerElement;
    this.buttonMap = new Map(); // Maps step+drum to button element
    this.eventHandlers = new Map(); // Event handler registry
  }

  /**
   * Render the entire sequencer UI from a model
   * @param {SequenceModel} model - Sequence model to render
   */
  render(model) {
    this.container.innerHTML = '';
    this.buttonMap.clear();

    const drumNames = model.getDrumNames();

    // Create a row for each drum
    drumNames.forEach((drumName, drumIndex) => {
      const row = this.createRow(drumName, drumIndex);
      
      // Create buttons for each step
      for (let stepIndex = 0; stepIndex < model.length; stepIndex++) {
        const button = this.createStepButton(
          stepIndex,
          drumIndex,
          drumName,
          model.steps[stepIndex].drums[drumName].on
        );
        
        row.appendChild(button);
        
        // Store reference for later updates
        const key = `${stepIndex}-${drumName}`;
        this.buttonMap.set(key, button);
      }

      this.container.appendChild(row);
    });

    // Add quarter beat visual indicators
    this.highlightQuarterBeats(model.length);
  }

  /**
   * Create a row container for a drum track
   * @param {string} drumName - Name of the drum
   * @param {number} drumIndex - Index of the drum track
   * @returns {HTMLElement}
   */
  createRow(drumName, drumIndex) {
    const row = document.createElement('div');
    row.className = `seq-container seq-row${drumIndex}`;
    row.dataset.drum = drumName;
    return row;
  }

  /**
   * Create a step button
   * @param {number} stepIndex - Step number
   * @param {number} drumIndex - Drum track index
   * @param {string} drumName - Drum name
   * @param {boolean} active - Whether the button is active
   * @returns {HTMLElement}
   */
  createStepButton(stepIndex, drumIndex, drumName, active = false) {
    const button = document.createElement('div');
    button.className = `seq-btn col-seq${stepIndex} seq${drumIndex}-${stepIndex}`;
    button.dataset.step = stepIndex;
    button.dataset.drum = drumName;

    if (active) {
      button.classList.add('btn-on');
    }

    // Add click handler
    button.addEventListener('click', () => {
      this.emit('drumToggle', { stepIndex, drumName });
    });

    return button;
  }

  /**
   * Highlight quarter beat positions
   * @param {number} length - Sequence length
   */
  highlightQuarterBeats(length) {
    for (let i = 0; i < length; i += 4) {
      const buttons = this.container.querySelectorAll(`.col-seq${i}`);
      buttons.forEach(btn => btn.classList.add('seq-btn-quarter-beat'));
    }
  }

  /**
   * Update a single drum button state
   * @param {number} stepIndex - Step number
   * @param {string} drumName - Drum name
   * @param {boolean} active - Active state
   */
  updateDrumButton(stepIndex, drumName, active) {
    const key = `${stepIndex}-${drumName}`;
    const button = this.buttonMap.get(key);
    
    if (button) {
      if (active) {
        button.classList.add('btn-on');
      } else {
        button.classList.remove('btn-on');
      }
    }
  }

  /**
   * Highlight current playing step
   * @param {number} stepIndex - Step to highlight
   */
  highlightStep(stepIndex) {
    // Clear previous highlights
    this.clearHighlights();

    // Highlight current step
    const buttons = this.container.querySelectorAll(`.col-seq${stepIndex}`);
    buttons.forEach(btn => btn.classList.add('seq-playhead'));
  }

  /**
   * Clear all step highlights
   */
  clearHighlights() {
    const highlighted = this.container.querySelectorAll('.seq-playhead');
    highlighted.forEach(btn => btn.classList.remove('seq-playhead'));
  }

  /**
   * Clear the entire view
   */
  clear() {
    this.container.innerHTML = '';
    this.buttonMap.clear();
  }

  /**
   * Register an event handler
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
   * Emit an event
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    const handlers = this.eventHandlers.get(event) || [];
    handlers.forEach(handler => handler(data));
  }

  /**
   * Remove an event handler
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

/**
 * ControlsView - UI for transport controls and settings
 */
export class ControlsView {
  constructor(elements) {
    this.playButton = elements.playButton;
    this.resetButton = elements.resetButton;
    this.tempoSlider = elements.tempoSlider;
    this.tempoOutput = elements.tempoOutput;
    this.lengthSlider = elements.lengthSlider;
    this.lengthOutput = elements.lengthOutput;
    this.sequenceSelect = elements.sequenceSelect;
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.playButton.addEventListener('click', () => {
      this.emit('play');
    });

    this.resetButton.addEventListener('mousedown', () => {
      this.resetButton.classList.add('reset-btn-flash-yellow');
    });

    this.resetButton.addEventListener('mouseup', () => {
      this.resetButton.classList.remove('reset-btn-flash-yellow');
      this.emit('reset');
    });

    this.tempoSlider.addEventListener('input', (e) => {
      this.updateTempoDisplay(e.target.value);
      this.emit('tempoChange', { tempo: parseInt(e.target.value) });
    });

    this.lengthSlider.addEventListener('input', (e) => {
      this.updateLengthDisplay(e.target.value);
      this.emit('lengthChange', { length: parseInt(e.target.value) });
    });

    if (this.sequenceSelect) {
      this.sequenceSelect.addEventListener('change', (e) => {
        const patternName = e.target.value;
        if (patternName !== 'keep') {
          this.emit('loadPattern', { name: patternName });
        }
      });
    }
  }

  updateTempoDisplay(tempo) {
    this.tempoOutput.innerText = `${tempo} BPM`;
  }

  updateLengthDisplay(length) {
    this.lengthOutput.innerText = `${length} steps`;
  }

  setPlayButtonState(isPlaying) {
    if (isPlaying) {
      this.playButton.classList.add('play-stop-btn-red');
      this.playButton.textContent = 'stop';
    } else {
      this.playButton.classList.remove('play-stop-btn-red');
      this.playButton.textContent = 'play';
    }
  }

  setTempo(tempo) {
    this.tempoSlider.value = tempo;
    this.updateTempoDisplay(tempo);
  }

  setLength(length) {
    this.lengthSlider.value = length;
    this.updateLengthDisplay(length);
  }

  updateSequenceSelect(patterns) {
    if (!this.sequenceSelect) return;
    
    // Clear existing options except the first one
    this.sequenceSelect.innerHTML = '<option value="keep">--pick a drum pattern</option>';
    
    // Add pattern options
    patterns.forEach(name => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      this.sequenceSelect.appendChild(option);
    });
  }

  // Event emitter pattern
  eventHandlers = new Map();

  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(handler);
  }

  emit(event, data) {
    const handlers = this.eventHandlers.get(event) || [];
    handlers.forEach(handler => handler(data));
  }
}

/**
 * VolumeControlsView - UI for volume sliders
 */
export class VolumeControlsView {
  constructor(sliders, outputContainer) {
    this.sliders = sliders;
    this.outputContainer = outputContainer;
    this.outputs = new Map();
    
    this.setupVolumeControls();
  }

  setupVolumeControls() {
    this.sliders.forEach(slider => {
      // Create output display
      const output = document.createElement('div');
      output.className = 'track-volume-output';
      output.innerText = `${slider.name} v : ${slider.value}`;
      this.outputContainer.appendChild(output);
      this.outputs.set(slider.name, output);

      // Add event listener
      slider.addEventListener('input', (e) => {
        this.updateVolumeDisplay(slider.name, e.target.value);
        this.emit('volumeChange', { 
          drumName: slider.name, 
          volume: parseFloat(e.target.value) 
        });
      });
    });
  }

  updateVolumeDisplay(drumName, volume) {
    const output = this.outputs.get(drumName);
    if (output) {
      output.innerText = `${drumName} v : ${volume}`;
    }
  }

  setVolume(drumName, volume) {
    const slider = Array.from(this.sliders).find(s => s.name === drumName);
    if (slider) {
      slider.value = volume;
      this.updateVolumeDisplay(drumName, volume);
    }
  }

  // Event emitter
  eventHandlers = new Map();

  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(handler);
  }

  emit(event, data) {
    const handlers = this.eventHandlers.get(event) || [];
    handlers.forEach(handler => handler(data));
  }
}
