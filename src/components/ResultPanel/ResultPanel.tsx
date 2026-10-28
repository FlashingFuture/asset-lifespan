import type { SimulationResult } from '../../engine/simulate'
import { BalanceChart } from '../BalanceChart/BalanceChart'
import { YearTable } from '../YearTable/YearTable'
import styles from './ResultPanel.module.css'

type Props = {
  result: SimulationResult
  currentAge: number
  retireAge: number
  targetAge: number
}

function headline(depletionAge: number | null, currentAge: number, targetAge: number) {
  if (depletionAge === null) return `${targetAge}세 이후까지 버틸 수 있어요`
  if (depletionAge === currentAge) return `지금 계획으로는 ${depletionAge}세부터 부족해요`
  return `지금 계획이면 ${depletionAge}세까지 버틸 수 있어요`
}

export function ResultPanel({ result, currentAge, retireAge, targetAge }: Props) {
  return (
    <section className={styles.panel}>
      <div className={styles.headlineCard}>
        <span className={styles.eyebrow}>자산고갈연령</span>
        <p className={styles.headline} aria-live="polite">
          {headline(result.depletionAge, currentAge, targetAge)}
        </p>
      </div>
      <BalanceChart rows={result.rows} retireAge={retireAge} depletionAge={result.depletionAge} />
      <YearTable rows={result.rows} />
    </section>
  )
}
