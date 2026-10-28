import type { V0Input } from '../../engine/simulate'
import { formatKorean } from '../../format'
import type { Errors, RawInput } from '../../validate'
import styles from './InputForm.module.css'

type Field = { key: keyof V0Input; label: string; unit: string; money?: boolean }

const fields: Field[] = [
  { key: 'currentAge', label: '현재 나이', unit: '세' },
  { key: 'retireAge', label: '퇴직 나이', unit: '세' },
  { key: 'monthlyIncome', label: '퇴직 전 월소득(세후)', unit: '만 원/월', money: true },
  { key: 'monthlyPension', label: '국민연금 월액', unit: '만 원/월', money: true },
  { key: 'pensionStartAge', label: '국민연금 수령 시작 나이', unit: '세' },
  { key: 'financialAssets', label: '현재 금융자산', unit: '만 원', money: true },
  { key: 'monthlySpending', label: '월 생활비', unit: '만 원/월', money: true },
]

type Props = {
  raw: RawInput
  errors: Errors
  onChange: (key: keyof V0Input, value: string) => void
}

export function InputForm({ raw, errors, onChange }: Props) {
  return (
    <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
      <h2 className={styles.heading}>내 계획 입력</h2>
      {fields.map((f) => (
        <label key={f.key} className={styles.field}>
          <span className={styles.label}>{f.label}</span>
          <span className={styles.control}>
            <input
              className={styles.input}
              type="number"
              inputMode="numeric"
              value={raw[f.key]}
              aria-invalid={errors[f.key] ? true : undefined}
              onChange={(e) => onChange(f.key, e.target.value)}
            />
            <span className={styles.unit}>{f.unit}</span>
          </span>
          {errors[f.key] ? (
            <span className={styles.error}>{errors[f.key]}</span>
          ) : (
            f.money && <span className={styles.hint}>{formatKorean(Number(raw[f.key]))}</span>
          )}
        </label>
      ))}
    </form>
  )
}
