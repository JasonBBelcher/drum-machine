# Phase 6: Pattern Chaining / Song Mode

**Research-Based Implementation Plan**

---

## Executive Summary

Implement pattern chaining to allow users to arrange multiple drum patterns into complete songs. Based on analysis of Korg Electribe 2's pattern chain function and iOS drum machine workflows (DM1, Patterning), this document outlines a phased approach optimized for web-based implementation.

---

## Research Findings

### GrooveRider 2 Clip/Scene System (Advanced Reference)

**Core Architecture** (From 76-page manual):

1. **Clips** - Pattern variations stored in grid
   - Each pattern bank has 8 scenes
   - Each scene can have different clip content
   - Clip = specific pattern state (notes + automation)

2. **Scene Grid** - 8×8 launcher matrix
   - Horizontal rows = scenes (8 total)
   - Vertical columns = patterns (8 visible at once)
   - Launch entire scene OR individual clips
   - Similar to Ableton Live session view

3. **Follow Actions** (Generative/Automatic):
   ```
   Options:
   - Next: Play next clip in sequence
   - Previous: Go back one clip
   - Random: Pick random clip
   - Other: Play different random clip (not current)
   - Stop: End playback
   
   Settings:
   - Probability: 0-100% chance of action
   - Quantization: When to trigger (bar/beat)
   - Repeat count before action
   ```

4. **Clip Select Mode**:
   - Trigger clips individually (grid mode)
   - Launch entire scenes (row mode)
   - Pads illuminate to show playing clips
   - Visual feedback per clip state

5. **Song Mode Page**:
   - Separate dedicated page for linear arrangement
   - Works alongside clip grid system
   - Can record clip launches as song structure
   - Export/print MIDI from arrangements

**Hardware Integration**:
- Full Novation Launchpad X support
- Launchpad Mini MK3 support
- 8×8 grid maps directly to hardware
- RGB LED feedback per clip
- Dedicated mixer/settings layouts

**Key Design Patterns**:
- **Dual workflow**: Clip jamming + Song arrangement coexist
- **Scene-based organization**: Group pattern variations together
- **Generative potential**: Follow actions create evolving sequences
- **Hardware parity**: Software UI matches Launchpad physical interface

### Korg Electribe 2 Pattern Chain (Hardware Reference)

**Key Features:**
- Added in System Version 2.0 (highly requested feature)
- Allows chaining patterns for live performance and production
- Simple interface: Select patterns in order, set repeats
- Pattern transitions happen at end of current pattern loop
- Can loop entire chain or play once

**Workflow:**
1. Enter Pattern Chain mode
2. Select patterns from 250 available patterns
3. Set number of repeats per pattern (1-99)
4. Chain up to 64 patterns
5. Play chain as full song

**UI Paradigm:**
- Hardware uses button grid (16 pads) for pattern selection
- LED display shows chain order
- Dedicated "Pattern Chain" button to enter mode
- Clear chain function
- Save chain as "Song"

### iOS Drum Machine Patterns (Mobile Reference)

**JimAudio GrooveRider GR-16:**
- **Jump Mode**: 8 pad buttons for instant pattern switching during performance
- **One-screen design**: All controls on single screen (no sub-menus)
- **Bar selection**: 4 bar buttons (1-4) with LED indicators for current position
- **Part-based**: 16 parts per pattern with individual insert effects
- **128 note step sequencer** with parameter automation
- **Pad Modes**: 8 modes including Mute, Erase, Trigger, Seq, Keys, Chords, Slice, and **Jump**
- **Real-time performance**: Built for live playing with Ableton Link sync
- Touch-optimized: All knobs and buttons designed for finger control

**JimAudio GrooveRider 2 (Advanced Version):**
- **Clips System**: Ableton Live-inspired clip launcher
- **Scene Grid**: 8x8 grid of clips (8 patterns × 8 scenes)
- **Follow Actions**: Automatic clip progression (Next, Random, Other, etc.)
- **Song Mode**: Dedicated song page for arrangement
- **Clip Select Mode**: Trigger individual clips or entire scenes
- **Pattern Banks**: Multiple banks of patterns for organization
- **Launchpad Integration**: Full Novation Launchpad X/Mini MK3 support

**Key Insights:**

1. **Clip-Based Architecture** (GrooveRider 2):
   - Each pattern can have multiple "clips" (variations)
   - 8 scenes per pattern bank = 8 different arrangements
   - Trigger clips individually or launch entire scenes
   - **Scene = horizontal row of clips that play together**

