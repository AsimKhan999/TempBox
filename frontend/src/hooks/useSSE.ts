import { useEffect, useRef, useCallback } from 'react';
import { useMailboxDispatch } from '../context/MailboxContext';
import { api } from '../services/api';
import type { Message } from '../types';

export function useSSE(mailboxId: string | null) {
  const dispatch = useMailboxDispatch();
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanup = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current as unknown as number);
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    dispatch({ type: 'SET_CONNECTED', payload: false });
  }, [dispatch]);

  const connect = useCallback(() => {
    if (!mailboxId) return;
    cleanup();

    const url = api.getSSEUrl(mailboxId);
    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      dispatch({ type: 'SET_CONNECTED', payload: true });
    };

    eventSource.addEventListener('NEW_EMAIL', (event) => {
      try {
        const message: Message = JSON.parse(event.data);
        dispatch({ type: 'ADD_MESSAGE', payload: message });
      } catch {
        // Ignore parse errors
      }
    });

    eventSource.onerror = () => {
      dispatch({ type: 'SET_CONNECTED', payload: false });
      eventSource.close();
      reconnectTimeoutRef.current = setTimeout(() => connect(), 3000);
    };
  }, [mailboxId, dispatch, cleanup]);

  useEffect(() => {
    connect();
    return cleanup;
  }, [connect, cleanup]);
}
