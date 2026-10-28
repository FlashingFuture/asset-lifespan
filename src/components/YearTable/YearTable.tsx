import type { YearRow } from '../../engine/simulate'
import { formatManwon } from '../../format'
import styles from './YearTable.module.css'

export function YearTable({ rows }: { rows: YearRow[] }) {
  return (
    <details className={styles.details}>
      <summary className={styles.summary}>연도별 표 보기</summary>
      <div className={styles.wrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>나이</th>
              <th>근로소득</th>
              <th>국민연금</th>
              <th>생활비</th>
              <th>기말 잔액</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.age}>
                <td>{r.age}세</td>
                <td>{formatManwon(r.income)}</td>
                <td>{formatManwon(r.pension)}</td>
                <td>{formatManwon(r.spending)}</td>
                <td className={r.balance < 0 ? styles.negative : undefined}>{formatManwon(r.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={styles.unitNote}>단위: 만 원/년</p>
    </details>
  )
}
