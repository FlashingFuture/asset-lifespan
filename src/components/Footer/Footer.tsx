import styles from './Footer.module.css'

type Props = {
  realReturn: number
  asOf: string
}

export function Footer({ realReturn, asOf }: Props) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p>
          실질수익률 {realReturn * 100}% 가정({asOf} 기준), 금액은 모두 오늘 돈 가치예요. 프로토타입 계산으로, 투자
          권유나 공식 연금 예상액이 아니에요.
        </p>
        <p>입력하신 내용은 이 브라우저 안에서만 계산하고 어디로도 보내지 않아요.</p>
        <p className={styles.meta}>자산수명 시뮬레이터 v0</p>
      </div>
    </footer>
  )
}
