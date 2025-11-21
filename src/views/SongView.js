/**
 * SongView - UI for song mode (pattern chaining)
 * 
 * Handles all DOM manipulation for:
 * - Pattern chain list display
 * - Add/remove/reorder patterns
 * - Repeat count controls
 * - Song playback controls
 * - Song save/load/delete
 */

export class SongView {
  constructor(containerElement) {
    this.container = containerElement;
    this.eventHandlers = new Map();
    this.elements = {}; // Store DOM element references
  }

  /**
   * Initial render of the song view UI
   */
  render() {
    this.container.innerHTML = '';

    // Create main layout
    const layout = this.createLayout();
    this.container.appendChild(layout);

    // Store element references
    this.cacheElements();
  }

  /**
   * Create the main layout structure
   */
  createLayout() {
    const wrapper = document.createElement('div');
    wrapper.className = 'song-view-wrapper';

    wrapper.innerHTML = `
      <div class="song-controls-section">
        <div class="song-management">
          <h3>Song Management</h3>
          <div class="song-input-group">
            <input type="text" class="song-name-input" placeholder="New song name..." />
            <button class="btn-song-new">New</button>
            <button class="btn-song-save">Save</button>
          </div>
          <div class="song-load-group">
            <select class="song-select">
              <option value="">-- Load a song --</option>
            </select>
            <button class="btn-song-load">Load</button>
            <button class="btn-song-delete">Delete</button>
          </div>
        </div>

        <div class="song-playback">
          <h3>Playback</h3>
          <div class="playback-controls">
            <button class="btn-song-play">Play Song</button>
            <button class="btn-song-stop">Stop</button>
            <button class="btn-song-pause">Pause</button>
            <button class="btn-song-resume">Resume</button>
          </div>
          <div class="playback-navigation">
            <button class="btn-song-skip-prev">◀ Previous</button>
            <button class="btn-song-skip-next">Next ▶</button>
          </div>
          <div class="playback-mode">
            <label>
              <input type="checkbox" class="song-loop-checkbox" />
              Loop Song
            </label>
          </div>
          <div class="song-status">
            <div class="current-pattern-display">Current: <span class="current-pattern-name">None</span></div>
            <div class="song-progress-display">Step: <span class="song-progress">0 / 0</span></div>
          </div>
        </div>
      </div>

      <div class="pattern-chain-section">
        <h3>Pattern Chain</h3>
        <div class="pattern-add-controls">
          <select class="pattern-select">
            <option value="">-- Select pattern --</option>
          </select>
          <input type="number" class="pattern-repeat-input" min="1" max="99" value="1" placeholder="Repeats" />
          <button class="btn-pattern-add">Add Pattern</button>
        </div>
        <div class="pattern-chain-list">
          <p class="empty-chain-message">No patterns added yet. Add patterns above to build your song.</p>
        </div>
      </div>
    `;

    return wrapper;
  }

  /**
   * Cache frequently accessed DOM elements
   */
  cacheElements() {
    // Song management
    this.elements.songNameInput = this.container.querySelector('.song-name-input');
    this.elements.btnNew = this.container.querySelector('.btn-song-new');
    this.elements.btnSave = this.container.querySelector('.btn-song-save');
    this.elements.songSelect = this.container.querySelector('.song-select');
    this.elements.btnLoad = this.container.querySelector('.btn-song-load');
    this.elements.btnDelete = this.container.querySelector('.btn-song-delete');

    // Playback
    this.elements.btnPlay = this.container.querySelector('.btn-song-play');
    this.elements.btnStop = this.container.querySelector('.btn-song-stop');
    this.elements.btnPause = this.container.querySelector('.btn-song-pause');
    this.elements.btnResume = this.container.querySelector('.btn-song-resume');
    this.elements.btnSkipPrev = this.container.querySelector('.btn-song-skip-prev');
    this.elements.btnSkipNext = this.container.querySelector('.btn-song-skip-next');
    this.elements.loopCheckbox = this.container.querySelector('.song-loop-checkbox');
    this.elements.currentPatternName = this.container.querySelector('.current-pattern-name');
    this.elements.songProgress = this.container.querySelector('.song-progress');

    // Pattern chain
    this.elements.patternSelect = this.container.querySelector('.pattern-select');
    this.elements.patternRepeatInput = this.container.querySelector('.pattern-repeat-input');
    this.elements.btnAddPattern = this.container.querySelector('.btn-pattern-add');
    this.elements.chainList = this.container.querySelector('.pattern-chain-list');
    this.elements.emptyMessage = this.container.querySelector('.empty-chain-message');

    // Bind event listeners
    this.bindEvents();
  }

