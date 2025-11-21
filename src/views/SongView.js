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
        <div class="song-overall-progress">
          <div class="overall-progress-label">Overall Progress:</div>
          <div class="overall-progress-bar">
            <div class="overall-progress-fill" style="width: 0%"></div>
          </div>
        </div>
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
        <div class="pattern-preview-tooltip" style="display: none;"></div>
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
    
    // Phase 6.3: Keyboard shortcuts
    this.keyboardHandler = (e) => this.handleKeyboardShortcut(e);
    document.addEventListener('keydown', this.keyboardHandler);
  }
  
  /**
   * Handle keyboard shortcuts
   * @param {KeyboardEvent} e - Keyboard event
   */
  handleKeyboardShortcut(e) {
    // Only handle shortcuts when song view is visible
    if (this.container.style.display === 'none') return;
    
    // Don't interfere with text inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    switch(e.key) {
      case ' ': // Space - play/pause toggle
        e.preventDefault();
        this.emit('keyboardTogglePlayPause');
        break;
      case 'ArrowLeft': // Left arrow - previous pattern
        e.preventDefault();
        this.emit('songSkipPrev');
        break;
      case 'ArrowRight': // Right arrow - next pattern
        e.preventDefault();
        this.emit('songSkipNext');
        break;
      case 'Escape': // Escape - stop
        e.preventDefault();
        this.emit('songStop');
        break;
      case 'l': // L - toggle loop
      case 'L':
        e.preventDefault();
        this.elements.loopCheckbox.checked = !this.elements.loopCheckbox.checked;
        this.emit('songLoopToggle', { loop: this.elements.loopCheckbox.checked });
        break;
      case 's': // S - save (with Ctrl/Cmd)
      case 'S':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const name = this.elements.songNameInput.value.trim();
          if (name) this.emit('songSave', { name });
        }
        break;
    }
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
    
    // Phase 6.3: Enable drag-and-drop
    item.draggable = true;
    
    // Phase 6.3: Calculate progress percentage
    const progressPercent = step.repeats > 0 
      ? Math.round(((step.currentRepeat + 1) / step.repeats) * 100) 
      : 0;

    item.innerHTML = `
      <div class="chain-item-header">
        <span class="chain-item-drag-handle" title="Drag to reorder">⋮⋮</span>
        <span class="chain-item-number">#${index + 1}</span>
        <span class="chain-item-pattern" title="Hover for pattern details">${step.patternName}</span>
        <div class="chain-item-controls">
          <button class="btn-chain-up" data-index="${index}" ${index === 0 ? 'disabled' : ''} title="Move up">▲</button>
          <button class="btn-chain-down" data-index="${index}" title="Move down">▼</button>
          <button class="btn-chain-jump" data-index="${index}" title="Add jump marker">🔀</button>
          <button class="btn-chain-remove" data-index="${index}" title="Remove pattern">✕</button>
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
      <div class="chain-item-progress-bar">
        <div class="chain-progress-fill" style="width: ${progressPercent}%"></div>
      </div>
      <div class="chain-item-jumps"></div>
    `;

    // Bind item-specific events
    const btnUp = item.querySelector('.btn-chain-up');
    const btnDown = item.querySelector('.btn-chain-down');
    const btnJump = item.querySelector('.btn-chain-jump');
    const btnRemove = item.querySelector('.btn-chain-remove');
    const repeatInput = item.querySelector('.chain-repeat-input');
    const patternNameEl = item.querySelector('.chain-item-pattern');

    btnUp.addEventListener('click', () => this.emit('patternMoveUp', { index }));
    btnDown.addEventListener('click', () => this.emit('patternMoveDown', { index }));
    btnJump.addEventListener('click', () => this.showJumpDialog(index));
    btnRemove.addEventListener('click', () => this.emit('patternRemove', { index }));
    repeatInput.addEventListener('change', (e) => {
      const repeats = parseInt(e.target.value) || 1;
      this.emit('patternRepeatChange', { index, repeats });
    });
    
    // Phase 6.3: Pattern preview on hover
    patternNameEl.addEventListener('mouseenter', () => {
      this.emit('patternHover', { patternName: step.patternName, element: patternNameEl });
    });
    patternNameEl.addEventListener('mouseleave', () => {
      this.emit('patternHoverEnd');
    });

    // Phase 6.3: Drag-and-drop handlers
    this.attachDragHandlers(item, index);

    return item;
  }
  
  /**
   * Attach drag-and-drop event handlers to a chain item
   * @param {HTMLElement} item - Chain item element
   * @param {number} index - Item index
   */
  attachDragHandlers(item, index) {
    item.addEventListener('dragstart', (e) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', index.toString());
      item.classList.add('dragging');
      this.draggedIndex = index;
    });

    item.addEventListener('dragend', (e) => {
      item.classList.remove('dragging');
      this.draggedIndex = null;
      // Remove all drag-over classes
      document.querySelectorAll('.drag-over').forEach(el => {
        el.classList.remove('drag-over');
      });
    });

    item.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      
      if (this.draggedIndex !== null && this.draggedIndex !== index) {
        item.classList.add('drag-over');
      }
    });

    item.addEventListener('dragleave', (e) => {
      item.classList.remove('drag-over');
    });

    item.addEventListener('drop', (e) => {
      e.preventDefault();
      item.classList.remove('drag-over');
      
      if (this.draggedIndex !== null && this.draggedIndex !== index) {
        this.emit('patternDragDrop', { 
          fromIndex: this.draggedIndex, 
          toIndex: index 
        });
      }
    });
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
   * Phase 6.3: Update progress bar for a specific chain item
   * @param {number} stepIndex - Index of the step
   * @param {Object} step - Step object with currentRepeat and repeats
   */
  updateChainItemProgress(stepIndex, step) {
    if (!step) return;
    
    const item = this.elements.chainList.querySelector(`[data-index="${stepIndex}"]`);
    if (!item) return;
    
    const progressFill = item.querySelector('.chain-progress-fill');
    if (!progressFill) return;
    
    // Calculate progress percentage
    const progressPercent = ((step.currentRepeat + 1) / step.repeats) * 100;
    progressFill.style.width = `${progressPercent}%`;
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
   * Update overall song progress bar
   * @param {number} completedRepeats - Number of completed pattern repeats
   * @param {number} totalRepeats - Total pattern repeats in song
   */
  setOverallProgress(completedRepeats, totalRepeats) {
    const progressBar = this.container.querySelector('.overall-progress-fill');
    if (progressBar && totalRepeats > 0) {
      const percent = Math.round((completedRepeats / totalRepeats) * 100);
      progressBar.style.width = `${percent}%`;
      progressBar.textContent = `${percent}%`;
    }
  }
  
  /**
   * Show pattern preview tooltip
   * @param {Object} patternInfo - Pattern information
   * @param {HTMLElement} targetElement - Element to position tooltip near
   */
  showPatternPreview(patternInfo, targetElement) {
    const tooltip = this.container.querySelector('.pattern-preview-tooltip');
    if (!tooltip) return;
    
    tooltip.innerHTML = `
      <div class="preview-title">${patternInfo.name}</div>
      <div class="preview-detail">Length: ${patternInfo.length || 16} steps</div>
      <div class="preview-detail">Tempo: ${patternInfo.tempo || 120} BPM</div>
      ${patternInfo.activeDrums ? `<div class="preview-detail">Active drums: ${patternInfo.activeDrums}</div>` : ''}
    `;
    
    // Position tooltip near the target element
    const rect = targetElement.getBoundingClientRect();
    const containerRect = this.container.getBoundingClientRect();
    tooltip.style.display = 'block';
    tooltip.style.left = `${rect.left - containerRect.left}px`;
    tooltip.style.top = `${rect.bottom - containerRect.top + 5}px`;
  }
  
  /**
   * Hide pattern preview tooltip
   */
  hidePatternPreview() {
    const tooltip = this.container.querySelector('.pattern-preview-tooltip');
    if (tooltip) {
      tooltip.style.display = 'none';
    }
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
   * Phase 7: Show jump creation dialog
   * @param {number} fromIndex - Source step index
   */
  showJumpDialog(fromIndex) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'jump-dialog-overlay';
    
    modal.innerHTML = `
      <div class="jump-dialog">
        <h3>Add Jump Marker</h3>
        <p>From pattern #${fromIndex + 1}</p>
        
        <label>
          Jump to pattern:
          <select class="jump-target-select" id="jumpTargetSelect">
            <option value="">-- Select target --</option>
          </select>
        </label>
        
        <label>
          Label (optional):
          <input type="text" class="jump-label-input" id="jumpLabelInput" placeholder="e.g., Verse, Chorus" />
        </label>
        
        <label>
          Condition:
          <select class="jump-condition-select" id="jumpConditionSelect">
            <option value="always">Always</option>
            <option value="on-first">On first repeat</option>
            <option value="on-last">On last repeat</option>
          </select>
        </label>
        
        <div class="jump-dialog-buttons">
          <button class="btn-jump-cancel">Cancel</button>
          <button class="btn-jump-create">Create Jump</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Populate target dropdown (all patterns except source)
    const targetSelect = modal.querySelector('#jumpTargetSelect');
    const chainItems = this.elements.chainList.querySelectorAll('.chain-item');
    chainItems.forEach((item, index) => {
      if (index !== fromIndex) {
        const patternName = item.querySelector('.chain-item-pattern').textContent;
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `#${index + 1} - ${patternName}`;
        targetSelect.appendChild(option);
      }
    });
    
    // Event handlers
    modal.querySelector('.btn-jump-cancel').addEventListener('click', () => {
      modal.remove();
    });
    
    modal.querySelector('.btn-jump-create').addEventListener('click', () => {
      const toIndex = parseInt(targetSelect.value);
      const label = modal.querySelector('#jumpLabelInput').value.trim();
      const condition = modal.querySelector('#jumpConditionSelect').value;
      
      if (isNaN(toIndex)) {
        alert('Please select a target pattern');
        return;
      }
      
      this.emit('jumpAdd', { fromIndex, toIndex, label, condition });
      modal.remove();
    });
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  /**
   * Phase 7: Render jump markers for all chain items
   * @param {Jump[]} jumps - Array of jump objects
   */
  renderJumps(jumps) {
    // Clear existing jump markers
    this.elements.chainList.querySelectorAll('.chain-item-jumps').forEach(el => {
      el.innerHTML = '';
    });
    
    // Remove existing jump arrows
    this.elements.chainList.querySelectorAll('.jump-arrow').forEach(el => {
      el.remove();
    });
    
    if (!jumps || jumps.length === 0) return;
    
    // Render each jump
    jumps.forEach((jump, jumpIndex) => {
      this.renderJump(jump, jumpIndex);
    });
  }

  /**
   * Phase 7: Render a single jump marker
   * @param {Jump} jump - Jump object
   * @param {number} jumpIndex - Jump index
   */
  renderJump(jump, jumpIndex) {
    const fromItem = this.elements.chainList.querySelector(`[data-index="${jump.fromIndex}"]`);
    const toItem = this.elements.chainList.querySelector(`[data-index="${jump.toIndex}"]`);
    
    if (!fromItem || !toItem) return;
    
    // Add jump badge to source item
    const jumpsContainer = fromItem.querySelector('.chain-item-jumps');
    const jumpBadge = document.createElement('div');
    jumpBadge.className = 'jump-badge';
    jumpBadge.dataset.jumpIndex = jumpIndex;
    jumpBadge.innerHTML = `
      <span class="jump-info">
        🔀 → #${jump.toIndex + 1}
        ${jump.label ? `<span class="jump-label">${jump.label}</span>` : ''}
        <span class="jump-condition">${jump.getConditionText()}</span>
      </span>
      <button class="btn-jump-remove" data-jump-index="${jumpIndex}" title="Remove jump">✕</button>
    `;
    
    jumpsContainer.appendChild(jumpBadge);
    
    // Event handler for remove button
    jumpBadge.querySelector('.btn-jump-remove').addEventListener('click', () => {
      this.emit('jumpRemove', { jumpIndex });
    });
    
    // Add visual arrow (simplified, just a marker on target)
    const targetIndicator = document.createElement('div');
    targetIndicator.className = 'jump-target-indicator';
    targetIndicator.textContent = `← Jump from #${jump.fromIndex + 1}`;
    toItem.insertBefore(targetIndicator, toItem.firstChild);
  }

  /**
   * Phase 7: Highlight active jump during playback
   * @param {Jump|null} jump - Currently executing jump, or null
   */
  highlightJump(jump) {
    // Clear previous highlights
    this.elements.chainList.querySelectorAll('.jump-badge').forEach(badge => {
      badge.classList.remove('jump-active');
    });
    
    if (!jump) return;
    
    // Highlight the jump badge
    const badge = this.elements.chainList.querySelector(`[data-jump-index]`);
    if (badge) {
      badge.classList.add('jump-active');
      setTimeout(() => badge.classList.remove('jump-active'), 1000);
    }
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
    // Remove keyboard event listener
    if (this.keyboardHandler) {
      document.removeEventListener('keydown', this.keyboardHandler);
      this.keyboardHandler = null;
    }
    
    this.eventHandlers.clear();
    this.container.innerHTML = '';
    this.elements = {};
    this.draggedIndex = null;
  }
}
