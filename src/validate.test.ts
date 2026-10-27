import { describe, expect, it } from 'vitest'
import { validate, type RawInput } from './validate'

const raw: RawInput = {
  currentAge: '55',
  retireAge: '60',
  monthlyIncome: '400',
  monthlyPension: '120',
  pensionStartAge: '65',
  financialAssets: '30000',
  monthlySpending: '300',
}

describe('validate', () => {
  it('기본값은 유효', () => {
    expect(validate(raw).input).toEqual({
      currentAge: 55,
      retireAge: 60,
      monthlyIncome: 400,
      monthlyPension: 120,
      pensionStartAge: 65,
      financialAssets: 30000,
      monthlySpending: 300,
    })
  })

  it('빈 값과 범위 밖 값은 오류', () => {
    const { input, errors } = validate({ ...raw, financialAssets: '', monthlySpending: '0' })
    expect(input).toBeNull()
    expect(errors.financialAssets).toBeDefined()
    expect(errors.monthlySpending).toBeDefined()
  })

  it('퇴직 나이는 현재 나이 이상', () => {
    expect(validate({ ...raw, retireAge: '50' }).errors.retireAge).toBeDefined()
  })
})
