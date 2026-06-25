import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ChatWidget from '@/components/ChatWidget.vue'

describe('ChatWidget', () => {
  it('renders tutor title and input', () => {
    const wrapper = mount(ChatWidget, {
      props: { tutorId: 1, title: 'Python Tutor' },
    })
    expect(wrapper.text()).toContain('Python Tutor')
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(true)
  })
})
