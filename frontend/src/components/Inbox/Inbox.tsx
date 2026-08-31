import { useMailbox } from '../../hooks/useMailbox';
import { useMailboxDispatch } from '../../context/MailboxContext';
import { EmailItem } from '../EmailItem/EmailItem';
import { EmptyInbox } from '../EmptyInbox/EmptyInbox';
import styles from './Inbox.module.css';

export function Inbox() {
  const { messages, loadMessages } = useMailbox();
  const dispatch = useMailboxDispatch();

  const handleClearAll = () => {
    dispatch({ type: 'SET_MESSAGES', payload: [] });
  };

  return (
    <div className={styles.inbox}>
      <div className={styles.header}>
        <h2 className={styles.title}>Inbox</h2>
        <div className={styles.actions}>
          <span className={styles.count}>
            {messages.length} {messages.length === 1 ? 'message' : 'messages'}
          </span>
          {messages.length > 0 && (
            <>
              <button onClick={loadMessages} className={styles.actionBtn}>Refresh</button>
              <button onClick={handleClearAll} className={styles.actionBtn}>Clear All</button>
            </>
          )}
        </div>
      </div>
      {messages.length === 0 ? (
        <EmptyInbox />
      ) : (
        <div className={styles.list}>
          {messages.map((msg) => (
            <EmailItem key={msg.id} message={msg} />
          ))}
        </div>
      )}
    </div>
  );
}
