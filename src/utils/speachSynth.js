const utterance = new SpeechSynthesisUtterance('');
utterance.lang = 'en';
utterance.rate = 0.8;
let voices = [];
let voiceIndex = 0;

speechSynthesis.speak(utterance);
utterance.onend = () => {
    const allVoices = speechSynthesis.getVoices();
    voices = allVoices.filter(voice => voice.lang.match('en-US') || voice.lang.match('en-GB'));
    console.log(voices);

    voiceIndex = Math.floor(Math.random() * voices.length);
    nextVoice();
    utterance.onend = nextVoice;
}

function nextVoice() {
    console.log(utterance?.text, `${voiceIndex+1}/${voices.length}: ${utterance?.voice?.name}`);
    voiceIndex++;
    if(voiceIndex >= voices.length) voiceIndex = 0;
    utterance.voice = voices[voiceIndex];
}

function generateSpeech(text) {
    utterance.text = text;
    speechSynthesis.speak(utterance);
}

export default generateSpeech;