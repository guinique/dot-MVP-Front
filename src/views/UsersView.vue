<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { createUser, deleteUser, fetchUsers, updateUser } from '@/api/users'
import type { User } from '@/config'

const auth = useAuthStore()
const users = ref<User[]>([])
const loading = ref(true)
const error = ref('')
const showForm = ref(false)

const form = ref({
  email: '',
  password: '',
  full_name: '',
  role: 'user' as 'admin' | 'user',
})

async function load() {
  loading.value = true
  error.value = ''
  try {
    users.value = await fetchUsers(auth.token!)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Falha ao carregar usuários'
  } finally {
    loading.value = false
  }
}

async function onCreate() {
  try {
    await createUser(auth.token!, {
      email: form.value.email,
      password: form.value.password,
      full_name: form.value.full_name || null,
      role: form.value.role,
    })
    showForm.value = false
    form.value = { email: '', password: '', full_name: '', role: 'user' }
    await load()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Falha ao criar usuário'
  }
}

async function toggleActive(user: User) {
  await updateUser(auth.token!, user.id, { is_active: !user.is_active })
  await load()
}

async function onDelete(user: User) {
  if (!confirm(`Remover usuário "${user.email}"?`)) return
  try {
    await deleteUser(auth.token!, user.id)
    await load()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Falha ao remover usuário'
  }
}

onMounted(load)
</script>

<template>
  <div>
    <div class="toolbar">
      <h1>Usuários</h1>
      <button type="button" @click="showForm = !showForm">
        {{ showForm ? 'Cancelar' : 'Novo usuário' }}
      </button>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="loading">Carregando...</p>

    <div v-if="showForm" class="card form">
      <h2>Novo usuário</h2>
      <label>Email <input v-model="form.email" type="email" required /></label>
      <label>Senha <input v-model="form.password" type="password" required minlength="8" /></label>
      <label>Nome <input v-model="form.full_name" /></label>
      <label>
        Papel
        <select v-model="form.role">
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
      </label>
      <button type="button" @click="onCreate">Salvar</button>
    </div>

    <div v-for="user in users" :key="user.id" class="card user">
      <div class="user__head">
        <h2>{{ user.email }}</h2>
        <span :class="['badge', user.role]">{{ user.role }}</span>
        <span :class="['badge', user.is_active ? 'active' : 'inactive']">
          {{ user.is_active ? 'ativo' : 'inativo' }}
        </span>
      </div>
      <p v-if="user.full_name" class="muted">{{ user.full_name }}</p>
      <div class="actions">
        <button type="button" @click="toggleActive(user)">
          {{ user.is_active ? 'Desativar' : 'Ativar' }}
        </button>
        <button
          v-if="user.id !== auth.user?.id"
          type="button"
          class="danger"
          @click="onDelete(user)"
        >
          Remover
        </button>
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
select {
  padding: 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
}

.user {
  margin-bottom: 1rem;
}

.user__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge {
  font-size: 0.75rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  text-transform: uppercase;
}

.badge.admin {
  background: #dbeafe;
  color: #1e40af;
}

.badge.user {
  background: #f1f5f9;
  color: #475569;
}

.badge.active {
  background: #dcfce7;
  color: #166534;
}

.badge.inactive {
  background: #fee2e2;
  color: #991b1b;
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
