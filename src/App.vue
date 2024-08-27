<script setup>
import PlayAudio from '@/components/PlayAudio.vue';

import { ref, onMounted, watch } from 'vue';
import getArticle from '@/services/getArticle.js'
import { play } from '@/utils/pronunciation.js';

// findAudio('day');

const theInput = ref(null);
const query = ref('');

onMounted(() => {
    window.resizeTo(500, 1200);
    window.moveTo(1700, 0);
    theInput.value.value = query.value;
    theInput.value.focus();
    theInput.value.select();
});

const e2uArticle = ref('');
const glosbeArticle = ref('');
const selectedArticle = ref('e2u');
let history = [];

function getHistory() {
    const json = localStorage.getItem('EngDicHistory');
    if(json) {
        console.log('change 1');
        history = JSON.parse(json);
        query.value = history[history.length - 1];
        // request(query.value);
        // theInput.value.value = history[history.length - 1];
        request(history[history.length - 1]);
    }
}
getHistory();

function updateHistory() {
    if(history[history.length - 1] !== query.value) {
        history.push(query.value);
        console.log(history);
        localStorage.setItem('EngDicHistory', JSON.stringify(history));
    }
}

function request(input) {
    console.log('change 2');
    query.value = input;
    theInput.value?.select();

    e2uArticle.value = '';
    glosbeArticle.value = '';
    selectedArticle.value = 'e2u';

    updateHistory();

    // if(theInput.value) {
    //     theInput.value.select();
    // }

    asyncPart(input);
}

async function asyncPart(input) {
    // await getArticle('e2u', input);
    // e2uArticle.value = 'gio!';
    e2uArticle.value = await getArticle('e2u', input);
    if(e2uArticle.value === '...') {
        select('glosbe');
    }
}

async function getGlosbe() {
    glosbeArticle.value = await getArticle('glosbe', query.value);
}

function select(dic) {
    console.log(dic);
    selectedArticle.value = dic;

    theInput.value.select();

    if(dic === 'glosbe' && glosbeArticle.value === '') {
        getGlosbe();
    }
}

function openWindow(type) {
    const strWindowFeatures = 'location=yes,height=1200,width=500,top=0,left=1700,scrollbars=yes,status=yes';

    const URL =
        type === 'google' ? `https://translate.google.com/?sl=en&tl=uk&text=${query.value}%0A&op=translate`
        : '';

    open(URL, '_blank', strWindowFeatures);
}

// :value="query"
</script>

<template>
    <header>
        <div class="input-plus">
            <input
                type="text"
                ref="theInput"
                class="the-input"
                
                @change="request($event.target.value)"
                @keyup="$event.code === 'Enter' ? play() : null"
            >
            <PlayAudio :query />
        </div>
        
        <div class="tabs">
            <p
                class="tab"
                :class="selectedArticle === 'e2u' ? 'selectedTab' : ''"
                @click="select('e2u')"
            >
                e2u
            </p>
            <p
                class="tab"
                :class="selectedArticle === 'glosbe' ? 'selectedTab' : ''"
                @click="select('glosbe')"
            >
                glosbe
            </p>
            <p class="tab" @click="openWindow('google')">
                google
            </p>
        </div>
    </header>

    <main>
        <div
            class="e2u"
            v-show="selectedArticle === 'e2u'"
            v-html="e2uArticle"
        />
        <div
            class="glosbe"
            v-show="selectedArticle === 'glosbe'"
            v-html="glosbeArticle"
        />
    </main>
</template>

<style>
.input-plus {
    display: flex;
    /* display: grid;
    grid-template-columns: 1fr auto; */
    gap: 0.4rem;
    /* max-width: 50%; */
}
.the-input {
    font-size: 2rem;
    max-width: calc(100% - 1.4em);
}
.tabs {
   display: flex; 
}
.tab {
    width: 4em;
    border: 3px solid gray;
    /* background: #dadada; */
    margin: 0.2rem;
    text-align: center;
    cursor: pointer;
}
.selectedTab {
    border-color: blue;
}

main {
    height: calc(100vh - 5rem);
    overflow: auto;
}

table {
    width: 100%;
}

table.other {
    border-left: 4px solid orange;
}

table.context {
    border-left: 4px solid red;
}

td {
    border-bottom: 2px solid;
}

.result_row .found {
    color: blue;
}

/* .glosbe {
    overflow: auto;
} */

.glosbe-eng {
    background: #fdfdab;
}

.glosbe-source {
    text-align: right;
    font-size: 0.7em;
    border-bottom: 2px solid;
    margin-bottom: 0.2rem;
}
</style>
