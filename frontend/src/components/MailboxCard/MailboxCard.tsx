import { useState } from 'react';
import { useExpirationTimer } from '../../hooks/useExpirationTimer';
import { useMailbox } from '../../hooks/useMailbox';
import styles from './MailboxCard.module.css';

export function MailboxCard() {
  const { mailbox, createMailbox, loading } = useMailbox();
  const { remaining, expired } = useExpirationTimer(mailbox?.expiresAt ?? null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!mailbox) return;
    await navigator.clipboard.writeText(mailbox.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNewEmail = async () => {
    await createMailbox();
  };

  if (!mailbox) return null;

  return (
    <div className={styles.card}>
      <div className={styles.emailRow}>
        <span className={styles.email}>{mailbox.email}</span>
      </div>
      <div className={styles.actions}>
        <button onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button className="primary" onClick={handleNewEmail} disabled={loading}>
          New Email
        </button>
      </div>
      <div className={styles.timer}>
        {expired ? (
          <span className={`${styles.timerValue} ${styles.expired}`}>EXPIRED</span>
        ) : (
          <>
            <span className={styles.timerLabel}>Expires in</span>
            <span className={styles.timerValue}>{remaining}</span>
          </>
        )}
      </div>
    </div>
  );
}
