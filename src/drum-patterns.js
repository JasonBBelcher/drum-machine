const examplePatterns = {
  basichouse: [{
      id: 0,
      kick: {
        id: 1,
        on: true,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.25",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.23",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.19",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.5"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.5",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.5",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.5",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 1,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.25",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.23",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.19",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.5"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.5",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.5",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.5",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 2,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.25",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.23",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: true,
        name: "hat",
        volume: "0.19",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.5"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.5",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.5",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.5",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 3,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.25",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.23",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.19",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.5"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.5",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.5",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.5",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 4,
      kick: {
        id: 1,
        on: true,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: true,
        name: "clap",
        volume: "0.25",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: true,
        name: "snare",
        volume: "0.23",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.19",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.5"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.5",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.5",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.5",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 5,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.25",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.23",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.19",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.5"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.5",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.5",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.5",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 6,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.25",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.23",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: true,
        name: "hat",
        volume: "0.19",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.5"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.5",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.5",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.5",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 7,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.25",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.23",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.19",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.5"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.5",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.5",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.5",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 8,
      kick: {
        id: 1,
        on: true,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.25",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.23",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.19",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.5"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.5",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.5",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.5",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 9,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.25",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.23",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.19",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.5"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.5",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.5",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.5",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 10,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.25",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.23",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: true,
        name: "hat",
        volume: "0.19",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.5"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.5",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.5",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.5",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 11,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.25",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.23",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.19",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.5"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.5",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.5",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.5",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 12,
      kick: {
        id: 1,
        on: true,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: true,
        name: "clap",
        volume: "0.25",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: true,
        name: "snare",
        volume: "0.23",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.19",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.5"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.5",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.5",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.5",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 13,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.25",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.23",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.19",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.5"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.5",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.5",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.5",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 14,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.25",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.23",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: true,
        name: "hat",
        volume: "0.19",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.5"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.5",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.5",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.5",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 15,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.25",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.23",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.19",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.5"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.5",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.5",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.5",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    }
  ],
  bongozhouse: [{
      id: 0,
      kick: {
        id: 1,
        on: true,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.25",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.23",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.19",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.5"
      },
      bongo1: {
        id: 6,
        on: true,
        name: "bongo1",
        volume: "0.17",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.14",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.5",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 1,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.25",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.23",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.19",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.5"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.17",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.14",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.5",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 2,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.25",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.23",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: true,
        name: "hat",
        volume: "0.19",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.5"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.17",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: true,
        name: "congaz",
        volume: "0.14",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.5",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 3,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.25",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.23",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.19",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.5"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.17",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.14",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.5",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 4,
      kick: {
        id: 1,
        on: true,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: true,
        name: "clap",
        volume: "0.25",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: true,
        name: "snare",
        volume: "0.23",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.19",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.5"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.17",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.14",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.5",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 5,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.25",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.23",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.19",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.5"
      },
      bongo1: {
        id: 6,
        on: true,
        name: "bongo1",
        volume: "0.17",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.14",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.5",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 6,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.25",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.23",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: true,
        name: "hat",
        volume: "0.19",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.5"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.17",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.14",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.5",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 7,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.25",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.23",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.19",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.5"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.17",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: true,
        name: "congaz",
        volume: "0.14",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.5",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 8,
      kick: {
        id: 1,
        on: true,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.25",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.23",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.19",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.5"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.17",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.14",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.5",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 9,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.25",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.23",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.19",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.5"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.17",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.14",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.5",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 10,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.25",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.23",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: true,
        name: "hat",
        volume: "0.19",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.5"
      },
      bongo1: {
        id: 6,
        on: true,
        name: "bongo1",
        volume: "0.17",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.14",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.5",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 11,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.25",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.23",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.19",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.5"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.17",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.14",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.5",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 12,
      kick: {
        id: 1,
        on: true,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: true,
        name: "clap",
        volume: "0.25",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: true,
        name: "snare",
        volume: "0.23",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.19",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.5"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.17",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.14",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.5",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 13,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.25",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.23",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.19",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.5"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.17",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: true,
        name: "congaz",
        volume: "0.14",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.5",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 14,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.25",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.23",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: true,
        name: "hat",
        volume: "0.19",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.5"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.17",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.14",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.5",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 15,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.25",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.23",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.19",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.5"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.17",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.14",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.5",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    }
  ],
  houseyBreaks: [{
      id: 0,
      kick: {
        id: 1,
        on: true,
        name: "kick",
        volume: "0.73",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.67",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.42",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: true,
        name: "hat",
        volume: "0.2",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: true,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.11"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.21",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.2",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.14",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 1,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.73",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.67",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.42",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.2",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.11"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.21",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.2",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.14",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 2,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.73",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.67",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.42",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.2",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: true,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.11"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.21",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.2",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.14",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 3,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.73",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.67",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.42",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.2",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.11"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.21",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: true,
        name: "congaz",
        volume: "0.2",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.14",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 4,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.73",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: true,
        name: "clap",
        volume: "0.67",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: true,
        name: "snare",
        volume: "0.42",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: true,
        name: "hat",
        volume: "0.2",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: true,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.11"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.21",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.2",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.14",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 5,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.73",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.67",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.42",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.2",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.11"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.21",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.2",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.14",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 6,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.73",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.67",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.42",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.2",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: true,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.11"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.21",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: true,
        name: "congaz",
        volume: "0.2",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: true,
        name: "harmony",
        volume: "0.14",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 7,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.73",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.67",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.42",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.2",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.11"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.21",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.2",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.14",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 8,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.73",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.67",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.42",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: true,
        name: "hat",
        volume: "0.2",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: true,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.11"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.21",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.2",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.14",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 9,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.73",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.67",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.42",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.2",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.11"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.21",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.2",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.14",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 10,
      kick: {
        id: 1,
        on: true,
        name: "kick",
        volume: "0.73",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.67",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.42",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.2",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: true,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.11"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.21",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.2",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.14",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 11,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.73",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.67",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.42",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.2",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.11"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.21",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: true,
        name: "congaz",
        volume: "0.2",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: true,
        name: "harmony",
        volume: "0.14",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 12,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.73",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: true,
        name: "clap",
        volume: "0.67",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: true,
        name: "snare",
        volume: "0.42",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: true,
        name: "hat",
        volume: "0.2",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: true,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.11"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.21",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.2",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.14",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 13,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.73",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.67",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.42",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.2",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.11"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.21",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.2",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.14",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 14,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.73",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.67",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.42",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.2",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: true,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.11"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.21",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: true,
        name: "congaz",
        volume: "0.2",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.14",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 15,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.73",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.67",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.42",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.2",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.11"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.21",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.2",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.14",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    }
  ],
  "32stephouse": [{
      id: 0,
      kick: {
        id: 1,
        on: true,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.14",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.11",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.14",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.04"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.07",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.06",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.21",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 1,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.14",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.11",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.14",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.04"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.07",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.06",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.21",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 2,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.14",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.11",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.14",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: true,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.04"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.07",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.06",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.21",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 3,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.14",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.11",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.14",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.04"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.07",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.06",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.21",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 4,
      kick: {
        id: 1,
        on: true,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: true,
        name: "clap",
        volume: "0.14",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: true,
        name: "snare",
        volume: "0.11",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.14",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.04"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.07",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.06",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.21",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 5,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.14",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.11",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.14",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.04"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.07",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.06",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.21",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 6,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.14",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.11",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: true,
        name: "hat",
        volume: "0.14",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: true,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.04"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.07",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.06",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.21",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 7,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.14",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.11",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.14",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.04"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.07",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.06",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.21",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 8,
      kick: {
        id: 1,
        on: true,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.14",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.11",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.14",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.04"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.07",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.06",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.21",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 9,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.14",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.11",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.14",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.04"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.07",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.06",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.21",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 10,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.14",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.11",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.14",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: true,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.04"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.07",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.06",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.21",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 11,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.14",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.11",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.14",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.04"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.07",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.06",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.21",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 12,
      kick: {
        id: 1,
        on: true,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: true,
        name: "clap",
        volume: "0.14",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.11",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.14",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.04"
      },
      bongo1: {
        id: 6,
        on: true,
        name: "bongo1",
        volume: "0.07",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.06",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.21",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 13,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.14",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.11",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.14",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.04"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.07",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.06",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.21",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 14,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.14",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.11",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: true,
        name: "hat",
        volume: "0.14",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: true,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.04"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.07",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.06",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.21",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 15,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.14",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.11",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.14",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.04"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.07",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: true,
        name: "congaz",
        volume: "0.06",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.21",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 16,
      kick: {
        id: 1,
        on: true,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.14",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.11",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.14",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.04"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.07",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.06",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.21",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 17,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.14",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.11",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.14",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.04"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.07",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.06",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.21",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 18,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.14",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.11",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.14",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: true,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.04"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.07",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.06",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.21",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 19,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.14",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.11",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.14",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.04"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.07",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.06",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.21",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 20,
      kick: {
        id: 1,
        on: true,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: true,
        name: "clap",
        volume: "0.14",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: true,
        name: "snare",
        volume: "0.11",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.14",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.04"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.07",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.06",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.21",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 21,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.14",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.11",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.14",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.04"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.07",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.06",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.21",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 22,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.14",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.11",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: true,
        name: "hat",
        volume: "0.14",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: true,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.04"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.07",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.06",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.21",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 23,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.14",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.11",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.14",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.04"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.07",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.06",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.21",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 24,
      kick: {
        id: 1,
        on: true,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.14",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.11",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.14",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.04"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.07",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.06",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.21",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 25,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.14",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.11",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.14",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.04"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.07",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.06",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.21",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 26,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.14",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: true,
        name: "snare",
        volume: "0.11",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.14",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: true,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.04"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.07",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.06",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.21",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 27,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.14",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.11",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.14",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.04"
      },
      bongo1: {
        id: 6,
        on: true,
        name: "bongo1",
        volume: "0.07",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.06",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.21",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 28,
      kick: {
        id: 1,
        on: true,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: true,
        name: "clap",
        volume: "0.14",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.11",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.14",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.04"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.07",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.06",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.21",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 29,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.14",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: true,
        name: "snare",
        volume: "0.11",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.14",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.04"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.07",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.06",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.21",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 30,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: false,
        name: "clap",
        volume: "0.14",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.11",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: true,
        name: "hat",
        volume: "0.14",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: true,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.04"
      },
      bongo1: {
        id: 6,
        on: true,
        name: "bongo1",
        volume: "0.07",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.06",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.21",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    },
    {
      id: 31,
      kick: {
        id: 1,
        on: false,
        name: "kick",
        volume: "0.5",
        setVolume: "function(v) {\n      kick._volume = v;\n      this.volume = v;\n    }",
        play: "() => kick.play()"
      },
      clap: {
        id: 2,
        on: true,
        name: "clap",
        volume: "0.14",
        setVolume: "function(v) {\n      clap._volume = v;\n      this.volume = v;\n    }",
        play: "() => clap.play()"
      },
      snare: {
        id: 3,
        on: false,
        name: "snare",
        volume: "0.11",
        setVolume: "function(v) {\n      snare._volume = v;\n      this.volume = v;\n    }",
        play: "() => snare.play()"
      },
      hat: {
        id: 4,
        on: false,
        name: "hat",
        volume: "0.14",
        setVolume: "function(v) {\n      hat._volume = v;\n      this.volume = v;\n    }",
        play: "() => hat.play()"
      },
      shaker: {
        id: 5,
        on: false,
        name: "shaker",
        setVolume: "function(v) {\n      shaker._volume = v;\n      this.volume = v;\n    }",
        play: "() => shaker.play()",
        volume: "0.04"
      },
      bongo1: {
        id: 6,
        on: false,
        name: "bongo1",
        volume: "0.07",
        setVolume: "function(v) {\n      bongo1._volume = v;\n      this.volume = v;\n    }",
        play: "() => bongo1.play()"
      },
      congaz: {
        id: 7,
        on: false,
        name: "congaz",
        volume: "0.06",
        setVolume: "function(v) {\n      congaz._volume = v;\n      this.volume = v;\n    }",
        play: "() => congaz.play()"
      },
      harmony: {
        id: 8,
        on: false,
        name: "harmony",
        volume: "0.21",
        setVolume: "function(v) {\n      harmony._volume = v;\n      this.volume = v;\n    }",
        play: "() => harmony.play()"
      }
    }
  ]
};


localStorage.setItem("sequences", JSONfn.stringify(examplePatterns));