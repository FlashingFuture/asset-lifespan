import { describe, expect, it } from 'vitest'
import { formatKorean, formatManwon } from './format'

describe('format', () => {
  it('쉼표와 음수 부호', () => {
    expect(formatManwon(30000)).toBe('30,000')
    expect(formatManwon(-659.4)).toBe('−659')
  })

  it('한글 단위', () => {
    expect(formatKorean(32000)).toBe('3억 2,000만 원')
    expect(formatKorean(30000)).toBe('3억 원')
    expect(formatKorean(659)).toBe('659만 원')
    expect(formatKorean(0)).toBe('0만 원')
    expect(formatKorean(-12345)).toBe('−1억 2,345만 원')
  })
})
