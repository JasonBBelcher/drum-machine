/**
 * Default drum patterns for the sequencer
 * Compatible with Phase 4 MVC architecture
 */

// Helper to create a step with all drums
const createStep = (drums) => ({ drums });

const allDrumsOff = {
  kick: { on: false, volume: 0.5, pitch: 0, detune: 0 },
  clap: { on: false, volume: 0.25, pitch: 0, detune: 0 },
  snare: { on: false, volume: 0.23, pitch: 0, detune: 0 },
  hat: { on: false, volume: 0.19, pitch: 0, detune: 0 },
  shaker: { on: false, volume: 0.5, pitch: 0, detune: 0 },
  bongo1: { on: false, volume: 0.5, pitch: 0, detune: 0 },
  congaz: { on: false, volume: 0.5, pitch: 0, detune: 0 },
  harmony: { on: false, volume: 0.5, pitch: 0, detune: 0 }
};

export const defaultPatterns = {
  'basic house': {
    name: 'basic house',
    tempo: 120,
    length: 16,
    steps: [
      // Step 0
      createStep({ ...allDrumsOff, kick: { on: true, volume: 0.5, pitch: 0, detune: 0 } }),
      // Step 1
      { kick: { on: false, volume: 0.5, pitch: 0, detune: 0 }, clap: { on: false, volume: 0.25, pitch: 0, detune: 0 }, snare: { on: false, volume: 0.23, pitch: 0, detune: 0 }, hat: { on: false, volume: 0.19, pitch: 0, detune: 0 }, shaker: { on: false, volume: 0.5, pitch: 0, detune: 0 }, bongo1: { on: false, volume: 0.5, pitch: 0, detune: 0 }, congaz: { on: false, volume: 0.5, pitch: 0, detune: 0 }, harmony: { on: false, volume: 0.5, pitch: 0, detune: 0 } },
      // Step 2
      { kick: { on: false, volume: 0.5, pitch: 0, detune: 0 }, clap: { on: false, volume: 0.25, pitch: 0, detune: 0 }, snare: { on: false, volume: 0.23, pitch: 0, detune: 0 }, hat: { on: true, volume: 0.19, pitch: 0, detune: 0 }, shaker: { on: false, volume: 0.5, pitch: 0, detune: 0 }, bongo1: { on: false, volume: 0.5, pitch: 0, detune: 0 }, congaz: { on: false, volume: 0.5, pitch: 0, detune: 0 }, harmony: { on: false, volume: 0.5, pitch: 0, detune: 0 } },
      // Step 3
      { kick: { on: false, volume: 0.5, pitch: 0, detune: 0 }, clap: { on: false, volume: 0.25, pitch: 0, detune: 0 }, snare: { on: false, volume: 0.23, pitch: 0, detune: 0 }, hat: { on: false, volume: 0.19, pitch: 0, detune: 0 }, shaker: { on: false, volume: 0.5, pitch: 0, detune: 0 }, bongo1: { on: false, volume: 0.5, pitch: 0, detune: 0 }, congaz: { on: false, volume: 0.5, pitch: 0, detune: 0 }, harmony: { on: false, volume: 0.5, pitch: 0, detune: 0 } },
      // Step 4
      { kick: { on: true, volume: 0.5, pitch: 0, detune: 0 }, clap: { on: true, volume: 0.25, pitch: 0, detune: 0 }, snare: { on: true, volume: 0.23, pitch: 0, detune: 0 }, hat: { on: false, volume: 0.19, pitch: 0, detune: 0 }, shaker: { on: false, volume: 0.5, pitch: 0, detune: 0 }, bongo1: { on: false, volume: 0.5, pitch: 0, detune: 0 }, congaz: { on: false, volume: 0.5, pitch: 0, detune: 0 }, harmony: { on: false, volume: 0.5, pitch: 0, detune: 0 } },
      // Step 5
      { kick: { on: false, volume: 0.5, pitch: 0, detune: 0 }, clap: { on: false, volume: 0.25, pitch: 0, detune: 0 }, snare: { on: false, volume: 0.23, pitch: 0, detune: 0 }, hat: { on: false, volume: 0.19, pitch: 0, detune: 0 }, shaker: { on: false, volume: 0.5, pitch: 0, detune: 0 }, bongo1: { on: false, volume: 0.5, pitch: 0, detune: 0 }, congaz: { on: false, volume: 0.5, pitch: 0, detune: 0 }, harmony: { on: false, volume: 0.5, pitch: 0, detune: 0 } },
      // Step 6
      { kick: { on: false, volume: 0.5, pitch: 0, detune: 0 }, clap: { on: false, volume: 0.25, pitch: 0, detune: 0 }, snare: { on: false, volume: 0.23, pitch: 0, detune: 0 }, hat: { on: true, volume: 0.19, pitch: 0, detune: 0 }, shaker: { on: false, volume: 0.5, pitch: 0, detune: 0 }, bongo1: { on: false, volume: 0.5, pitch: 0, detune: 0 }, congaz: { on: false, volume: 0.5, pitch: 0, detune: 0 }, harmony: { on: false, volume: 0.5, pitch: 0, detune: 0 } },
      // Step 7
      { kick: { on: false, volume: 0.5, pitch: 0, detune: 0 }, clap: { on: false, volume: 0.25, pitch: 0, detune: 0 }, snare: { on: false, volume: 0.23, pitch: 0, detune: 0 }, hat: { on: false, volume: 0.19, pitch: 0, detune: 0 }, shaker: { on: false, volume: 0.5, pitch: 0, detune: 0 }, bongo1: { on: false, volume: 0.5, pitch: 0, detune: 0 }, congaz: { on: false, volume: 0.5, pitch: 0, detune: 0 }, harmony: { on: false, volume: 0.5, pitch: 0, detune: 0 } },
      // Step 8
      { kick: { on: true, volume: 0.5, pitch: 0, detune: 0 }, clap: { on: false, volume: 0.25, pitch: 0, detune: 0 }, snare: { on: false, volume: 0.23, pitch: 0, detune: 0 }, hat: { on: false, volume: 0.19, pitch: 0, detune: 0 }, shaker: { on: false, volume: 0.5, pitch: 0, detune: 0 }, bongo1: { on: false, volume: 0.5, pitch: 0, detune: 0 }, congaz: { on: false, volume: 0.5, pitch: 0, detune: 0 }, harmony: { on: false, volume: 0.5, pitch: 0, detune: 0 } },
      // Step 9
      { kick: { on: false, volume: 0.5, pitch: 0, detune: 0 }, clap: { on: false, volume: 0.25, pitch: 0, detune: 0 }, snare: { on: false, volume: 0.23, pitch: 0, detune: 0 }, hat: { on: false, volume: 0.19, pitch: 0, detune: 0 }, shaker: { on: false, volume: 0.5, pitch: 0, detune: 0 }, bongo1: { on: false, volume: 0.5, pitch: 0, detune: 0 }, congaz: { on: false, volume: 0.5, pitch: 0, detune: 0 }, harmony: { on: false, volume: 0.5, pitch: 0, detune: 0 } },
      // Step 10
      { kick: { on: false, volume: 0.5, pitch: 0, detune: 0 }, clap: { on: false, volume: 0.25, pitch: 0, detune: 0 }, snare: { on: false, volume: 0.23, pitch: 0, detune: 0 }, hat: { on: true, volume: 0.19, pitch: 0, detune: 0 }, shaker: { on: false, volume: 0.5, pitch: 0, detune: 0 }, bongo1: { on: false, volume: 0.5, pitch: 0, detune: 0 }, congaz: { on: false, volume: 0.5, pitch: 0, detune: 0 }, harmony: { on: false, volume: 0.5, pitch: 0, detune: 0 } },
      // Step 11
      { kick: { on: false, volume: 0.5, pitch: 0, detune: 0 }, clap: { on: false, volume: 0.25, pitch: 0, detune: 0 }, snare: { on: false, volume: 0.23, pitch: 0, detune: 0 }, hat: { on: false, volume: 0.19, pitch: 0, detune: 0 }, shaker: { on: false, volume: 0.5, pitch: 0, detune: 0 }, bongo1: { on: false, volume: 0.5, pitch: 0, detune: 0 }, congaz: { on: false, volume: 0.5, pitch: 0, detune: 0 }, harmony: { on: false, volume: 0.5, pitch: 0, detune: 0 } },
      // Step 12
      { kick: { on: true, volume: 0.5, pitch: 0, detune: 0 }, clap: { on: true, volume: 0.25, pitch: 0, detune: 0 }, snare: { on: true, volume: 0.23, pitch: 0, detune: 0 }, hat: { on: false, volume: 0.19, pitch: 0, detune: 0 }, shaker: { on: false, volume: 0.5, pitch: 0, detune: 0 }, bongo1: { on: false, volume: 0.5, pitch: 0, detune: 0 }, congaz: { on: false, volume: 0.5, pitch: 0, detune: 0 }, harmony: { on: false, volume: 0.5, pitch: 0, detune: 0 } },
      // Step 13
      { kick: { on: false, volume: 0.5, pitch: 0, detune: 0 }, clap: { on: false, volume: 0.25, pitch: 0, detune: 0 }, snare: { on: false, volume: 0.23, pitch: 0, detune: 0 }, hat: { on: false, volume: 0.19, pitch: 0, detune: 0 }, shaker: { on: false, volume: 0.5, pitch: 0, detune: 0 }, bongo1: { on: false, volume: 0.5, pitch: 0, detune: 0 }, congaz: { on: false, volume: 0.5, pitch: 0, detune: 0 }, harmony: { on: false, volume: 0.5, pitch: 0, detune: 0 } },
      // Step 14
      { kick: { on: false, volume: 0.5, pitch: 0, detune: 0 }, clap: { on: false, volume: 0.25, pitch: 0, detune: 0 }, snare: { on: false, volume: 0.23, pitch: 0, detune: 0 }, hat: { on: true, volume: 0.19, pitch: 0, detune: 0 }, shaker: { on: false, volume: 0.5, pitch: 0, detune: 0 }, bongo1: { on: false, volume: 0.5, pitch: 0, detune: 0 }, congaz: { on: false, volume: 0.5, pitch: 0, detune: 0 }, harmony: { on: false, volume: 0.5, pitch: 0, detune: 0 } },
      // Step 15
      { kick: { on: false, volume: 0.5, pitch: 0, detune: 0 }, clap: { on: false, volume: 0.25, pitch: 0, detune: 0 }, snare: { on: false, volume: 0.23, pitch: 0, detune: 0 }, hat: { on: false, volume: 0.19, pitch: 0, detune: 0 }, shaker: { on: false, volume: 0.5, pitch: 0, detune: 0 }, bongo1: { on: false, volume: 0.5, pitch: 0, detune: 0 }, congaz: { on: false, volume: 0.5, pitch: 0, detune: 0 }, harmony: { on: false, volume: 0.5, pitch: 0, detune: 0 } }
    ]
  },
  'bongoz house': {
    tempo: 120,
    length: 16,
    steps: [
      { kick: { on: true, volume: 0.5, pitch: 0, detune: 0 }, clap: { on: false, volume: 0.25, pitch: 0, detune: 0 }, snare: { on: false, volume: 0.23, pitch: 0, detune: 0 }, hat: { on: false, volume: 0.19, pitch: 0, detune: 0 }, shaker: { on: false, volume: 0.5, pitch: 0, detune: 0 }, bongo1: { on: true, volume: 0.17, pitch: 0, detune: 0 }, congaz: { on: false, volume: 0.14, pitch: 0, detune: 0 }, harmony: { on: false, volume: 0.5, pitch: 0, detune: 0 } },
      { kick: { on: false, volume: 0.5, pitch: 0, detune: 0 }, clap: { on: false, volume: 0.25, pitch: 0, detune: 0 }, snare: { on: false, volume: 0.23, pitch: 0, detune: 0 }, hat: { on: false, volume: 0.19, pitch: 0, detune: 0 }, shaker: { on: false, volume: 0.5, pitch: 0, detune: 0 }, bongo1: { on: false, volume: 0.17, pitch: 0, detune: 0 }, congaz: { on: false, volume: 0.14, pitch: 0, detune: 0 }, harmony: { on: false, volume: 0.5, pitch: 0, detune: 0 } },
      { kick: { on: false, volume: 0.5, pitch: 0, detune: 0 }, clap: { on: false, volume: 0.25, pitch: 0, detune: 0 }, snare: { on: false, volume: 0.23, pitch: 0, detune: 0 }, hat: { on: true, volume: 0.19, pitch: 0, detune: 0 }, shaker: { on: false, volume: 0.5, pitch: 0, detune: 0 }, bongo1: { on: false, volume: 0.17, pitch: 0, detune: 0 }, congaz: { on: true, volume: 0.14, pitch: 0, detune: 0 }, harmony: { on: false, volume: 0.5, pitch: 0, detune: 0 } },
      { kick: { on: false, volume: 0.5, pitch: 0, detune: 0 }, clap: { on: false, volume: 0.25, pitch: 0, detune: 0 }, snare: { on: false, volume: 0.23, pitch: 0, detune: 0 }, hat: { on: false, volume: 0.19, pitch: 0, detune: 0 }, shaker: { on: false, volume: 0.5, pitch: 0, detune: 0 }, bongo1: { on: false, volume: 0.17, pitch: 0, detune: 0 }, congaz: { on: false, volume: 0.14, pitch: 0, detune: 0 }, harmony: { on: false, volume: 0.5, pitch: 0, detune: 0 } },
      { kick: { on: true, volume: 0.5, pitch: 0, detune: 0 }, clap: { on: true, volume: 0.25, pitch: 0, detune: 0 }, snare: { on: true, volume: 0.23, pitch: 0, detune: 0 }, hat: { on: false, volume: 0.19, pitch: 0, detune: 0 }, shaker: { on: false, volume: 0.5, pitch: 0, detune: 0 }, bongo1: { on: false, volume: 0.17, pitch: 0, detune: 0 }, congaz: { on: false, volume: 0.14, pitch: 0, detune: 0 }, harmony: { on: false, volume: 0.5, pitch: 0, detune: 0 } },
      { kick: { on: false, volume: 0.5, pitch: 0, detune: 0 }, clap: { on: false, volume: 0.25, pitch: 0, detune: 0 }, snare: { on: false, volume: 0.23, pitch: 0, detune: 0 }, hat: { on: false, volume: 0.19, pitch: 0, detune: 0 }, shaker: { on: false, volume: 0.5, pitch: 0, detune: 0 }, bongo1: { on: true, volume: 0.17, pitch: 0, detune: 0 }, congaz: { on: false, volume: 0.14, pitch: 0, detune: 0 }, harmony: { on: false, volume: 0.5, pitch: 0, detune: 0 } },
      { kick: { on: false, volume: 0.5, pitch: 0, detune: 0 }, clap: { on: false, volume: 0.25, pitch: 0, detune: 0 }, snare: { on: false, volume: 0.23, pitch: 0, detune: 0 }, hat: { on: true, volume: 0.19, pitch: 0, detune: 0 }, shaker: { on: false, volume: 0.5, pitch: 0, detune: 0 }, bongo1: { on: false, volume: 0.17, pitch: 0, detune: 0 }, congaz: { on: false, volume: 0.14, pitch: 0, detune: 0 }, harmony: { on: false, volume: 0.5, pitch: 0, detune: 0 } },
      { kick: { on: false, volume: 0.5, pitch: 0, detune: 0 }, clap: { on: false, volume: 0.25, pitch: 0, detune: 0 }, snare: { on: false, volume: 0.23, pitch: 0, detune: 0 }, hat: { on: false, volume: 0.19, pitch: 0, detune: 0 }, shaker: { on: false, volume: 0.5, pitch: 0, detune: 0 }, bongo1: { on: false, volume: 0.17, pitch: 0, detune: 0 }, congaz: { on: true, volume: 0.14, pitch: 0, detune: 0 }, harmony: { on: false, volume: 0.5, pitch: 0, detune: 0 } },
      { kick: { on: true, volume: 0.5, pitch: 0, detune: 0 }, clap: { on: false, volume: 0.25, pitch: 0, detune: 0 }, snare: { on: false, volume: 0.23, pitch: 0, detune: 0 }, hat: { on: false, volume: 0.19, pitch: 0, detune: 0 }, shaker: { on: false, volume: 0.5, pitch: 0, detune: 0 }, bongo1: { on: false, volume: 0.17, pitch: 0, detune: 0 }, congaz: { on: false, volume: 0.14, pitch: 0, detune: 0 }, harmony: { on: false, volume: 0.5, pitch: 0, detune: 0 } },
      { kick: { on: false, volume: 0.5, pitch: 0, detune: 0 }, clap: { on: false, volume: 0.25, pitch: 0, detune: 0 }, snare: { on: false, volume: 0.23, pitch: 0, detune: 0 }, hat: { on: false, volume: 0.19, pitch: 0, detune: 0 }, shaker: { on: false, volume: 0.5, pitch: 0, detune: 0 }, bongo1: { on: false, volume: 0.17, pitch: 0, detune: 0 }, congaz: { on: false, volume: 0.14, pitch: 0, detune: 0 }, harmony: { on: false, volume: 0.5, pitch: 0, detune: 0 } },
      { kick: { on: false, volume: 0.5, pitch: 0, detune: 0 }, clap: { on: false, volume: 0.25, pitch: 0, detune: 0 }, snare: { on: false, volume: 0.23, pitch: 0, detune: 0 }, hat: { on: true, volume: 0.19, pitch: 0, detune: 0 }, shaker: { on: false, volume: 0.5, pitch: 0, detune: 0 }, bongo1: { on: true, volume: 0.17, pitch: 0, detune: 0 }, congaz: { on: false, volume: 0.14, pitch: 0, detune: 0 }, harmony: { on: false, volume: 0.5, pitch: 0, detune: 0 } },
      { kick: { on: false, volume: 0.5, pitch: 0, detune: 0 }, clap: { on: false, volume: 0.25, pitch: 0, detune: 0 }, snare: { on: false, volume: 0.23, pitch: 0, detune: 0 }, hat: { on: false, volume: 0.19, pitch: 0, detune: 0 }, shaker: { on: false, volume: 0.5, pitch: 0, detune: 0 }, bongo1: { on: false, volume: 0.17, pitch: 0, detune: 0 }, congaz: { on: false, volume: 0.14, pitch: 0, detune: 0 }, harmony: { on: false, volume: 0.5, pitch: 0, detune: 0 } },
      { kick: { on: true, volume: 0.5, pitch: 0, detune: 0 }, clap: { on: true, volume: 0.25, pitch: 0, detune: 0 }, snare: { on: true, volume: 0.23, pitch: 0, detune: 0 }, hat: { on: false, volume: 0.19, pitch: 0, detune: 0 }, shaker: { on: false, volume: 0.5, pitch: 0, detune: 0 }, bongo1: { on: false, volume: 0.17, pitch: 0, detune: 0 }, congaz: { on: false, volume: 0.14, pitch: 0, detune: 0 }, harmony: { on: false, volume: 0.5, pitch: 0, detune: 0 } },
      { kick: { on: false, volume: 0.5, pitch: 0, detune: 0 }, clap: { on: false, volume: 0.25, pitch: 0, detune: 0 }, snare: { on: false, volume: 0.23, pitch: 0, detune: 0 }, hat: { on: false, volume: 0.19, pitch: 0, detune: 0 }, shaker: { on: false, volume: 0.5, pitch: 0, detune: 0 }, bongo1: { on: false, volume: 0.17, pitch: 0, detune: 0 }, congaz: { on: false, volume: 0.14, pitch: 0, detune: 0 }, harmony: { on: false, volume: 0.5, pitch: 0, detune: 0 } },
      { kick: { on: false, volume: 0.5, pitch: 0, detune: 0 }, clap: { on: false, volume: 0.25, pitch: 0, detune: 0 }, snare: { on: false, volume: 0.23, pitch: 0, detune: 0 }, hat: { on: true, volume: 0.19, pitch: 0, detune: 0 }, shaker: { on: false, volume: 0.5, pitch: 0, detune: 0 }, bongo1: { on: false, volume: 0.17, pitch: 0, detune: 0 }, congaz: { on: false, volume: 0.14, pitch: 0, detune: 0 }, harmony: { on: false, volume: 0.5, pitch: 0, detune: 0 } },
      { kick: { on: false, volume: 0.5, pitch: 0, detune: 0 }, clap: { on: false, volume: 0.25, pitch: 0, detune: 0 }, snare: { on: false, volume: 0.23, pitch: 0, detune: 0 }, hat: { on: false, volume: 0.19, pitch: 0, detune: 0 }, shaker: { on: false, volume: 0.5, pitch: 0, detune: 0 }, bongo1: { on: false, volume: 0.17, pitch: 0, detune: 0 }, congaz: { on: false, volume: 0.14, pitch: 0, detune: 0 }, harmony: { on: false, volume: 0.5, pitch: 0, detune: 0 } }
    ]
  }
};