  /**
   * Bind all event listeners
   */
  bindEvents() {
    // Song management
    this.elements.btnNew.addEventListener('click', () => this.emit('songNew'));
    this.elements.btnSave.addEventListener('click', () => {
      const name = this.elements.songNameInput.value.trim();
      if (name) this.emit('songSave', { name });
    });
    this.elements.btnLoad.addEventListener('click', () => {
      const name = this.elements.songSelect.value;
      if (name) this.emit('songLoad', { name });
    });
    this.elements.btnDelete.addEventListener('click', () => {
      const name = this.elements.songSelect.value;
      if (name) this.emit('songDelete', { name });
    });

    // Playback
    this.elements.btnPlay.addEventListener('click', () => this.emit('songPlay'));
    this.elements.btnStop.addEventListener('click', () => this.emit('songStop'));
    this.elements.btnPause.addEventListener('click', () => this.emit('songPause'));
    this.elements.btnResume.addEventListener('click', () => this.emit('songResume'));
    this.elements.btnSkipPrev.addEventListener('click', () => this.emit('songSkipPrev'));
    this.elements.btnSkipNext.addEventListener('click', () => this.emit('songSkipNext'));
    this.elements.loopCheckbox.addEventListener('change', (e) => {
      this.emit('songLoopToggle', { loop: e.target.checked });
    });

    // Pattern chain
    this.elements.btnAddPattern.addEventListener('click', () => {
      const patternName = this.elements.patternSelect.value;
      const repeats = parseInt(this.elements.patternRepeatInput.value) || 1;
      if (patternName) this.emit('patternAdd', { patternName, repeats });
    });
  }

