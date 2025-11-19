/**
 * Audio Effects Presets
 * 
 * Predefined effect configurations for quick application
 */

export const FILTER_PRESETS = {
  // Lowpass filters - Cut high frequencies
  'Warm': {
    type: 'lowpass',
    frequency: 800,
    q: 0.7,
    description: 'Warm, muffled sound'
  },
  'Telephone': {
    type: 'lowpass',
    frequency: 500,
    q: 1.5,
    description: 'Lo-fi telephone effect'
  },
  'Muted': {
    type: 'lowpass',
    frequency: 300,
    q: 0.5,
    description: 'Very muffled, distant'
  },
  'Smooth Roll-off': {
    type: 'lowpass',
    frequency: 2000,
    q: 0.5,
    description: 'Gentle high-cut'
  },
  
  // Highpass filters - Cut low frequencies
  'Thin': {
    type: 'highpass',
    frequency: 800,
    q: 0.7,
    description: 'Thin, tinny sound'
  },
  'Radio': {
    type: 'highpass',
    frequency: 500,
    q: 1.5,
    description: 'AM radio effect'
  },
  'Air': {
    type: 'highpass',
    frequency: 200,
    q: 0.5,
    description: 'Airy, light sound'
  },
  
  // Bandpass filters - Cut low and high
  'Nasal': {
    type: 'bandpass',
    frequency: 1000,
    q: 5,
    description: 'Narrow midrange'
  },
  'Vocal': {
    type: 'bandpass',
    frequency: 1500,
    q: 2,
    description: 'Voice-like quality'
  },
  'Resonance': {
    type: 'bandpass',
    frequency: 800,
    q: 10,
    description: 'Extreme resonance'
  },
  
  // Notch filters - Remove specific frequency
  'Notch 1kHz': {
    type: 'notch',
    frequency: 1000,
    q: 5,
    description: 'Remove 1kHz spike'
  },
  'Notch 500Hz': {
    type: 'notch',
    frequency: 500,
    q: 5,
    description: 'Remove 500Hz'
  }
};

// Default preset (no effect)
export const FILTER_OFF = {
  type: 'lowpass',
  frequency: 20000,
  q: 0.1,
  description: 'No filtering'
};

/**
 * Get preset by name
 * @param {string} name - Preset name
 * @returns {Object} Preset configuration
 */
export function getFilterPreset(name) {
  return FILTER_PRESETS[name] || FILTER_OFF;
}

/**
 * Get all preset names
 * @returns {Array<string>}
 */
export function getFilterPresetNames() {
  return Object.keys(FILTER_PRESETS);
}

/**
 * Get presets grouped by type
 * @returns {Object} Presets grouped by filter type
 */
export function getFilterPresetsByType() {
  const grouped = {
    lowpass: [],
    highpass: [],
    bandpass: [],
    notch: []
  };
  
  Object.entries(FILTER_PRESETS).forEach(([name, preset]) => {
    if (grouped[preset.type]) {
      grouped[preset.type].push({ name, ...preset });
    }
  });
  
  return grouped;
}
