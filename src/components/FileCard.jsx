import React from 'react'
import { Card, Group, Text, Badge, Stack } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { IconFileSpreadsheet } from '@tabler/icons-react'

export default function FileCard({ file }) {
  const navigate = useNavigate()
  return (
    <Card withBorder radius="md" onClick={()=>navigate(`/file/${file._id}`)} style={{ cursor:'pointer', background:'#f3fbf7' }}>
      <Group>
        <IconFileSpreadsheet color="#16a34a" />
        <Stack gap={2}>
          <Text fw={600} lineClamp={1}>{file.name}</Text>
          <Text size="xs" c="dimmed">{Math.round((file.size||0)/1024)} KB</Text>
        </Stack>
        <Badge ml="auto" color={file.status==='ready'?'green':'yellow'}>{file.status}</Badge>
      </Group>
    </Card>
  )
}
