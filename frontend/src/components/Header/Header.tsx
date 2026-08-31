import { Link } from 'react-router-dom';
import { useMailboxState } from '../../context/MailboxContext';
import styles from './Header.module.css';

export function Header() {
  const { connected } = useMailboxState();

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.title}>
          <img src="/Logo.png" alt="TempBox" className={styles.logo} />
        </Link>
        <div className={styles.status}>
          <img src={connected ? '/greendot.png' : '/reddot.png'} alt="" className={styles.dot} />
          {connected ? 'Connected' : 'Offline'}
        </div>
      </div>
    </header>
  );
}
