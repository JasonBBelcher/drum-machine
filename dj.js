let sequencer = new Sequencer(16);
let seq = sequencer.initSeq();

// demo loop  (using the api)

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

// page interaction

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
