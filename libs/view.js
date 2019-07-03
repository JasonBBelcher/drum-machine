let dmDiv = document.querySelector(".dm");
let element = document.createElement("div");

const start = document.querySelector("#start");
const volumeSliders = document.querySelectorAll("input");
const volumeOutputContainer = document.querySelector(".volume-output");

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

volumeSliders.forEach(slider => {
  let output = createNewElement(
    volumeOutputContainer,
    "div",
    null,
    null,
    null,
    "track-volume-output"
  );
  output.innerText = "0.50";
  slider.addEventListener("input", function(e) {
    output.innerText = e.target.value;
  });
});

function getVolumeSettingsAndSetVolumeState(dmState) {
  volumeSliders.forEach(slider => {
    if (dmState[slider.name]) {
      dmState[slider.name].volume(slider.value);
    }
  });
}

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

function spawnSeqBtns(sequence = []) {
  Object.keys(sequence[0]).forEach((key, i) => {
    if (key !== "id") {
      createNewElement(
        dmDiv,
        "div",
        null,
        null,
        addBtnHandler,
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

function playHeadPosition(index) {
  document.querySelector(".seq" + index).classList.add("seq-playhead");
  setTimeout(() => {
    document.querySelector(".seq" + index).classList.remove("seq-playhead");
  }, 120);
}
