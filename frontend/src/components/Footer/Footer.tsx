import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        &copy; All rights reserved 2026 Developed by Asim Khan
      </div>
    </footer>
  );
}
