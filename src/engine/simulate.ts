// 금액은 모두 만 원, 오늘 돈 가치(실질) 기준. React·DOM import 금지.

export type V0Input = {
  currentAge: number // V-IN-01
  retireAge: number // V-IN-02
  monthlyIncome: number // V-IN-03 퇴직 전 월소득(세후)
  monthlyPension: number // V-IN-04 국민연금 월액
  pensionStartAge: number // V-IN-05
  financialAssets: number // V-IN-06
  monthlySpending: number // V-IN-07
}

export type Assumptions = {
  realReturn: number
  targetAge: number
}

export type YearRow = {
  age: number
  income: number
  pension: number
  spending: number
  balance: number // 기말 잔액
}

export type SimulationResult = {
  rows: YearRow[]
  depletionAge: number | null // null = 목표 연령까지 고갈하지 않음
}

// W_a = (W_{a-1} + Y_a + P_a - C) × (1 + r), 현재 나이 ~ 목표 연령 - 1
export function simulate(input: V0Input, assumptions: Assumptions): SimulationResult {
  const rows: YearRow[] = []
  let balance = input.financialAssets
  let depletionAge: number | null = null

  for (let age = input.currentAge; age < assumptions.targetAge; age++) {
    const income = age < input.retireAge ? input.monthlyIncome * 12 : 0
    const pension = age >= input.pensionStartAge ? input.monthlyPension * 12 : 0
    const spending = input.monthlySpending * 12
    balance = (balance + income + pension - spending) * (1 + assumptions.realReturn)
    rows.push({ age, income, pension, spending, balance })
    if (depletionAge === null && balance < 0) depletionAge = age
  }

  return { rows, depletionAge }
}