  /**
   * Update the available patterns dropdown
   * @param {string[]} patternNames - Array of pattern names
   */
  updatePatternList(patternNames) {
    const select = this.elements.patternSelect;
    select.innerHTML = '<option value="">-- Select pattern --</option>';
    
    patternNames.forEach(name => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      select.appendChild(option);
    });
  }

  /**
   * Update the saved songs dropdown
   * @param {string[]} songNames - Array of song names
   */
  updateSongList(songNames) {
    const select = this.elements.songSelect;
    select.innerHTML = '<option value="">-- Load a song --</option>';
    
    songNames.forEach(name => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      select.appendChild(option);
    });
  }

  /**
   * Render the pattern chain list from song model
   * @param {Array} chain - Array of ChainStep objects from SongModel
   */
  renderChain(chain) {
    const list = this.elements.chainList;
    
    if (!chain || chain.length === 0) {
      list.innerHTML = '<p class="empty-chain-message">No patterns added yet. Add patterns above to build your song.</p>';
      return;
    }

    list.innerHTML = '';

    chain.forEach((step, index) => {
      const item = this.createChainItem(step, index);
      list.appendChild(item);
    });
  }

  /**
   * Create a single chain item element
   * @param {ChainStep} step - Chain step data
   * @param {number} index - Position in chain
   */
  createChainItem(step, index) {
    const item = document.createElement('div');
    item.className = 'chain-item';
    item.dataset.index = index;

    item.innerHTML = `
      <div class="chain-item-header">
        <span class="chain-item-number">#${index + 1}</span>
        <span class="chain-item-pattern">${step.patternName}</span>
        <div class="chain-item-controls">
          <button class="btn-chain-up" data-index="${index}" ${index === 0 ? 'disabled' : ''}>▲</button>
          <button class="btn-chain-down" data-index="${index}">▼</button>
          <button class="btn-chain-remove" data-index="${index}">✕</button>
        </div>
      </div>
      <div class="chain-item-details">
        <label>
          Repeats: 
          <input type="number" class="chain-repeat-input" 
                 data-index="${index}" 
                 min="1" max="99" 
                 value="${step.repeats}" />
        </label>
        <span class="chain-progress">${step.currentRepeat + 1} / ${step.repeats}</span>
      </div>
    `;

    // Bind item-specific events
    const btnUp = item.querySelector('.btn-chain-up');
    const btnDown = item.querySelector('.btn-chain-down');
    const btnRemove = item.querySelector('.btn-chain-remove');
    const repeatInput = item.querySelector('.chain-repeat-input');

    btnUp.addEventListener('click', () => this.emit('patternMoveUp', { index }));
    btnDown.addEventListener('click', () => this.emit('patternMoveDown', { index }));
    btnRemove.addEventListener('click', () => this.emit('patternRemove', { index }));
    repeatInput.addEventListener('change', (e) => {
      const repeats = parseInt(e.target.value) || 1;
      this.emit('patternRepeatChange', { index, repeats });
    });

    return item;
  }

  /**
   * Highlight the currently playing pattern in the chain
   * @param {number} stepIndex - Index of current step
   */
  highlightCurrentPattern(stepIndex) {
    // Remove previous highlights
    const items = this.elements.chainList.querySelectorAll('.chain-item');
    items.forEach(item => item.classList.remove('chain-item-active'));

    // Highlight current
    if (stepIndex >= 0) {
      const item = this.elements.chainList.querySelector(`[data-index="${stepIndex}"]`);
      if (item) {
        item.classList.add('chain-item-active');
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }

  /**
   * Update the current pattern display
   * @param {string} patternName - Name of current pattern
   */
  setCurrentPattern(patternName) {
    this.elements.currentPatternName.textContent = patternName || 'None';
  }

  /**
   * Update the song progress display
   * @param {number} current - Current step index
   * @param {number} total - Total steps
   */
  setSongProgress(current, total) {
    this.elements.songProgress.textContent = `${current} / ${total}`;
  }

  /**
   * Set song name in input
   * @param {string} name - Song name
   */
  setSongName(name) {
    this.elements.songNameInput.value = name || '';
  }

  /**
   * Get song name from input
   * @returns {string}
   */
  getSongName() {
    return this.elements.songNameInput.value.trim();
  }

  /**
   * Set loop mode checkbox
   * @param {boolean} loop - Loop enabled
   */
  setLoopMode(loop) {
    this.elements.loopCheckbox.checked = loop;
  }

  /**
   * Enable/disable playback controls
   * @param {boolean} enabled
   */
  setPlaybackEnabled(enabled) {
    this.elements.btnPlay.disabled = !enabled;
    this.elements.btnStop.disabled = !enabled;
    this.elements.btnPause.disabled = !enabled;
    this.elements.btnResume.disabled = !enabled;
    this.elements.btnSkipPrev.disabled = !enabled;
    this.elements.btnSkipNext.disabled = !enabled;
  }

  /**
   * Update button states based on playback state
   * @param {string} state - 'stopped', 'playing', 'paused'
   */
  setPlaybackState(state) {
    // Reset all
    this.elements.btnPlay.disabled = false;
    this.elements.btnStop.disabled = false;
    this.elements.btnPause.disabled = false;
    this.elements.btnResume.disabled = false;

    switch (state) {
      case 'stopped':
        this.elements.btnStop.disabled = true;
        this.elements.btnPause.disabled = true;
        this.elements.btnResume.disabled = true;
        break;
      case 'playing':
        this.elements.btnPlay.disabled = true;
        this.elements.btnResume.disabled = true;
        break;
      case 'paused':
        this.elements.btnPlay.disabled = true;
        this.elements.btnPause.disabled = true;
        break;
    }
  }

  /**
   * Show error message
   * @param {string} message
   */
  showError(message) {
    // Create temporary error display
    const error = document.createElement('div');
    error.className = 'song-error-message';
    error.textContent = message;
    this.container.insertBefore(error, this.container.firstChild);

    // Auto-remove after 3 seconds
    setTimeout(() => error.remove(), 3000);
  }

  /**
   * Show success message
   * @param {string} message
   */
  showSuccess(message) {
    // Create temporary success display
    const success = document.createElement('div');
    success.className = 'song-success-message';
    success.textContent = message;
    this.container.insertBefore(success, this.container.firstChild);

    // Auto-remove after 2 seconds
    setTimeout(() => success.remove(), 2000);
  }

  /**
   * Clear all highlights and reset view
   */
  clear() {
    this.highlightCurrentPattern(-1);
    this.setCurrentPattern('None');
    this.setSongProgress(0, 0);
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
   * Emit an event to all registered handlers
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  /**
   * Remove all event handlers for an event
   * @param {string} event - Event name
   */
  off(event) {
    this.eventHandlers.delete(event);
  }

  /**
   * Destroy the view and clean up
   */
  destroy() {
    this.eventHandlers.clear();
    this.container.innerHTML = '';
    this.elements = {};
  }
}
