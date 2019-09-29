const {
  Howl
} = require('howler');


const kickwave = require('../samples/bd_kick/bd_909dwsd.wav');
const clapwave = require('../samples/clap/clp_analogue.wav');
const snarewave = require('../samples/snare/snr_answer8bit.wav');
const hatwave = require('../samples/hats/hat_analog.wav');
const shakerwave = require('../samples/shaker_tambourine/shaker_quicky.wav');
const bongowave = require('../samples/percussion/prc_bongodrm.wav');
const congawave = require('../samples/percussion/prc_congaz.wav');
const harmonywave = require('../samples/percussion/prc_harmony.wav');



JSONfn = {};

// helper function to preserve functions on sequence objects
JSONfn.stringify = function (obj) {
  return JSON.stringify(obj, function (key, value) {
    return typeof value === "function" ? value.toString() : value;
  });
};

JSONfn.parse = function (str) {
  return JSON.parse(str, function (key, value) {
    if (typeof value != "string") return value;
    return value.match(/=>|function/gi) ? eval("(" + value + ")") : value;
  });
};


// DOM element references

let dmDiv = document.querySelector(".dm");
let element = document.createElement("div");
const start = document.querySelector("#start");
const reset = document.querySelector("#reset");
const saveBtn = document.querySelector("#save");
const deleteBtn = document.querySelector("#delete");
const saveInput = document.querySelector("#input-save");
const volumeSliders = document.querySelectorAll(".vol-slider");
const volumeOutputContainer = document.querySelector(".volume-output");
const seqLengthSlider = document.querySelector(".seq-length-slider");
const seqLengthOutput = document.querySelector(".seq-length-output");
const seqTempoSlider = document.querySelector(".seq-tempo-slider");
const seqTempoOutput = document.querySelector(".seq-tempo-output");
const savedSequenceSelector = document.querySelector(".saved-sequences");

// DRUM SEQUENCER UI LOGIC
/**************************/

// view object to contain all methods that deal with rendering.

const view = {};

// start the drum sequence

start.addEventListener("click", clickStart);

function clickStart() {
  if (!transport.isPlaying) {
    this.classList.toggle("play-stop-btn-red", true);
    this.textContent = "stop";
    transport.start(transport.seq);
  } else {
    this.textContent = "play";
    this.classList.toggle("play-stop-btn-red", false);
    transport.stop();
  }
}

reset.addEventListener("mousedown", function () {
  this.classList.toggle("reset-btn-flash-yellow", true);
});

// reset state to defaults;

reset.addEventListener("mouseup", function () {
  transport.stopSeqAndReset(16);
  this.classList.toggle("reset-btn-flash-yellow", false);
  seqLengthSlider.value = 16;
  seqLengthOutput.innerText = "16 steps";
  transport.setTempo(120, 4);
  seqTempoSlider.value = 120;
  seqTempoOutput.innerText = "120 BPM";
});

/*
  when changing the sequence length
  stop playing to prevent weird bug
  then calls the stopSeqAndReset function
   which in turn changes the engines
   sequence length
*/

seqLengthSlider.addEventListener("input", function (e) {
  transport.stopSeqAndReset(e.target.value);
  seqLengthOutput.innerText = e.target.value + " steps";
});

seqTempoSlider.addEventListener("input", function (e) {
  transport.restartSeqAfterTempoChange(e.target.value);
  seqTempoOutput.innerText = e.target.value + " BPM";
});

// helper function to create dom elements dynamically

view.createNewElement = function (
  parentEl,
  childEl,
  currentState,
  drumName,
  ...classList
) {
  childEl = document.createElement(childEl);
  childEl.classList.add(...classList);
  parentEl.appendChild(childEl);
  if (currentState && drumName) {
    this.addBtnHandler(childEl, currentState, drumName);
  }
  return childEl;
};

/* builds out the volume sliders and
  respective volume level output
*/

volumeSliders.forEach((slider) => {
  let output = view.createNewElement(
    volumeOutputContainer,
    "div",
    null,
    null,

    "track-volume-output"
  );
  output.innerText = slider.name + " v : 0.50";
  slider.addEventListener("input", function (e) {
    output.innerText = slider.name + " v : " + e.target.value;
  });
});

// grabs volume level from UI and sets the level in the sequencer engine

