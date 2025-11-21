/**
 * SceneView - UI for scene-based arrangement
 * 
 * Displays a grid of scenes and clips, with buttons to launch scenes
 * and manage clip assignments. Part of Phase 8: Clip/Scene Grid.
 */

export class SceneView {
  constructor(sceneGrid, patternNames = []) {
    this.sceneGrid = sceneGrid;
    this.patternNames = patternNames;
    this.container = null;
    this.selectedSceneIndex = -1;
    this.selectedTrackIndex = -1;
  }

  /**
   * Render the scene grid UI
   * @param {HTMLElement} container - Container element
   */
  render(container) {
    this.container = container;
    this.container.innerHTML = '';
    this.container.className = 'scene-grid-container';

    // Header with controls
    const header = this.createHeader();
    this.container.appendChild(header);

    // Scene grid
    const gridContainer = this.createGrid();
    this.container.appendChild(gridContainer);

    return this.container;
  }

  /**
   * Create header with controls
   * @returns {HTMLElement}
   */
  createHeader() {
    const header = document.createElement('div');
    header.className = 'scene-grid-header';

    const title = document.createElement('h3');
    title.textContent = 'Scenes';
    header.appendChild(title);

    const addButton = document.createElement('button');
    addButton.className = 'add-scene-btn';
    addButton.textContent = '+ Add Scene';
    addButton.onclick = () => this.handleAddScene();
    header.appendChild(addButton);

    return header;
  }

  /**
   * Create the scene grid
   * @returns {HTMLElement}
   */
  createGrid() {
    const gridContainer = document.createElement('div');
    gridContainer.className = 'scene-grid';

    const scenes = this.sceneGrid.scenes;

    if (scenes.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'scene-grid-empty';
      emptyMessage.textContent = 'No scenes yet. Click "+ Add Scene" to create one.';
      gridContainer.appendChild(emptyMessage);
      return gridContainer;
    }

    // Create track headers
    const trackHeaders = this.createTrackHeaders();
    gridContainer.appendChild(trackHeaders);

    // Create scene rows
    scenes.forEach((scene, sceneIndex) => {
      const sceneRow = this.createSceneRow(scene, sceneIndex);
      gridContainer.appendChild(sceneRow);
    });

    return gridContainer;
  }

  /**
   * Create track headers (columns)
   * @returns {HTMLElement}
   */
  createTrackHeaders() {
    const headerRow = document.createElement('div');
    headerRow.className = 'scene-grid-header-row';

    // Scene name column
    const nameHeader = document.createElement('div');
    nameHeader.className = 'scene-name-header';
    nameHeader.textContent = 'Scene';
    headerRow.appendChild(nameHeader);

    // Track columns
    for (let i = 0; i < this.sceneGrid.maxTracks; i++) {
      const trackHeader = document.createElement('div');
      trackHeader.className = 'track-header';
      trackHeader.textContent = `Track ${i + 1}`;
      headerRow.appendChild(trackHeader);
    }

    // Launch button column
    const launchHeader = document.createElement('div');
    launchHeader.className = 'launch-header';
    launchHeader.textContent = 'Launch';
    headerRow.appendChild(launchHeader);

    return headerRow;
  }

  /**
   * Create a scene row
   * @param {Scene} scene - The scene to render
   * @param {number} sceneIndex - Scene index
   * @returns {HTMLElement}
   */
  createSceneRow(scene, sceneIndex) {
    const row = document.createElement('div');
    row.className = 'scene-row';
    row.dataset.sceneIndex = sceneIndex;

    // Scene name
    const nameCell = document.createElement('div');
    nameCell.className = 'scene-name-cell';
    
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = scene.name;
    nameInput.className = 'scene-name-input';
    nameInput.onchange = (e) => this.handleSceneRename(sceneIndex, e.target.value);
    nameCell.appendChild(nameInput);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-scene-btn';
    deleteBtn.textContent = '×';
    deleteBtn.title = 'Delete scene';
    deleteBtn.onclick = () => this.handleDeleteScene(sceneIndex);
    nameCell.appendChild(deleteBtn);

    row.appendChild(nameCell);

    // Clip slots
    for (let trackIndex = 0; trackIndex < this.sceneGrid.maxTracks; trackIndex++) {
      const clipCell = this.createClipCell(scene, sceneIndex, trackIndex);
      row.appendChild(clipCell);
    }

    // Launch button
    const launchCell = document.createElement('div');
    launchCell.className = 'launch-cell';
    
    const launchBtn = document.createElement('button');
    launchBtn.className = 'launch-scene-btn';
    launchBtn.textContent = '▶';
    launchBtn.title = 'Launch scene';
    launchBtn.onclick = () => this.handleLaunchScene(sceneIndex);
    launchCell.appendChild(launchBtn);

    row.appendChild(launchCell);

    return row;
  }