2. **Follow Actions** (Automated Chaining):
   - Set what happens when clip finishes playing
   - Options: Next, Previous, Random, Other, Stop
   - Set probability and quantization (bars/beats)
   - Enables generative/evolving arrangements

3. **Song Mode** (Linear Arrangement):
   - Dedicated page for traditional DAW-style timeline
   - Pre-arrange clips in sequence
   - Mix clip-based jamming with fixed song structure

**DM1 - The Drum Machine:**
- Song mode with pattern playlist
- Drag-and-drop pattern arrangement
- Visual timeline representation
- Tap to add/remove patterns
- Swipe to reorder
- Export full song to audio

**Patterning:**
- Scene-based arrangement
- Visual grid of pattern cells
- Touch to trigger, hold to chain
- Pattern variations within scenes
- Timeline playback indicator

**Common iOS Patterns:**
- Touch-first UI (no mouse hover states)
- Visual timeline/grid representation
- Immediate feedback
- Swipe gestures for reordering
- Modal interfaces for editing
- **One-screen philosophy**: Minimize navigation between screens

---

## Design Principles for Web Implementation

### 1. Progressive Enhancement
- Core functionality works without complex UI
- Add visual polish incrementally
- Keyboard shortcuts for power users
- Touch-friendly on mobile

### 2. Familiar Workflows
- Borrow from DAW patterns (Ableton, Logic)
- Keep existing pattern creation workflow unchanged
- Add new "Song Mode" tab/panel
- **Consider "Jump Mode"**: Like GrooveRider's pad-based instant switching for live performance

### 3. Data Model First
- Design data structure before UI
- Ensure persistence compatibility
- Plan for future features (pattern variations, automation)

### 4. Three Architectural Approaches

**A) Song Mode (Linear Pre-arranged)** - Electribe/DM1 style
- Build fixed pattern chain before playing
- Set repeat counts (1-99 per pattern)
- Linear playback from start to end
- Best for: Production, composition, exporting complete tracks
- **Simplest to implement** - just queue patterns

**B) Clip/Scene Grid (Ableton Live style)** - GrooveRider 2
- 8x8 grid: 8 patterns × 8 scenes (variations)
- Launch individual clips OR entire scenes
- Follow Actions for automated transitions
- Non-linear, generative arrangements
- Best for: Live performance, experimentation, jamming
- **Most flexible but complex** - requires grid UI + scene management

**C) Jump Mode (Instant Switch)** - GrooveRider GR-16 style  
- Keyboard/pad numbers (1-8) trigger patterns instantly
- Quantized switching (wait for bar end)
- Queue next pattern while current plays
- Best for: Live improvisation, DJ-style performance
- **Medium complexity** - simpler than clips, more real-time than song mode

**Recommendation Strategy:**
1. **Phase 6**: Implement **Song Mode** (A) - Proven, simple, production-focused
2. **Phase 7**: Add **Jump Mode** (C) - Complements song mode for live use
3. **Phase 8+**: Consider **Clip Grid** (B) - Major feature requiring scene system

**Why this order?**
- Song Mode provides immediate value for composition
- Jump Mode adds performance capability with moderate effort  
- Clip Grid is powerful but requires significant architecture (scenes, follow actions, grid UI)
- All three can coexist: Song Mode for production, Jump/Clips for performance

---

## Proposed Implementation

### Phase 6.1: Core Data Model & Logic

**Goals:**
- Create SongModel class
- Implement pattern queue system
- Scheduler integration for seamless transitions
- Save/load song chains

**New Files:**
```
src/
├── models/
│   └── SongModel.js           # NEW: Song/chain data model
├── libs/
│   └── song-scheduler.js       # NEW: Chain playback logic
```

