let player = require("play-sound")();

// For each tick in a sequence this object will be checked
// to determine what instruments need
// to be triggered for the current tick.

function DrumMachineState(id) {
  this.id = id;
  this.kick = {
    on: false,
    name: "kick",
    location: "./samples/Deep House Drum Samples/bd_kick/bd_deephouser.wav"
  };
  this.clap = {
    on: false,
    name: "clap",
    location: "./samples/Deep House Drum Samples/clap/clp_analogue.wav"
  };
  this.hat = {
    on: false,
    name: "hat",
    location: "./samples/Deep House Drum Samples/hats/hat_analog.wav"
  };
  this.shaker = {
    on: false,
    name: "shaker",
    location:
      "./samples/Deep House Drum Samples/shaker_tambourine/shaker_bot.wav"
  };
  this.perc = {
    on: false,
    name: "perc",
    location: "./samples/Deep House Drum Samples/percussion/prc_bongodrm.wav"
  };
  this.perc2 = {
    on: false,
    name: "perc2",
    location: "./samples/Deep House Drum Samples/percussion/prc_congaz.wav"
  };
}

DrumMachineState.prototype.getState = function(name) {
  return this[name];
};
DrumMachineState.prototype.setState = function(name, on, volume) {
  this[name].on = on;
  this[name].volume = volume || 1;
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
      default:
        ms = 15000 / tempo;
    }
    this.tempo = ms;
  },
  start: function start(initializedSequence) {
    this.playingSeq = setInterval(() => {
      this.triggerSounds(initializedSequence[this.playHead]);
      this.playHead++;
      if (this.playHead === initializedSequence.length) {
        this.playHead = 0;
      }
    }, this.tempo);
  },
  stop: function stop(m) {
    return new Promise(resolve => {
      if (m === undefined) {
        clearInterval(this.playingSeq);
        return resolve();
      }
      setTimeout(() => {
        clearInterval(this.playingSeq);
        return resolve();
      }, m);
    });
  },
  triggerSounds: function triggerSounds(dmState) {
    for (let instrument in dmState) {
      if (dmState.hasOwnProperty(instrument)) {
        if (dmState[instrument].on) {
          console.log(dmState.getState(instrument).location);
          player.play(dmState.getState(instrument).location, {
            afplay: ["-v", dmState.getState(instrument).volume]
          });
        }
      }
    }
  }
};

let sequencer = new Sequencer(DrumMachineState, 8);
let seq = sequencer.initSeq();

seq[0].setState("kick", true, 1);
seq[4].setState("kick", true, 0.8);
seq[4].setState("clap", true);
seq[2].setState("hat", true, 0.2);
seq[6].setState("hat", true, 0.24);
seq[0].setState("shaker", true, 0.2);
seq[1].setState("shaker", true, 0.1);
seq[2].setState("shaker", true, 0.2);
seq[3].setState("shaker", true, 0.1);
seq[4].setState("shaker", true, 0.2);
seq[5].setState("shaker", true, 0.1);
seq[6].setState("shaker", true, 0.2);
seq[7].setState("shaker", true, 0.1);
seq[1].setState("perc", true, 0.3);
seq[4].setState("perc", true, 0.4);
seq[5].setState("perc", true, 0.3);
seq[2].setState("perc2", true, 0.3);
seq[3].setState("perc2", true, 0.5);
seq[7].setState("perc2", true, 0.25);

dm.setTempo(127, 4);
dm.start(seq);

dm.stop(4000).then(() => {
  seq[0].setState("kick", true, 1);
  seq[4].setState("kick", true, 0.8);
  seq[4].setState("clap", true);
  seq[2].setState("hat", true, 0.2);
  seq[6].setState("hat", true, 0.24);
  seq[0].setState("shaker", true, 0.2);
  seq[1].setState("shaker", true, 0.1);
  seq[2].setState("shaker", true, 0.2);
  seq[3].setState("shaker", true, 0.1);
  seq[4].setState("shaker", true, 0.2);
  seq[5].setState("shaker", true, 0.1);
  seq[6].setState("shaker", true, 0.2);
  seq[7].setState("shaker", true, 0.1);
  seq[1].setState("perc", true, 0.3);
  seq[2].setState("perc", true, 0.4);
  seq[0].setState("perc", true, 0.3);
  seq[4].setState("perc2", true, 0.3);
  seq[0].setState("perc2", true, 0.5);
  seq[6].setState("perc2", true, 0.25);

  dm.setTempo(127, 2);

  dm.start(seq);
  dm.stop(4000);
});
