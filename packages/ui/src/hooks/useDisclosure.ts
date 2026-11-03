import { useCallback, useState } from 'react';

export function useDisclosure<T = undefined>(initialOpen = false) {
  const [state, setState] = useState<{ open: boolean; data?: T }>({ open: initialOpen });
  const onOpen = useCallback((data?: T) => setState({ open: true, data }), []);
  const onClose = useCallback(() => setState((s) => ({ ...s, open: false })), []);
  const toggle = useCallback(() => setState((s) => ({ ...s, open: !s.open })), []);
  return { open: state.open, data: state.data, onOpen, onClose, toggle };
}
