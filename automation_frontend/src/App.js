import React, { useMemo, useState } from 'react';
import './App.css';
import './index.css';

import UploadPane from './components/UploadPane';
import JobsList from './components/JobsList';
import ArtifactsViewer from './components/ArtifactsViewer';
import ExecutionControls from './components/ExecutionControls';
import AllureEmbed from './components/AllureEmbed';
import { ROUTES } from './routes';

// PUBLIC_INTERFACE
function App() {
  /** App renders a simple dashboard with left nav, header, and main content. */
  const [active, setActive] = useState('upload');
  const [selectedJobId, setSelectedJobId] = useState('');
  const [theme, setTheme] = useState('light');

  const onUploaded = (jobId) => {
    setSelectedJobId(jobId);
    setActive('jobs');
  };

  const headerTitle = useMemo(() => {
    const r = ROUTES.find(r => r.path === active);
    return r ? r.label : 'Dashboard';
  }, [active]);

  return (
    <div className="app-shell" data-theme={theme}>
      <header className="header">
        <div className="brand" role="img" aria-label="Logo">
          <div className="logo" />
          <div>Automation Suite</div>
        </div>
        <div className="right">
          <span style={{ opacity: .85 }}>Job: {selectedJobId || '-'}</span>
          <button
            className="theme-toggle"
            onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </header>

      <aside className="sidebar" aria-label="Navigation">
        <nav className="nav">
          {ROUTES.map((r) => (
            <button
              key={r.path}
              className={active === r.path ? 'active' : ''}
              onClick={() => setActive(r.path)}
            >
              {r.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="content">
        {active === 'upload' && (
          <div className="grid">
            <div className="span-8">
              <UploadPane onUploaded={onUploaded} />
            </div>
            <div className="span-4">
              <div className="card">
                <h2 className="card-title">How it works</h2>
                <p className="card-subtitle">
                  Upload your SRS Excel/CSV to start the pipeline. A job will be created and processed.
                </p>
                <ol>
                  <li>Upload SRS file</li>
                  <li>Generation: requirements, tests, scripts</li>
                  <li>Execution: run Selenium tests</li>
                  <li>Review artifacts and Allure report</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {active === 'jobs' && (
          <div className="grid">
            <div className="span-12">
              <div className="card">
                <h2 className="card-title">{headerTitle}</h2>
                <p className="card-subtitle">Polling every few seconds for updates.</p>
                <JobsList onSelect={(id) => setSelectedJobId(id)} />
              </div>
            </div>
          </div>
        )}

        {active === 'artifacts' && (
          <div className="grid">
            <div className="span-12">
              <ArtifactsViewer jobId={selectedJobId} />
            </div>
          </div>
        )}

        {active === 'execute' && (
          <div className="grid">
            <div className="span-12">
              <ExecutionControls jobId={selectedJobId} />
            </div>
          </div>
        )}

        {active === 'reports' && (
          <div className="grid">
            <div className="span-12">
              <AllureEmbed jobId={selectedJobId} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
