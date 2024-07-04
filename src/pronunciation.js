let urlList = null;
let currentWordUrls = null;
const audio = new Audio();

const urlKeys = {
	"a": "https://s3.amazonaws.com/audio.vocabulary.com/1.0/us/",
	"cb": "https://dictionary.cambridge.org/us/media/english/uk_pron/",
	"ca": "https://dictionary.cambridge.org/us/media/english/us_pron/",
	"oa": "https://www.onelook.com/pronounce/macmillan/US/",
	"ob": "https://www.onelook.com/pronounce/macmillan/UK/"
};

async function fetchAudioUrls() {
    const resp = await fetch('/recordUrls.json');
    urlList = await resp.json();
    console.log(urlList['apple']);
}

let currentIndex = 0;

function playNext() {
    currentIndex++;
    if(currentIndex >= currentWordUrls.length) {
        currentIndex = 0;
    } 
    console.log(currentIndex);
    console.log(currentWordUrls[currentIndex]);

    audio.src = currentWordUrls[currentIndex];
    audio.play();
}

async function findAudio(word) {
    console.log(word);
    if(!urlList) await fetchAudioUrls();

    const compactUrls = urlList[word];
    if(!compactUrls) {
        currentWordUrls = null;
        return;
    }

    currentWordUrls = compactUrls.map(compactUrl => {
        const [encoded, query] = compactUrl.split('*');
        return urlKeys[encoded] + query;
    });

    console.log(currentWordUrls);
}

function play() {
    if(currentWordUrls) {
        playNext();
    }
}

export { findAudio, play };