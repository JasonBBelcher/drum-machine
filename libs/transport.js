const transport = {
  sequencer: null,
  seq: [],
  initSeq: function(ticks) {
    dmDiv.innerHTML = "";
    this.sequencer = new Sequencer(ticks);
    this.seq = this.sequencer.initSeq();
  },

  stopSeqAndReset: function stopSeqAndReset(ticks) {
    dmDiv.innerHTML = "";
    this.sequencer = new Sequencer(ticks);
    this.seq = sequencer.initSeq();
    dm.stop();
    start.innerHTML = "play";
    start.classList.toggle("play-stop-btn-red", false);
  },

  restartSeqAfterTempoChange: function(value) {
    dm.setTempo(value, 4);
    if (dm.isPlaying) {
      dm.stop();
      dm.start(seq);
    }
  }
};

transport.initSeq(16);
