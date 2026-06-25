<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const isEmbed = computed(() => Boolean(route.meta.embed))

function logout() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div :class="['app', { 'app--embed': isEmbed }]">
    <header v-if="!isEmbed" class="header">
      <div class="header__brand">dot-MVP Tutores</div>
      <nav v-if="auth.isAuthenticated" class="header__nav">
        <RouterLink to="/admin/tutors">Tutores</RouterLink>
        <RouterLink to="/admin/users">Usuários</RouterLink>
        <RouterLink to="/docs/embed">Embed</RouterLink>
        <button class="link-btn" type="button" @click="logout">Sair</button>
      </nav>
    </header>
    <main class="main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
}

.app--embed .main {
  padding: 0;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background: #1a1a2e;
  color: #fff;
}

.header__brand {
  font-weight: 700;
}

.header__nav {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.header__nav a {
  color: #cbd5e1;
  text-decoration: none;
}

.header__nav a.router-link-active {
  color: #fff;
}

.link-btn {
  background: none;
  border: none;
  color: #cbd5e1;
  padding: 0;
}

.main {
  padding: 1.5rem;
  max-width: 960px;
  margin: 0 auto;
}
</style>
