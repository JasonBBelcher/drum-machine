const transport = {
  sequencer: null,
  seq: [],
  isPlaying: false,
  playingSeq: null,
  playHead: 0,
  tempo: 800,
  initSeq: function(ticks) {
    dmDiv.innerHTML = "";
    this.sequencer = new Sequencer(ticks);
    this.seq = this.sequencer.initSeq();
    view.createOptionsFromSavedSequences();

    // console.log(JSON.parse(localStorage.getItem("sequences")));
  },

  stopSeqAndReset: function stopSeqAndReset(ticks) {
    dmDiv.innerHTML = "";
    this.sequencer = new Sequencer(ticks);
    this.seq = this.sequencer.initSeq();
    transport.stop();
    start.innerHTML = "play";
    start.classList.toggle("play-stop-btn-red", false);
  },

  restartSeqAfterTempoChange: function(value) {
    transport.setTempo(value, 4);
    if (transport.isPlaying) {
      transport.stop();
      transport.start(this.seq);
    }
  },

  saveSeq: function(seqName) {
    const sequence = { [seqName]: this.seq };
    const sequences = JSONfn.parse(localStorage.getItem("sequences"));
    const merged = Object.assign({}, sequences, sequence);
    const stringedBeats = JSONfn.stringify(merged);
    // console.log(stringedBeats);
    localStorage.setItem("sequences", JSONfn.stringify(merged));
  },

  deleteSeq: function(seqName) {
    console.log("from delete method");
    const sequence = { [seqName]: this.sequencer.initSeq() };
    const sequences = JSONfn.parse(localStorage.getItem("sequences"));

    const merged = Object.assign({}, sequences, sequence);
    console.log("merged: ", merged);
    localStorage.setItem("sequences", JSONfn.stringify(merged));
  },

  loadSeq: function(seqName) {
    dmDiv.innerHTML = "";

    const sequences = JSONfn.parse(localStorage.getItem("sequences"));
    this.seq = sequences[seqName];
    view.spawnSeqBtns(this.seq);
    seqLengthOutput.innerText = this.seq.length + " steps";
    seqLengthSlider.value = this.seq.length;
    view.loadSeqBtnViewState(this.seq);
  },

  // calculate bpm to milliseconds for setInterval second arg
  setTempo: function(tempo, ticksPerBeat) {
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

/*
drum machine player (transport)
This singleton object consumes the Senquencer and drumMachineState class
*/
transport.setTempo(120, 4);

transport.initSeq(16);
