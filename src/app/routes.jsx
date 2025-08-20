import React from 'react'
import { createBrowserRouter, RouterProvider, Navigate, Outlet, Link } from 'react-router-dom'
import { AppShell, Group, Button, TextInput, Avatar, Text } from '@mantine/core'
import { IconPlus, IconSearch } from '@tabler/icons-react'
import LoginPage from '../pages/LoginPage'
import DashboardPage from '../pages/DashboardPage'
import FilePage from '../pages/FilePage'
import ExplorePage from '../pages/ExplorePage'
import { useAuthStore } from '../store/auth'

function RequireAuth({ children }) {
  const token = useAuthStore(s => s.token)
  if (!token) return <Navigate to="/login" replace />
  return children
}

function Shell() {
  const { user, logout } = useAuthStore()
  return (
    <AppShell header={{ height: 64 }} padding="lg">
      <AppShell.Header style={{ backdropFilter: 'saturate(180%) blur(8px)', background: 'rgba(255,255,255,0.85)', borderBottom: '1px solid #eef0f2' }}>
        <Group h="100%" px="lg" justify="space-between">
          <Group gap="sm">
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/73/Microsoft_Excel_2013-2019_logo.svg" width={24} />
            <Text fw={700}>HIRA Docs</Text>
          </Group>
          <Group visibleFrom="sm">
            <TextInput leftSection={<IconSearch size={16} />} placeholder="Search files" radius="xl" />
            <Button leftSection={<IconPlus size={16} />} component={Link} to="/dashboard">Add file</Button>
            <Group gap="xs">
              <Avatar size="sm" radius="xl">{(user?.name || 'U')[0]}</Avatar>
              <Button variant="subtle" onClick={logout}>Logout</Button>
            </Group>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { path: '/login', element: <LoginPage /> },
  {
    element: <RequireAuth><Shell /></RequireAuth>,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/file/:fileId', element: <FilePage /> },
      { path: '/explore/:datasetId', element: <ExplorePage /> }
    ]
  }
])

export function AppRoutes() { return <RouterProvider router={router} /> }
