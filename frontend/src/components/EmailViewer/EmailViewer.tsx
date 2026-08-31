import { useMailbox } from '../../hooks/useMailbox';
import styles from './EmailViewer.module.css';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString();
}

export function EmailViewer() {
  const { selectedMessage, selectMessage } = useMailbox();

  if (!selectedMessage) return null;

  return (
    <div className={styles.viewer}>
      <div className={styles.toolbar}>
        <button onClick={() => selectMessage(null)}>Back to inbox</button>
      </div>
      <div className={styles.meta}>
        <div className={styles.row}>
          <span className={styles.label}>From</span>
          <span className={styles.value}>
            {selectedMessage.senderName
              ? `${selectedMessage.senderName} <${selectedMessage.sender}>`
              : selectedMessage.sender}
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>To</span>
          <span className={styles.value}>{selectedMessage.recipient}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Date</span>
          <span className={styles.value}>{formatDate(selectedMessage.receivedAt)}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Subject</span>
          <span className={styles.value}>{selectedMessage.subject || '(No subject)'}</span>
        </div>
      </div>
      <div className={styles.body}>
        {selectedMessage.htmlBody ? (
          <div dangerouslySetInnerHTML={{ __html: selectedMessage.htmlBody }} />
        ) : (
          <pre>{selectedMessage.textBody}</pre>
        )}
      </div>
    </div>
  );
}