#### SongModel.js
```javascript
class SongModel {
  constructor() {
    this.name = 'Untitled Song';
    this.chain = [];              // Array of ChainStep
    this.currentStepIndex = 0;
    this.isLooping = true;        // Loop entire chain
    this.isPlaying = false;
  }

  addPattern(patternName, repeats = 1) {
    this.chain.push(new ChainStep(patternName, repeats));
  }

  removeStep(index) {
    this.chain.splice(index, 1);
  }

  moveStep(fromIndex, toIndex) {
    const [step] = this.chain.splice(fromIndex, 1);
    this.chain.splice(toIndex, 0, step);
  }

  clear() {
    this.chain = [];
    this.currentStepIndex = 0;
  }

  getNextStep() {
    if (this.currentStepIndex >= this.chain.length) {
      if (this.isLooping) {
        this.currentStepIndex = 0;
      } else {
        return null; // End of chain
      }
    }
    return this.chain[this.currentStepIndex];
  }

  toJSON() {
    return {
      name: this.name,
      chain: this.chain.map(step => step.toJSON()),
      isLooping: this.isLooping
    };
  }

  static fromJSON(data) {
    const song = new SongModel();
    song.name = data.name;
    song.isLooping = data.isLooping;
    song.chain = data.chain.map(stepData => ChainStep.fromJSON(stepData));
    return song;
  }
}

class ChainStep {
  constructor(patternName, repeats = 1) {
    this.patternName = patternName;
    this.repeats = repeats;
    this.currentRepeat = 0;
  }

  incrementRepeat() {
    this.currentRepeat++;
    return this.currentRepeat >= this.repeats;
  }

  reset() {
    this.currentRepeat = 0;
  }

  toJSON() {
    return {
      patternName: this.patternName,
      repeats: this.repeats
    };
  }

  static fromJSON(data) {
    return new ChainStep(data.patternName, data.repeats);
  }
}
```

#### song-scheduler.js
```javascript
class SongScheduler {
  constructor(sequencerController, songModel) {
    this.controller = sequencerController;
    this.songModel = songModel;
    this.currentStep = null;
    this.isPlaying = false;
  }

  start() {
    if (this.isPlaying) return;
    
    this.isPlaying = true;
    this.songModel.currentStepIndex = 0;
    this.playNextStep();
  }

  stop() {
    this.isPlaying = false;
    this.controller.handleStop();
  }

  playNextStep() {
    if (!this.isPlaying) return;

    const step = this.songModel.getNextStep();
    
    if (!step) {
      // End of chain (not looping)
      this.stop();
      return;
    }

    // Load pattern
    const patternName = step.patternName;
    this.controller.loadPattern(patternName);
    
    // Set callback for pattern completion
    const patternLength = this.controller.model.length;
    const tempo = this.controller.model.tempo;
    const patternDuration = (60 / tempo) * (patternLength / 4); // seconds
    
    // Schedule next pattern
    setTimeout(() => {
      const shouldAdvance = step.incrementRepeat();
      
      if (shouldAdvance) {
        step.reset();
        this.songModel.currentStepIndex++;
      }
      
      this.playNextStep();
    }, patternDuration * 1000);
  }

  pause() {
    this.isPlaying = false;
    this.controller.handleStop();
  }

  resume() {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.playNextStep();
    }
  }
}
```

**Integration with SequencerController:**
```javascript
// In SequencerController.js
class SequencerController {
  constructor(config) {
    // ... existing code
    this.songScheduler = new SongScheduler(this, config.songModel);
  }

  // NEW: Method to load pattern by name
  loadPattern(patternName) {
    const storage = new StorageManager();
    const patternData = storage.load(patternName);
    
    if (patternData) {
      this.model = SequenceModel.fromJSON(patternData);
      this.sequencerView.render();
      this.handlePlay(); // Auto-start pattern
    }
  }
}
```

**Storage Integration:**
```javascript
// In StorageManager.js - add song storage methods
class StorageManager {
  // ... existing pattern methods

  saveSong(song) {
    const key = `song_${song.name}`;
    localStorage.setItem(key, JSON.stringify(song.toJSON()));
  }

  loadSong(songName) {
    const key = `song_${songName}`;
    const data = localStorage.getItem(key);
    return data ? SongModel.fromJSON(JSON.parse(data)) : null;
  }

  getAllSongs() {
    const songs = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('song_')) {
        const data = localStorage.getItem(key);
        songs.push(SongModel.fromJSON(JSON.parse(data)));
      }
    }
    return songs;
  }

  deleteSong(songName) {
    const key = `song_${songName}`;
    localStorage.removeItem(key);
  }
}
```

---

### Phase 6.2: Basic UI Implementation

**Goals:**
- Simple list-based chain editor
- Add/remove patterns
- Set repeat counts
- Play/stop chain

**New Files:**
```
src/
├── views/
│   └── SongView.js            # NEW: Chain editor UI
```

