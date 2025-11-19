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
    this.delayEnabled = false;
    this.reverbEnabled = false;
    
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
            <input type="checkbox" id="filter-enabled" />
            <span>Enable Filter</span>
          </label>
        </div>

        <div class="effects-controls" id="filter-controls">
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
            <label for="filter-freq">
              Frequency: <span id="filter-freq-value">1000</span> Hz
            </label>
            <input 
              type="range" 
              id="filter-freq" 
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
              Resonance: <span id="filter-q-value">1.0</span>
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

        <!-- Delay Effect -->
        <div class="effects-section">
          <div class="effects-section-header">
            <h4>Delay</h4>
            <label class="effects-toggle">
              <input type="checkbox" id="delay-enabled" />
              <span>Enable</span>
            </label>
          </div>
          <div class="effects-section-controls" id="delay-controls">
            <div class="effects-control-group">
              <label for="delay-time">
                Time: <span id="delay-time-value">300</span> ms
              </label>
              <input 
                type="range" 
                id="delay-time" 
                class="effects-slider"
                min="10" 
                max="2000" 
                value="300" 
                step="10"
              />
            </div>
            <div class="effects-control-group">
              <label for="delay-feedback">
                Feedback: <span id="delay-feedback-value">40</span>%
              </label>
              <input 
                type="range" 
                id="delay-feedback" 
                class="effects-slider"
                min="0" 
                max="90" 
                value="40" 
                step="1"
              />
            </div>
            <div class="effects-control-group">
              <label for="delay-wet">
                Mix: <span id="delay-wet-value">50</span>%
              </label>
              <input 
                type="range" 
                id="delay-wet" 
                class="effects-slider"
                min="0" 
                max="100" 
                value="50" 
                step="1"
              />
            </div>
          </div>
        </div>

        <!-- Reverb Effect -->
        <div class="effects-section">
          <div class="effects-section-header">
            <h4>Reverb</h4>
            <label class="effects-toggle">
              <input type="checkbox" id="reverb-enabled" />
              <span>Enable</span>
            </label>
          </div>
          <div class="effects-section-controls" id="reverb-controls">
            <div class="effects-control-group">
              <label for="reverb-duration">
                Room Size: <span id="reverb-duration-value">2.0</span> s
              </label>
              <input 
                type="range" 
                id="reverb-duration" 
                class="effects-slider"
                min="0.5" 
                max="5.0" 
                value="2.0" 
                step="0.1"
              />
            </div>
            <div class="effects-control-group">
              <label for="reverb-wet">
                Mix: <span id="reverb-wet-value">30</span>%
              </label>
              <input 
                type="range" 
                id="reverb-wet" 
                class="effects-slider"
                min="0" 
                max="100" 
                value="30" 
                step="1"
              />
            </div>
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
    this.updateDelayControlsState();
    this.updateReverbControlsState();
  }

  attachEventListeners() {
    // Filter enable
    const filterEnabled = this.container.querySelector('#filter-enabled');
    filterEnabled.addEventListener('change', (e) => {
      this.filterEnabled = e.target.checked;
      this.updateControlsState();

      if (this.filterEnabled) {
        this.handleFilterEnable();
      } else {
        this.handleFilterDisable();
      }
    });

    // Filter type
    const filterType = this.container.querySelector('#filter-type');
    filterType.addEventListener('change', (e) => {
      this.filterType = e.target.value;
      this.handleFilterChange();
    });

    // Filter frequency
    const filterFreq = this.container.querySelector('#filter-freq');
    const filterFreqValue = this.container.querySelector('#filter-freq-value');
    filterFreq.addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      filterFreqValue.textContent = value;
      this.filterFrequency = value;
      this.handleFilterChange();
    });

    // Filter Q
    const filterQ = this.container.querySelector('#filter-q');
    const filterQValue = this.container.querySelector('#filter-q-value');
    filterQ.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      filterQValue.textContent = value.toFixed(1);
      this.filterQ = value;
      this.handleFilterChange();
    });

    // Filter preset
    const filterPreset = this.container.querySelector('#filter-preset');
    filterPreset.addEventListener('change', (e) => {
      if (e.target.value) {
        this.applyPreset(e.target.value);
      }
    });

    // Delay enable
    const delayEnabled = this.container.querySelector('#delay-enabled');
    delayEnabled.addEventListener('change', (e) => {
      this.delayEnabled = e.target.checked;
      this.updateDelayControlsState();

      if (this.delayEnabled) {
        this.handleDelayEnable();
      } else {
        this.handleDelayDisable();
      }
    });

    // Delay time
    const delayTime = this.container.querySelector('#delay-time');
    const delayTimeValue = this.container.querySelector('#delay-time-value');
    delayTime.addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      delayTimeValue.textContent = value;
      this.handleDelayChange();
    });

    // Delay feedback
    const delayFeedback = this.container.querySelector('#delay-feedback');
    const delayFeedbackValue = this.container.querySelector('#delay-feedback-value');
    delayFeedback.addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      delayFeedbackValue.textContent = value;
      this.handleDelayChange();
    });

    // Delay wet
    const delayWet = this.container.querySelector('#delay-wet');
    const delayWetValue = this.container.querySelector('#delay-wet-value');
    delayWet.addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      delayWetValue.textContent = value;
      this.handleDelayChange();
    });

    // Reverb enable
    const reverbEnabled = this.container.querySelector('#reverb-enabled');
    reverbEnabled.addEventListener('change', (e) => {
      this.reverbEnabled = e.target.checked;
      this.updateReverbControlsState();

      if (this.reverbEnabled) {
        this.handleReverbEnable();
      } else {
        this.handleReverbDisable();
      }
    });

    // Reverb duration
    const reverbDuration = this.container.querySelector('#reverb-duration');
    const reverbDurationValue = this.container.querySelector('#reverb-duration-value');
    reverbDuration.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      reverbDurationValue.textContent = value.toFixed(1);
      this.handleReverbChange();
    });

    // Reverb wet
    const reverbWet = this.container.querySelector('#reverb-wet');
    const reverbWetValue = this.container.querySelector('#reverb-wet-value');
    reverbWet.addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      reverbWetValue.textContent = value;
      this.handleReverbChange();
    });

    // Master volume
    const masterVolume = this.container.querySelector('#master-volume');
    const masterVolumeValue = this.container.querySelector('#master-volume-value');
    masterVolume.addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      masterVolumeValue.textContent = value;
      this.handleVolumeChange(value / 100);
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
    this.container.querySelector('#filter-freq').value = preset.frequency;
    this.container.querySelector('#filter-freq-value').textContent = preset.frequency;
    this.container.querySelector('#filter-q').value = preset.q;
    this.container.querySelector('#filter-q-value').textContent = preset.q.toFixed(1);
    
    // Enable filter if not already enabled
    if (!this.filterEnabled) {
      this.filterEnabled = true;
      this.container.querySelector('#filter-enabled').checked = true;
      this.updateControlsState();
    }
    
    // Apply to master bus
    this.masterBus.enableFilter(preset.type, preset.frequency, preset.q);
  }

  updateControlsState() {
    const filterControls = this.container.querySelector('#filter-controls');
    filterControls.style.opacity = this.filterEnabled ? '1' : '0.5';
    filterControls.style.pointerEvents = this.filterEnabled ? 'auto' : 'none';
  }

  updateDelayControlsState() {
    const delayControls = this.container.querySelector('#delay-controls');
    delayControls.style.opacity = this.delayEnabled ? '1' : '0.5';
    delayControls.style.pointerEvents = this.delayEnabled ? 'auto' : 'none';
  }

  updateReverbControlsState() {
    const reverbControls = this.container.querySelector('#reverb-controls');
    reverbControls.style.opacity = this.reverbEnabled ? '1' : '0.5';
    reverbControls.style.pointerEvents = this.reverbEnabled ? 'auto' : 'none';
  }

  handleFilterEnable() {
    const type = this.container.querySelector('#filter-type').value;
    const frequency = parseFloat(this.container.querySelector('#filter-freq').value);
    const q = parseFloat(this.container.querySelector('#filter-q').value);
    this.masterBus.enableFilter(type, frequency, q);
  }

  handleFilterDisable() {
    this.masterBus.disableFilter();
  }

  handleFilterChange() {
    if (this.filterEnabled) {
      const type = this.container.querySelector('#filter-type').value;
      const frequency = parseFloat(this.container.querySelector('#filter-freq').value);
      const q = parseFloat(this.container.querySelector('#filter-q').value);
      this.masterBus.updateFilter({ type, frequency, q });
    }
  }

  handleDelayEnable() {
    const time = parseFloat(this.container.querySelector('#delay-time').value) / 1000; // Convert ms to seconds
    const feedback = parseFloat(this.container.querySelector('#delay-feedback').value) / 100; // Convert percent to 0-1
    const wet = parseFloat(this.container.querySelector('#delay-wet').value) / 100; // Convert percent to 0-1
    this.masterBus.enableDelay(time, feedback, wet);
  }

  handleDelayDisable() {
    this.masterBus.disableDelay();
  }

  handleDelayChange() {
    if (this.delayEnabled) {
      const time = parseFloat(this.container.querySelector('#delay-time').value) / 1000;
      const feedback = parseFloat(this.container.querySelector('#delay-feedback').value) / 100;
      const wet = parseFloat(this.container.querySelector('#delay-wet').value) / 100;
      this.masterBus.updateDelay({ time, feedback, wet });
    }
  }

  handleReverbEnable() {
    const duration = parseFloat(this.container.querySelector('#reverb-duration').value);
    const wet = parseFloat(this.container.querySelector('#reverb-wet').value) / 100;
    this.masterBus.enableReverb(duration, wet);
  }

  handleReverbDisable() {
    this.masterBus.disableReverb();
  }

  handleReverbChange() {
    if (this.reverbEnabled) {
      const duration = parseFloat(this.container.querySelector('#reverb-duration').value);
      const wet = parseFloat(this.container.querySelector('#reverb-wet').value) / 100;
      this.masterBus.updateReverb({ duration, wet });
    }
  }

  handleVolumeChange(volume) {
    this.masterBus.setVolume(volume);
  }
}
