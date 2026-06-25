import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/admin/tutors' },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/admin/tutors',
      name: 'tutors',
      component: () => import('@/views/TutorsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/docs/embed',
      name: 'embed-docs',
      component: () => import('@/views/EmbedDocsView.vue'),
      meta: { public: true },
    },
    {
      path: '/embed/:tutorId',
      name: 'embed-chat',
      component: () => import('@/views/EmbedChatView.vue'),
      meta: { public: true, embed: true },
    },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (!auth.user && auth.token) {
    await auth.init()
  }
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.name === 'login' && auth.isAuthenticated) {
    return { name: 'tutors' }
  }
})

export default router
