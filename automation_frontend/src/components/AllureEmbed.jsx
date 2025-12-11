import React from 'react';
import { getAllureReportUrl } from '../api/client';

// PUBLIC_INTERFACE
export default function AllureEmbed({ jobId }) {
  /** AllureEmbed displays an iframe of the Allure report for a job. */
  if (!jobId) {
    return (
      <div className="card">
        <h2 className="card-title">Allure Report</h2>
        <div className="hint">Select a job to view the Allure report.</div>
      </div>
    );
  }
  const src = getAllureReportUrl(jobId);
  return (
    <div className="card">
      <h2 className="card-title">Allure Report</h2>
      <div className="iframe-wrap">
        <iframe title="Allure Report" src={src} frameBorder="0" />
      </div>
    </div>
  );
}