#### SongView.js (Minimal Version)
```javascript
class SongView {
  constructor(containerElement, songModel) {
    this.container = containerElement;
    this.songModel = songModel;
    this.listeners = new Map();
  }

  render() {
    this.container.innerHTML = `
      <div class="song-container">
        <div class="song-header">
          <input type="text" 
                 class="song-name" 
                 value="${this.songModel.name}" 
                 placeholder="Song Name">
          <button class="song-play-btn">▶ Play Chain</button>
          <button class="song-stop-btn">⬛ Stop</button>
          <label>
            <input type="checkbox" 
                   class="song-loop-checkbox" 
                   ${this.songModel.isLooping ? 'checked' : ''}>
            Loop Chain
          </label>
        </div>

        <div class="chain-editor">
          <h3>Pattern Chain</h3>
          <div class="chain-steps">
            ${this.renderChainSteps()}
          </div>
          <div class="chain-add">
            <select class="pattern-selector">
              <option value="">-- Add Pattern --</option>
              ${this.renderPatternOptions()}
            </select>
            <button class="add-pattern-btn">+ Add</button>
          </div>
        </div>

        <div class="song-controls">
          <button class="save-song-btn">💾 Save Song</button>
          <button class="clear-chain-btn">🗑️ Clear Chain</button>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  renderChainSteps() {
    if (this.songModel.chain.length === 0) {
      return '<p class="empty-chain">No patterns in chain. Add patterns above.</p>';
    }

    return this.songModel.chain.map((step, index) => `
      <div class="chain-step" data-index="${index}">
        <span class="step-number">${index + 1}.</span>
        <span class="step-pattern-name">${step.patternName}</span>
        <input type="number" 
               class="step-repeats" 
               min="1" 
               max="99" 
               value="${step.repeats}"
               data-index="${index}">
        <span class="step-repeat-label">×</span>
        <button class="step-remove-btn" data-index="${index}">✕</button>
        <button class="step-move-up-btn" data-index="${index}" 
                ${index === 0 ? 'disabled' : ''}>▲</button>
        <button class="step-move-down-btn" data-index="${index}" 
                ${index === this.songModel.chain.length - 1 ? 'disabled' : ''}>▼</button>
      </div>
    `).join('');
  }

  renderPatternOptions() {
    const storage = new StorageManager();
    const patterns = storage.getAllPatterns();
    
    return patterns.map(pattern => 
      `<option value="${pattern.name}">${pattern.name}</option>`
    ).join('');
  }

  bindEvents() {
    // Song name
    this.container.querySelector('.song-name')?.addEventListener('input', (e) => {
      this.emit('songNameChange', e.target.value);
    });

    // Play/stop
    this.container.querySelector('.song-play-btn')?.addEventListener('click', () => {
      this.emit('songPlay');
    });

    this.container.querySelector('.song-stop-btn')?.addEventListener('click', () => {
      this.emit('songStop');
    });

    // Loop checkbox
    this.container.querySelector('.song-loop-checkbox')?.addEventListener('change', (e) => {
      this.emit('songLoopChange', e.target.checked);
    });

    // Add pattern
    this.container.querySelector('.add-pattern-btn')?.addEventListener('click', () => {
      const selector = this.container.querySelector('.pattern-selector');
      const patternName = selector.value;
      if (patternName) {
        this.emit('addPattern', patternName);
        selector.value = '';
      }
    });

    // Remove step
    this.container.querySelectorAll('.step-remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.emit('removeStep', index);
      });
    });

    // Move step
    this.container.querySelectorAll('.step-move-up-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.emit('moveStep', index, index - 1);
      });
    });

    this.container.querySelectorAll('.step-move-down-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.emit('moveStep', index, index + 1);
      });
    });

    // Update repeats
    this.container.querySelectorAll('.step-repeats').forEach(input => {
      input.addEventListener('change', (e) => {
        const index = parseInt(e.target.dataset.index);
        const repeats = parseInt(e.target.value);
        this.emit('updateRepeats', index, repeats);
      });
    });

    // Save song
    this.container.querySelector('.save-song-btn')?.addEventListener('click', () => {
      this.emit('saveSong');
    });

    // Clear chain
    this.container.querySelector('.clear-chain-btn')?.addEventListener('click', () => {
      if (confirm('Clear entire chain?')) {
        this.emit('clearChain');
      }
    });
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  emit(event, ...args) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(...args));
    }
  }

  highlightCurrentStep(index) {
    this.container.querySelectorAll('.chain-step').forEach((step, i) => {
      step.classList.toggle('active', i === index);
    });
  }
}
```

**CSS Styles (add to styles.css):**
```css
/* Song/Chain View */
.song-container {
  margin-top: 20px;
  padding: 20px;
  background: #222;
  border-radius: 4px;
}