view.getVolumeSettingsAndSetVolumeState = function (dmState) {
  volumeSliders.forEach((slider) => {
    if (dmState[slider.name]) {
      dmState[slider.name].setVolume(slider.value);
      // set slider value when loading from localStorage
      slider.value = dmState[slider.name].volume;
    }
  });
};

// load volumes after loading localStorage sequence
view.loadVolumeSettings = function (dmState) {
  volumeSliders.forEach((slider) => {
    if (dmState[slider.name]) {
      slider.value = dmState[slider.name].volume;
    }
  });
};

view.loadSeqBtnViewState = function (seq) {
  seq.forEach((drumState, i) => {
    if (drumState) {
      for (let drum in drumState) {
        if (drumState.hasOwnProperty(drum)) {
          if (drumState[drum].on === true) {
            document
              .querySelector(".seq" + drumState[drum].id + "-" + i)
              .classList.add("btn-on");
          }
        }
      }
      view.loadVolumeSettings(drumState);
    }
  });
};

/* sets up a event handler on each sequence btn to enable the user
  to turn on/off individual drum sounds in the engine and reflects that state
  in the UI
*/

view.addBtnHandler = function (el, currentState, drumName) {
  if (currentState && drumName) {
    el.addEventListener("click", function () {
      let clicked = false;
      if (drumName.on === clicked) {
        drumName.on = true;
        clicked = !clicked;
        el.classList.add("btn-on");
      } else if (!drumName.on === clicked) {
        drumName.on = false;
        clicked = !clicked;
        el.classList.remove("btn-on");
        el.classList.add("seq-btn");
      }
    });
  }
};

/*
when sequencer is instantiated this function
will build out the UI for the drum machine
sequencer that the user interacts with.
*/

view.spawnSeqBtns = function (sequence = []) {
  Object.keys(sequence[0]).forEach((key, i) => {
    if (key !== "id") {
      this.createNewElement(
        dmDiv,
        "div",
        null,
        null,
        "seq-container",
        "seq-row" + i
      );
    }
    sequence.forEach((dmState, j) => {
      if (dmState[key].name === key) {
        this.createNewElement(
          document.querySelector(".seq-row" + i),
          "div",
          dmState,
          dmState[key],
          "seq-btn",
          "col-seq" + j,
          "seq" + i + "-" + j
        );
      }
    });
  });

  for (let k = 0; k < sequence.length; k += 4) {
    const seqCols = document.querySelectorAll(".col-seq" + k).forEach((btn) => {
      btn.classList.add("seq-btn-quarter-beat");
    });
  }
};

view.createOptionsFromSavedSequences = function () {
  document.querySelectorAll("option").forEach((option) => {
    if (option.value !== "keep") option.remove();
  });

  savedSequenceSelector.removeEventListener("change", load);
  const sequences = JSONfn.parse(localStorage.getItem("sequences"));
  Object.keys(sequences).forEach((k) => {
    let option = this.createNewElement(
      savedSequenceSelector,
      "option",
      null,
      null
    );
    option.text = k;
    option.value = k;
  });
  savedSequenceSelector.addEventListener("change", load);

  function load(e) {
    start.textContent = "play";
    start.classList.toggle("play-stop-btn-red", false);
    transport.stop();

    if (e.target.value !== "keep") {
      saveInput.value = e.target.value;
      transport.loadSeq(e.target.value);
    }
    if (e.target.value === "keep") {
      transport.initSeq(16);
    }
  }
};

// save state to localStorage

saveBtn.addEventListener("mousedown", function () {
  this.classList.toggle("save-btn-flash-yellow", true);
});

saveBtn.addEventListener("mouseup", function () {
  this.classList.toggle("save-btn-flash-yellow", false);
  if (saveInput.value !== "") {
    start.textContent = "play";
    start.classList.toggle("play-stop-btn-red", false);
    transport.stop();

    transport.saveSeq(saveInput.value);
    transport.initSeq(16);
  }
});

deleteBtn.addEventListener("click", function () {
  start.textContent = "play";
  start.classList.toggle("play-stop-btn-red", false);
  transport.stop();

  if (saveInput.value !== "") {
    transport.deleteSeq(saveInput.value);
    transport.initSeq(16);
    document.querySelectorAll("option").forEach((option) => {
      if (option.value === saveInput.value) {
        saveInput.value = "";
        option.remove();
      }
    });
  }
});

