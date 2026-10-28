import { useState } from 'react'
import styles from './App.module.css'
import assumptionsFile from './assumptions.json'
import { Footer } from './components/Footer/Footer'
import { Header } from './components/Header/Header'
import { InputForm } from './components/InputForm/InputForm'
import { ResultPanel } from './components/ResultPanel/ResultPanel'
import { simulate, type Assumptions, type V0Input } from './engine/simulate'
import { validate, type RawInput } from './validate'

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

function toRaw(input: V0Input): RawInput {
  return Object.fromEntries(Object.entries(input).map(([k, v]) => [k, String(v)])) as RawInput
}

export default function App() {
  const [raw, setRaw] = useState(toRaw(defaultInput))
  // 오류가 있으면 결과는 마지막 유효값으로 유지
  const [input, setInput] = useState(defaultInput)
  const { errors } = validate(raw)
  const result = simulate(input, assumptions)

  const onChange = (key: keyof V0Input, value: string) => {
    const next = { ...raw, [key]: value }
    setRaw(next)
    const checked = validate(next).input
    if (checked) setInput(checked)
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.layout}>
          <InputForm raw={raw} errors={errors} onChange={onChange} />
          <ResultPanel
            result={result}
            currentAge={input.currentAge}
            retireAge={input.retireAge}
            targetAge={assumptions.targetAge}
          />
        </div>
      </main>
      <Footer realReturn={assumptions.realReturn} asOf={assumptionsFile.realReturn.asOf} />
    </>
  )
}
