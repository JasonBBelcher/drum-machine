// DOM element references

let dmDiv = document.querySelector(".dm");
let element = document.createElement("div");
const start = document.querySelector("#start");
const reset = document.querySelector("#reset");
const volumeSliders = document.querySelectorAll(".vol-slider");
const volumeOutputContainer = document.querySelector(".volume-output");
const seqLengthSlider = document.querySelector(".seq-length-slider");
const seqLengthOutput = document.querySelector(".seq-length-output");
const seqTempoSlider = document.querySelector(".seq-tempo-slider");
const seqTempoOutput = document.querySelector(".seq-tempo-output");

// DRUM SEQUENCER UI LOGIC
/**************************/

// view object to contain all methods that deal with rendering.

const view = {};

// start the drum sequence

start.addEventListener("click", function() {
  if (!transport.isPlaying) {
    this.classList.toggle("play-stop-btn-red", true);
    this.textContent = "stop";
    transport.start(transport.seq);
  } else {
    this.textContent = "play";
    this.classList.toggle("play-stop-btn-red", false);
    transport.stop();
  }
});

reset.addEventListener("mousedown", function() {
  this.classList.toggle("reset-btn-flash-yellow", true);
});

// reset state to defaults;

reset.addEventListener("mouseup", function() {
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

seqLengthSlider.addEventListener("input", function(e) {
  transport.stopSeqAndReset(e.target.value);
  seqLengthOutput.innerText = e.target.value + " steps";
});

seqTempoSlider.addEventListener("input", function(e) {
  transport.restartSeqAfterTempoChange(e.target.value);
  seqTempoOutput.innerText = e.target.value + " BPM";
});

// helper function to create dom elements dynamically

view.createNewElement = function(
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
  slider.addEventListener("input", function(e) {
    output.innerText = slider.name + " v : " + e.target.value;
  });
});

// grabs volume level from UI and sets the level in the sequencer engine

view.getVolumeSettingsAndSetVolumeState = function(dmState) {
  volumeSliders.forEach((slider) => {
    if (dmState[slider.name]) {
      dmState[slider.name].setVolume(slider.value);
      // set slider value when loading from localStorage
      slider.value = dmState[slider.name].volume;
    }
  });
};

// load volumes after loading localStorage sequence
view.loadVolumeSettings = function(dmState) {
  volumeSliders.forEach((slider) => {
    if (dmState[slider.name]) {
      slider.value = dmState[slider.name].volume;
    }
  });
};

view.loadSeqBtnViewState = function(seq) {
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

view.addBtnHandler = function(el, currentState, drumName) {
  if (currentState && drumName) {
    el.addEventListener("click", function() {
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

view.spawnSeqBtns = function(sequence = []) {
  self = this;
  Object.keys(sequence[0]).forEach((key, i) => {
    if (key !== "id") {
      self.createNewElement(
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
          "seq-col" + j,
          "seq" + i
        );
      }
    });
  });
};

/* this function is consumed by the start method
 of the drum machine engine and turns a light indicator
 on and off quickly as the playhead loops
*/

view.playHeadPosition = function(index) {
  document.querySelectorAll(".seq-col" + index).forEach((seqBtn) => {
    seqBtn.classList.add("seq-playhead");
  });
  setTimeout(() => {
    document.querySelectorAll(".seq-col" + index).forEach((seqBtn) => {
      seqBtn.classList.remove("seq-playhead");
    });
  }, transport.tempo);
};
