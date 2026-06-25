<script setup lang="ts">
import { computed } from 'vue'

const origin = computed(() => (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'))

const snippet = computed(
  () => `<iframe
  src="${origin.value}/embed/TUTOR_ID"
  width="400"
  height="600"
  style="border: none; border-radius: 12px;"
  title="Tutor Chat"
></iframe>`,
)
</script>

<template>
  <div class="card">
    <h1>Documentação de Embed</h1>
    <p>
      Incorpore o widget de chat em qualquer site via <code>&lt;iframe&gt;</code>.
      Substitua <code>TUTOR_ID</code> pelo ID do tutor criado no painel admin.
    </p>

    <h2>Snippet</h2>
    <pre class="code">{{ snippet }}</pre>

    <h2>Configuração</h2>
    <ul>
      <li>
        Defina <code>VITE_EMBED_API_KEY</code> no <code>.env</code> do frontend (mesmo valor de
        <code>EMBED_API_KEY</code> no backend).
      </li>
      <li>O backend deve permitir CORS para a origem do frontend.</li>
      <li>A rota <code>/embed/:tutorId</code> renderiza somente o chat — ideal para iframe.</li>
    </ul>

    <h2>Fluxo</h2>
    <ol>
      <li>Admin cria tutor em <RouterLink to="/admin/tutors">/admin/tutors</RouterLink></li>
      <li>Copie a URL de embed exibida no card do tutor</li>
      <li>Cole o iframe no site integrador</li>
      <li>Usuário final conversa com o tutor via agente de IA</li>
    </ol>
  </div>
</template>

<style scoped>
.code {
  background: #1e293b;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 0.85rem;
}

.card {
  background: #fff;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

code {
  background: #f1f5f9;
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
}
</style>
