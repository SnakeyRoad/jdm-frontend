/**
 * Utility function to play sound effects
 */

// Play a simple click sound
export const playClickSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
    
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
    }, 150);
  } catch (e) {
    console.error('Error playing sound:', e);
  }
};

// Play a celebration sound
export const playCelebrationSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    
    // Play a series of happy notes
    const notes = [
      { freq: 523.25, duration: 0.2 }, // C5
      { freq: 659.25, duration: 0.2 }, // E5
      { freq: 783.99, duration: 0.2 }, // G5
      { freq: 1046.50, duration: 0.4 } // C6
    ];
    
    notes.forEach((note, index) => {
      setTimeout(() => {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(note.freq, audioCtx.currentTime);
        
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + note.duration);
        
        oscillator.start();
        setTimeout(() => {
          oscillator.stop();
        }, note.duration * 1000);
      }, index * 200);
    });
  } catch (e) {
    console.error('Error playing celebration sound:', e);
  }
};
