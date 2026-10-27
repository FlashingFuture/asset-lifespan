import { useState } from 'react'
import assumptionsFile from './assumptions.json'
import { simulate, type Assumptions, type V0Input } from './engine/simulate'

const assumptions: Assumptions = {
  realReturn: assumptionsFile.realReturn.value,
  targetAge: assumptionsFile.targetAge.value,
}

const defaultInput: V0Input = {
  currentAge: 55,
  retireAge: 60,
  monthlyIncome: 400,
  monthlyPension: 120,
  pensionStartAge: 65,
  financialAssets: 30000,
  monthlySpending: 300,
}

type Field = { key: keyof V0Input; label: string; unit: string }

const fields: Field[] = [
  { key: 'currentAge', label: '현재 나이', unit: '세' },
  { key: 'retireAge', label: '퇴직 나이', unit: '세' },
  { key: 'monthlyIncome', label: '퇴직 전 월소득(세후)', unit: '만 원/월' },
  { key: 'monthlyPension', label: '국민연금 월액', unit: '만 원/월' },
  { key: 'pensionStartAge', label: '국민연금 수령 시작 나이', unit: '세' },
  { key: 'financialAssets', label: '현재 금융자산', unit: '만 원' },
  { key: 'monthlySpending', label: '월 생활비', unit: '만 원/월' },
]

function headline(depletionAge: number | null, currentAge: number) {
  if (depletionAge === null) return `${assumptions.targetAge}세 이후까지 버틸 수 있어요`
  if (depletionAge === currentAge) return `지금 계획으로는 ${depletionAge}세부터 부족해요`
  return `지금 계획이면 ${depletionAge}세까지 버틸 수 있어요`
}

export default function App() {
  const [input, setInput] = useState(defaultInput)
  const result = simulate(input, assumptions)

  return (
    <main className="page">
      <h1>자산수명 시뮬레이터</h1>

      <form className="inputs" onSubmit={(e) => e.preventDefault()}>
        {fields.map((f) => (
          <label key={f.key} className="field">
            <span>{f.label}</span>
            <span className="control">
              <input
                type="number"
                inputMode="numeric"
                value={input[f.key]}
                onChange={(e) => setInput({ ...input, [f.key]: Number(e.target.value) })}
              />
              <span className="unit">{f.unit}</span>
            </span>
          </label>
        ))}
      </form>

      <section className="result">
        <p className="headline">{headline(result.depletionAge, input.currentAge)}</p>
        <p className="notice">
          실질수익률 {assumptions.realReturn * 100}% 가정, 프로토타입 계산이에요. 투자 권유나 공식 연금 예상액이
          아니에요.
        </p>
      </section>
    </main>
  )
}
