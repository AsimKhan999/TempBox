import type { MailboxState, MailboxAction } from '../types';

export const initialState: MailboxState = {
  mailbox: null,
  messages: [],
  selectedMessage: null,
  loading: false,
  error: null,
  connected: false,
};

export function mailboxReducer(
  state: MailboxState,
  action: MailboxAction
): MailboxState {
  switch (action.type) {
    case 'SET_MAILBOX':
      return { ...state, mailbox: action.payload, error: null };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [action.payload, ...state.messages] };
    case 'SET_SELECTED_MESSAGE':
      return { ...state, selectedMessage: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CONNECTED':
      return { ...state, connected: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}
