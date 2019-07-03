let dmDiv = document.querySelector(".dm");
let element = document.createElement("div");

const start = document.querySelector("#start");

start.addEventListener("click", function() {
  if (!dm.isPlaying) {
    this.style.background = "red";
    this.textContent = "off";
    dm.start(seq);
  } else {
    this.textContent = "on";
    this.style.background = "green";
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
  console.log("drum: ", drumName);
  childEl = document.createElement(childEl);
  childEl.classList.add(...classList);
  parentEl.appendChild(childEl);
  if (currentState && drumName) {
    childEl.addEventListener("click", function() {
      let clicked = false;
      if (drumName.on === clicked) {
        currentState.setState(drumName.name, true);
        clicked = !clicked;
        childEl.classList.add("btn-on");
      } else if (!drumName.on === clicked) {
        currentState.setState(drumName.name, false);
        clicked = !clicked;
        childEl.classList.remove("btn-on");
        childEl.classList.add("seq-btn");
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
        console.log("key:", key);

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
