import type { V0Input } from './engine/simulate'

export type RawInput = Record<keyof V0Input, string>
export type Errors = Partial<Record<keyof V0Input, string>>

// 기능명세 v0 입력 항목의 범위
export function validate(raw: RawInput): { input: V0Input | null; errors: Errors } {
  const errors: Errors = {}
  const num = {} as V0Input

  for (const key of Object.keys(raw) as (keyof V0Input)[]) {
    const text = raw[key].trim()
    const value = Number(text)
    if (text === '' || !Number.isFinite(value)) errors[key] = '숫자를 입력해 주세요'
    num[key] = value
  }

  const check = (key: keyof V0Input, ok: boolean, message: string) => {
    if (!errors[key] && !ok) errors[key] = message
  }
  check('currentAge', num.currentAge >= 20 && num.currentAge <= 80, '20~80세 사이로 입력해 주세요')
  check('retireAge', num.retireAge >= num.currentAge && num.retireAge <= 75, '현재 나이~75세 사이로 입력해 주세요')
  check('monthlyIncome', num.monthlyIncome >= 0, '0 이상으로 입력해 주세요')
  check('monthlyPension', num.monthlyPension >= 0, '0 이상으로 입력해 주세요')
  check('pensionStartAge', num.pensionStartAge >= 60 && num.pensionStartAge <= 70, '60~70세 사이로 입력해 주세요')
  check('financialAssets', num.financialAssets >= 0, '0 이상으로 입력해 주세요')
  check('monthlySpending', num.monthlySpending > 0, '0보다 크게 입력해 주세요')

  return { input: Object.keys(errors).length === 0 ? num : null, errors }
}