.song-header {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
}

.song-name {
  flex: 1;
  padding: 8px 12px;
  background: #333;
  border: 1px solid #444;
  color: white;
  border-radius: 4px;
}

.song-play-btn,
.song-stop-btn {
  padding: 8px 16px;
  background: #8B5CF6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.song-stop-btn {
  background: #e74c3c;
}

.chain-editor {
  background: #1a1a1a;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.chain-steps {
  margin: 15px 0;
  max-height: 400px;
  overflow-y: auto;
}

.chain-step {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px;
  background: #333;
  margin-bottom: 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.chain-step.active {
  background: #8B5CF6;
  box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
}

.step-number {
  color: #888;
  min-width: 30px;
}

.step-pattern-name {
  flex: 1;
  color: white;
  font-weight: 500;
}

.step-repeats {
  width: 60px;
  padding: 4px 8px;
  background: #222;
  border: 1px solid #444;
  color: white;
  border-radius: 4px;
  text-align: center;
}

.step-repeat-label {
  color: #888;
}

.step-remove-btn,
.step-move-up-btn,
.step-move-down-btn {
  padding: 4px 8px;
  background: #444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.step-remove-btn:hover {
  background: #e74c3c;
}

.step-move-up-btn:hover,
.step-move-down-btn:hover {
  background: #555;
}

.step-move-up-btn:disabled,
.step-move-down-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.chain-add {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.pattern-selector {
  flex: 1;
  padding: 8px 12px;
  background: #333;
  border: 1px solid #444;
  color: white;
  border-radius: 4px;
}

.add-pattern-btn {
  padding: 8px 16px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.song-controls {
  display: flex;
  gap: 10px;
}

.save-song-btn,
.clear-chain-btn {
  flex: 1;
  padding: 10px;
  background: #444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-song-btn:hover {
  background: #27ae60;
}

.clear-chain-btn:hover {
  background: #e74c3c;
}

.empty-chain {
  color: #888;
  text-align: center;
  padding: 20px;
  font-style: italic;
}
```

**Integration with app.js:**
```javascript
// In app.js - add Song Mode toggle
const songModel = new SongModel();
const songView = new SongView(
  document.querySelector('.song-view-container'),
  songModel
);

// Event handlers
songView.on('songPlay', () => {
  sequencerController.songScheduler.start();
});

songView.on('songStop', () => {
  sequencerController.songScheduler.stop();
});

songView.on('addPattern', (patternName) => {
  songModel.addPattern(patternName, 1);
  songView.render();
});

songView.on('removeStep', (index) => {
  songModel.removeStep(index);
  songView.render();
});

songView.on('moveStep', (fromIndex, toIndex) => {
  songModel.moveStep(fromIndex, toIndex);
  songView.render();
});

songView.on('updateRepeats', (index, repeats) => {
  songModel.chain[index].repeats = repeats;
});

songView.on('saveSong', () => {
  const storage = new StorageManager();
  storage.saveSong(songModel);
  alert(`Song "${songModel.name}" saved!`);
});

songView.on('clearChain', () => {
  songModel.clear();
  songView.render();
});

songView.on('songLoopChange', (isLooping) => {
  songModel.isLooping = isLooping;
});

// Initial render
songView.render();
```

**HTML Structure (add to index.html):**
```html
<!-- Add tab navigation -->
<div class="mode-tabs">
  <button class="mode-tab active" data-mode="pattern">Pattern Mode</button>
  <button class="mode-tab" data-mode="song">Song Mode</button>
</div>

<!-- Existing sequencer -->
<div class="pattern-mode-container" style="display: block;">
  <!-- Existing sequencer UI -->
</div>

<!-- New song mode -->
<div class="song-mode-container song-view-container" style="display: none;">
  <!-- SongView renders here -->
</div>

<script>
  // Tab switching
  document.querySelectorAll('.mode-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const mode = e.target.dataset.mode;
      
      document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      
      document.querySelector('.pattern-mode-container').style.display = 
        mode === 'pattern' ? 'block' : 'none';
      document.querySelector('.song-mode-container').style.display = 
        mode === 'song' ? 'block' : 'none';
    });
  });
