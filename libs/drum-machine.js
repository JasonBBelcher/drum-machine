// DRUM SEQUENCER ENGINE
/************************************************************************
  This serves as the engine for the sequnce and handles all state changes
  in the sequence loop.  Howler is used to fire the one hit samples and
  the engine handles the rest.
*************************************************************************/

// feed howler sound lib with sounds from the server

const kick = new Howl({
  src: [
    `${
      location.origin
    }/samples/Deep%20House%20Drum%20Samples/bd_kick/bd_909dwsd.wav`
  ],
  html5: true
});
const clap = new Howl({
  src: [
    `${
      location.origin
    }/samples/Deep%20House%20Drum%20Samples/clap/clp_analogue.wav`
  ],
  html5: true
});
const snare = new Howl({
  src: [
    `${
      location.origin
    }/samples/Deep%20House%20Drum%20Samples/snare/snr_answer8bit.wav`
  ],
  html5: true
});
const hat = new Howl({
  src: [
    `${
      location.origin
    }/samples/Deep%20House%20Drum%20Samples/hats/hat_darkstar.wav`
  ],
  html5: true
});
const shaker = new Howl({
  src: [
    `${
      location.origin
    }/samples/Deep%20House%20Drum%20Samples/shaker_tambourine/shaker_quicky.wav`
  ],
  html5: true
});
const bongo1 = new Howl({
  src: [
    `${
      location.origin
    }/samples/Deep%20House%20Drum%20Samples/percussion/prc_bongodrm.wav`
  ],
  html5: true
});
const congaz = new Howl({
  src: [
    `${
      location.origin
    }/samples/Deep%20House%20Drum%20Samples/percussion/prc_congaz.wav`
  ],
  html5: true
});
const harmony = new Howl({
  src: [
    `${
      location.origin
    }/samples/Deep%20House%20Drum%20Samples/percussion/prc_harmony.wav`
  ],
  html5: true
});

/* For each tick in a sequence this object will be checked
   to determine what instruments need
   to be triggered for the current tick.
*/

function DrumMachineState(id) {
  this.id = id;
  this.kick = {
    on: false,
    name: "kick",
    volume: volume => (kick._volume = volume),
    play: () => kick.play()
  };
  this.clap = {
    on: false,
    name: "clap",
    volume: volume => (clap._volume = volume),
    play: () => clap.play()
  };
  this.snare = {
    on: false,
    name: "snare",
    volume: volume => (snare._volume = volume),
    play: () => snare.play()
  };
  this.hat = {
    on: false,
    name: "hat",
    volume: volume => (hat._volume = volume),
    play: () => hat.play()
  };
  this.shaker = {
    on: false,
    name: "shaker",
    volume: volume => (shaker._volume = volume),
    play: () => shaker.play()
  };
  this.bongo = {
    on: false,
    name: "bongo",
    volume: volume => (bongo1._volume = volume),
    play: () => bongo1.play()
  };
  this.conga = {
    on: false,
    name: "conga",
    volume: volume => (congaz._volume = volume),
    play: () => congaz.play()
  };
  this.perc = {
    on: false,
    name: "perc",
    volume: volume => (harmony._volume = volume),
    play: () => harmony.play()
  };
}
// used by drum machine to retrieve samples set to on = true or not to play on = false;
// if sample on = true then play the sample using howler

DrumMachineState.prototype.getState = function(drum) {
  return this[drum];
};
DrumMachineState.prototype.setState = function(drum, on = true, volume) {
  this[drum].on = on;
  this[drum].volume(volume) || this[drum].volume(1);
  this[drum].name = drum;
};

// dependency inject the drum machine state into sequencer

function Sequencer(length) {
  this.drumMachineState = DrumMachineState;
  this.length = length;
  this.sequence = [];
}

// use this to initialize the sequence with state.
// each use there after will reset the sequence

Sequencer.prototype.initSeq = function(ticks) {
  if (ticks) {
    this.length = ticks;
  }

  this.sequence = [];
  for (let i = 0; i < this.length; i += 1) {
    this.sequence.push(new this.drumMachineState(i + 1));
  }
  view.spawnSeqBtns(this.sequence);
  return this.sequence;
};

// not used currently. Not sure where to use it yet

function calculateTicks(bars) {
  let tickMultiples = [];
  if (bars % 4 == 0 && bars % 3 !== 0) {
    for (var i = 0; i <= bars; i += 1) {
      if ((i * 16) % 16 === 0) {
        tickMultiples.push(i * 16);
      }
    }
    return tickMultiples;
  } else {
    return tickMultiples;
  }
}

/*
drum machine player (transport)
This singleton object consumes the Senquencer and drumMachineState class
*/

const dm = {
  isPlaying: false,
  playingSeq: null,
  playHead: 0,
  tempo: 800,
  // calculate bpm to milliseconds for setInterval second arg
  setTempo: function(tempo, ticksPerBeat = 1) {
    let ms;
    switch (ticksPerBeat) {
      case 1:
        ms = 60000 / tempo;
        break;
      case 2:
        ms = 30000 / tempo;
        break;
      case 4:
        ms = 15000 / tempo;
        break;
      default:
        ms = 15000 / tempo;
    }
    this.tempo = ms;
  },
  /* start the sequence and loop the play head
  setInterval keeps the tempo and allows
  the sounds to be triggered at the playHead index
  */

  start: function start(initializedSequence) {
    if (!this.isPlaying) {
      this.playingSeq = setInterval(() => {
        this.isPlaying = true;
        this.triggerSounds(initializedSequence[this.playHead]);
        view.playHeadPosition(this.playHead);
        this.playHead++;
        if (this.playHead >= initializedSequence.length) {
          this.playHead = 0;
        }
      }, this.tempo);
    }
  },

  /*
    stop the sequence and clear the interval
  */
  stop: function stop() {
    this.playHead = 0;
    clearInterval(this.playingSeq);
    this.isPlaying = false;
  },
  /*
    runs through the drum state object and plays all the sounds
    at the given playhead index that are set to boolean = true;
  */
  triggerSounds: function triggerSounds(dmState) {
    for (let drum in dmState) {
      view.getVolumeSettingsAndSetVolumeState(dmState);
      if (dmState.hasOwnProperty(drum)) {
        if (dmState[drum].on) {
          dmState.getState(drum).play();
        }
      }
    }
  }
};
