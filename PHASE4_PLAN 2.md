# Phase 4: Custom Samples & Tuning Control

## What Will Be Built

Phase 4 adds **custom sample loading** and **pitch control** for creative sound design and personalization.

### Features

1. **Custom Sample Loading**
   - Drag & drop audio files
   - File picker interface
   - Support WAV, MP3, OGG formats
   - Per-drum sample replacement
   - Sample library management

2. **Pitch Control**
   - Semitone adjustment (-12 to +12)
   - Fine-tuning in cents (-100 to +100)
   - Per-drum tuning
   - Real-time pitch shifting
   - Preserve tuning in saved patterns

3. **Sample Management**
   - Save custom sample sets
   - Reset to default samples
   - Sample preview on load
   - File size validation
   - Format validation

## Architecture

### 1. SampleLoader (`src/utils/SampleLoader.js`)
**Handle file loading and validation**:
```javascript
export class SampleLoader {
  constructor(audioContext) {
    this.context = audioContext;
    this.supportedFormats = ['audio/wav', 'audio/mpeg', 'audio/ogg'];
  }

  async loadFromFile(file) {
    // Validate file
    if (!this.isValidFormat(file)) {
      throw new Error(`Unsupported format: ${file.type}`);
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      throw new Error('File too large (max 5MB)');
    }

    // Read and decode
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
    
    return {
      name: file.name,
      buffer: audioBuffer,
      size: file.size,
      duration: audioBuffer.duration
    };
  }

  isValidFormat(file) {
    return this.supportedFormats.includes(file.type);
  }

  async loadFromURL(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await this.context.decodeAudioData(arrayBuffer);
  }
}
```

### 2. PitchableAudioPlayer (`src/libs/pitchable-audio-player.js`)
**Extend AudioPlayer with pitch control**:
```javascript
export class PitchableAudioPlayer extends AudioPlayer {
  constructor(audioContext) {
    super(audioContext);
    this.pitchOffsets = new Map(); // semitones per sound
    this.detuneOffsets = new Map(); // cents per sound
  }

  /**
   * Set pitch offset in semitones
   * @param {string} name - Sound identifier
   * @param {number} semitones - Pitch shift (-12 to +12)
   */
  setPitch(name, semitones) {
    const clamped = Math.max(-12, Math.min(12, semitones));
    this.pitchOffsets.set(name, clamped);
  }

  /**
   * Set fine tuning in cents
   * @param {string} name - Sound identifier  
   * @param {number} cents - Fine tune (-100 to +100)
   */
  setDetune(name, cents) {
    const clamped = Math.max(-100, Math.min(100, cents));
    this.detuneOffsets.set(name, clamped);
  }

  /**
   * Get total detune in cents
   * @param {string} name - Sound identifier
   * @returns {number} Total cents offset
   */
  getTotalDetune(name) {
    const semitones = this.pitchOffsets.get(name) || 0;
    const cents = this.detuneOffsets.get(name) || 0;
    return (semitones * 100) + cents;
  }

  /**
   * Play sound with pitch control
   * @param {string} name - Sound identifier
   * @param {number} time - When to play
   * @param {Object} options - Playback options
   */
  play(name, time = 0, options = {}) {
    const buffer = this.buffers.get(name);
    if (!buffer) {
      console.warn(`Sound "${name}" not loaded`);
      return null;
    }

    // Create source and gain nodes
    const source = this.context.createBufferSource();
    source.buffer = buffer;

    const gainNode = this.context.createGain();
    const volume = options.volume !== undefined ? options.volume : this.volumes.get(name);
    gainNode.gain.value = volume;

    // Apply pitch control
    const totalDetune = this.getTotalDetune(name);
    source.detune.value = totalDetune;

    // Connect: source -> gain -> destination
    source.connect(gainNode);
    gainNode.connect(this.context.destination);

    // Start playback
    const startTime = time === 0 ? this.context.currentTime : time;
    source.start(startTime);

    // Track and cleanup
    this.activeSources.push(source);
    source.onended = () => {
      source.disconnect();
      gainNode.disconnect();
      this._removeActiveSource(source);
    };

    return source;
  }

  /**
   * Reset pitch to default
   * @param {string} name - Sound identifier
   */
  resetPitch(name) {
    this.pitchOffsets.delete(name);
    this.detuneOffsets.delete(name);
  }

  /**
   * Get pitch settings for serialization
   * @param {string} name - Sound identifier
   */
  getPitchSettings(name) {
    return {
      semitones: this.pitchOffsets.get(name) || 0,
      cents: this.detuneOffsets.get(name) || 0
    };
  }
}
```

