/**
 * DrumEffectsView - UI for per-drum effects controls
 * 
 * Provides collapsible effects panels for each drum with filter, delay, and reverb controls.
 * Uses event-driven architecture - emits events for controller to handle.
 */

export class DrumEffectsView {
  constructor(container, drumPlayer, drumNames) {
    this.container = container;
    this.drumPlayer = drumPlayer; // Keep for reading state only
    this.drumNames = drumNames;
    this.expandedDrums = new Set(); // Track which drums have expanded effects panels
    this.eventListeners = new Map(); // Store event handlers
    
    this.render();
    this.attachEventListeners();
  }

  /**
   * Register event listener for drum effect changes
   * @param {string} eventName - Event name (e.g., 'drumFilterChange')
   * @param {function} callback - Handler function
   */
  on(eventName, callback) {
    if (!this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, []);
    }
    this.eventListeners.get(eventName).push(callback);
  }

  /**
   * Emit event to registered listeners
   * @param {string} eventName - Event name
   * @param {object} data - Event data
   */
  emit(eventName, data) {
    const listeners = this.eventListeners.get(eventName);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  render() {
    this.container.innerHTML = `
      <div class="drum-effects-container">
        <div class="drum-effects-header">
          <h3>Per-Track Effects</h3>
        </div>
        <div class="drum-effects-list">
          ${this.drumNames.map(drumName => this.renderDrumPanel(drumName)).join('')}
        </div>
      </div>
    `;
  }

  renderDrumPanel(drumName) {
    const isExpanded = this.expandedDrums.has(drumName);
    const hasEffects = this.drumPlayer.hasDrumEffects(drumName);
    
    return `
      <div class="drum-effect-panel" data-drum="${drumName}">
        <div class="drum-effect-header">
          <span class="drum-name">${drumName.toUpperCase()}</span>
          ${hasEffects ? '<span class="fx-indicator">●</span>' : ''}
          <button class="drum-fx-toggle" data-drum="${drumName}">
            ${isExpanded ? '▼' : '▶'} FX
          </button>
        </div>
        
        ${isExpanded ? this.renderDrumEffects(drumName) : ''}
      </div>
    `;
  }

  renderDrumEffects(drumName) {
    const effectStates = this.drumPlayer.getDrumEffectStates(drumName) || {
      filter: null,
      delay: null,
      reverb: null
    };

    return `
      <div class="drum-effects-content" data-drum="${drumName}">
        <!-- Filter Section -->
        <div class="drum-effect-section">
          <div class="drum-effect-section-header">
            <h4>Filter</h4>
            <label class="drum-effect-toggle">
              <input type="checkbox" 
                     class="drum-filter-enabled" 
                     data-drum="${drumName}"
                     ${effectStates.filter?.enabled ? 'checked' : ''} />
              <span>Enable</span>
            </label>
          </div>
          <div class="drum-effect-controls ${effectStates.filter?.enabled ? '' : 'disabled'}">
            <div class="drum-control-group">
              <label>Type</label>
              <select class="drum-filter-type" data-drum="${drumName}">
                <option value="lowpass" ${effectStates.filter?.type === 'lowpass' ? 'selected' : ''}>Lowpass</option>
                <option value="highpass" ${effectStates.filter?.type === 'highpass' ? 'selected' : ''}>Highpass</option>
                <option value="bandpass" ${effectStates.filter?.type === 'bandpass' ? 'selected' : ''}>Bandpass</option>
                <option value="notch" ${effectStates.filter?.type === 'notch' ? 'selected' : ''}>Notch</option>
              </select>
            </div>
            <div class="drum-control-group">
              <label>
                Frequency: <span class="drum-filter-freq-value" data-drum="${drumName}">${effectStates.filter?.frequency || 1000}</span> Hz
              </label>
              <input type="range" 
                     class="drum-filter-freq" 
                     data-drum="${drumName}"
                     min="20" 
                     max="20000" 
                     value="${effectStates.filter?.frequency || 1000}" 
                     step="10" />
            </div>
            <div class="drum-control-group">
              <label>
                Q: <span class="drum-filter-q-value" data-drum="${drumName}">${effectStates.filter?.q || 1.0}</span>
              </label>
              <input type="range" 
                     class="drum-filter-q" 
                     data-drum="${drumName}"
                     min="0.1" 
                     max="20" 
                     value="${effectStates.filter?.q || 1.0}" 
                     step="0.1" />
            </div>
          </div>
        </div>

        <!-- Delay Section -->
        <div class="drum-effect-section">
          <div class="drum-effect-section-header">
            <h4>Delay</h4>
            <label class="drum-effect-toggle">
              <input type="checkbox" 
                     class="drum-delay-enabled" 
                     data-drum="${drumName}"
                     ${effectStates.delay?.enabled ? 'checked' : ''} />
              <span>Enable</span>
            </label>
          </div>
          <div class="drum-effect-controls ${effectStates.delay?.enabled ? '' : 'disabled'}">
            <div class="drum-control-group">
              <label>
                Time: <span class="drum-delay-time-value" data-drum="${drumName}">${effectStates.delay ? Math.round(effectStates.delay.time * 1000) : 300}</span> ms
              </label>
              <input type="range" 
                     class="drum-delay-time" 
                     data-drum="${drumName}"
                     min="10" 
                     max="2000" 
                     value="${effectStates.delay ? Math.round(effectStates.delay.time * 1000) : 300}" 
                     step="10" />
            </div>
            <div class="drum-control-group">
              <label>
                Feedback: <span class="drum-delay-feedback-value" data-drum="${drumName}">${effectStates.delay ? Math.round(effectStates.delay.feedback * 100) : 40}</span>%
              </label>
              <input type="range" 
                     class="drum-delay-feedback" 
                     data-drum="${drumName}"
                     min="0" 
                     max="90" 
                     value="${effectStates.delay ? Math.round(effectStates.delay.feedback * 100) : 40}" 
                     step="1" />
            </div>
            <div class="drum-control-group">
              <label>
                Mix: <span class="drum-delay-wet-value" data-drum="${drumName}">${effectStates.delay ? Math.round(effectStates.delay.wet * 100) : 50}</span>%
              </label>
              <input type="range" 
                     class="drum-delay-wet" 
                     data-drum="${drumName}"
                     min="0" 
                     max="100" 
                     value="${effectStates.delay ? Math.round(effectStates.delay.wet * 100) : 50}" 
                     step="1" />
            </div>
          </div>
        </div>

        <!-- Reverb Section -->
        <div class="drum-effect-section">
          <div class="drum-effect-section-header">
            <h4>Reverb</h4>
            <label class="drum-effect-toggle">
              <input type="checkbox" 
                     class="drum-reverb-enabled" 
                     data-drum="${drumName}"
                     ${effectStates.reverb?.enabled ? 'checked' : ''} />
              <span>Enable</span>
            </label>
          </div>
          <div class="drum-effect-controls ${effectStates.reverb?.enabled ? '' : 'disabled'}">
            <div class="drum-control-group">
              <label>
                Room Size: <span class="drum-reverb-duration-value" data-drum="${drumName}">${effectStates.reverb?.duration || 2.0}</span> s
              </label>
              <input type="range" 
                     class="drum-reverb-duration" 
                     data-drum="${drumName}"
                     min="0.5" 
                     max="5.0" 
                     value="${effectStates.reverb?.duration || 2.0}" 
                     step="0.1" />
            </div>
            <div class="drum-control-group">
              <label>
                Mix: <span class="drum-reverb-wet-value" data-drum="${drumName}">${effectStates.reverb ? Math.round(effectStates.reverb.wet * 100) : 30}</span>%
              </label>
              <input type="range" 
                     class="drum-reverb-wet" 
                     data-drum="${drumName}"
                     min="0" 
                     max="100" 
                     value="${effectStates.reverb ? Math.round(effectStates.reverb.wet * 100) : 30}" 
                     step="1" />
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    // Expand/collapse toggle
    this.container.addEventListener('click', (e) => {
      if (e.target.classList.contains('drum-fx-toggle')) {
        const drumName = e.target.dataset.drum;
        this.toggleDrumPanel(drumName);
      }
    });

    // Filter enable/disable
    this.container.addEventListener('change', (e) => {
      if (e.target.classList.contains('drum-filter-enabled')) {
        const drumName = e.target.dataset.drum;
        this.handleFilterToggle(drumName, e.target.checked);
      }
    });

    // Filter controls
    this.container.addEventListener('change', (e) => {
      if (e.target.classList.contains('drum-filter-type')) {
        const drumName = e.target.dataset.drum;
        this.handleFilterChange(drumName);
      }
    });

    this.container.addEventListener('input', (e) => {
      if (e.target.classList.contains('drum-filter-freq')) {
        const drumName = e.target.dataset.drum;
        const value = parseInt(e.target.value);
        const valueSpan = this.container.querySelector(`.drum-filter-freq-value[data-drum="${drumName}"]`);
        if (valueSpan) valueSpan.textContent = value;
        this.handleFilterChange(drumName);
      }
      if (e.target.classList.contains('drum-filter-q')) {
        const drumName = e.target.dataset.drum;
        const value = parseFloat(e.target.value);
        const valueSpan = this.container.querySelector(`.drum-filter-q-value[data-drum="${drumName}"]`);
        if (valueSpan) valueSpan.textContent = value.toFixed(1);
        this.handleFilterChange(drumName);
      }
    });

    // Delay enable/disable
    this.container.addEventListener('change', (e) => {
      if (e.target.classList.contains('drum-delay-enabled')) {
        const drumName = e.target.dataset.drum;
        this.handleDelayToggle(drumName, e.target.checked);
      }
    });

    // Delay controls
    this.container.addEventListener('input', (e) => {
      if (e.target.classList.contains('drum-delay-time')) {
        const drumName = e.target.dataset.drum;
        const value = parseInt(e.target.value);
        const valueSpan = this.container.querySelector(`.drum-delay-time-value[data-drum="${drumName}"]`);
        if (valueSpan) valueSpan.textContent = value;
        this.handleDelayChange(drumName);
      }
      if (e.target.classList.contains('drum-delay-feedback')) {
        const drumName = e.target.dataset.drum;
        const value = parseInt(e.target.value);
        const valueSpan = this.container.querySelector(`.drum-delay-feedback-value[data-drum="${drumName}"]`);
        if (valueSpan) valueSpan.textContent = value;
        this.handleDelayChange(drumName);
      }
      if (e.target.classList.contains('drum-delay-wet')) {
        const drumName = e.target.dataset.drum;
        const value = parseInt(e.target.value);
        const valueSpan = this.container.querySelector(`.drum-delay-wet-value[data-drum="${drumName}"]`);
        if (valueSpan) valueSpan.textContent = value;
        this.handleDelayChange(drumName);
      }
    });

    // Reverb enable/disable
    this.container.addEventListener('change', (e) => {
      if (e.target.classList.contains('drum-reverb-enabled')) {
        const drumName = e.target.dataset.drum;
        this.handleReverbToggle(drumName, e.target.checked);
      }
    });

    // Reverb controls
    this.container.addEventListener('input', (e) => {
      if (e.target.classList.contains('drum-reverb-duration')) {
        const drumName = e.target.dataset.drum;
        const value = parseFloat(e.target.value);
        const valueSpan = this.container.querySelector(`.drum-reverb-duration-value[data-drum="${drumName}"]`);
        if (valueSpan) valueSpan.textContent = value.toFixed(1);
        this.handleReverbChange(drumName);
      }
      if (e.target.classList.contains('drum-reverb-wet')) {
        const drumName = e.target.dataset.drum;
        const value = parseInt(e.target.value);
        const valueSpan = this.container.querySelector(`.drum-reverb-wet-value[data-drum="${drumName}"]`);
        if (valueSpan) valueSpan.textContent = value;
        this.handleReverbChange(drumName);
      }
    });
  }

  toggleDrumPanel(drumName) {
    if (this.expandedDrums.has(drumName)) {
      this.expandedDrums.delete(drumName);
    } else {
      this.expandedDrums.add(drumName);
    }
    
    // Re-render the specific drum panel
    const panel = this.container.querySelector(`.drum-effect-panel[data-drum="${drumName}"]`);
    if (panel) {
      panel.outerHTML = this.renderDrumPanel(drumName);
    }
  }

  handleFilterToggle(drumName, enabled) {
    const panel = this.container.querySelector(`.drum-effects-content[data-drum="${drumName}"]`);
    const controls = panel.querySelector('.drum-effect-section:first-child .drum-effect-controls');
    
    if (enabled) {
      controls.classList.remove('disabled');
      this.handleFilterChange(drumName);
    } else {
      controls.classList.add('disabled');
      this.emit('drumFilterDisable', { drumName });
    }
    
    this.updateFxIndicator(drumName);
  }

  handleFilterChange(drumName) {
    const type = this.container.querySelector(`.drum-filter-type[data-drum="${drumName}"]`).value;
    const frequency = parseFloat(this.container.querySelector(`.drum-filter-freq[data-drum="${drumName}"]`).value);
    const q = parseFloat(this.container.querySelector(`.drum-filter-q[data-drum="${drumName}"]`).value);
    
    const enabled = this.container.querySelector(`.drum-filter-enabled[data-drum="${drumName}"]`).checked;
    if (enabled) {
      this.emit('drumFilterChange', { drumName, type, frequency, q });
    }
  }

  handleDelayToggle(drumName, enabled) {
    const panel = this.container.querySelector(`.drum-effects-content[data-drum="${drumName}"]`);
    const controls = panel.querySelectorAll('.drum-effect-section')[1].querySelector('.drum-effect-controls');
    
    if (enabled) {
      controls.classList.remove('disabled');
      this.handleDelayChange(drumName);
    } else {
      controls.classList.add('disabled');
      this.emit('drumDelayDisable', { drumName });
    }
    
    this.updateFxIndicator(drumName);
  }

  handleDelayChange(drumName) {
    const time = parseFloat(this.container.querySelector(`.drum-delay-time[data-drum="${drumName}"]`).value) / 1000;
    const feedback = parseFloat(this.container.querySelector(`.drum-delay-feedback[data-drum="${drumName}"]`).value) / 100;
    const wet = parseFloat(this.container.querySelector(`.drum-delay-wet[data-drum="${drumName}"]`).value) / 100;
    
    const enabled = this.container.querySelector(`.drum-delay-enabled[data-drum="${drumName}"]`).checked;
    if (enabled) {
      this.emit('drumDelayChange', { drumName, time, feedback, wet });
    }
  }

  handleReverbToggle(drumName, enabled) {
    const panel = this.container.querySelector(`.drum-effects-content[data-drum="${drumName}"]`);
    const controls = panel.querySelectorAll('.drum-effect-section')[2].querySelector('.drum-effect-controls');
    
    if (enabled) {
      controls.classList.remove('disabled');
      this.handleReverbChange(drumName);
    } else {
      controls.classList.add('disabled');
      this.emit('drumReverbDisable', { drumName });
    }
    
    this.updateFxIndicator(drumName);
  }

  handleReverbChange(drumName) {
    const duration = parseFloat(this.container.querySelector(`.drum-reverb-duration[data-drum="${drumName}"]`).value);
    const wet = parseFloat(this.container.querySelector(`.drum-reverb-wet[data-drum="${drumName}"]`).value) / 100;
    
    const enabled = this.container.querySelector(`.drum-reverb-enabled[data-drum="${drumName}"]`).checked;
    if (enabled) {
      this.emit('drumReverbChange', { drumName, duration, wet });
    }
  }

  updateFxIndicator(drumName) {
    const hasEffects = this.drumPlayer.hasDrumEffects(drumName);
    const header = this.container.querySelector(`.drum-effect-panel[data-drum="${drumName}"] .drum-effect-header`);
    
    let indicator = header.querySelector('.fx-indicator');
    if (hasEffects && !indicator) {
      const drumNameSpan = header.querySelector('.drum-name');
      drumNameSpan.insertAdjacentHTML('afterend', '<span class="fx-indicator">●</span>');
    } else if (!hasEffects && indicator) {
      indicator.remove();
    }
  }
}
