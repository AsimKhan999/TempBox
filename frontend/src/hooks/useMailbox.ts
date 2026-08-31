import { useCallback } from 'react';
import { useMailboxState, useMailboxDispatch } from '../context/MailboxContext';
import { api } from '../services/api';
import { storage } from '../utils/storage';
import type { Message } from '../types';

export function useMailbox() {
  const state = useMailboxState();
  const dispatch = useMailboxDispatch();

  const createMailbox = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    try {
      const mailbox = await api.createMailbox();
      dispatch({ type: 'SET_MAILBOX', payload: mailbox });
      storage.setMailboxId(mailbox.id);
      return mailbox;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create mailbox';
      dispatch({ type: 'SET_ERROR', payload: message });
      throw err;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch]);

  const loadMailbox = useCallback(async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    try {
      const mailbox = await api.getMailbox(id);
      dispatch({ type: 'SET_MAILBOX', payload: mailbox });
      storage.setMailboxId(mailbox.id);
      return mailbox;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load mailbox';
      dispatch({ type: 'SET_ERROR', payload: message });
      storage.removeMailboxId();
      throw err;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch]);

  const deleteMailbox = useCallback(async () => {
    if (!state.mailbox) return;
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await api.deleteMailbox(state.mailbox.id);
      dispatch({ type: 'RESET' });
      storage.removeMailboxId();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete mailbox';
      dispatch({ type: 'SET_ERROR', payload: message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.mailbox, dispatch]);

  const loadMessages = useCallback(async () => {
    if (!state.mailbox) return;
    try {
      const messages = await api.getMessages(state.mailbox.id);
      dispatch({ type: 'SET_MESSAGES', payload: messages });
    } catch {
      // Silent fail for message loading
    }
  }, [state.mailbox, dispatch]);

  const selectMessage = useCallback(
    (message: Message | null) => {
      dispatch({ type: 'SET_SELECTED_MESSAGE', payload: message });
    },
    [dispatch]
  );

  return {
    ...state,
    createMailbox,
    loadMailbox,
    deleteMailbox,
    loadMessages,
    selectMessage,
  };
}
