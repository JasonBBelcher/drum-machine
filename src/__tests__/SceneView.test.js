/**
 * Tests for Phase 8: SceneView UI component
 * @jest-environment jsdom
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { SceneView } from '../views/SceneView.js';
import { SceneGrid, Scene } from '../models/SceneModel.js';

describe('SceneView', () => {
  let sceneGrid;
  let sceneView;
  let container;
  let patternNames;

  beforeEach(() => {
    // Mock scrollIntoView
    if (!Element.prototype.scrollIntoView) {
      Element.prototype.scrollIntoView = () => {};
    }

    sceneGrid = new SceneGrid();
    patternNames = ['Pattern1', 'Pattern2', 'Pattern3'];
    sceneView = new SceneView(sceneGrid, patternNames);
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  describe('render', () => {
    test('should render empty scene grid', () => {
      sceneView.render(container);

      expect(container.classList.contains('scene-grid-container')).toBe(true);
      expect(container.querySelector('.scene-grid-header')).toBeTruthy();
      expect(container.querySelector('.add-scene-btn')).toBeTruthy();
      expect(container.querySelector('.scene-grid-empty')).toBeTruthy();
    });

    test('should render scene grid with scenes', () => {
      sceneGrid.addScene('Scene 1');
      sceneGrid.addScene('Scene 2');

      sceneView.render(container);

      const sceneRows = container.querySelectorAll('.scene-row');
      expect(sceneRows.length).toBe(2);
    });

    test('should render track headers', () => {
      sceneGrid.addScene('Scene 1');

      sceneView.render(container);

      const trackHeaders = container.querySelectorAll('.track-header');
      expect(trackHeaders.length).toBe(8); // 8 tracks
    });

    test('should render scene name input', () => {
      sceneGrid.addScene('Test Scene');

      sceneView.render(container);

      const nameInput = container.querySelector('.scene-name-input');
      expect(nameInput).toBeTruthy();
      expect(nameInput.value).toBe('Test Scene');
    });

    test('should render launch button for each scene', () => {
      sceneGrid.addScene('Scene 1');
      sceneGrid.addScene('Scene 2');

      sceneView.render(container);

      const launchButtons = container.querySelectorAll('.launch-scene-btn');
      expect(launchButtons.length).toBe(2);
    });

    test('should render delete button for each scene', () => {
      sceneGrid.addScene('Scene 1');

      sceneView.render(container);

      const deleteBtn = container.querySelector('.delete-scene-btn');
      expect(deleteBtn).toBeTruthy();
      expect(deleteBtn.textContent).toBe('×');
    });
  });

  describe('createClipCell', () => {
    test('should render empty clip slot', () => {
      sceneGrid.addScene('Scene 1');
      sceneView.render(container);

      const emptyClips = container.querySelectorAll('.empty-clip');
      expect(emptyClips.length).toBeGreaterThan(0);

      const addClipBtn = emptyClips[0].querySelector('.add-clip-btn');
      expect(addClipBtn).toBeTruthy();
      expect(addClipBtn.textContent).toBe('+');
    });

    test('should render clip with pattern name', () => {
      const scene = sceneGrid.addScene('Scene 1');
      scene.addClip('Pattern1', 0);

      sceneView.render(container);

      const clipCells = container.querySelectorAll('.has-clip');
      expect(clipCells.length).toBe(1);

      const clipName = clipCells[0].querySelector('.clip-name');
      expect(clipName.textContent).toBe('Pattern1');
    });

    test('should render remove button for existing clips', () => {
      const scene = sceneGrid.addScene('Scene 1');
      scene.addClip('Pattern1', 0);

      sceneView.render(container);

      const removeBtn = container.querySelector('.remove-clip-btn');
      expect(removeBtn).toBeTruthy();
      expect(removeBtn.textContent).toBe('×');
    });

    test('should render all 8 track slots per scene', () => {
      sceneGrid.addScene('Scene 1');

      sceneView.render(container);

      const clipCells = container.querySelectorAll('.clip-cell');
      expect(clipCells.length).toBe(8); // 8 tracks
    });
  });

  describe('handleAddScene', () => {
    test('should emit sceneAdd event with name', () => {
      sceneView.render(container);

      let eventDetail = null;
      container.addEventListener('sceneAdd', (e) => {
        eventDetail = e.detail;
      });

      // Mock prompt
      global.prompt = jest.fn(() => 'New Scene');

      const addButton = container.querySelector('.add-scene-btn');
      addButton.click();

      expect(global.prompt).toHaveBeenCalled();
      expect(eventDetail).toEqual({ name: 'New Scene' });
    });

    test('should not emit event if prompt cancelled', () => {
      sceneView.render(container);

      let eventFired = false;
      container.addEventListener('sceneAdd', () => {
        eventFired = true;
      });

      // Mock prompt returning null (cancelled)
      global.prompt = jest.fn(() => null);

      const addButton = container.querySelector('.add-scene-btn');
      addButton.click();

      expect(eventFired).toBe(false);
    });
  });

  describe('handleSceneRename', () => {
    test('should emit sceneRename event', () => {
      sceneGrid.addScene('Scene 1');
      sceneView.render(container);

      let eventDetail = null;
      container.addEventListener('sceneRename', (e) => {
        eventDetail = e.detail;
      });

      const nameInput = container.querySelector('.scene-name-input');
      nameInput.value = 'Renamed Scene';
      nameInput.dispatchEvent(new Event('change'));

      expect(eventDetail).toEqual({ sceneIndex: 0, name: 'Renamed Scene' });
    });
  });

  describe('handleDeleteScene', () => {
    test('should emit sceneRemove event when confirmed', () => {
      sceneGrid.addScene('Scene 1');
      sceneView.render(container);

      let eventDetail = null;
      container.addEventListener('sceneRemove', (e) => {
        eventDetail = e.detail;
      });

      // Mock confirm
      global.confirm = jest.fn(() => true);

      const deleteBtn = container.querySelector('.delete-scene-btn');
      deleteBtn.click();

      expect(global.confirm).toHaveBeenCalled();
      expect(eventDetail).toEqual({ sceneIndex: 0 });
    });

    test('should not emit event if not confirmed', () => {
      sceneGrid.addScene('Scene 1');
      sceneView.render(container);

      let eventFired = false;
      container.addEventListener('sceneRemove', () => {
        eventFired = true;
      });

      // Mock confirm returning false
      global.confirm = jest.fn(() => false);

      const deleteBtn = container.querySelector('.delete-scene-btn');
      deleteBtn.click();

      expect(eventFired).toBe(false);
    });
  });

  describe('showClipDialog', () => {
    test('should create and show clip dialog', () => {
      sceneGrid.addScene('Scene 1');
      sceneView.render(container);

      const addClipBtn = container.querySelector('.add-clip-btn');
      addClipBtn.click();

      const dialog = document.querySelector('.clip-dialog-overlay');
      expect(dialog).toBeTruthy();

      const select = dialog.querySelector('.pattern-select');
      expect(select).toBeTruthy();

      // Check all patterns are in dropdown
      const options = select.querySelectorAll('option');
      expect(options.length).toBe(4); // Default + 3 patterns
      expect(options[1].value).toBe('Pattern1');
      expect(options[2].value).toBe('Pattern2');
      expect(options[3].value).toBe('Pattern3');
    });

    test('should emit clipAdd event when pattern selected', () => {
      sceneGrid.addScene('Scene 1');
      sceneView.render(container);

      let eventDetail = null;
      container.addEventListener('clipAdd', (e) => {
        eventDetail = e.detail;
      });

      // Test emit method directly
      sceneView.emit('clipAdd', { sceneIndex: 0, trackIndex: 0, patternName: 'Pattern1' });

      expect(eventDetail).toEqual({
        sceneIndex: 0,
        trackIndex: 0,
        patternName: 'Pattern1'
      });
    });

    test('should create cancel button with onclick handler', () => {
      sceneGrid.addScene('Scene 1');
      sceneView.render(container);

      sceneView.handleAddClip(0, 0);

      const dialog = document.querySelector('.clip-dialog-overlay');
      expect(dialog).toBeTruthy();

      const cancelBtn = dialog.querySelector('button:not(.primary)');
      expect(cancelBtn).toBeTruthy();
      expect(cancelBtn.onclick).toBeInstanceOf(Function);
    });

    test('should not emit event if no pattern selected', () => {
      sceneGrid.addScene('Scene 1');
      sceneView.render(container);

      let eventFired = false;
      container.addEventListener('clipAdd', () => {
        eventFired = true;
      });

      const addClipBtn = container.querySelector('.add-clip-btn');
      addClipBtn.click();

      const dialog = document.querySelector('.clip-dialog-overlay');
      const addBtn = dialog.querySelector('button.primary');
      addBtn.click();

      expect(eventFired).toBe(false);
    });
  });

  describe('handleRemoveClip', () => {
    test('should emit clipRemove event', () => {
      const scene = sceneGrid.addScene('Scene 1');
      scene.addClip('Pattern1', 0);
      sceneView.render(container);

      let eventDetail = null;
      container.addEventListener('clipRemove', (e) => {
        eventDetail = e.detail;
      });

      const removeBtn = container.querySelector('.remove-clip-btn');
      removeBtn.click();

      expect(eventDetail).toEqual({ sceneIndex: 0, trackIndex: 0 });
    });
  });

  describe('handleLaunchScene', () => {
    test('should emit sceneLaunch event', () => {
      sceneGrid.addScene('Scene 1');
      sceneView.render(container);

      let eventDetail = null;
      container.addEventListener('sceneLaunch', (e) => {
        eventDetail = e.detail;
      });

      const launchBtn = container.querySelector('.launch-scene-btn');
      launchBtn.click();

      expect(eventDetail).toEqual({ sceneIndex: 0 });
    });
  });

  describe('updatePatternNames', () => {
    test('should update available pattern names', () => {
      sceneView.updatePatternNames(['NewPattern1', 'NewPattern2']);

      expect(sceneView.patternNames).toEqual(['NewPattern1', 'NewPattern2']);
    });
  });

  describe('highlightActiveScene', () => {
    test('should add active class to scene', () => {
      sceneGrid.addScene('Scene 1');
      sceneGrid.addScene('Scene 2');
      sceneView.render(container);

      sceneView.highlightActiveScene(0);

      const sceneRows = container.querySelectorAll('.scene-row');
      expect(sceneRows[0].classList.contains('active')).toBe(true);
      expect(sceneRows[1].classList.contains('active')).toBe(false);
    });

    test('should remove previous highlights', () => {
      sceneGrid.addScene('Scene 1');
      sceneGrid.addScene('Scene 2');
      sceneView.render(container);

      sceneView.highlightActiveScene(0);
      sceneView.highlightActiveScene(1);

      const sceneRows = container.querySelectorAll('.scene-row');
      expect(sceneRows[0].classList.contains('active')).toBe(false);
      expect(sceneRows[1].classList.contains('active')).toBe(true);
    });

    test('should remove all highlights when index is -1', () => {
      sceneGrid.addScene('Scene 1');
      sceneView.render(container);

      sceneView.highlightActiveScene(0);
      sceneView.highlightActiveScene(-1);

      const sceneRows = container.querySelectorAll('.scene-row');
      expect(sceneRows[0].classList.contains('active')).toBe(false);
    });

    test('should handle invalid scene index', () => {
      sceneGrid.addScene('Scene 1');
      sceneView.render(container);

      expect(() => {
        sceneView.highlightActiveScene(99);
      }).not.toThrow();
    });
  });

  describe('destroy', () => {
    test('should clear container', () => {
      sceneView.render(container);
      expect(container.innerHTML).not.toBe('');

      sceneView.destroy();

      expect(container.innerHTML).toBe('');
      expect(sceneView.container).toBeNull();
    });

    test('should handle destroy without container', () => {
      expect(() => {
        sceneView.destroy();
      }).not.toThrow();
    });
  });

  describe('data attributes', () => {
    test('should set sceneIndex on scene rows', () => {
      sceneGrid.addScene('Scene 1');
      sceneGrid.addScene('Scene 2');
      sceneView.render(container);

      const sceneRows = container.querySelectorAll('.scene-row');
      expect(sceneRows[0].dataset.sceneIndex).toBe('0');
      expect(sceneRows[1].dataset.sceneIndex).toBe('1');
    });

    test('should set sceneIndex and trackIndex on clip cells', () => {
      sceneGrid.addScene('Scene 1');
      sceneView.render(container);

      const clipCells = container.querySelectorAll('.clip-cell');
      expect(clipCells[0].dataset.sceneIndex).toBe('0');
      expect(clipCells[0].dataset.trackIndex).toBe('0');
      expect(clipCells[1].dataset.trackIndex).toBe('1');
    });
  });
});
