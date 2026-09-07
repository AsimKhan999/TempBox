import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMailbox } from '../../hooks/useMailbox';
import { useAuth } from '../../context/AuthContext';
import { saveMailbox } from '../../services/auth.service';
import styles from './MailboxCard.module.css';

export function MailboxCard() {
  const { mailbox, createMailbox, loading } = useMailbox();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setCopied(false);
    setSaved(false);
  }, [mailbox?.id]);

  const handleCopy = async () => {
    if (!mailbox) return;
    await navigator.clipboard.writeText(mailbox.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNewEmail = async () => {
    await createMailbox();
  };

  const handleSave = async () => {
    if (!user || !token || !mailbox) {
      navigate('/login');
      return;
    }
    if (saved) return;
    try {
      await saveMailbox(token, mailbox.id);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // ignore
    }
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
        {user && (
          <button onClick={handleSave} disabled={saved}>
            {saved ? 'Saved!' : 'Save'}
          </button>
        )}
        <button className="primary" onClick={handleNewEmail} disabled={loading}>
          New Email
        </button>
      </div>
    </div>
  );
}
