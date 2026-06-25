<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { sendChatMessage } from '@/api/tutors'
import { EMBED_API_KEY } from '@/config'

const props = defineProps<{
  tutorId: number
  title?: string
}>()

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const messages = ref<Message[]>([])
const input = ref('')
const loading = ref(false)
const error = ref('')
const sessionKey = ref<string | null>(null)
const listRef = ref<HTMLElement | null>(null)

async function scrollToBottom() {
  await nextTick()
  listRef.value?.scrollTo({ top: listRef.value.scrollHeight, behavior: 'smooth' })
}

async function send() {
  const text = input.value.trim()
  if (!text || loading.value) return

  if (!EMBED_API_KEY) {
    error.value = 'VITE_EMBED_API_KEY não configurada'
    return
  }

  messages.value.push({ role: 'user', content: text })
  input.value = ''
  loading.value = true
  error.value = ''
  await scrollToBottom()

  try {
    const reply = await sendChatMessage(props.tutorId, text, EMBED_API_KEY, sessionKey.value)
    sessionKey.value = reply.session_key
    messages.value.push({ role: 'assistant', content: reply.reply })
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro ao enviar mensagem'
  } finally {
    loading.value = false
    await scrollToBottom()
  }
}
</script>

<template>
  <div class="chat">
    <header class="chat__header">{{ title || 'Tutor' }}</header>
    <div ref="listRef" class="chat__messages">
      <p v-if="!messages.length" class="chat__empty">Olá! Como posso ajudar?</p>
      <div
        v-for="(msg, i) in messages"
        :key="i"
        :class="['bubble', msg.role]"
      >
        {{ msg.content }}
      </div>
      <p v-if="error" class="chat__error">{{ error }}</p>
    </div>
    <form class="chat__input" @submit.prevent="send">
      <input
        v-model="input"
        type="text"
        placeholder="Digite sua mensagem..."
        :disabled="loading"
      />
      <button type="submit" :disabled="loading || !input.trim()">
        {{ loading ? '...' : 'Enviar' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.chat {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f8fafc;
}

.chat__header {
  padding: 0.75rem 1rem;
  background: #1a1a2e;
  color: #fff;
  font-weight: 600;
}

.chat__messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.chat__empty {
  color: #94a3b8;
  text-align: center;
  margin-top: 2rem;
}

.bubble {
  max-width: 85%;
  padding: 0.6rem 0.85rem;
  border-radius: 12px;
  line-height: 1.4;
  white-space: pre-wrap;
}

.bubble.user {
  align-self: flex-end;
  background: #2563eb;
  color: #fff;
}

.bubble.assistant {
  align-self: flex-start;
  background: #fff;
  border: 1px solid #e2e8f0;
}

.chat__error {
  color: #dc2626;
  font-size: 0.85rem;
}

.chat__input {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem;
  border-top: 1px solid #e2e8f0;
  background: #fff;
}

.chat__input input {
  flex: 1;
  padding: 0.6rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
}

.chat__input button {
  padding: 0.6rem 1rem;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
}
</style>