/* this function is consumed by the start method
 of the drum machine engine and turns a light indicator
 on and off quickly as the playhead loops
*/

view.playHeadPosition = function (index) {
  document.querySelectorAll(".col-seq" + index).forEach((seqBtn) => {
    seqBtn.classList.add("seq-playhead");
  });
  setTimeout(() => {
    document.querySelectorAll(".col-seq" + index).forEach((seqBtn) => {
      seqBtn.classList.remove("seq-playhead");
    });
  }, transport.tempo);
};


const transport = {
  sequencer: null,
  seq: [],
  isPlaying: false,
  playingSeq: null,
  playHead: 0,
  tempo: 800,
  initSeq: function (ticks) {
    dmDiv.innerHTML = "";
    this.sequencer = new Sequencer(ticks);
    this.seq = this.sequencer.initSeq();
    view.createOptionsFromSavedSequences();


  },

  stopSeqAndReset: function stopSeqAndReset(ticks) {
    dmDiv.innerHTML = "";
    this.sequencer = new Sequencer(ticks);
    this.seq = this.sequencer.initSeq();
    transport.stop();
    start.innerHTML = "play";
    start.classList.toggle("play-stop-btn-red", false);
  },

  restartSeqAfterTempoChange: function (value) {
    transport.setTempo(value, 4);
    if (transport.isPlaying) {
      transport.stop();
      transport.start(this.seq);
    }
  },

  saveSeq: function (seqName) {
    const sequence = {
      [seqName]: this.seq
    };
    const sequences = JSONfn.parse(localStorage.getItem("sequences"));
    const merged = Object.assign({}, sequences, sequence);
    const stringedBeats = JSONfn.stringify(merged);

    localStorage.setItem("sequences", JSONfn.stringify(merged));
  },

  deleteSeq: function (seqName) {

    const sequence = {
      [seqName]: this.sequencer.initSeq()
    };
    const sequences = JSONfn.parse(localStorage.getItem("sequences"));

    const merged = Object.assign({}, sequences, sequence);

    localStorage.setItem("sequences", JSONfn.stringify(merged));
  },

  loadSeq: function (seqName) {
    dmDiv.innerHTML = "";

    const sequences = JSONfn.parse(localStorage.getItem("sequences"));
    this.seq = sequences[seqName];
    view.spawnSeqBtns(this.seq);
    seqLengthOutput.innerText = this.seq.length + " steps";
    seqLengthSlider.value = this.seq.length;
    view.loadSeqBtnViewState(this.seq);
  },

  // calculate bpm to milliseconds for setInterval second arg
  setTempo: function (tempo, ticksPerBeat) {
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
          dmState[drum].play();
        }
      }
    }
  }
};


// feed howler sound lib with sounds from the server

const kick = new Howl({
  src: [
    kickwave
  ],
  html5: true
});
const clap = new Howl({
  src: [
    clapwave
  ],
  html5: true
});
const snare = new Howl({
  src: [
    snarewave
  ],
  html5: true
});
const hat = new Howl({
  src: [
    hatwave
  ],
  html5: true
});
const shaker = new Howl({
  src: [
    shakerwave
  ],
  html5: true
});
const bongo1 = new Howl({
  src: [
    bongowave
  ],
  html5: true
});
const congaz = new Howl({
  src: [
    congawave
  ],
  html5: true
});
const harmony = new Howl({
  src: [
    harmonywave
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
    setVolume: function (v) {
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
    setVolume: function (v) {
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
    setVolume: function (v) {
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
    setVolume: function (v) {
      hat._volume = v;
      this.volume = v;
    },
    play: () => hat.play()
  };
  this.shaker = {
    id: 5,
    on: false,
    name: "shaker",
    setVolume: function (v) {
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
    setVolume: function (v) {
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
    setVolume: function (v) {
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
    setVolume: function (v) {
      harmony._volume = v;
      this.volume = v;
    },
    play: () => harmony.play()
  };
}
// used by drum machine to retrieve samples set to on = true or not to play on = false;
// if sample on = true then play the sample using howler

DrumMachineState.prototype.setState = function (drum, on = true, setVolume) {
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

Sequencer.prototype.initSeq = function (ticks) {
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


/*
drum machine player (transport)
This singleton object consumes the Senquencer and drumMachineState class
*/
transport.setTempo(120, 4);

transport.initSeq(16);