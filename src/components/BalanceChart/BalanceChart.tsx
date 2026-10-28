import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { YearRow } from '../../engine/simulate'
import { formatKorean, formatManwon } from '../../format'
import { chartColors } from '../../theme'
import styles from './BalanceChart.module.css'

type Props = {
  rows: YearRow[]
  retireAge: number
  depletionAge: number | null
}

export function BalanceChart({ rows, retireAge, depletionAge }: Props) {
  return (
    <figure className={styles.chart}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={rows} margin={{ top: 28, right: 16, bottom: 8, left: 8 }}>
          <CartesianGrid stroke={chartColors.grid} vertical={false} />
          <XAxis dataKey="age" tickFormatter={(age) => `${age}세`} stroke={chartColors.axis} />
          <YAxis tickFormatter={formatManwon} width={64} stroke={chartColors.axis} />
          <Tooltip
            labelFormatter={(age) => `${age}세`}
            formatter={(value: number) => [formatKorean(value), '기말 잔액']}
          />
          <ReferenceLine y={0} stroke={chartColors.zero} />
          <ReferenceLine
            x={retireAge}
            stroke={chartColors.axis}
            strokeDasharray="4 4"
            label={{ value: '퇴직', position: 'top' }}
          />
          {depletionAge !== null && (
            <ReferenceLine
              x={depletionAge}
              stroke={chartColors.danger}
              strokeDasharray="4 4"
              label={{ value: '고갈', position: 'top' }}
            />
          )}
          <Line dataKey="balance" stroke={chartColors.line} strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
      <figcaption className={styles.caption}>나이별 기말 금융자산 잔액 (만 원, 오늘 돈 가치)</figcaption>
    </figure>
  )
}