</script>
```

---

### Phase 6.3: Enhanced UI (Optional)

**Goals:**
- Visual timeline representation
- Drag-and-drop reordering
- Pattern preview/audition
- Real-time playback indicator

**Enhancements:**
1. **Timeline View** - Visual blocks representing patterns
2. **Drag-and-Drop** - Reorder using HTML5 Drag API
3. **Preview Button** - Audition pattern before adding
4. **Progress Indicator** - Show current position in chain

**Implementation Notes:**
- Use HTML5 Drag and Drop API for reordering
- Add visual progress bar showing current pattern/repeat
- Pattern blocks sized proportionally to duration
- Color-code patterns for visual distinction

---

## Implementation Checklist

### Phase 6.1: Core (1-2 days)
- [ ] Create `SongModel.js` class
- [ ] Create `ChainStep` class
- [ ] Implement `song-scheduler.js`
- [ ] Add song storage methods to `StorageManager`
- [ ] Integrate with `SequencerController`
- [ ] Test pattern transitions
- [ ] Test repeat functionality
- [ ] Test loop mode

### Phase 6.2: Basic UI (2-3 days)
- [ ] Create `SongView.js` class
- [ ] Build chain editor UI
- [ ] Add/remove pattern functionality
- [ ] Set repeat counts
- [ ] Move steps up/down
- [ ] Play/stop chain controls
- [ ] Save/load songs
- [ ] Add CSS styling
- [ ] Test on mobile (touch events)

### Phase 6.3: Polish (Optional, 2-3 days)
- [ ] Add timeline visualization
- [ ] Implement drag-and-drop
- [ ] Add pattern preview
- [ ] Real-time progress indicator
- [ ] Keyboard shortcuts (spacebar, arrows)
- [ ] Export chain to pattern list
- [ ] Pattern length indicators

---

## Testing Strategy

### Unit Tests
```javascript
describe('SongModel', () => {
  it('adds pattern to chain', () => {
    const song = new SongModel();
    song.addPattern('basic house', 2);
    expect(song.chain.length).toBe(1);
    expect(song.chain[0].repeats).toBe(2);
  });

  it('removes step from chain', () => {
    const song = new SongModel();
    song.addPattern('pattern1');
    song.addPattern('pattern2');
    song.removeStep(0);
    expect(song.chain.length).toBe(1);
    expect(song.chain[0].patternName).toBe('pattern2');
  });

  it('moves step within chain', () => {
    const song = new SongModel();
    song.addPattern('pattern1');
    song.addPattern('pattern2');
    song.moveStep(1, 0);
    expect(song.chain[0].patternName).toBe('pattern2');
  });
});
```

### Integration Tests
1. Create 3 patterns
2. Add to chain: A (×2), B (×1), C (×3)
3. Play chain
4. Verify: A plays twice, B once, C three times
5. Verify smooth transitions (no gaps/overlaps)

### Manual Tests
- [ ] Pattern transitions are seamless
- [ ] Repeat counts work correctly
- [ ] Loop mode cycles properly
- [ ] Non-loop mode stops at end
- [ ] UI updates during playback
- [ ] Save/load preserves chain
- [ ] Mobile touch interactions work
- [ ] Tempo changes respected

---

## Future Enhancements (Phase 7+)

### High Priority
1. **Jump Mode (Live Performance)** - GrooveRider-inspired instant pattern switching
   - Assign patterns to keyboard numbers (1-8)
   - Visual indicators for current pattern
   - Quantized switching (wait for bar/beat end)
   - Queue next pattern while current plays
   
2. **Pattern Variations** - Same pattern, different settings per instance
3. **Automation** - Record tempo/effect changes during playback

### Medium Priority
4. **Scenes** - Group patterns into scenes (intro, verse, chorus)
5. **Export to Audio** - Render entire chain to WAV
6. **Collaborative** - Share songs (export JSON)
7. **MIDI Export** - Export chain as MIDI file

### Low Priority
8. **Pattern Transitions** - Crossfades, fills, breaks
9. **Real-time Recording** - Record pattern changes while playing

### Jump Mode Implementation Preview (Phase 7)
```javascript
class JumpMode {
  constructor(controller) {
    this.controller = controller;
    this.patternSlots = new Array(8).fill(null); // 8 slots
    this.currentSlot = 0;
    this.nextSlot = null; // Queue next pattern
  }

