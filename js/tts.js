// Text-to-speech utilities
let polishVoice = null;
let voicesLoaded = false;

// Load Polish voice when available
function loadPolishVoice() {
    const voices = window.speechSynthesis.getVoices();

    if (voices.length === 0) {
        // Voices not loaded yet, will retry
        return;
    }

    voicesLoaded = true;

    // Try to find Polish voice - check multiple variants
    polishVoice = voices.find(voice =>
        voice.lang === 'pl-PL' ||
        voice.lang === 'pl_PL' ||
        voice.lang.startsWith('pl-') ||
        voice.lang.startsWith('pl_')
    );

    if (!polishVoice) {
        console.warn('No Polish voice found. Available voices:', voices.map(v => `${v.name} (${v.lang})`));
    } else {
        console.log('Polish voice selected:', polishVoice.name, polishVoice.lang);
    }
}

// Voices load asynchronously, so we need to wait for them
if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadPolishVoice;
}

// iOS Safari workaround: getVoices() returns empty array initially,
// but populates after being called. Call it multiple times.
setTimeout(loadPolishVoice, 0);
setTimeout(loadPolishVoice, 100);
setTimeout(loadPolishVoice, 500);

export function speakText(text) {
    const speechSynthesis = window.speechSynthesis;
    speechSynthesis.cancel();

    // iOS workaround: ensure voices are loaded
    if (!voicesLoaded) {
        loadPolishVoice();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pl-PL';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    // Get fresh voice list each time on iOS (it can change)
    const voices = speechSynthesis.getVoices();
    const freshPolishVoice = voices.find(voice =>
        voice.lang === 'pl-PL' ||
        voice.lang === 'pl_PL' ||
        voice.lang.startsWith('pl-') ||
        voice.lang.startsWith('pl_')
    );

    if (freshPolishVoice) {
        utterance.voice = freshPolishVoice;
    } else if (polishVoice) {
        utterance.voice = polishVoice;
    }

    speechSynthesis.speak(utterance);
}

// Diagnostic function - call from console to see available voices
export function listVoices() {
    const voices = window.speechSynthesis.getVoices();
    console.log('Total voices:', voices.length);
    console.log('Polish voices:', voices.filter(v => v.lang.startsWith('pl')));
    console.log('All voices:', voices.map(v => ({ name: v.name, lang: v.lang })));
    return voices;
}

// Make it available globally for debugging
if (typeof window !== 'undefined') {
    window.listPolishVoices = listVoices;
}