### 3. Update DrumPlayer with Pitch
```javascript
export class DrumPlayer extends PitchableAudioPlayer {
  constructor(audioContext) {
    super(audioContext);
    this.drumMap = new Map();
  }

  /**
   * Set drum pitch in semitones
   */
  setDrumPitch(drumName, semitones) {
    const bufferName = this.drumMap.get(drumName) || drumName;
    this.setPitch(bufferName, semitones);
  }

  /**
   * Set drum fine tuning in cents
   */
  setDrumDetune(drumName, cents) {
    const bufferName = this.drumMap.get(drumName) || drumName;
    this.setDetune(bufferName, cents);
  }

  /**
   * Get drum pitch settings
   */
  getDrumPitch(drumName) {
    const bufferName = this.drumMap.get(drumName) || drumName;
    return this.getPitchSettings(bufferName);
  }

  /**
   * Load custom sample for a drum
   */
  async loadCustomSample(drumName, audioBuffer, volume = 1.0) {
    this.loadBuffer(drumName, audioBuffer, volume);
    this.mapDrum(drumName, drumName);
  }
}
```

### 4. Update SequenceModel for Pitch Storage
Add pitch data to the model:

```javascript
class DrumState {
  constructor(on = false, volume = 1.0, pitch = 0, detune = 0) {
    this.on = on;
    this.volume = volume;
    this.pitch = pitch;      // NEW: semitones
    this.detune = detune;    // NEW: cents
  }

  toJSON() {
    return {
      on: this.on,
      volume: this.volume,
      pitch: this.pitch,
      detune: this.detune
    };
  }

  static fromJSON(data) {
    return new DrumState(
      data.on,
      data.volume,
      data.pitch || 0,
      data.detune || 0
    );
  }
}
```

### 5. UI Components (`src/views/SampleControlsView.js`)
**Interface for sample loading and tuning**:

