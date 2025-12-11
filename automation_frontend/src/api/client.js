const DEFAULT_BASE = '';

/**
 * PUBLIC_INTERFACE
 * apiFetch is a thin wrapper around fetch that prefixes the base API URL,
 * sets JSON headers when needed, parses JSON, and throws informative errors.
 */
export async function apiFetch(path, { method = 'GET', headers = {}, body, isForm = false, signal } = {}) {
  /** Make a request to the backend API. */
  const base = process.env.REACT_APP_API_BASE || DEFAULT_BASE;
  const url = `${base}${path}`;

  const finalHeaders = new Headers(headers);
  if (!isForm && body && !(body instanceof FormData) && !finalHeaders.has('Content-Type')) {
    finalHeaders.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body ? (isForm || body instanceof FormData ? body : JSON.stringify(body)) : undefined,
    signal,
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  if (!response.ok) {
    let detail = '';
    try {
      if (isJson) {
        const j = await response.json();
        detail = j.detail || j.message || JSON.stringify(j);
      } else {
        detail = await response.text();
      }
    } catch {
      // ignore
    }
    const err = new Error(`API error ${response.status}: ${detail || response.statusText}`);
    err.status = response.status;
    err.detail = detail;
    throw err;
  }

  if (isJson) {
    return response.json();
  }
  return response.text();
}

// PUBLIC_INTERFACE
export async function uploadJob(file) {
  /** POST /api/jobs with a file (xlsx/csv). Returns {job_id}. */
  const form = new FormData();
  form.append('file', file);
  return apiFetch('/api/jobs', { method: 'POST', body: form, isForm: true });
}

// PUBLIC_INTERFACE
export async function listJobs() {
  /** GET /api/jobs - Returns array of jobs with statuses. */
  return apiFetch('/api/jobs');
}

// PUBLIC_INTERFACE
export async function getJobArtifacts(jobId) {
  /** GET /api/jobs/{id}/artifacts - Returns array of artifact objects. */
  return apiFetch(`/api/jobs/${encodeURIComponent(jobId)}/artifacts`);
}

// PUBLIC_INTERFACE
export function getArtifactDownloadUrl(jobId, artifactName) {
  /** Returns a direct URL to download an artifact via GET /api/jobs/{id}/artifacts/{name} */
  const base = process.env.REACT_APP_API_BASE || '';
  return `${base}/api/jobs/${encodeURIComponent(jobId)}/artifacts/${encodeURIComponent(artifactName)}`;
}

// PUBLIC_INTERFACE
export async function triggerGenerate(jobId) {
  /** POST /api/jobs/{id}/generate - triggers generation step */
  return apiFetch(`/api/jobs/${encodeURIComponent(jobId)}/generate`, { method: 'POST' });
}

// PUBLIC_INTERFACE
export async function triggerExecute(jobId) {
  /** POST /api/jobs/{id}/execute - triggers execution step */
  return apiFetch(`/api/jobs/${encodeURIComponent(jobId)}/execute`, { method: 'POST' });
}

// PUBLIC_INTERFACE
export function getAllureReportUrl(jobId) {
  /** Returns a URL to embed the Allure report for a job: /api/jobs/{id}/allure */
  const base = process.env.REACT_APP_API_BASE || '';
  return `${base}/api/jobs/${encodeURIComponent(jobId)}/allure`;
}
