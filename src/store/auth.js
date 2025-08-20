import { create } from 'zustand'
export const useAuthStore = create(set => ({
  token: localStorage.getItem('token') || '',
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  setAuth: ({ token, user }) => { localStorage.setItem('token', token || ''); localStorage.setItem('user', JSON.stringify(user || null)); set({ token, user }) },
  logout: () => { localStorage.removeItem('token'); localStorage.removeItem('user'); set({ token: '', user: null }) }
}))
