import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getSavedMailboxes, unsaveMailbox } from '../services/auth.service';
import type { SavedMailbox } from '../services/auth.service';
import { LoadingState } from '../components/LoadingState/LoadingState';
import styles from './Saved.module.css';

export function Saved() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [mailboxes, setMailboxes] = useState<SavedMailbox[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadSaved();
  }, [user]);

  const loadSaved = async () => {
    if (!token) return;
    try {
      const data = await getSavedMailboxes(token);
      setMailboxes(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (mailboxId: string) => {
    if (!token) return;
    await unsaveMailbox(token, mailboxId);
    setMailboxes((prev) => prev.filter((m) => m.mailbox_id !== mailboxId));
  };

  if (!user) return null;

  return (
    <main className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Saved Emails</h1>
        {loading ? (
          <LoadingState text="Loading saved emails..." />
        ) : mailboxes.length === 0 ? (
          <div className={styles.empty}>
            No saved emails yet. Create a temp email and click "Save" to keep it.
          </div>
        ) : (
          <div className={styles.list}>
            {mailboxes.map((m) => (
              <div key={m.id} className={styles.item}>
                <div className={styles.info}>
                  <span className={styles.email}>{m.email_address}</span>
                  {m.label && <span className={styles.label}>{m.label}</span>}
                </div>
                <button className={styles.remove} onClick={() => handleRemove(m.mailbox_id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
