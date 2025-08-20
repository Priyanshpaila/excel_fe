import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Title, Tabs, Button, Group, Card, SimpleGrid, Text } from '@mantine/core'
import api from '../lib/http'
import { useQuery } from '@tanstack/react-query'
import ChartCanvas from '../components/ChartCanvas'

export default function FilePage() {
  const { fileId } = useParams()
  const navigate = useNavigate()
  const fileQ = useQuery({ queryKey: ['file', fileId], queryFn: () => api.get(`/files/${fileId}`).then(r=>r.data) })
  if (!fileQ.data) return null
  const f = fileQ.data
  return (
    <Container py="lg" size="xl">
      <Group justify="space-between" mb="sm">
        <Group>
          <img src="https://upload.wikimedia.org/wikipedia/commons/7/73/Microsoft_Excel_2013-2019_logo.svg" width={28} />
          <Title order={2} fw={700}>{f.name}</Title>
        </Group>
        <Button variant="light" onClick={()=>navigate(-1)}>Go back</Button>
      </Group>
      <Tabs defaultValue={f.sheets?.[0]?.sheetId}>
        <Tabs.List>
          {f.sheets?.map(s => <Tabs.Tab key={s.sheetId} value={s.sheetId}>{s.name}</Tabs.Tab>)}
        </Tabs.List>
        {f.sheets?.map(s => (
          <Tabs.Panel key={s.sheetId} value={s.sheetId} pt="md">
            <SheetBlock file={f} sheet={s} />
          </Tabs.Panel>
        ))}
      </Tabs>
    </Container>
  )
}

function SheetBlock({ file, sheet }) {
  const schemaQ = useQuery({ queryKey: ['schema', sheet.sheetId], queryFn: () => api.get(`/sheets/${sheet.sheetId}/schema`).then(r=>r.data) })
  const datasetIdQ = useQuery({ enabled: !sheet.datasetId, queryKey: ['datasetId', sheet.sheetId], queryFn: () => api.get(`/sheets/${sheet.sheetId}/dataset`).then(r=>r.data.datasetId) })
  const datasetId = sheet.datasetId || datasetIdQ.data
  const cols = schemaQ.data?.columns || []

  const x = cols.find(c=>['string','category','boolean'].includes(c.type))?.name || cols[0]?.name
  const y = cols.find(c=>c.type==='number')?.name || cols[1]?.name
  const date = cols.find(c=>c.type==='date')?.name || null

  return (
    <>
      {datasetId && (
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          <Card>
            <Title order={4} mb="xs">Stacked Column Chart</Title>
            <ChartCanvas datasetId={datasetId} spec={{ type:'bar', x, y, agg:'sum' }} height={280} />
          </Card>
          <Card>
            <Title order={4} mb="xs">Bar Chart</Title>
            <ChartCanvas datasetId={datasetId} spec={{ type:'bar', x, y, agg:'sum' }} height={280} />
          </Card>
          <Card span={2}>
            <Title order={4} mb="xs">Line Chart</Title>
            <ChartCanvas datasetId={datasetId} spec={{ type:'line', x: date || x, y, agg:'sum', bin: date ? { field: date, unit:'month' } : undefined }} height={420} />
          </Card>
        </SimpleGrid>
      )}
      {!datasetId && <Text c="dimmed" mt="sm">Preparing dataset…</Text>}
    </>
  )
}
