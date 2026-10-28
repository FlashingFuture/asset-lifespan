import styles from './Header.module.css'

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <h1 className={styles.title}>자산수명 시뮬레이터</h1>
        <span className={styles.badge}>v0 프로토타입</span>
      </div>
    </header>
  )
}
