import React, { useEffect, useRef, useState } from 'react';
import { listJobs } from '../api/client';

const POLL_MS = 3000;

// PUBLIC_INTERFACE
export default function JobsList({ onSelect }) {
  /** JobsList polls the backend for jobs and renders status. */
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  const timerRef = useRef(null);

  const load = async () => {
    try {
      setError('');
      const data = await listJobs();
      setJobs(Array.isArray(data) ? data : (data.items || []));
    } catch (e) {
      setError(e.message || 'Failed to load jobs');
    }
  };

  useEffect(() => {
    load();
    timerRef.current = setInterval(load, POLL_MS);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="card">
      <h2 className="card-title">Jobs</h2>
      {error && <div className="error">{error}</div>}
      <div className="jobs-table">
        <div className="row header">
          <div>ID</div>
          <div>Status</div>
          <div>Created</div>
          <div>Updated</div>
          <div>Action</div>
        </div>
        {jobs.map((j) => (
          <div className="row" key={j.id || j.job_id}>
            <div>{j.id || j.job_id}</div>
            <div>
              <span className={`badge ${statusClass(j.status)}`}>{j.status || 'unknown'}</span>
            </div>
            <div>{fmt(j.created_at || j.created)}</div>
            <div>{fmt(j.updated_at || j.updated)}</div>
            <div>
              <button className="btn" onClick={() => onSelect && onSelect(j.id || j.job_id)}>
                View
              </button>
            </div>
          </div>
        ))}
        {jobs.length === 0 && (
          <div className="row">
            <div className="muted">No jobs yet. Upload a file to get started.</div>
          </div>
        )}
      </div>
    </div>
  );
}

function fmt(ts) {
  if (!ts) return '-';
  try {
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return ts;
    return d.toLocaleString();
  } catch {
    return ts;
  }
}

function statusClass(st) {
  const s = (st || '').toLowerCase();
  if (['completed', 'success', 'done', 'passed'].includes(s)) return 'success';
  if (['failed', 'error'].includes(s)) return 'error';
  if (['running', 'in_progress', 'generating', 'executing', 'queued'].includes(s)) return 'info';
  return 'secondary';
}
