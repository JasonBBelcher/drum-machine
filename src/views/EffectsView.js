/**
 * EffectsView - UI for master bus effects controls
 * 
 * Provides controls for filter effects and master volume
 */

import { getFilterPresetNames, getFilterPreset } from '../data/effect-presets.js';

export class EffectsView {
  constructor(container, masterBus) {
    this.container = container;
    this.masterBus = masterBus;
    this.filterEnabled = false;
    
    this.render();
    this.attachEventListeners();
  }

  render() {
    const presetNames = getFilterPresetNames();
    
    this.container.innerHTML = `
      <div class="effects-panel">
        <div class="effects-header">
          <h3>Master Effects</h3>
          <label class="effects-toggle">
            <input type="checkbox" id="effects-enabled" />
            <span>Enable Filter</span>
          </label>
        </div>

        <div class="effects-controls" id="effects-controls">
          <!-- Filter Type -->
          <div class="effects-control-group">
            <label for="filter-type">Filter Type</label>
            <select id="filter-type" class="effects-select">
              <option value="lowpass">Lowpass</option>
              <option value="highpass">Highpass</option>
              <option value="bandpass">Bandpass</option>
              <option value="notch">Notch</option>
            </select>
          </div>

          <!-- Frequency Slider -->
          <div class="effects-control-group">
            <label for="filter-frequency">
              Frequency: <span id="frequency-value">1000</span> Hz
            </label>
            <input 
              type="range" 
              id="filter-frequency" 
              class="effects-slider"
              min="20" 
              max="20000" 
              value="1000" 
              step="10"
            />
          </div>

          <!-- Q/Resonance Slider -->
          <div class="effects-control-group">
            <label for="filter-q">
              Resonance: <span id="q-value">1.0</span>
            </label>
            <input 
              type="range" 
              id="filter-q" 
              class="effects-slider"
              min="0.1" 
              max="20" 
              value="1.0" 
              step="0.1"
            />
          </div>

          <!-- Presets -->
          <div class="effects-control-group">
            <label for="filter-preset">Preset</label>
            <select id="filter-preset" class="effects-select">
              <option value="">-- Select Preset --</option>
              ${presetNames.map(name => `<option value="${name}">${name}</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- Master Volume -->
        <div class="effects-control-group master-volume">
          <label for="master-volume">
            Master Volume: <span id="master-volume-value">100</span>%
          </label>
          <input 
            type="range" 
            id="master-volume" 
            class="effects-slider"
            min="0" 
            max="100" 
            value="100" 
            step="1"
          />
        </div>
      </div>
    `;

    // Disable controls initially
    this.updateControlsState();
  }

  attachEventListeners() {
    // Enable/Disable toggle
    const enabledCheckbox = this.container.querySelector('#effects-enabled');
    enabledCheckbox.addEventListener('change', (e) => {
      this.filterEnabled = e.target.checked;
      this.updateControlsState();
      
      if (this.filterEnabled) {
        this.applyFilter();
      } else {
        this.masterBus.disableFilter();
      }
    });

    // Filter type
    const filterType = this.container.querySelector('#filter-type');
    filterType.addEventListener('change', () => {
      if (this.filterEnabled) {
        this.applyFilter();
      }
    });

    // Frequency slider
    const frequency = this.container.querySelector('#filter-frequency');
    const frequencyValue = this.container.querySelector('#frequency-value');
    frequency.addEventListener('input', (e) => {
      frequencyValue.textContent = e.target.value;
      if (this.filterEnabled) {
        this.masterBus.updateFilter({ frequency: parseFloat(e.target.value) });
      }
    });

    // Q/Resonance slider
    const q = this.container.querySelector('#filter-q');
    const qValue = this.container.querySelector('#q-value');
    q.addEventListener('input', (e) => {
      qValue.textContent = parseFloat(e.target.value).toFixed(1);
      if (this.filterEnabled) {
        this.masterBus.updateFilter({ q: parseFloat(e.target.value) });
      }
    });

    // Preset selector
    const preset = this.container.querySelector('#filter-preset');
    preset.addEventListener('change', (e) => {
      if (e.target.value) {
        this.applyPreset(e.target.value);
      }
    });

    // Master volume
    const volume = this.container.querySelector('#master-volume');
    const volumeValue = this.container.querySelector('#master-volume-value');
    volume.addEventListener('input', (e) => {
      const percent = parseInt(e.target.value);
      volumeValue.textContent = percent;
      this.masterBus.setVolume(percent / 100);
    });
  }

  applyFilter() {
    const type = this.container.querySelector('#filter-type').value;
    const frequency = parseFloat(this.container.querySelector('#filter-frequency').value);
    const q = parseFloat(this.container.querySelector('#filter-q').value);
    
    this.masterBus.enableFilter(type, frequency, q);
  }

  applyPreset(presetName) {
    const preset = getFilterPreset(presetName);
    
    // Update UI controls
    this.container.querySelector('#filter-type').value = preset.type;
    this.container.querySelector('#filter-frequency').value = preset.frequency;
    this.container.querySelector('#frequency-value').textContent = preset.frequency;
    this.container.querySelector('#filter-q').value = preset.q;
    this.container.querySelector('#q-value').textContent = preset.q.toFixed(1);
    
    // Enable filter if not already enabled
    if (!this.filterEnabled) {
      this.filterEnabled = true;
      this.container.querySelector('#effects-enabled').checked = true;
      this.updateControlsState();
    }
    
    // Apply to master bus
    this.masterBus.enableFilter(preset.type, preset.frequency, preset.q);
  }

  updateControlsState() {
    const controls = this.container.querySelector('#effects-controls');
    if (this.filterEnabled) {
      controls.classList.remove('disabled');
    } else {
      controls.classList.add('disabled');
    }
  }
}
