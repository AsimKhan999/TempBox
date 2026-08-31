import { useMailbox } from '../../hooks/useMailbox';
import type { Message } from '../../types';
import styles from './EmailItem.module.css';

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

interface EmailItemProps {
  message: Message;
}

export function EmailItem({ message }: EmailItemProps) {
  const { selectMessage } = useMailbox();

  return (
    <button
      className={styles.item}
      onClick={() => selectMessage(message)}
      type="button"
    >
      <span className={styles.sender}>{message.senderName || message.sender}</span>
      <span className={styles.subject}>{message.subject || '(No subject)'}</span>
      <span className={styles.time}>{formatTime(message.receivedAt)}</span>
    </button>
  );
}
