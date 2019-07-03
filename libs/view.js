let dmDiv = document.querySelector(".dm");
let element = document.createElement("div");

const start = document.querySelector("#start");

start.addEventListener("click", function() {
  if (!dm.isPlaying) {
    this.classList.add("play-stop-btn-red");
    this.classList.remove("play-stop-btn-green");
    this.textContent = "stop";
    dm.start(seq);
  } else {
    this.textContent = "play";
    this.classList.add("play-stop-btn-green");
    this.classList.remove("play-stop-btn-red");
    dm.stop();
  }
});

function createNewElement(
  parentEl,
  childEl,
  currentState,
  drumName,
  ...classList
) {
  childEl = document.createElement(childEl);
  childEl.classList.add(...classList);
  parentEl.appendChild(childEl);
  addBtnHandler(childEl, currentState, drumName);
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
