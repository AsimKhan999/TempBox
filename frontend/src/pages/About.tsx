import styles from './About.module.css';

export function About() {
  return (
    <main className={styles.about}>
      <div className="container">
        <div className={styles.content}>
          <h1 className={styles.title}>About TempBox</h1>

          <div className={styles.section}>
            <h2 className={styles.heading}>What is temporary email?</h2>
            <p className={styles.text}>
              Temporary email services provide disposable email addresses
              that expire after a short period. They protect your real
              email address from spam and unwanted communications.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.heading}>How it works</h2>
            <ul className={styles.list}>
              <li>A temporary email address is generated automatically</li>
              <li>Share this address when you need to receive an email</li>
              <li>Messages appear in your inbox in real-time</li>
              <li>The address expires after 20 minutes</li>
              <li>All data is automatically cleaned up after expiration</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.heading}>Limitations</h2>
            <ul className={styles.list}>
              <li>Mailboxes are temporary and will expire</li>
              <li>Do not use for sensitive or important accounts</li>
              <li>Messages are not stored permanently</li>
              <li>Attachments may be limited or disabled</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.heading}>Privacy</h2>
            <p className={styles.text}>
              We minimize data collection and automatically delete all
              information when mailboxes expire. No accounts or personal
              information are required to use this service.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
