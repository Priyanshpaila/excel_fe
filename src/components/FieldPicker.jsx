import React from 'react'
import { Group, Select, NumberInput, Button } from '@mantine/core'

export default function FieldPicker({ schema=[], value, onChange, onRun }) {
  const columns = schema.map(c => ({ value: c.name, label: `${c.name} (${c.type})` }))
  return (
    <>
      <Group wrap="wrap" gap="sm">
        <Select label="X" data={columns} value={value.x || null} onChange={(v)=>onChange({ ...value, x:v })} />
        <Select label="Y" data={columns} value={value.y || null} onChange={(v)=>onChange({ ...value, y:v })} />
        <Select label="Type" data={[{value:'bar',label:'Bar'},{value:'line',label:'Line'}]} value={value.type || 'bar'} onChange={(v)=>onChange({ ...value, type:v })} />
        <Select label="Aggregate" data={[{value:'sum',label:'sum'},{value:'avg',label:'avg'},{value:'min',label:'min'},{value:'max',label:'max'},{value:'count',label:'count'}]} value={value.agg || 'sum'} onChange={(v)=>onChange({ ...value, agg:v })} />
        <NumberInput label="Limit" value={value.limit || 0} onChange={(v)=>onChange({ ...value, limit:v })} min={0} />
      </Group>
      <Group mt="sm">
        <Button onClick={onRun}>Run</Button>
      </Group>
    </>
  )
}
