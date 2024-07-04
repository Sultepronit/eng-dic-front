<script setup>
import { watch } from 'vue';
import { findAudio, play } from '@/utils/pronunciation.js';

const props = defineProps(['query']);

findAudio(props.query);
watch(props, () => {
    findAudio(props.query);
    // audio.play();
});

</script>

<template>
    <button @click="play()">🔊</button>
</template>

<style scoped>
button {
    background: white;
    border-width: 0;
}
</style>