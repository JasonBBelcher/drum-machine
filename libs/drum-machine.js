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
    id: 1,
    on: false,
    name: "kick",
    volume: "",
    setVolume: function(v) {
      kick._volume = v;
      this.volume = v;
    },
    play: () => kick.play()
  };
  this.clap = {
    id: 2,
    on: false,
    name: "clap",
    volume: "",
    setVolume: function(v) {
      clap._volume = v;
      this.volume = v;
    },
    play: () => clap.play()
  };
  this.snare = {
    id: 3,
    on: false,
    name: "snare",
    volume: "",
    setVolume: function(v) {
      snare._volume = v;
      this.volume = v;
    },
    play: () => snare.play()
  };
  this.hat = {
    id: 4,
    on: false,
    name: "hat",
    volume: "",
    setVolume: function(v) {
      hat._volume = v;
      this.volume = v;
    },
    play: () => hat.play()
  };
  this.shaker = {
    id: 5,
    on: false,
    name: "shaker",
    setVolume: function(v) {
      shaker._volume = v;
      this.volume = v;
    },
    play: () => shaker.play()
  };
  this.bongo1 = {
    id: 6,
    on: false,
    name: "bongo1",
    volume: "",
    setVolume: function(v) {
      bongo1._volume = v;
      this.volume = v;
    },
    play: () => bongo1.play()
  };
  this.congaz = {
    id: 7,
    on: false,
    name: "congaz",
    volume: "",
    setVolume: function(v) {
      congaz._volume = v;
      this.volume = v;
    },
    play: () => congaz.play()
  };
  this.harmony = {
    id: 8,
    on: false,
    name: "harmony",
    volume: "",
    setVolume: function(v) {
      harmony._volume = v;
      this.volume = v;
    },
    play: () => harmony.play()
  };
}
// used by drum machine to retrieve samples set to on = true or not to play on = false;
// if sample on = true then play the sample using howler

DrumMachineState.prototype.setState = function(drum, on = true, setVolume) {
  this[drum].on = on;
  this[drum].setVolume(setVolume) || this[drum].setVolume(1);
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
    this.sequence.push(new this.drumMachineState(i));
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