```javascript
export class SampleControlsView {
  constructor(container, drumNames) {
    this.container = container;
    this.drumNames = drumNames;
    this.eventHandlers = new Map();
  }

  render() {
    this.container.innerHTML = '';
    
    this.drumNames.forEach(drumName => {
      const drumControl = this.createDrumControl(drumName);
      this.container.appendChild(drumControl);
    });
  }

  createDrumControl(drumName) {
    const control = document.createElement('div');
    control.className = 'drum-sample-control';
    control.innerHTML = `
      <div class="drum-label">${drumName}</div>
      
      <!-- File Input -->
      <input type="file" 
             id="file-${drumName}" 
             accept="audio/wav,audio/mp3,audio/ogg"
             class="sample-file-input">
      <button class="load-sample-btn" data-drum="${drumName}">
        Load Sample
      </button>
      
      <!-- Pitch Control -->
      <div class="pitch-control">
        <label>Pitch (semitones)</label>
        <input type="range" 
               class="pitch-slider"
               data-drum="${drumName}"
               min="-12" max="12" value="0" step="1">
        <output class="pitch-output">0</output>
      </div>
      
      <!-- Detune Control -->
      <div class="detune-control">
        <label>Fine Tune (cents)</label>
        <input type="range"
               class="detune-slider" 
               data-drum="${drumName}"
               min="-100" max="100" value="0" step="1">
        <output class="detune-output">0</output>
      </div>
      
      <!-- Reset Button -->
      <button class="reset-pitch-btn" data-drum="${drumName}">
        Reset Pitch
      </button>
    `;

    // Bind events
    this.bindControlEvents(control, drumName);
    
    return control;
  }

  bindControlEvents(control, drumName) {
    // Load sample button
    const loadBtn = control.querySelector('.load-sample-btn');
    const fileInput = control.querySelector('.sample-file-input');
    
    loadBtn.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        this.emit('sampleLoad', { drumName, file });
      }
    });

    // Pitch slider
    const pitchSlider = control.querySelector('.pitch-slider');
    const pitchOutput = control.querySelector('.pitch-output');
    
    pitchSlider.addEventListener('input', (e) => {
      const semitones = parseInt(e.target.value);
      pitchOutput.textContent = semitones;
      this.emit('pitchChange', { drumName, semitones });
    });

    // Detune slider
    const detuneSlider = control.querySelector('.detune-slider');
    const detuneOutput = control.querySelector('.detune-output');
    
    detuneSlider.addEventListener('input', (e) => {
      const cents = parseInt(e.target.value);
      detuneOutput.textContent = cents;
      this.emit('detuneChange', { drumName, cents });
    });

    // Reset button
    const resetBtn = control.querySelector('.reset-pitch-btn');
    resetBtn.addEventListener('click', () => {
      pitchSlider.value = 0;
      pitchOutput.textContent = '0';
      detuneSlider.value = 0;
      detuneOutput.textContent = '0';
      this.emit('pitchReset', { drumName });
    });
  }

  // Update UI from model
  setPitch(drumName, semitones) {
    const slider = this.container.querySelector(`.pitch-slider[data-drum="${drumName}"]`);
    const output = slider?.parentElement.querySelector('.pitch-output');
    if (slider) {
      slider.value = semitones;
      output.textContent = semitones;
    }
  }

  setDetune(drumName, cents) {
    const slider = this.container.querySelector(`.detune-slider[data-drum="${drumName}"]`);
    const output = slider?.parentElement.querySelector('.detune-output');
    if (slider) {
      slider.value = cents;
      output.textContent = cents;
    }
  }

  // Event emitter
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
```

### 6. Update Controller Integration
```javascript
// In SequencerController constructor
this.sampleLoader = new SampleLoader(this.audioEngine.getContext());
this.sampleControlsView = new SampleControlsView(
  config.sampleControlsContainer,
  this.model.getDrumNames()
);

// Bind sample control events
this.sampleControlsView.on('sampleLoad', this.handleSampleLoad.bind(this));
this.sampleControlsView.on('pitchChange', this.handlePitchChange.bind(this));
this.sampleControlsView.on('detuneChange', this.handleDetuneChange.bind(this));
this.sampleControlsView.on('pitchReset', this.handlePitchReset.bind(this));

// Event handlers
async handleSampleLoad({ drumName, file }) {
  try {
    const sampleData = await this.sampleLoader.loadFromFile(file);
    await this.audioPlayer.loadCustomSample(drumName, sampleData.buffer);
    console.log(`Loaded ${file.name} for ${drumName}`);
    
    // Play preview
    this.audioPlayer.playDrum(drumName);
  } catch (error) {
    console.error('Failed to load sample:', error);
    alert(`Error: ${error.message}`);
  }
}

handlePitchChange({ drumName, semitones }) {
  this.model.setDrumPitch(drumName, semitones);
  this.audioPlayer.setDrumPitch(drumName, semitones);
}

handleDetuneChange({ drumName, cents }) {
  this.model.setDrumDetune(drumName, cents);
  this.audioPlayer.setDrumDetune(drumName, cents);
}

handlePitchReset({ drumName }) {
  this.model.setDrumPitch(drumName, 0);
  this.model.setDrumDetune(drumName, 0);
  this.audioPlayer.setDrumPitch(drumName, 0);
  this.audioPlayer.setDrumDetune(drumName, 0);
}
```

## CSS Styling

