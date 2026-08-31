import styles from './EmptyInbox.module.css';

export function EmptyInbox() {
  return (
    <div className={styles.empty}>
      <img src="/mailbox.svg" alt="" className={styles.icon} />
      <h3 className={styles.title}>No messages yet</h3>
      <p className={styles.text}>
        Share your temporary email address to receive messages. They will
        appear here automatically.
      </p>
    </div>
  );
}
