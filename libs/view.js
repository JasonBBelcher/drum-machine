dm.setTempo(120, 4);

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

// start the drum sequence

start.addEventListener("click", function() {
  if (!dm.isPlaying) {
    this.classList.toggle("play-stop-btn-red", true);
    this.textContent = "stop";
    dm.start(seq);
  } else {
    this.textContent = "play";
    this.classList.toggle("play-stop-btn-red", false);
    dm.stop();
  }
});

reset.addEventListener("mousedown", function() {
  this.classList.toggle("reset-btn-flash-yellow", true);
});

// reset state to defaults;

reset.addEventListener("mouseup", function() {
  stopSeqAndReset(16);
  this.classList.toggle("reset-btn-flash-yellow", false);
  seqLengthSlider.value = 16;
  seqLengthOutput.innerText = "16 ticks";
  dm.setTempo(120, 4);
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
  stopSeqAndReset(e.target.value);
  seqLengthOutput.innerText = e.target.value + " ticks";
});

seqTempoSlider.addEventListener("input", function(e) {
  restartSeqAfterTempoChange(e.target.value);
  seqTempoOutput.innerText = e.target.value + " BPM";
});

/* builds out the volume sliders and
  respective volume level output
*/

volumeSliders.forEach(slider => {
  let output = createNewElement(
    volumeOutputContainer,
    "div",
    null,
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

function getVolumeSettingsAndSetVolumeState(dmState) {
  volumeSliders.forEach(slider => {
    if (dmState[slider.name]) {
      dmState[slider.name].volume(slider.value);
    }
  });
}

// helper function to create dom elements dynamically

function createNewElement(
  parentEl,
  childEl,
  currentState,
  drumName,
  cb,
  ...classList
) {
  childEl = document.createElement(childEl);
  childEl.classList.add(...classList);
  parentEl.appendChild(childEl);
  if (cb && currentState && drumName) {
    cb(childEl, currentState, drumName);
  }
  return childEl;
}

/* sets up a event handler on each sequence btn to enable the user
  to turn on/off individual drum sounds in the engine and reflects that state
  in the UI
*/

function addBtnHandler(el, currentState, drumName) {
  if (currentState && drumName) {
    el.addEventListener("click", function() {
      let clicked = false;
      if (drumName.on === clicked) {
        currentState.setState(drumName.name, true);
        clicked = !clicked;
        el.classList.add("btn-on");
      } else if (!drumName.on === clicked) {
        currentState.setState(drumName.name, false);
        clicked = !clicked;
        el.classList.remove("btn-on");
        el.classList.add("seq-btn");
      }
    });
  }
}

/*
when sequencer is instantiated this function
will build out the UI for the drum machine
sequencer that the user interacts with.
*/

function spawnSeqBtns(sequence = []) {
  Object.keys(sequence[0]).forEach((key, i) => {
    if (key !== "id") {
      createNewElement(
        dmDiv,
        "div",
        null,
        null,
        null,
        "seq-container",
        "seq-row" + i
      );
    }
    sequence.forEach((dmState, j) => {
      if (dmState[key].name === key) {
        createNewElement(
          document.querySelector(".seq-row" + i),
          "div",
          dmState,
          dmState[key],
          addBtnHandler,

          "seq-btn",
          "seq" + j
        );
      }
    });
  });
}

/* this function is consumed by the start method
 of the drum machine engine and turns a light indicator
 on and off quickly as the playhead loops
*/

function playHeadPosition(index) {
  document.querySelector(".seq" + index).classList.add("seq-playhead");
  setTimeout(() => {
    document.querySelector(".seq" + index).classList.remove("seq-playhead");
  }, 50);
}
