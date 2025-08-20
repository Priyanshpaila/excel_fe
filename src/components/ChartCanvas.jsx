import React from 'react'
import ReactECharts from 'echarts-for-react'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/http'
import { b64url } from '../lib/b64url'

export default function ChartCanvas({ datasetId, spec, height=360 }) {
  const q = useQuery({
    queryKey: ['query', datasetId, spec],
    queryFn: () => {
      const enc = b64url(spec)
      return api.get(`/datasets/${datasetId}/query`, { params: { spec: enc } }).then(r=>r.data)
    }
  })

  const rows = q.data?.rows || []
  const categories = [...new Set(rows.map(r => r.x))]
  const seriesKeys = [...new Set(rows.map(r => r.series).filter(Boolean))]
  const hasSeries = seriesKeys.length > 0

  const option = {
    tooltip: { trigger: 'axis' },
    legend: hasSeries ? { data: seriesKeys } : undefined,
    grid: { left: 24, right: 16, top: 32, bottom: 24 },
    xAxis: { type: 'category', data: categories },
    yAxis: { type: 'value' },
    series: hasSeries
      ? seriesKeys.map(sk => ({
          name: sk,
          type: spec.type === 'line' ? 'line' : 'bar',
          itemStyle: { borderRadius: 8 },
          data: categories.map(x => { const row = rows.find(r => r.x === x && r.series === sk); return row ? row.value : 0 })
        }))
      : [{
          type: spec.type === 'line' ? 'line' : 'bar',
          itemStyle: { borderRadius: 8 },
          data: categories.map(x => { const row = rows.find(r => r.x === x); return row ? row.value : 0 })
        }]
  }
  return <ReactECharts option={option} style={{ height }} />
}
