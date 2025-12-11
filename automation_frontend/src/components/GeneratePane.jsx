import React, { useEffect, useState } from 'react';
import { listJobs, triggerGenerate } from '../api/client';

// PUBLIC_INTERFACE
export default function GeneratePane({ initialJobId, onGenerated }) {
  /**
   * GeneratePane lists jobs, allows selection, and triggers generation for the selected job.
   * - Preselects initialJobId if provided; otherwise uses the last saved job_id from localStorage.
   * - Shows loading state on trigger, and displays success/error messages.
   */
  const [jobs, setJobs] = useState([]);
  const [selected, setSelected] = useState(initialJobId || localStorage.getItem('last_job_id') || '');
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoadingJobs(true);
      setError('');
      try {
        const data = await listJobs();
        const items = Array.isArray(data) ? data : (data.items || []);
        setJobs(items);
        // If no selection yet but there is a last_job_id, prefer that; else try last item
        if (!selected) {
          const last = localStorage.getItem('last_job_id');
          if (last && items.some(j => (j.id || j.job_id) === last)) {
            setSelected(last);
          } else if (items.length > 0) {
            setSelected(items[items.length - 1].id || items[items.length - 1].job_id);
          }
        }
      } catch (e) {
        setError(e.message || 'Failed to load jobs');
      } finally {
        setLoadingJobs(false);
      }
    }
    load();
  }, []); // only once

  const onGenerate = async () => {
    if (!selected) {
      setMessage('');
      setError('Please select a job.');
      return;
    }
    setBusy(true);
    setMessage('');
    setError('');
    try {
      const res = await triggerGenerate(selected);
      const msg = res.detail || res.message || 'Generation triggered successfully.';
      setMessage(msg);
      onGenerated && onGenerated(selected, res);
    } catch (e) {
      setError(e.message || 'Failed to trigger generation.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Generate Test Cases</h2>
      <p className="card-subtitle">Select a job and start the generation step.</p>

      <div className="actions" style={{ marginBottom: 12 }}>
        <label htmlFor="jobSelect" style={{ fontWeight: 600 }}>Job</label>
        <select
          id="jobSelect"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          disabled={loadingJobs || busy || jobs.length === 0}
          aria-label="Select job"
        >
          <option value="" disabled>
            {loadingJobs ? 'Loading jobs...' : (jobs.length === 0 ? 'No jobs available' : 'Select a job')}
          </option>
          {jobs.map((j) => {
            const id = j.id || j.job_id;
            const label = `${id} — ${j.status || 'unknown'}`;
            return (
              <option key={id} value={id}>{label}</option>
            );
          })}
        </select>

        <button className="btn primary" onClick={onGenerate} disabled={!selected || busy}>
          {busy ? 'Generating...' : 'Generate Test Cases'}
        </button>
      </div>

      {message && <div className="badge success">{message}</div>}
      {error && <div className="badge error" role="alert">{error}</div>}
      {!selected && <div className="hint">Tip: The last uploaded job (if any) will be preselected.</div>}
    </div>
  );
}
