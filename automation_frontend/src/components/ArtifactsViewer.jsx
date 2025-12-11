import React, { useEffect, useState } from 'react';
import { getArtifactDownloadUrl, getJobArtifacts } from '../api/client';

// PUBLIC_INTERFACE
export default function ArtifactsViewer({ jobId }) {
  /** ArtifactsViewer lists downloadable artifacts for a selected job. */
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      setError('');
      if (!jobId) {
        setItems([]);
        return;
      }
      try {
        const res = await getJobArtifacts(jobId);
        if (!active) return;
        const list = Array.isArray(res) ? res : (res.items || []);
        setItems(list);
      } catch (e) {
        setError(e.message || 'Failed to load artifacts');
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [jobId]);

  return (
    <div className="card">
      <h2 className="card-title">Artifacts</h2>
      {!jobId && <div className="hint">Select a job to view artifacts.</div>}
      {error && <div className="error">{error}</div>}
      {jobId && (
        <ul className="artifact-list">
          {items.map((it) => {
            const name = it.name || it.filename || it.path || 'artifact';
            const href = getArtifactDownloadUrl(jobId, name);
            const size = humanSize(it.size);
            return (
              <li key={name} className="artifact-item">
                <span className="artifact-name">{name}</span>
                {size && <span className="artifact-size">{size}</span>}
                <a className="btn" href={href} target="_blank" rel="noreferrer">Download</a>
              </li>
            );
          })}
          {items.length === 0 && <li className="muted">No artifacts found.</li>}
        </ul>
      )}
    </div>
  );
}

function humanSize(bytes) {
  if (typeof bytes !== 'number') return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0, val = bytes;
  while (val >= 1024 && i < units.length - 1) {
    val /= 1024;
    i++;
  }
  return `${val.toFixed(1)} ${units[i]}`;
}
