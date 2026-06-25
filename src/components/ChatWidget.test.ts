import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ChatWidget from '@/components/ChatWidget.vue'

const { fetchChatHistory } = vi.hoisted(() => ({
  fetchChatHistory: vi.fn(),
}))

vi.mock('@/config', () => ({
  EMBED_API_KEY: 'test-embed-key',
}))

vi.mock('@/api/tutors', () => ({
  sendChatMessage: vi.fn(),
  fetchChatHistory,
}))

describe('ChatWidget', () => {
  beforeEach(() => {
    localStorage.clear()
    fetchChatHistory.mockReset()
  })

  it('renders tutor title and input', () => {
    const wrapper = mount(ChatWidget, {
      props: { tutorId: 1, title: 'Python Tutor' },
    })
    expect(wrapper.text()).toContain('Python Tutor')
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(true)
    wrapper.unmount()
  })

  it('restores chat history from localStorage on mount', async () => {
    localStorage.setItem('dot-mvp-session-1', 'session-abc')
    fetchChatHistory.mockResolvedValue({
      session_id: 10,
      session_key: 'session-abc',
      messages: [
        { role: 'user', content: 'Oi', created_at: '2026-01-01T00:00:00Z' },
        { role: 'assistant', content: 'Olá!', created_at: '2026-01-01T00:00:01Z' },
      ],
    })

    const wrapper = mount(ChatWidget, {
      props: { tutorId: 1, title: 'Python Tutor' },
    })
    await flushPromises()

    expect(fetchChatHistory).toHaveBeenCalledWith(1, 'session-abc', 'test-embed-key')
    expect(wrapper.text()).toContain('Oi')
    expect(wrapper.text()).toContain('Olá!')
    wrapper.unmount()
  })
})