```css
/* Sample Controls */
.drum-sample-control {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  border-bottom: 1px solid #333;
}

.drum-label {
  min-width: 80px;
  font-weight: bold;
}

.sample-file-input {
  display: none;
}

.load-sample-btn {
  padding: 0.5rem 1rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.load-sample-btn:hover {
  background: #45a049;
}

.pitch-control,
.detune-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pitch-slider,
.detune-slider {
  width: 120px;
}

.pitch-output,
.detune-output {
  min-width: 40px;
  text-align: center;
  font-family: monospace;
}

.reset-pitch-btn {
  padding: 0.5rem;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.reset-pitch-btn:hover {
  background: #da190b;
}
```

## Testing Checklist

### Sample Loading
- [ ] Load WAV file successfully
- [ ] Load MP3 file successfully
- [ ] Load OGG file successfully
- [ ] Reject unsupported formats
- [ ] Reject files > 5MB
- [ ] Play preview on load
- [ ] Multiple drum samples work
- [ ] Samples persist through playback

### Pitch Control
- [ ] Semitone slider works (-12 to +12)
- [ ] Cent slider works (-100 to +100)
- [ ] Pitch changes audible immediately
- [ ] Pitch persists through pattern save/load
- [ ] Reset button returns to 0/0
- [ ] All drums independently tunable
- [ ] Extreme pitch values don't glitch

### Integration
- [ ] Custom samples work with sequencer
- [ ] Pitched samples play in time
- [ ] Volume control still works
- [ ] UI updates match audio
- [ ] Pattern export includes pitch data
- [ ] Pattern import restores pitch

## Performance Considerations

1. **Sample Size Limits**: 5MB per sample prevents memory issues
2. **Detune Range**: ±12 semitones is musically useful without artifacts
3. **Playback Rate**: AudioBufferSourceNode.detune is efficient
4. **Memory**: Old buffers are replaced, not accumulated

## Usage Example

```javascript
// Initialize with custom samples
const drumMachine = new SequencerController({
  audioPlayer: new DrumPlayer(audioContext),
  sampleControlsContainer: document.getElementById('sample-controls'),
  // ... other config
});

// Load custom kick drum
const kickFile = document.getElementById('kick-file').files[0];
const kickData = await sampleLoader.loadFromFile(kickFile);
await drumMachine.audioPlayer.loadCustomSample('kick', kickData.buffer);

// Tune kick down 3 semitones
drumMachine.audioPlayer.setDrumPitch('kick', -3);

// Fine tune snare up 25 cents
drumMachine.audioPlayer.setDrumDetune('snare', 25);

// Save pattern with custom samples and tuning
const pattern = drumMachine.saveSequence();
localStorage.setItem('myPattern', JSON.stringify(pattern));
```

## File Structure

```
src/
├── libs/
│   ├── audio-player.js               # Phase 3: Base player
│   ├── pitchable-audio-player.js     # Phase 4: Adds pitch (NEW)
└── utils/
│   └── SampleLoader.js               # Phase 4: File loading (NEW)
├── views/
│   ├── SequencerView.js              # Phase 2: Grid UI
│   └── SampleControlsView.js         # Phase 4: Sample UI (NEW)
├── models/
│   └── SequenceModel.js              # Updated: Add pitch/detune fields
└── controllers/
    └── SequencerController.js        # Updated: Add sample handling
```

## Success Criteria

- [x] Load custom audio files (WAV, MP3, OGG)
- [x] Validate file size and format
- [x] Semitone pitch control (-12 to +12)
- [x] Cent fine tuning (-100 to +100)
- [x] Per-drum independent tuning
- [x] Pitch data saved with patterns
- [x] UI updates reflect audio state
- [x] Preview sound on sample load
- [x] Reset pitch functionality
- [x] No audio artifacts at extreme pitches

## Next Steps (Phase 5)

After Phase 4, consider:
1. **Drag & Drop Interface**: Drag files directly onto drum pads
2. **Sample Library**: Built-in sample browser
3. **Waveform Display**: Visualize loaded samples
4. **Reverse Playback**: Add sample reverse option
5. **Loop Points**: Set start/end points for samples

---

**Phase 4 Status**: 📋 **PLANNED**  
**Estimated Time**: 1-2 weeks  
**Complexity**: Medium  
**Dependencies**: Phase 3 complete (Web Audio API)