  assignPattern(slot, patternName) {
    this.patternSlots[slot] = patternName;
  }

  jump(slot) {
    if (this.controller.isPlaying) {
      this.nextSlot = slot; // Queue for end of bar
    } else {
      this.switchPattern(slot);
    }
  }

  onBarEnd() {
    if (this.nextSlot !== null) {
      this.switchPattern(this.nextSlot);
      this.nextSlot = null;
    }
  }

  switchPattern(slot) {
    const patternName = this.patternSlots[slot];
    if (patternName) {
      this.controller.loadPattern(patternName);
      this.currentSlot = slot;
    }
  }
}

// Keyboard shortcuts for Jump Mode
document.addEventListener('keydown', (e) => {
  if (e.key >= '1' && e.key <= '8') {
    const slot = parseInt(e.key) - 1;
    jumpMode.jump(slot);
  }
});
```

---

## Performance Considerations

### Optimization Strategies
```javascript
// Pre-load patterns before transition
class SmartSongScheduler extends SongScheduler {
  constructor(controller, songModel) {
    super(controller, songModel);
    this.preloadQueue = [];
  }

  preloadNextPattern() {
    const nextStep = this.songModel.chain[this.songModel.currentStepIndex + 1];
    if (nextStep) {
      const storage = new StorageManager();
      const patternData = storage.load(nextStep.patternName);
      this.preloadQueue.push(patternData);
    }
  }

  playNextStep() {
    // Use preloaded data if available
    if (this.preloadQueue.length > 0) {
      const patternData = this.preloadQueue.shift();
      this.controller.model = SequenceModel.fromJSON(patternData);
    } else {
      // Fallback to sync load
      super.playNextStep();
    }

    // Preload next
    this.preloadNextPattern();
  }
}
```

---

## Documentation Updates

### User-Facing (README.md)
```markdown
## Song Mode

Create full tracks by chaining patterns together.

1. **Create Patterns** - Build drum patterns in Pattern Mode
2. **Switch to Song Mode** - Click "Song Mode" tab
3. **Add Patterns** - Select patterns and click "Add"
4. **Set Repeats** - Adjust how many times each pattern plays
5. **Arrange** - Use ▲▼ buttons to reorder
6. **Play** - Click "Play Chain" to hear full song
7. **Save** - Save your song arrangement

### Tips
- Create variations of patterns for intro/verse/chorus
- Use 1× repeat for transitions
- Enable "Loop Chain" for continuous playback
- Save songs with descriptive names
```

### Developer-Facing (Update Complete Guide)
```markdown
## Song/Chain Architecture

### SongModel
- Manages chain of patterns
- Stores repeat counts
- Handles loop logic

### SongScheduler
- Coordinates pattern playback
- Handles transitions
- Tracks current position

### SongView
- Chain editor UI
- Add/remove/reorder patterns
- Playback controls
```

---

## Success Metrics

- [ ] Users can create multi-pattern songs
- [ ] Transitions are seamless (<5ms gap)
- [ ] UI is intuitive (no documentation needed)
- [ ] Mobile experience is smooth
- [ ] Songs save/load reliably
- [ ] Performance remains good (no lag with 20+ patterns)

---

## Phase 8: Clip/Scene Grid System (Advanced - Future)

**Goals**: Ableton Live-style clip launcher with scenes and follow actions

### Architecture Overview

```javascript
class ClipGrid {
  constructor() {
    this.scenes = Array(8).fill(null).map(() => new Scene());
    this.patterns = Array(8).fill(null).map(() => new Pattern());
    this.activeClips = new Map(); // Track playing clips per column
  }
}

class Scene {
  constructor(name = 'Scene') {
    this.name = name;
    this.clips = Array(8).fill(null); // 8 clip slots per scene
  }

  launch() {
    // Fire all clips in this scene simultaneously
    this.clips.forEach((clip, index) => {
      if (clip) clip.trigger(index);
    });
  }
}

class Clip {
  constructor(patternName) {
    this.patternName = patternName;
    this.followAction = {
      type: 'none',        // none, next, previous, random, other, stop
      probability: 100,    // 0-100%
      quantization: 'bar', // beat, bar, 2bar, 4bar
      repeats: 1           // Times to loop before action
    };
    this.isPlaying = false;
    this.currentRepeat = 0;
  }

