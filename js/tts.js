// Text-to-speech utilities
export function speakText(text) {
    const speechSynthesis = window.speechSynthesis;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pl-PL';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
}
