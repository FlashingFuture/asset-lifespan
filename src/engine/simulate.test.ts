import { describe, expect, it } from 'vitest'
import { simulate, type V0Input } from './simulate'

const assumptions = { realReturn: 0.02, targetAge: 100 }

const base: V0Input = {
  currentAge: 55,
  retireAge: 60,
  monthlyIncome: 400,
  monthlyPension: 120,
  pensionStartAge: 65,
  financialAssets: 30000,
  monthlySpending: 300,
}

describe('simulate (기능명세 v0 수용 기준)', () => {
  it('사례 1: 기본값이면 77세에 고갈', () => {
    const result = simulate(base, assumptions)
    expect(result.depletionAge).toBe(77)
    expect(result.rows.find((r) => r.age === 77)!.balance).toBeCloseTo(-659, 0)
  })

  it('사례 2: 금융자산 10,000이면 65세에 고갈', () => {
    expect(simulate({ ...base, financialAssets: 10000 }, assumptions).depletionAge).toBe(65)
  })

  it('사례 3: 생활비 200이면 100세까지 고갈 없음', () => {
    const result = simulate({ ...base, monthlySpending: 200 }, assumptions)
    expect(result.depletionAge).toBeNull()
    expect(result.rows.at(-1)!.age).toBe(99)
    expect(result.rows.at(-1)!.balance).toBeCloseTo(26833, 0)
  })
})
