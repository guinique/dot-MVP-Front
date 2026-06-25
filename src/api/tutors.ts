import { apiFetch } from '@/api/client'
import type { ChatHistory, ChatReply, Tutor } from '@/config'

export function fetchTutors(token: string) {
  return apiFetch<Tutor[]>('/api/v1/tutors', {}, token)
}

export function createTutor(token: string, payload: Partial<Tutor> & { system_instructions: string; title: string }) {
  return apiFetch<Tutor>(
    '/api/v1/tutors',
    { method: 'POST', body: JSON.stringify(payload) },
    token,
  )
}

export function updateTutor(token: string, id: number, payload: Partial<Tutor>) {
  return apiFetch<Tutor>(
    `/api/v1/tutors/${id}`,
    { method: 'PATCH', body: JSON.stringify(payload) },
    token,
  )
}

export function deactivateTutor(token: string, id: number) {
  return apiFetch<Tutor>(`/api/v1/tutors/${id}/deactivate`, { method: 'POST' }, token)
}

export function deleteTutor(token: string, id: number) {
  return apiFetch<void>(`/api/v1/tutors/${id}`, { method: 'DELETE' }, token)
}

export async function sendChatMessage(
  tutorId: number,
  message: string,
  embedToken: string,
  sessionKey?: string | null,
): Promise<ChatReply> {
  return apiFetch<ChatReply>(
    `/api/v1/chat/tutors/${tutorId}/messages`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Embed-Token': embedToken,
      },
      body: JSON.stringify({ message, session_key: sessionKey ?? null }),
    },
  )
}

export function fetchChatHistory(
  tutorId: number,
  sessionKey: string,
  embedToken: string,
): Promise<ChatHistory> {
  return apiFetch<ChatHistory>(
    `/api/v1/chat/tutors/${tutorId}/sessions/${encodeURIComponent(sessionKey)}/messages`,
    {
      headers: { 'X-Embed-Token': embedToken },
    },
  )
}
