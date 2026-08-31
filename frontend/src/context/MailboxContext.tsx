import { createContext, useContext, useReducer, type ReactNode } from 'react';
import { mailboxReducer, initialState } from '../reducers/mailboxReducer';
import type { MailboxState, MailboxAction } from '../types';

const MailboxContext = createContext<MailboxState | null>(null);
const MailboxDispatchContext = createContext<React.Dispatch<MailboxAction> | null>(null);

export function MailboxProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(mailboxReducer, initialState);

  return (
    <MailboxContext.Provider value={state}>
      <MailboxDispatchContext.Provider value={dispatch}>
        {children}
      </MailboxDispatchContext.Provider>
    </MailboxContext.Provider>
  );
}

export function useMailboxState(): MailboxState {
  const context = useContext(MailboxContext);
  if (!context) {
    throw new Error('useMailboxState must be used within MailboxProvider');
  }
  return context;
}

export function useMailboxDispatch(): React.Dispatch<MailboxAction> {
  const context = useContext(MailboxDispatchContext);
  if (!context) {
    throw new Error('useMailboxDispatch must be used within MailboxProvider');
  }
  return context;
}
