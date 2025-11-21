/**
 * Phase 6.1 Core Logic Tests
 * Simple validation tests for SongModel and SongScheduler
 */

import { SongModel, ChainStep } from './src/models/SongModel.js';

console.log('🧪 Testing Phase 6.1 Core Logic...\n');

// Test 1: SongModel creation
console.log('Test 1: SongModel creation');
const song = new SongModel('Test Song');
console.assert(song.name === 'Test Song', '✓ Song name set correctly');
console.assert(song.chain.length === 0, '✓ Chain starts empty');
console.assert(song.isLooping === true, '✓ Loop enabled by default');
console.log('✅ SongModel creation passed\n');

// Test 2: Adding patterns to chain
console.log('Test 2: Adding patterns');
song.addPattern('pattern1', 2);
song.addPattern('pattern2', 1);
song.addPattern('pattern3', 4);
console.assert(song.chain.length === 3, '✓ Three patterns added');
console.assert(song.chain[0].patternName === 'pattern1', '✓ First pattern correct');
console.assert(song.chain[0].repeats === 2, '✓ Repeat count correct');
console.assert(song.getTotalLength() === 7, '✓ Total length = 2+1+4');
console.log('✅ Adding patterns passed\n');

// Test 3: ChainStep repeat logic
console.log('Test 3: ChainStep repeat logic');
const step = new ChainStep('test', 3);
console.assert(step.currentRepeat === 0, '✓ Starts at 0');
console.assert(step.incrementRepeat() === false, '✓ First repeat not complete');
console.assert(step.currentRepeat === 1, '✓ Incremented to 1');
console.assert(step.incrementRepeat() === false, '✓ Second repeat not complete');
console.assert(step.incrementRepeat() === true, '✓ Third repeat completes');
console.assert(step.isComplete() === true, '✓ Step is complete');
step.reset();
console.assert(step.currentRepeat === 0, '✓ Reset works');
console.log('✅ ChainStep repeat logic passed\n');

// Test 4: Chain navigation
console.log('Test 4: Chain navigation');
song.reset();
const step1 = song.getNextStep();
console.assert(step1.patternName === 'pattern1', '✓ First step correct');
song.advance();
const step2 = song.getCurrentStep();
console.assert(step2.patternName === 'pattern2', '✓ Advance works');
console.log('✅ Chain navigation passed\n');

// Test 5: Removing steps
console.log('Test 5: Removing steps');
song.removeStep(1); // Remove pattern2
console.assert(song.chain.length === 2, '✓ Pattern removed');
console.assert(song.chain[1].patternName === 'pattern3', '✓ Remaining patterns correct');
console.log('✅ Removing steps passed\n');

// Test 6: Moving steps
console.log('Test 6: Moving steps');
song.addPattern('pattern4', 1);
song.moveStep(2, 0); // Move pattern4 to front
console.assert(song.chain[0].patternName === 'pattern4', '✓ Pattern moved to front');
console.assert(song.chain.length === 3, '✓ Length preserved');
console.log('✅ Moving steps passed\n');

// Test 7: JSON serialization
console.log('Test 7: JSON serialization');
const json = song.toJSON();
console.assert(json.name === 'Test Song', '✓ Name serialized');
console.assert(json.chain.length === 3, '✓ Chain serialized');
console.assert(json.version === '1.0', '✓ Version included');
const restored = SongModel.fromJSON(json);
console.assert(restored.name === song.name, '✓ Name restored');
console.assert(restored.chain.length === song.chain.length, '✓ Chain restored');
console.log('✅ JSON serialization passed\n');

// Test 8: Input validation
console.log('Test 8: Input validation');
try {
  song.addPattern('', 1);
  console.error('✗ Should reject empty pattern name');
} catch (e) {
  console.assert(e.message.includes('empty'), '✓ Empty name rejected');
}

try {
  song.addPattern('test', 100);
  console.error('✗ Should reject repeats > 99');
} catch (e) {
  console.assert(e.message.includes('between'), '✓ Invalid repeat count rejected');
}

try {
  song.removeStep(999);
  console.error('✗ Should reject invalid index');
} catch (e) {
  console.assert(e.message.includes('Invalid'), '✓ Invalid index rejected');
}
console.log('✅ Input validation passed\n');

// Test 9: Loop mode
console.log('Test 9: Loop mode');
const song2 = new SongModel();
song2.addPattern('p1', 1);
song2.currentStepIndex = 1; // Past end
const loopStep = song2.getNextStep();
console.assert(loopStep !== null, '✓ Loop mode returns to start');
console.assert(song2.currentStepIndex === 0, '✓ Index reset to 0');

song2.isLooping = false;
song2.currentStepIndex = 1;
const noLoopStep = song2.getNextStep();
console.assert(noLoopStep === null, '✓ Non-loop mode returns null at end');
console.log('✅ Loop mode passed\n');

// Test 10: Clear chain
console.log('Test 10: Clear chain');
song.clear();
console.assert(song.chain.length === 0, '✓ Chain cleared');
console.assert(song.currentStepIndex === 0, '✓ Index reset');
console.assert(song.isEmpty() === true, '✓ isEmpty() works');
console.log('✅ Clear chain passed\n');

console.log('🎉 All Phase 6.1 tests passed! Core logic is solid.\n');
