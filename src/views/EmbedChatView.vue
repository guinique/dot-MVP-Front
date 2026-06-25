<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import ChatWidget from '@/components/ChatWidget.vue'

const route = useRoute()
const tutorId = Number(route.params.tutorId)
const invalid = Number.isNaN(tutorId)
const title = ref(`Tutor #${tutorId}`)
</script>

<template>
  <div class="embed-page">
    <p v-if="invalid" class="error">Tutor ID inválido.</p>
    <ChatWidget v-else :tutor-id="tutorId" :title="title" />
  </div>
</template>

<style scoped>
.embed-page {
  height: 100vh;
  background: #fff;
}

.error {
  padding: 1rem;
  color: #dc2626;
}
</style>
