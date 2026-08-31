import { useEffect } from 'react';
import { useMailbox } from '../hooks/useMailbox';
import { useSSE } from '../hooks/useSSE';
import { storage } from '../utils/storage';
import { MailboxCard } from '../components/MailboxCard/MailboxCard';
import { Inbox } from '../components/Inbox/Inbox';
import { EmailViewer } from '../components/EmailViewer/EmailViewer';
import { LoadingState } from '../components/LoadingState/LoadingState';
import styles from './Home.module.css';

export function Home() {
  const {
    mailbox,
    selectedMessage,
    loading,
    error,
    createMailbox,
    loadMailbox,
    loadMessages,
  } = useMailbox();

  useSSE(mailbox?.id ?? null);

  useEffect(() => {
    const init = async () => {
      const savedId = storage.getMailboxId();
      if (savedId) {
        try {
          await loadMailbox(savedId);
        } catch {
          await createMailbox();
        }
      } else {
        await createMailbox();
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (mailbox) {
      loadMessages();
    }
  }, [mailbox?.id]);

  if (loading && !mailbox) {
    return (
      <main className={styles.home}>
        <div className="container">
          <LoadingState text="Creating mailbox..." />
        </div>
      </main>
    );
  }

  if (error && !mailbox) {
    return (
      <main className={styles.home}>
        <div className="container">
          <div className={styles.error}>
            {error}
            <br />
            <button
              className={styles.retryButton}
              onClick={() => createMailbox()}
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.home}>
      <div className="container">
        <div className={styles.hero}>
          <p className={styles.heroText}>
            Disposable email. No signup required.
          </p>
        </div>

        {selectedMessage ? <EmailViewer /> : <MailboxCard />}

        {!selectedMessage && <Inbox />}
      </div>
    </main>
  );
}
