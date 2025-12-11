import React, { useState } from 'react';
import { uploadJob } from '../api/client';

// PUBLIC_INTERFACE
export default function UploadPane({ onUploaded }) {
  /** UploadPane provides file selection and upload to create a job. */
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const onChange = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    setMessage('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please choose a .xlsx or .csv file.');
      return;
    }
    setBusy(true);
    setMessage('');
    try {
      const res = await uploadJob(file);
      setMessage(`Upload successful. Job ID: ${res.job_id}`);
      onUploaded && onUploaded(res.job_id);
    } catch (err) {
      setMessage(err.message || 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Upload SRS</h2>
      <p className="card-subtitle">Supported types: .xlsx, .csv</p>
      <form onSubmit={onSubmit}>
        <input
          aria-label="SRS File"
          type="file"
          accept=".xlsx,.csv"
          onChange={onChange}
          disabled={busy}
        />
        <div className="actions">
          <button className="btn primary" type="submit" disabled={busy || !file}>
            {busy ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </form>
      {message && <div className="hint">{message}</div>}
    </div>
  );
}
