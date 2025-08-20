import React, { useMemo, useState } from 'react'
import { useSearchParams, useParams } from 'react-router-dom'
import { Container, Title, Group } from '@mantine/core'
import api from '../lib/http'
import { useQuery } from '@tanstack/react-query'
import FieldPicker from '../components/FieldPicker'
import ChartCanvas from '../components/ChartCanvas'

export default function ExplorePage() {
  const { datasetId } = useParams()
  const [search] = useSearchParams()
  const sheetId = search.get('sheetId')

  const schemaQ = useQuery({ enabled: !!sheetId, queryKey: ['schema', sheetId], queryFn: () => api.get(`/sheets/${sheetId}/schema`).then(r=>r.data) })

  const [spec, setSpec] = useState({ type: 'bar' })
  const [activeSpec, setActiveSpec] = useState(null)

  const schema = schemaQ.data?.columns || []
  const defaultSpec = useMemo(() => {
    const num = schema.find(c=>c.type==='number')?.name
    const cat = schema.find(c=>c.type==='string' || c.type==='category' || c.type==='boolean')?.name
    return { type:'bar', x: cat, y: num, agg: 'sum' }
  }, [schema])

  React.useEffect(() => { setSpec(s => ({ ...defaultSpec, ...s })) }, [schemaQ.isSuccess]) // eslint-disable-line

  return (
    <Container py="lg">
      <Title mb="md">Explore</Title>
      <FieldPicker schema={schema} value={spec} onChange={setSpec} onRun={() => setActiveSpec({ ...spec })} />
      {activeSpec && (<><Group mt="lg"><Title order={3}>Chart</Title></Group><ChartCanvas datasetId={datasetId} spec={activeSpec} height={420} /></>)}
    </Container>
  )
}
