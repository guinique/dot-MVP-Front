export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
export const EMBED_API_KEY = import.meta.env.VITE_EMBED_API_KEY || ''

export interface User {
  id: number
  email: string
  full_name: string | null
  role: 'admin' | 'user'
  is_active: boolean
}

export interface Tutor {
  id: number
  title: string
  description: string | null
  system_instructions: string
  status: 'active' | 'inactive'
  source_urls: string[]
}

export interface ChatReply {
  session_id: number
  session_key: string
  reply: string
}

export interface ChatHistoryMessage {
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface ChatHistory {
  session_id: number
  session_key: string
  messages: ChatHistoryMessage[]
}
