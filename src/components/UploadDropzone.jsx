import React, { useState } from 'react'
import { Dropzone } from '@mantine/dropzone'
import { Paper, Text, Group, Button, LoadingOverlay, Stack } from '@mantine/core'
import api from '../lib/http'
import { notifications } from '@mantine/notifications'

export default function UploadDropzone({ onUploaded }) {
  const [loading, setLoading] = useState(false)
  const handle = async (files) => {
    const file = files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    try {
      setLoading(true)
      const { data } = await api.post('/files/upload', fd)
      notifications.show({ message: 'Uploaded successfully', color: 'teal' })
      onUploaded?.(data)
    } catch (e) {
      notifications.show({ message: e?.response?.data?.error || 'Upload failed', color: 'red' })
    } finally { setLoading(false) }
  }
  return (
    <Paper p="xl" radius={20} withBorder style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }} pos="relative">
      <LoadingOverlay visible={loading} />
      <Stack align="center" gap="sm">
        <Text fw={700} fz={28}>Please upload a file.</Text>
        <Text c="dimmed">Select relevant documents you want to add</Text>
        <Dropzone onDrop={handle} maxFiles={1} accept={['.xlsx','.xls','.csv']}
          styles={{ root: { borderStyle: 'dashed', borderRadius: 18, padding: 32, width: '100%', background: '#fafbfc' } }}>
          <Group justify="center" mih={160}>
            <Stack align="center" gap={6}>
              <div style={{ fontSize: 40, opacity: 0.5 }}>☁️⬆️</div>
              <Text fw={600}>Select a file or drag and drop here</Text>
              <Text c="dimmed" size="sm">XLSX, XLS or CSV</Text>
              <Button variant="outline" color="teal">Select file</Button>
            </Stack>
          </Group>
        </Dropzone>
        <Button size="md" color="teal" style={{ width: 180 }}>UPLOAD</Button>
      </Stack>
    </Paper>
  )
}
