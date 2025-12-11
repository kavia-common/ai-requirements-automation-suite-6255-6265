import React, { useState } from 'react';
import { triggerExecute, triggerGenerate } from '../api/client';

// PUBLIC_INTERFACE
export default function ExecutionControls({ jobId }) {
  /** ExecutionControls triggers generation and execution for a job. */
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const run = async (type) => {
    if (!jobId) {
      setMessage('Select a job first.');
      return;
    }
    setBusy(true);
    setMessage('');
    try {
      const res = type === 'generate' ? await triggerGenerate(jobId) : await triggerExecute(jobId);
      const msg = res.detail || res.message || `${type} triggered`;
      setMessage(msg);
    } catch (e) {
      setMessage(e.message || `${type} failed`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Execution</h2>
      <div className="actions">
        <button className="btn success" disabled={!jobId || busy} onClick={() => run('generate')}>
          {busy ? 'Working...' : 'Generate'}
        </button>
        <button className="btn secondary" disabled={!jobId || busy} onClick={() => run('execute')}>
          {busy ? 'Working...' : 'Execute'}
        </button>
      </div>
      {!jobId && <div className="hint">Select a job to enable actions.</div>}
      {message && <div className="hint">{message}</div>}
    </div>
  );
}
