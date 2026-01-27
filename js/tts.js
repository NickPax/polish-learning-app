// Text-to-speech utilities
let polishVoice = null;

// Load Polish voice when available
function loadPolishVoice() {
    const voices = window.speechSynthesis.getVoices();
    polishVoice = voices.find(voice => voice.lang.startsWith('pl'));

    if (!polishVoice) {
        console.warn('No Polish voice found. Available voices:', voices.map(v => v.lang));
    }
}

// Voices load asynchronously, so we need to wait for them
if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadPolishVoice;
}
// Also try loading immediately in case they're already available
loadPolishVoice();

export function speakText(text) {
    const speechSynthesis = window.speechSynthesis;
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pl-PL';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    // Use cached Polish voice if available
    if (polishVoice) {
        utterance.voice = polishVoice;
    } else {
        // Try one more time to find a Polish voice
        const voices = speechSynthesis.getVoices();
        const voice = voices.find(v => v.lang.startsWith('pl'));
        if (voice) {
            utterance.voice = voice;
        }
    }

    speechSynthesis.speak(utterance);
}
