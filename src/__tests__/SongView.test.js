/**
 * @jest-environment jsdom
 */

/**
 * Unit tests for SongView
 * Tests rendering, user interactions, and event handling
 */

import { SongView } from '../views/SongView.js';

describe('SongView', () => {
  let container;
  let songView;

  beforeEach(() => {
    // Create a container element
    container = document.createElement('div');
    document.body.appendChild(container);
    
    songView = new SongView(container);
  });

  afterEach(() => {
    if (songView) {
      songView.destroy();
    }
    document.body.removeChild(container);
  });

  describe('Initialization', () => {
    test('creates a SongView instance', () => {
      expect(songView).toBeInstanceOf(SongView);
      expect(songView.container).toBe(container);
    });

    test('initializes with empty event handlers map', () => {
      expect(songView.eventHandlers).toBeInstanceOf(Map);
      expect(songView.eventHandlers.size).toBe(0);
    });

    test('initializes with empty elements object', () => {
      expect(songView.elements).toEqual({});
    });
  });

  describe('render()', () => {
    test('renders the main layout', () => {
      songView.render();
      
      expect(container.querySelector('.song-view-wrapper')).toBeTruthy();
      expect(container.querySelector('.song-controls-section')).toBeTruthy();
      expect(container.querySelector('.pattern-chain-section')).toBeTruthy();
    });

    test('renders song management controls', () => {
      songView.render();
      
      expect(container.querySelector('.song-name-input')).toBeTruthy();
      expect(container.querySelector('.btn-song-new')).toBeTruthy();
      expect(container.querySelector('.btn-song-save')).toBeTruthy();
      expect(container.querySelector('.song-select')).toBeTruthy();
      expect(container.querySelector('.btn-song-load')).toBeTruthy();
      expect(container.querySelector('.btn-song-delete')).toBeTruthy();
    });

    test('renders playback controls', () => {
      songView.render();
      
      expect(container.querySelector('.btn-song-play')).toBeTruthy();
      expect(container.querySelector('.btn-song-stop')).toBeTruthy();
      expect(container.querySelector('.btn-song-pause')).toBeTruthy();
      expect(container.querySelector('.btn-song-resume')).toBeTruthy();
      expect(container.querySelector('.btn-song-skip-prev')).toBeTruthy();
      expect(container.querySelector('.btn-song-skip-next')).toBeTruthy();
      expect(container.querySelector('.song-loop-checkbox')).toBeTruthy();
    });

    test('renders pattern chain controls', () => {
      songView.render();
      
      expect(container.querySelector('.pattern-select')).toBeTruthy();
      expect(container.querySelector('.pattern-repeat-input')).toBeTruthy();
      expect(container.querySelector('.btn-pattern-add')).toBeTruthy();
      expect(container.querySelector('.pattern-chain-list')).toBeTruthy();
    });

    test('caches DOM elements after render', () => {
      songView.render();
      
      expect(songView.elements.songNameInput).toBeTruthy();
      expect(songView.elements.btnPlay).toBeTruthy();
      expect(songView.elements.patternSelect).toBeTruthy();
      expect(songView.elements.chainList).toBeTruthy();
    });
  });

  describe('updatePatternList()', () => {
    beforeEach(() => {
      songView.render();
    });

    test('updates pattern dropdown with names', () => {
      const patterns = ['basic house', 'bongoz house', 'breakbeat'];
      songView.updatePatternList(patterns);
      
      const select = songView.elements.patternSelect;
      expect(select.options.length).toBe(4); // 3 patterns + default option
      expect(select.options[0].value).toBe('');
      expect(select.options[1].value).toBe('basic house');
      expect(select.options[2].value).toBe('bongoz house');
      expect(select.options[3].value).toBe('breakbeat');
    });

    test('clears previous options before updating', () => {
      songView.updatePatternList(['pattern1', 'pattern2']);
      songView.updatePatternList(['pattern3']);
      
      const select = songView.elements.patternSelect;
      expect(select.options.length).toBe(2); // 1 pattern + default
      expect(select.options[1].value).toBe('pattern3');
    });

    test('handles empty pattern list', () => {
      songView.updatePatternList([]);
      
      const select = songView.elements.patternSelect;
      expect(select.options.length).toBe(1); // Only default option
    });
  });

  describe('updateSongList()', () => {
    beforeEach(() => {
      songView.render();
    });

    test('updates song dropdown with names', () => {
      const songs = ['My Song', 'Another Song'];
      songView.updateSongList(songs);
      
      const select = songView.elements.songSelect;
      expect(select.options.length).toBe(3); // 2 songs + default
      expect(select.options[1].value).toBe('My Song');
      expect(select.options[2].value).toBe('Another Song');
    });

    test('clears previous options before updating', () => {
      songView.updateSongList(['song1']);
      songView.updateSongList(['song2', 'song3']);
      
      const select = songView.elements.songSelect;
      expect(select.options.length).toBe(3); // 2 songs + default
    });
  });

  describe('renderChain()', () => {
    beforeEach(() => {
      songView.render();
    });

    test('shows empty message when chain is empty', () => {
      songView.renderChain([]);
      
      const message = container.querySelector('.empty-chain-message');
      expect(message).toBeTruthy();
      expect(message.textContent).toContain('No patterns added yet');
    });

    test('renders chain items for non-empty chain', () => {
      const chain = [
        { patternName: 'intro', repeats: 2, currentRepeat: 0 },
        { patternName: 'verse', repeats: 4, currentRepeat: 1 }
      ];
      
      songView.renderChain(chain);
      
      const items = container.querySelectorAll('.chain-item');
      expect(items.length).toBe(2);
    });

    test('displays pattern names and repeat counts', () => {
      const chain = [
        { patternName: 'intro', repeats: 3, currentRepeat: 0 }
      ];
      
      songView.renderChain(chain);
      
      expect(container.textContent).toContain('intro');
      expect(container.querySelector('.chain-repeat-input').value).toBe('3');
    });

    test('displays item numbers correctly', () => {
      const chain = [
        { patternName: 'intro', repeats: 1, currentRepeat: 0 },
        { patternName: 'verse', repeats: 1, currentRepeat: 0 }
      ];
      
      songView.renderChain(chain);
      
      expect(container.textContent).toContain('#1');
      expect(container.textContent).toContain('#2');
    });

    test('disables up button for first item', () => {
      const chain = [
        { patternName: 'intro', repeats: 1, currentRepeat: 0 }
      ];
      
      songView.renderChain(chain);
      
      const upButton = container.querySelector('.btn-chain-up');
      expect(upButton.disabled).toBe(true);
    });
  });

  describe('highlightCurrentPattern()', () => {
    beforeEach(() => {
      songView.render();
      const chain = [
        { patternName: 'intro', repeats: 1, currentRepeat: 0 },
        { patternName: 'verse', repeats: 1, currentRepeat: 0 }
      ];
      songView.renderChain(chain);
    });

    test('highlights the current pattern', () => {
      songView.highlightCurrentPattern(1);
      
      const items = container.querySelectorAll('.chain-item');
      expect(items[0].classList.contains('chain-item-active')).toBe(false);
      expect(items[1].classList.contains('chain-item-active')).toBe(true);
    });

    test('removes previous highlights', () => {
      songView.highlightCurrentPattern(0);
      songView.highlightCurrentPattern(1);
      
      const items = container.querySelectorAll('.chain-item');
      expect(items[0].classList.contains('chain-item-active')).toBe(false);
      expect(items[1].classList.contains('chain-item-active')).toBe(true);
    });

    test('removes all highlights when index is negative', () => {
      songView.highlightCurrentPattern(0);
      songView.highlightCurrentPattern(-1);
      
      const items = container.querySelectorAll('.chain-item');
      items.forEach(item => {
        expect(item.classList.contains('chain-item-active')).toBe(false);
      });
    });
  });

  describe('setCurrentPattern()', () => {
    beforeEach(() => {
      songView.render();
    });

    test('updates current pattern display', () => {
      songView.setCurrentPattern('intro');
      
      const display = songView.elements.currentPatternName;
      expect(display.textContent).toBe('intro');
    });

    test('displays "None" when pattern is null', () => {
      songView.setCurrentPattern(null);
      
      const display = songView.elements.currentPatternName;
      expect(display.textContent).toBe('None');
    });
  });

  describe('setSongProgress()', () => {
    beforeEach(() => {
      songView.render();
    });

    test('updates song progress display', () => {
      songView.setSongProgress(3, 8);
      
      const display = songView.elements.songProgress;
      expect(display.textContent).toBe('3 / 8');
    });

    test('handles zero progress', () => {
      songView.setSongProgress(0, 0);
      
      const display = songView.elements.songProgress;
      expect(display.textContent).toBe('0 / 0');
    });
  });

  describe('setSongName() and getSongName()', () => {
    beforeEach(() => {
      songView.render();
    });

    test('sets song name in input', () => {
      songView.setSongName('My Song');
      
      expect(songView.elements.songNameInput.value).toBe('My Song');
    });

    test('gets song name from input', () => {
      songView.elements.songNameInput.value = 'Test Song';
      
      expect(songView.getSongName()).toBe('Test Song');
    });

    test('trims whitespace when getting song name', () => {
      songView.elements.songNameInput.value = '  Trimmed  ';
      
      expect(songView.getSongName()).toBe('Trimmed');
    });
  });

  describe('setLoopMode()', () => {
    beforeEach(() => {
      songView.render();
    });

    test('checks loop checkbox when true', () => {
      songView.setLoopMode(true);
      
      expect(songView.elements.loopCheckbox.checked).toBe(true);
    });

    test('unchecks loop checkbox when false', () => {
      songView.setLoopMode(false);
      
      expect(songView.elements.loopCheckbox.checked).toBe(false);
    });
  });

  describe('setPlaybackState()', () => {
    beforeEach(() => {
      songView.render();
    });

    test('disables appropriate buttons when stopped', () => {
      songView.setPlaybackState('stopped');
      
      expect(songView.elements.btnPlay.disabled).toBe(false);
      expect(songView.elements.btnStop.disabled).toBe(true);
      expect(songView.elements.btnPause.disabled).toBe(true);
      expect(songView.elements.btnResume.disabled).toBe(true);
    });

    test('disables appropriate buttons when playing', () => {
      songView.setPlaybackState('playing');
      
      expect(songView.elements.btnPlay.disabled).toBe(true);
      expect(songView.elements.btnStop.disabled).toBe(false);
      expect(songView.elements.btnPause.disabled).toBe(false);
      expect(songView.elements.btnResume.disabled).toBe(true);
    });

    test('disables appropriate buttons when paused', () => {
      songView.setPlaybackState('paused');
      
      expect(songView.elements.btnPlay.disabled).toBe(true);
      expect(songView.elements.btnStop.disabled).toBe(false);
      expect(songView.elements.btnPause.disabled).toBe(true);
      expect(songView.elements.btnResume.disabled).toBe(false);
    });
  });

  describe('showError() and showSuccess()', () => {
    beforeEach(() => {
      songView.render();
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('displays error message', () => {
      songView.showError('Test error');
      
      const error = container.querySelector('.song-error-message');
      expect(error).toBeTruthy();
      expect(error.textContent).toBe('Test error');
    });

    test('displays success message', () => {
      songView.showSuccess('Test success');
      
      const success = container.querySelector('.song-success-message');
      expect(success).toBeTruthy();
      expect(success.textContent).toBe('Test success');
    });

    test('auto-removes error after timeout', () => {
      songView.showError('Test error');
      
      expect(container.querySelector('.song-error-message')).toBeTruthy();
      
      jest.advanceTimersByTime(3000);
      
      expect(container.querySelector('.song-error-message')).toBeFalsy();
    });

    test('auto-removes success after timeout', () => {
      songView.showSuccess('Test success');
      
      expect(container.querySelector('.song-success-message')).toBeTruthy();
      
      jest.advanceTimersByTime(2000);
      
      expect(container.querySelector('.song-success-message')).toBeFalsy();
    });
  });

  describe('Event Handling', () => {
    beforeEach(() => {
      songView.render();
    });

    test('emits songNew event when new button clicked', () => {
      const handler = jest.fn();
      songView.on('songNew', handler);
      
      songView.elements.btnNew.click();
      
      expect(handler).toHaveBeenCalledTimes(1);
    });

    test('emits songSave event with name when save button clicked', () => {
      const handler = jest.fn();
      songView.on('songSave', handler);
      
      songView.elements.songNameInput.value = 'Test Song';
      songView.elements.btnSave.click();
      
      expect(handler).toHaveBeenCalledWith({ name: 'Test Song' });
    });

    test('does not emit songSave when name is empty', () => {
      const handler = jest.fn();
      songView.on('songSave', handler);
      
      songView.elements.songNameInput.value = '';
      songView.elements.btnSave.click();
      
      expect(handler).not.toHaveBeenCalled();
    });

    test('emits songLoad event with selected song', () => {
      const handler = jest.fn();
      songView.on('songLoad', handler);
      
      songView.updateSongList(['Song1']);
      songView.elements.songSelect.value = 'Song1';
      songView.elements.btnLoad.click();
      
      expect(handler).toHaveBeenCalledWith({ name: 'Song1' });
    });

    test('emits songDelete event with selected song', () => {
      const handler = jest.fn();
      songView.on('songDelete', handler);
      
      songView.updateSongList(['Song1']);
      songView.elements.songSelect.value = 'Song1';
      songView.elements.btnDelete.click();
      
      expect(handler).toHaveBeenCalledWith({ name: 'Song1' });
    });

    test('emits playback control events', () => {
      const playHandler = jest.fn();
      const stopHandler = jest.fn();
      const pauseHandler = jest.fn();
      const resumeHandler = jest.fn();
      
      songView.on('songPlay', playHandler);
      songView.on('songStop', stopHandler);
      songView.on('songPause', pauseHandler);
      songView.on('songResume', resumeHandler);
      
      songView.elements.btnPlay.click();
      songView.elements.btnStop.click();
      songView.elements.btnPause.click();
      songView.elements.btnResume.click();
      
      expect(playHandler).toHaveBeenCalledTimes(1);
      expect(stopHandler).toHaveBeenCalledTimes(1);
      expect(pauseHandler).toHaveBeenCalledTimes(1);
      expect(resumeHandler).toHaveBeenCalledTimes(1);
    });

    test('emits navigation events', () => {
      const prevHandler = jest.fn();
      const nextHandler = jest.fn();
      
      songView.on('songSkipPrev', prevHandler);
      songView.on('songSkipNext', nextHandler);
      
      songView.elements.btnSkipPrev.click();
      songView.elements.btnSkipNext.click();
      
      expect(prevHandler).toHaveBeenCalledTimes(1);
      expect(nextHandler).toHaveBeenCalledTimes(1);
    });

    test('emits songLoopToggle event with checkbox state', () => {
      const handler = jest.fn();
      songView.on('songLoopToggle', handler);
      
      songView.elements.loopCheckbox.checked = true;
      songView.elements.loopCheckbox.dispatchEvent(new Event('change'));
      
      expect(handler).toHaveBeenCalledWith({ loop: true });
    });

    test('emits patternAdd event when add button clicked', () => {
      const handler = jest.fn();
      songView.on('patternAdd', handler);
      
      songView.updatePatternList(['intro']);
      songView.elements.patternSelect.value = 'intro';
      songView.elements.patternRepeatInput.value = '3';
      songView.elements.btnAddPattern.click();
      
      expect(handler).toHaveBeenCalledWith({ patternName: 'intro', repeats: 3 });
    });
  });

  describe('Chain Item Events', () => {
    beforeEach(() => {
      songView.render();
    });

    test('emits patternMoveUp event when up button clicked', () => {
      const handler = jest.fn();
      songView.on('patternMoveUp', handler);
      
      const chain = [
        { patternName: 'intro', repeats: 1, currentRepeat: 0 },
        { patternName: 'verse', repeats: 1, currentRepeat: 0 }
      ];
      songView.renderChain(chain);
      
      const upButtons = container.querySelectorAll('.btn-chain-up');
      upButtons[1].click(); // Click second item's up button
      
      expect(handler).toHaveBeenCalledWith({ index: 1 });
    });

    test('emits patternMoveDown event when down button clicked', () => {
      const handler = jest.fn();
      songView.on('patternMoveDown', handler);
      
      const chain = [
        { patternName: 'intro', repeats: 1, currentRepeat: 0 },
        { patternName: 'verse', repeats: 1, currentRepeat: 0 }
      ];
      songView.renderChain(chain);
      
      const downButtons = container.querySelectorAll('.btn-chain-down');
      downButtons[0].click();
      
      expect(handler).toHaveBeenCalledWith({ index: 0 });
    });

    test('emits patternRemove event when remove button clicked', () => {
      const handler = jest.fn();
      songView.on('patternRemove', handler);
      
      const chain = [
        { patternName: 'intro', repeats: 1, currentRepeat: 0 }
      ];
      songView.renderChain(chain);
      
      const removeButton = container.querySelector('.btn-chain-remove');
      removeButton.click();
      
      expect(handler).toHaveBeenCalledWith({ index: 0 });
    });

    test('emits patternRepeatChange event when repeat input changes', () => {
      const handler = jest.fn();
      songView.on('patternRepeatChange', handler);
      
      const chain = [
        { patternName: 'intro', repeats: 1, currentRepeat: 0 }
      ];
      songView.renderChain(chain);
      
      const repeatInput = container.querySelector('.chain-repeat-input');
      repeatInput.value = '5';
      repeatInput.dispatchEvent(new Event('change'));
      
      expect(handler).toHaveBeenCalledWith({ index: 0, repeats: 5 });
    });
  });

  describe('clear()', () => {
    beforeEach(() => {
      songView.render();
      const chain = [
        { patternName: 'intro', repeats: 1, currentRepeat: 0 }
      ];
      songView.renderChain(chain);
    });

    test('clears highlights', () => {
      songView.highlightCurrentPattern(0);
      songView.clear();
      
      const item = container.querySelector('.chain-item');
      expect(item.classList.contains('chain-item-active')).toBe(false);
    });

    test('resets current pattern display', () => {
      songView.setCurrentPattern('intro');
      songView.clear();
      
      expect(songView.elements.currentPatternName.textContent).toBe('None');
    });

    test('resets progress display', () => {
      songView.setSongProgress(3, 8);
      songView.clear();
      
      expect(songView.elements.songProgress.textContent).toBe('0 / 0');
    });
  });

  describe('destroy()', () => {
    test('clears event handlers', () => {
      songView.render();
      songView.on('songNew', jest.fn());
      
      songView.destroy();
      
      expect(songView.eventHandlers.size).toBe(0);
    });

    test('clears container', () => {
      songView.render();
      
      songView.destroy();
      
      expect(container.innerHTML).toBe('');
    });

    test('clears elements object', () => {
      songView.render();
      
      songView.destroy();
      
      expect(songView.elements).toEqual({});
    });
  });
});
