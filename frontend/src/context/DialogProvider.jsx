import { useCallback, useMemo, useRef, useState } from 'react';
import { DialogContext } from './DialogContext';
import ConfirmModal from '../components/ConfirmModal';

export default function DialogProvider({ children }) {
  const [queue, setQueue] = useState([]);
  const nextId = useRef(0);
  const enqueue = useCallback((options) => new Promise((resolve) => {
    const item = { ...options, id: nextId.current++, resolve };
    setQueue((current) => [...current, item]);
  }), []);
  const showAlert = useCallback((message, options = {}) => enqueue({
    title: '알림', description: message, ...options, showCancel: false,
  }), [enqueue]);
  const showConfirm = useCallback((message, options = {}) => enqueue({
    title: message, ...options, showCancel: true,
  }), [enqueue]);
  const context = useMemo(() => ({ showAlert, showConfirm }), [showAlert, showConfirm]);
  const current = queue[0];
  function settle(result) {
    if (!current) return;
    current.resolve(result);
    setQueue((items) => items.filter((item) => item.id !== current.id));
  }
  return <DialogContext.Provider value={context}>
    {children}
    {current && <ConfirmModal key={current.id} open title={current.title} description={current.description} confirmText={current.confirmText} cancelText={current.cancelText} danger={current.danger} showCancel={current.showCancel} onConfirm={() => settle(true)} onCancel={() => settle(false)} />}
  </DialogContext.Provider>;
}
