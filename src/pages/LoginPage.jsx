import React, { useState } from 'react'
import { Button, Container, Paper, TextInput, Title, Stack, Group, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import api from '../lib/http'
import { useAuthStore } from '../store/auth'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const setAuth = useAuthStore(s => s.setAuth)
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('pass123')
  const [name, setName] = useState('Test User')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    try {
      setLoading(true)
      const url = mode === 'login' ? '/auth/login' : '/auth/signup'
      const body = mode === 'login' ? { email, password } : { email, name, password }
      const { data } = await api.post(url, body)
      setAuth({ token: data.token, user: data.user })
      notifications.show({ message: 'Welcome!', color: 'teal' })
      navigate('/dashboard', { replace: true })
    } catch (e) {
      notifications.show({ message: e?.response?.data?.error || 'Auth failed', color: 'red' })
    } finally { setLoading(false) }
  }

  return (
    <Container size={460} pt={80}>
      <Title ta="center" mb="md">HIRA Docs</Title>
      <Paper p="xl" withBorder radius={20} style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
        <Stack>
          {mode === 'signup' && <TextInput label="Name" value={name} onChange={e=>setName(e.target.value)} radius="lg" />}
          <TextInput label="Email" value={email} onChange={e=>setEmail(e.target.value)} radius="lg" />
          <TextInput label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} radius="lg" />
          <Button loading={loading} onClick={submit} color="teal" radius="lg">{mode === 'login' ? 'Login' : 'Create account'}</Button>
          <Group justify="space-between">
            <Text c="dimmed" size="sm">Use your backend credentials</Text>
            <Button variant="subtle" onClick={()=>setMode(mode==='login'?'signup':'login')}>Switch to {mode==='login'?'Sign Up':'Login'}</Button>
          </Group>
        </Stack>
      </Paper>
    </Container>
  )
}
