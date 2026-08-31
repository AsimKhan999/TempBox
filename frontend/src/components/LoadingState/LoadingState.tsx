import styles from './LoadingState.module.css';

export function LoadingState({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className={styles.loading}>
      <div className={styles.spinner} />
      <p className={styles.text}>{text}</p>
    </div>
  );
}
