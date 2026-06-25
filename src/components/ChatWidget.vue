<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { fetchChatHistory, sendChatMessage } from '@/api/tutors'
import { EMBED_API_KEY } from '@/config'

const props = defineProps<{
  tutorId: number
  title?: string
}>()

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SESSION_STORAGE_PREFIX = 'dot-mvp-session-'

const messages = ref<Message[]>([])
const input = ref('')
const loading = ref(false)
const restoring = ref(false)
const error = ref('')
const sessionKey = ref<string | null>(null)
const listRef = ref<HTMLElement | null>(null)

function sessionStorageKey(tutorId: number) {
  return `${SESSION_STORAGE_PREFIX}${tutorId}`
}

function persistSessionKey(key: string) {
  localStorage.setItem(sessionStorageKey(props.tutorId), key)
}

function clearPersistedSession() {
  localStorage.removeItem(sessionStorageKey(props.tutorId))
}

async function scrollToBottom() {
  await nextTick()
  const list = listRef.value
  if (!list) return
  if (typeof list.scrollTo === 'function') {
    list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' })
  } else {
    list.scrollTop = list.scrollHeight
  }
}

async function restoreSession() {
  if (!EMBED_API_KEY) return

  const savedKey = localStorage.getItem(sessionStorageKey(props.tutorId))
  if (!savedKey) return

  restoring.value = true
  error.value = ''
  try {
    const history = await fetchChatHistory(props.tutorId, savedKey, EMBED_API_KEY)
    sessionKey.value = history.session_key
    messages.value = history.messages.map((message) => ({
      role: message.role,
      content: message.content,
    }))
    await scrollToBottom()
  } catch {
    clearPersistedSession()
    sessionKey.value = null
    messages.value = []
  } finally {
    restoring.value = false
  }
}

onMounted(() => {
  void restoreSession()
})

async function send() {
  const text = input.value.trim()
  if (!text || loading.value || restoring.value) return

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
    persistSessionKey(reply.session_key)
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
      <p v-if="restoring" class="chat__empty">Carregando conversa...</p>
      <p v-else-if="!messages.length" class="chat__empty">Olá! Como posso ajudar?</p>
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
        :disabled="loading || restoring"
      />
      <button type="submit" :disabled="loading || restoring || !input.trim()">
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
