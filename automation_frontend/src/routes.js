import React from 'react';

// PUBLIC_INTERFACE
export const ROUTES = [
  { path: 'upload', label: 'Upload' },
  { path: 'generate', label: 'Generate' },
  { path: 'jobs', label: 'Jobs' },
  { path: 'artifacts', label: 'Artifacts' },
  { path: 'execute', label: 'Execute' },
  { path: 'reports', label: 'Reports' },
];

// PUBLIC_INTERFACE
export function getRouteLabel(path) {
  /** Returns the display label for a given route path. */
  const r = ROUTES.find(r => r.path === path);
  return r ? r.label : '';
}
