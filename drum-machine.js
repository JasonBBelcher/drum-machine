const start = document.querySelector("#start");
const stop = document.querySelector("#stop");

let power = false;

var kick = new Howl({
  src: [
    `${
      location.origin
    }/samples/Deep%20House%20Drum%20Samples/bd_kick/bd_909dwsd.wav`
  ]
});
var clap = new Howl({
  src: [
    `${
      location.origin
    }/samples/Deep%20House%20Drum%20Samples/clap/clp_analogue.wav`
  ]
});
var hat = new Howl({
  src: [
    `${
      location.origin
    }/samples/Deep%20House%20Drum%20Samples/hats/hat_darkstar.wav`
  ]
});
var shaker = new Howl({
  src: [
    `${
      location.origin
    }/samples/Deep%20House%20Drum%20Samples/shaker_tambourine/shaker_quicky.wav`
  ]
});
var bongo1 = new Howl({
  src: [
    `${
      location.origin
    }/samples/Deep%20House%20Drum%20Samples/percussion/prc_bongodrm.wav`
  ]
});
var congaz = new Howl({
  src: [
    `${
      location.origin
    }/samples/Deep%20House%20Drum%20Samples/percussion/prc_congaz.wav`
  ]
});

// For each tick in a sequence this object will be checked
// to determine what instruments need
// to be triggered for the current tick.

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
  this.perc = {
    on: false,
    name: "perc",
    volume: volume => (bongo1._volume = volume),
    play: () => bongo1.play()
  };
  this.perc2 = {
    on: false,
    name: "perc2",
    volume: volume => (congaz._volume = volume),
    play: () => congaz.play()
  };
}

DrumMachineState.prototype.getState = function(name) {
  return this[name];
};
DrumMachineState.prototype.setState = function(name, on, volume) {
  this[name].on = on;
  this[name].volume(volume) || this[name].volume(1);
  this[name].name = name;
};

// dependency inject the drum machine state into sequencer
function Sequencer(drumMachineState, length) {
  this.drumMachineState = drumMachineState;
  this.length = length;
  this.sequence = [];
}

Sequencer.prototype.initSeq = function() {
  for (let i = 0; i < this.length; i += 1) {
    this.sequence.push(new this.drumMachineState(i + 1));
  }

  return this.sequence;
};

// drum machine player
const dm = {
  isPlaying: false,
  playingSeq: null,
  playHead: 0,
  tempo: 800,
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
  start: function start(initializedSequence) {
    if (!this.isPlaying) {
      this.playingSeq = setInterval(() => {
        this.isPlaying = true;
        this.triggerSounds(initializedSequence[this.playHead]);
        this.playHead++;
        if (this.playHead === initializedSequence.length) {
          this.playHead = 0;
        }
      }, this.tempo);
    }
  },
  stop: function stop(m) {
    return new Promise(resolve => {
      if (m === undefined) {
        clearInterval(this.playingSeq);
        this.isPlaying = false;
        return resolve();
      }
      setTimeout(() => {
        clearInterval(this.playingSeq);
        this.isPlaying = false;
        return resolve();
      }, m);
    });
  },
  triggerSounds: function triggerSounds(dmState) {
    for (let instrument in dmState) {
      if (dmState.hasOwnProperty(instrument)) {
        if (dmState[instrument].on) {
          dmState.getState(instrument).play();
        }
      }
    }
  }
};

let sequencer = new Sequencer(DrumMachineState, 16);
let seq = sequencer.initSeq();
seq[0].setState("kick", true, 1);
seq[6].setState("kick", true, 0.8);
seq[14].setState("kick", true, 0.8);
seq[4].setState("clap", true, 0.5);
seq[12].setState("clap", true, 0.5);
seq[15].setState("clap", true, 0.5);
seq[0].setState("hat", true, 0.2);
seq[2].setState("hat", true, 0.2);
seq[4].setState("hat", true, 0.2);
seq[6].setState("hat", true, 0.2);
seq[8].setState("hat", true, 0.2);
seq[10].setState("hat", true, 0.2);
seq[12].setState("hat", true, 0.2);
seq[14].setState("hat", true, 0.2);
seq[0].setState("shaker", true, 0.2);
seq[1].setState("shaker", true, 0.1);
seq[2].setState("shaker", true, 0.2);
seq[3].setState("shaker", true, 0.1);
seq[4].setState("shaker", true, 0.2);
seq[5].setState("shaker", true, 0.1);
seq[6].setState("shaker", true, 0.2);
seq[7].setState("shaker", true, 0.1);
seq[8].setState("shaker", true, 0.2);
seq[9].setState("shaker", true, 0.1);
seq[10].setState("shaker", true, 0.2);
seq[11].setState("shaker", true, 0.1);
seq[12].setState("shaker", true, 0.2);
seq[13].setState("shaker", true, 0.1);
seq[14].setState("shaker", true, 0.2);
seq[15].setState("shaker", true, 0.1);
seq[3].setState("perc", true, 0.1);
seq[9].setState("perc2", true, 0.1);

dm.setTempo(120, 4);

start.addEventListener("click", function() {
  dm.start(seq);
});
stop.addEventListener("click", function() {
  dm.stop();
});