  /**
   * Create a clip cell
   * @param {Scene} scene - The scene
   * @param {number} sceneIndex - Scene index
   * @param {number} trackIndex - Track index
   * @returns {HTMLElement}
   */
  createClipCell(scene, sceneIndex, trackIndex) {
    const cell = document.createElement('div');
    cell.className = 'clip-cell';
    cell.dataset.sceneIndex = sceneIndex;
    cell.dataset.trackIndex = trackIndex;

    const clip = scene.getClipAtTrack(trackIndex);

    if (clip) {
      // Show existing clip
      const clipName = document.createElement('div');
      clipName.className = 'clip-name';
      clipName.textContent = clip.patternName;
      cell.appendChild(clipName);

      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-clip-btn';
      removeBtn.textContent = '×';
      removeBtn.onclick = () => this.handleRemoveClip(sceneIndex, trackIndex);
      cell.appendChild(removeBtn);

      cell.classList.add('has-clip');
    } else {
      // Empty slot - show add button
      const addBtn = document.createElement('button');
      addBtn.className = 'add-clip-btn';
      addBtn.textContent = '+';
      addBtn.onclick = () => this.handleAddClip(sceneIndex, trackIndex);
      cell.appendChild(addBtn);

      cell.classList.add('empty-clip');
    }

    return cell;
  }

  /**
   * Handle add scene button click
   */
  handleAddScene() {
    const sceneName = prompt('Enter scene name:', `Scene ${this.sceneGrid.scenes.length + 1}`);
    if (sceneName) {
      this.emit('sceneAdd', { name: sceneName });
    }
  }

  /**
   * Handle scene rename
   * @param {number} sceneIndex - Scene index
   * @param {string} newName - New scene name
   */
  handleSceneRename(sceneIndex, newName) {
    this.emit('sceneRename', { sceneIndex, name: newName });
  }

  /**
   * Handle delete scene
   * @param {number} sceneIndex - Scene index
   */
  handleDeleteScene(sceneIndex) {
    if (confirm('Delete this scene?')) {
      this.emit('sceneRemove', { sceneIndex });
    }
  }

  /**
   * Handle add clip to scene
   * @param {number} sceneIndex - Scene index
   * @param {number} trackIndex - Track index
   */
  handleAddClip(sceneIndex, trackIndex) {
    this.showClipDialog(sceneIndex, trackIndex);
  }

  /**
   * Show dialog to select pattern for clip
   * @param {number} sceneIndex - Scene index
   * @param {number} trackIndex - Track index
   */
  showClipDialog(sceneIndex, trackIndex) {
    const dialog = document.createElement('div');
    dialog.className = 'clip-dialog-overlay';

    const modal = document.createElement('div');
    modal.className = 'clip-dialog';

    const title = document.createElement('h4');
    title.textContent = 'Select Pattern';
    modal.appendChild(title);

    // Pattern selector
    const select = document.createElement('select');
    select.className = 'pattern-select';
    
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '-- Select Pattern --';
    select.appendChild(defaultOption);

    this.patternNames.forEach(name => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      select.appendChild(option);
    });

    modal.appendChild(select);

    // Buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'clip-dialog-buttons';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.onclick = () => {
      if (dialog.parentNode) {
        dialog.parentNode.removeChild(dialog);
      }
    };
    buttonContainer.appendChild(cancelBtn);

    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add';
    addBtn.className = 'primary';
    addBtn.onclick = () => {
      const patternName = select.value;
      if (patternName) {
        this.emit('clipAdd', { sceneIndex, trackIndex, patternName });
        if (dialog.parentNode) {
          dialog.parentNode.removeChild(dialog);
        }
      }
    };
    buttonContainer.appendChild(addBtn);

    modal.appendChild(buttonContainer);
    dialog.appendChild(modal);
    document.body.appendChild(dialog);

    select.focus();
  }

  /**
   * Handle remove clip from scene
   * @param {number} sceneIndex - Scene index
   * @param {number} trackIndex - Track index
   */
  handleRemoveClip(sceneIndex, trackIndex) {
    this.emit('clipRemove', { sceneIndex, trackIndex });
  }

  /**
   * Handle launch scene
   * @param {number} sceneIndex - Scene index
   */
  handleLaunchScene(sceneIndex) {
    this.emit('sceneLaunch', { sceneIndex });
  }

  /**
   * Update pattern names available for clips
   * @param {Array<string>} patternNames - Available pattern names
   */
  updatePatternNames(patternNames) {
    this.patternNames = patternNames;
  }

  /**
   * Highlight active scene
   * @param {number} sceneIndex - Scene index to highlight
   */
  highlightActiveScene(sceneIndex) {
    if (!this.container) return;

    // Remove previous highlights
    const previousActive = this.container.querySelectorAll('.scene-row.active');
    previousActive.forEach(row => row.classList.remove('active'));

    // Add highlight to current scene
    if (sceneIndex >= 0) {
      const sceneRow = this.container.querySelector(`[data-scene-index="${sceneIndex}"]`);
      if (sceneRow) {
        sceneRow.classList.add('active');
      }
    }
  }

  /**
   * Emit custom event
   * @param {string} eventName - Event name
   * @param {Object} detail - Event detail
   */
  emit(eventName, detail) {
    if (this.container) {
      this.container.dispatchEvent(new CustomEvent(eventName, { detail, bubbles: true }));
    }
  }

  /**
   * Destroy the view
   */
  destroy() {
    if (this.container) {
      this.container.innerHTML = '';
    }
    this.container = null;
  }
}
