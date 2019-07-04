// instantiate the sequencer engine;
let sequencer;
let seq;

function initSeq(ticks) {
  dmDiv.innerHTML = "";
  sequencer = new Sequencer(ticks);
  seq = sequencer.initSeq();
}

function stopSeqAndReset(ticks) {
  dmDiv.innerHTML = "";
  sequencer = new Sequencer(ticks);
  seq = sequencer.initSeq();
  dm.stop();
  start.innerHTML = "play";
  start.classList.toggle("play-stop-btn-red", false);
}

function restartSeqAfterTempoChange(value) {
  dm.setTempo(value, 4);
  if (dm.isPlaying) {
    dm.stop();
    dm.start(seq);
  }
}

initSeq(16);
