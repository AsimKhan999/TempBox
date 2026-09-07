import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMailboxState } from '../../context/MailboxContext';
import { useAuth } from '../../context/AuthContext';
import styles from './Header.module.css';

export function Header() {
  const { connected } = useMailboxState();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.title}>
          <img src="/Logo.png" alt="TempBox" className={styles.logo} />
        </Link>
        <div className={styles.right}>
          <nav className={styles.nav}>
            {!user && (
              <>
                <Link to="/login" className={styles.link}>Login</Link>
                <Link to="/signup" className={styles.link}>Sign Up</Link>
              </>
            )}
          </nav>
          {user && (
            <div className={styles.avatarWrapper} ref={ref}>
              <button className={styles.avatar} onClick={() => setOpen(!open)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: -2 }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {open && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownEmail}>{user.email}</div>
                  <Link to="/saved" className={styles.dropdownItem} onClick={() => setOpen(false)}>
                    Saved Emails
                  </Link>
                  <button
                    className={`${styles.dropdownItem} ${styles.dropdownItemLogout}`}
                    onClick={() => { logout(); setOpen(false); }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
          <div className={styles.status}>
            <img src={connected ? '/greendot.png' : '/reddot.png'} alt="" className={styles.dot} />
            {connected ? 'Connected' : 'Offline'}
          </div>
        </div>
      </div>
    </header>
  );
}
