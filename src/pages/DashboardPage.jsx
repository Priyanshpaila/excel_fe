import React from 'react'
import { Container, Title, Group, SimpleGrid, Card, Text, Button, Table, ActionIcon, Stack } from '@mantine/core'
import { IconFileSpreadsheet, IconTrash } from '@tabler/icons-react'
import UploadDropzone from '../components/UploadDropzone'
import api from '../lib/http'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { notifications } from '@mantine/notifications'

export default function DashboardPage() {
  const navigate = useNavigate()
  const q = useQuery({ queryKey: ['files'], queryFn: () => api.get('/files').then(r=>r.data) })

  const remove = async (fileId) => {
    await api.delete(`/files/${fileId}`)
    notifications.show({ message: 'Removed', color: 'teal' })
    q.refetch()
  }

  const files = q.data || []
  const recents = files.slice(0, 5)

  return (
    <Container py="lg" size="xl">
      <UploadDropzone onUploaded={()=>q.refetch()} />

      <Group justify="space-between" mt="lg" mb="xs">
        <Title order={3}>Recents</Title>
        <Button variant="light" onClick={()=>document.querySelector('input[type=file]')?.click()}>Add file</Button>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 3, md: 5 }}>
        {recents.map(f => (
          <Card key={f._id} onClick={()=>navigate(`/file/${f._id}`)} style={{ cursor:'pointer', background: '#f3fbf7' }}>
            <Group>
              <IconFileSpreadsheet color="#16a34a" />
              <Stack gap={2}>
                <Text fw={600} lineClamp={1}>{f.name}</Text>
                <Text size="xs" c="dimmed">{dayjs(f.createdAt).format('MMM D, YYYY')}</Text>
              </Stack>
            </Group>
          </Card>
        ))}
      </SimpleGrid>

      <Title order={3} mt="lg" mb="xs">All files</Title>
      <Card withBorder>
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Filename</Table.Th>
              <Table.Th>Size</Table.Th>
              <Table.Th>Uploaded on</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {files.map(f => (
              <Table.Tr key={f._id}>
                <Table.Td>
                  <Group gap="xs">
                    <IconFileSpreadsheet color="#16a34a" />
                    <Text fw={500}>{f.name}</Text>
                  </Group>
                </Table.Td>
                <Table.Td>{Math.round((f.size||0)/1024)} KB</Table.Td>
                <Table.Td>{dayjs(f.createdAt).format('MMM D, YYYY')}</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Button size="xs" variant="light" onClick={()=>navigate(`/file/${f._id}`)}>Open</Button>
                    <ActionIcon color="red" variant="subtle" onClick={()=>remove(f._id)}><IconTrash size={16} /></ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>
    </Container>
  )
}
