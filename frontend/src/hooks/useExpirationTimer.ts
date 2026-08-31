import { useState, useEffect, useCallback } from 'react';

export function useExpirationTimer(expiresAt: string | null) {
  const [remaining, setRemaining] = useState<string>('--:--');
  const [expired, setExpired] = useState(false);

  const calculateRemaining = useCallback(() => {
    if (!expiresAt) return;

    const now = Date.now();
    const expiry = new Date(expiresAt).getTime();
    const diff = expiry - now;

    if (diff <= 0) {
      setRemaining('00:00');
      setExpired(true);
      return;
    }

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    setRemaining(
      `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    );
    setExpired(false);
  }, [expiresAt]);

  useEffect(() => {
    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);
    return () => clearInterval(interval);
  }, [calculateRemaining]);

  return { remaining, expired };
}
