import { useEffect, useState } from "react";
import apiClient from "./api/client";
import "./App.css";

function App() {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const response = await apiClient.get("/releases");
        setReleases(response.data);
      } catch (error) {
        setError("Unable to load releases. Please check the Rails API.");
      } finally {
        setLoading(false);
      }
    };

    fetchReleases();
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>ReleaseGuard AI</h1>
        <p>AI-Powered Release Risk Analyzer</p>
      </header>

      <main className="dashboard">
        <div className="dashboard-heading">
          <div>
            <h2>Release Dashboard</h2>
            <p>Monitor releases and identify potential risks.</p>
          </div>

          <button className="primary-button" onClick={() => setShowForm(true)}>
            + New Release
          </button>
        </div>
        
        <section className="summary-cards">
          <div className="card">
            <p>Total Releases</p>
            <h3>3</h3>
          </div>

          <div className="card">
            <p>Pending Analysis</p>
            <h3>3</h3>
          </div>

          <div className="card">
            <p>High Risk Releases</p>
            <h3>0</h3>
          </div>
        </section>

        <section className="releases-section">
          <h2>Recent Releases</h2>

          {loading && <p>Loading releases...</p>}

          {error && <p role="alert">{error}</p>}

          {!loading && !error && releases.length === 0 && (
            <p>No releases found. Create your first release!</p>
          )}

          {!loading &&
            !error &&
            releases.map((release) => (
              <div className="release-row" key={release.id}>
                <div>
                  <h3>Release {release.version}</h3>
                  <p>{release.description || "No description provided"}</p>
                  <small>Environment: {release.environment}</small>
                </div>

                <span className={`status ${release.status}`}>
                  {release.status}
                </span>
              </div>
            ))}
        </section>
      </main>
    </div>
  );
}

export default App;