  trigger(column) {
    this.isPlaying = true;
    this.currentRepeat = 0;
    // Load and play pattern
  }

  onLoopComplete() {
    this.currentRepeat++;
    
    if (this.currentRepeat >= this.followAction.repeats) {
      const shouldTrigger = Math.random() * 100 < this.followAction.probability;
      
      if (shouldTrigger) {
        this.executeFollowAction();
      }
    }
  }

  executeFollowAction() {
    switch (this.followAction.type) {
      case 'next':
        // Trigger next scene
        break;
      case 'random':
        // Pick random clip
        break;
      case 'other':
        // Pick different random clip
        break;
      case 'stop':
        this.stop();
        break;
    }
  }
}
```

### UI Design (8×8 Grid)

```html
<div class="clip-grid">
  <!-- 8 rows (scenes) × 8 columns (patterns) -->
  <div class="scene-row" data-scene="0">
    <button class="scene-launch-btn">▶ Scene 1</button>
    <div class="clip-slot" data-scene="0" data-pattern="0"></div>
    <div class="clip-slot" data-scene="0" data-pattern="1"></div>
    <!-- ... 6 more clips -->
  </div>
  <!-- ... 7 more scenes -->
</div>

<div class="clip-settings-panel">
  <h3>Clip Settings</h3>
  <select class="follow-action-type">
    <option value="none">None</option>
    <option value="next">Next</option>
    <option value="random">Random</option>
    <option value="other">Other</option>
    <option value="stop">Stop</option>
  </select>
  <input type="range" class="follow-action-probability" min="0" max="100">
  <input type="number" class="follow-action-repeats" min="1" max="99">
</div>
```

### Implementation Steps

1. **Phase 8.1: Grid Data Model** (3 days)
   - ClipGrid, Scene, Clip classes
   - Pattern storage per clip
   - Follow action logic

2. **Phase 8.2: Basic Grid UI** (4 days)
   - 8×8 button grid
   - Click to trigger clips
   - Scene launch buttons
   - Visual feedback (playing state)

3. **Phase 8.3: Follow Actions** (3 days)
   - Action execution logic
   - Probability system
   - Quantization (bar/beat sync)
   - Settings panel per clip

4. **Phase 8.4: Advanced Features** (4 days)
   - Record clip launches to song mode
   - Clip color coding
   - Drag patterns to clips
   - Keyboard shortcuts (grid navigation)

**Total Phase 8 Estimate**: 2-3 weeks

### Benefits vs Complexity

**Pros:**
- Maximum flexibility for live performance
- Generative/evolving arrangements
- Industry-standard workflow (Ableton)
- Powerful for experimentation

**Cons:**
- Significant development time
- Complex UI (8×8 grid + settings)
- Requires scene management system
- Steeper learning curve for users

**Decision Point**: Implement only if user base requests advanced performance features

---

## Timeline Estimate

### Phase 6: Song Mode (Linear Chaining)
- **Phase 6.1 (Core)**: 2 days
- **Phase 6.2 (UI)**: 3 days
- **Testing & Polish**: 2 days
- **Total**: ~1 week for MVP
- **Phase 6.3 (Enhanced UI)**: +1 week (optional)

### Phase 7: Jump Mode (Live Performance)
- **Core Logic**: 2 days
- **UI Integration**: 2 days
- **Keyboard Shortcuts**: 1 day
- **Total**: ~1 week

### Phase 8: Clip/Scene Grid (Advanced)
- **Phase 8.1 (Data Model)**: 3 days
- **Phase 8.2 (Grid UI)**: 4 days
- **Phase 8.3 (Follow Actions)**: 3 days
- **Phase 8.4 (Polish)**: 4 days
- **Total**: 2-3 weeks

**Recommended Path**: Phase 6 → Phase 7 → Evaluate Phase 8 based on user feedback

---

## Questions for User

1. **UI Preference**: Simple list editor or visual timeline?
2. **Pattern Limit**: Max patterns per chain? (suggest 64 like Electribe)
3. **Transition Behavior**: Immediate or wait for pattern end?
4. **Mobile Priority**: Focus on desktop first or mobile-first?
5. **Export**: Need audio export or just playback?

---

**Next Steps:**
1. Review this plan
2. Decide on Phase 6.2 UI approach (list vs timeline)
3. Create feature branch: `git checkout -b feature/pattern-chaining`
4. Begin Phase 6.1 implementation
5. Test core functionality before building UI
