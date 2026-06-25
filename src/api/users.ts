import { apiFetch } from '@/api/client'
import type { User } from '@/config'

export interface UserCreatePayload {
  email: string
  password: string
  full_name?: string | null
  role?: 'admin' | 'user'
  is_active?: boolean
}

export interface UserUpdatePayload {
  email?: string
  password?: string
  full_name?: string | null
  role?: 'admin' | 'user'
  is_active?: boolean
}

export function fetchUsers(token: string) {
  return apiFetch<User[]>('/api/v1/users', {}, token)
}

export function createUser(token: string, payload: UserCreatePayload) {
  return apiFetch<User>(
    '/api/v1/users',
    { method: 'POST', body: JSON.stringify(payload) },
    token,
  )
}

export function updateUser(token: string, id: number, payload: UserUpdatePayload) {
  return apiFetch<User>(
    `/api/v1/users/${id}`,
    { method: 'PATCH', body: JSON.stringify(payload) },
    token,
  )
}

export function deleteUser(token: string, id: number) {
  return apiFetch<void>(`/api/v1/users/${id}`, { method: 'DELETE' }, token)
}
