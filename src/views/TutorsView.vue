<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import {
  createTutor,
  deactivateTutor,
  deleteTutor,
  fetchTutors,
} from '@/api/tutors'
import type { Tutor } from '@/config'

const auth = useAuthStore()
const tutors = ref<Tutor[]>([])
const loading = ref(true)
const error = ref('')
const showForm = ref(false)

const form = ref({
  title: '',
  description: '',
  system_instructions: '',
  source_urls: '',
})

async function load() {
  loading.value = true
  error.value = ''
  try {
    tutors.value = await fetchTutors(auth.token!)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load tutors'
  } finally {
    loading.value = false
  }
}

async function onCreate() {
  try {
    await createTutor(auth.token!, {
      title: form.value.title,
      description: form.value.description || null,
      system_instructions: form.value.system_instructions,
      source_urls: form.value.source_urls
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      status: 'active',
    })
    showForm.value = false
    form.value = { title: '', description: '', system_instructions: '', source_urls: '' }
    await load()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to create tutor'
  }
}

async function onDeactivate(tutor: Tutor) {
  await deactivateTutor(auth.token!, tutor.id)
  await load()
}

async function onDelete(tutor: Tutor) {
  if (!confirm(`Remover tutor "${tutor.title}"?`)) return
  await deleteTutor(auth.token!, tutor.id)
  await load()
}

function embedUrl(tutorId: number) {
  return `${window.location.origin}/embed/${tutorId}`
}

onMounted(load)
</script>

<template>
  <div>
    <div class="toolbar">
      <h1>Tutores</h1>
      <button type="button" @click="showForm = !showForm">
        {{ showForm ? 'Cancelar' : 'Novo tutor' }}
      </button>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="loading">Carregando...</p>

    <div v-if="showForm" class="card form">
      <h2>Novo tutor</h2>
      <label>Título <input v-model="form.title" required /></label>
      <label>Descrição <input v-model="form.description" /></label>
      <label>
        Instruções do sistema
        <textarea v-model="form.system_instructions" rows="4" required />
      </label>
      <label>
        URLs de fontes (uma por linha)
        <textarea v-model="form.source_urls" rows="3" />
      </label>
      <button type="button" @click="onCreate">Salvar</button>
    </div>

    <div v-for="tutor in tutors" :key="tutor.id" class="card tutor">
      <div class="tutor__head">
        <h2>{{ tutor.title }}</h2>
        <span :class="['badge', tutor.status]">{{ tutor.status }}</span>
      </div>
      <p class="muted">{{ tutor.description }}</p>
      <p class="embed">
        <strong>Embed:</strong>
        <code>{{ embedUrl(tutor.id) }}</code>
      </p>
      <div class="actions">
        <button v-if="tutor.status === 'active'" type="button" @click="onDeactivate(tutor)">
          Desativar
        </button>
        <button type="button" class="danger" @click="onDelete(tutor)">Remover</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.form {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form label {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

input,
textarea {
  padding: 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
}

.tutor {
  margin-bottom: 1rem;
}

.tutor__head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.badge {
  font-size: 0.75rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  text-transform: uppercase;
}

.badge.active {
  background: #dcfce7;
  color: #166534;
}

.badge.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.embed code {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.85rem;
  word-break: break-all;
}

.actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

button {
  padding: 0.4rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #fff;
}

button.danger {
  border-color: #fca5a5;
  color: #dc2626;
}

.muted {
  color: #64748b;
}

.error {
  color: #dc2626;
}

.card {
  background: #fff;
  border-radius: 10px;
  padding: 1.25rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}
</style>
