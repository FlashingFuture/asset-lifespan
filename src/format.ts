// 금액(만 원) 표기: 쉼표, 한글 단위 보조 표기, 음수는 "−"

const comma = new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 0 })

export function formatManwon(value: number): string {
  const sign = value < 0 ? '−' : ''
  return `${sign}${comma.format(Math.abs(Math.round(value)))}`
}

// 32000 → "3억 2,000만 원"
export function formatKorean(value: number): string {
  const sign = value < 0 ? '−' : ''
  const abs = Math.abs(Math.round(value))
  const eok = Math.floor(abs / 10000)
  const man = abs % 10000
  const parts = []
  if (eok > 0) parts.push(`${comma.format(eok)}억`)
  if (man > 0 || eok === 0) parts.push(`${comma.format(man)}만`)
  return `${sign}${parts.join(' ')} 원`
}
