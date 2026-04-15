import { useCallback, useState } from 'react';

export function useDialog(initial = false) {
  const [open, setOpen] = useState<boolean>(initial);
  const openDialog = useCallback(() => setOpen(true), []);
  const closeDialog = useCallback(() => setOpen(false), []);
  return { open, setOpen, openDialog, closeDialog } as const;
}
