import { useEffect, useState } from "react";
import apiClient from "./api/client";
import "./App.css";

function App() {
  const [releases, setReleases] = useState([]);
  const totalReleases = releases.length;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const pendingReleases = releases.filter(
  (release) => release.status === "pending"
).length;

  const [formData, setFormData] = useState({
    version: "",
    environment: "staging",
    description: "",
  });

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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setError("");
    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    try {
      const response = await apiClient.post("/releases", {
        release: {
          user_id: 1,
          version: formData.version,
          environment: formData.environment,
          description: formData.description,
        },
      });

      setReleases((previousReleases) => [response.data, ...previousReleases]);
      setSuccessMessage("Release created successfully!");
      setShowForm(false);
    } catch (error) {
      setSubmitError(
        error.response?.data?.errors?.join(", ") ||
          error.response?.data?.error ||
          "Failed to create release. Please try again.",
      );
    }
  };

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

          <button
            type="button"
            className="primary-button"
            onClick={() => setShowForm(true)}
          >
            + New Release
          </button>
        </div>
        {successMessage && (
          <p className="success-message" role="status">
            {successMessage}
          </p>
        )}

        {showForm && (
          <section className="releases-section new-release-form">
            <h2>Create New Release</h2>
            {submitError && (
              <p className="form-error" role="alert">
                {submitError}
              </p>
            )}

            <form className="release-form" onSubmit={handleSubmit}>
              <label>
                Release Version
                <input
                  type="text"
                  name="version"
                  value={formData.version}
                  onChange={handleInputChange}
                  placeholder="e.g. 3.1.0"
                />
              </label>

              <label>
                Environment
                <select
                  name="environment"
                  value={formData.environment}
                  onChange={handleInputChange}
                >
                  <option value="development">Development</option>
                  <option value="staging">Staging</option>
                  <option value="production">Production</option>
                </select>
              </label>

              <label>
                Description
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the changes in this release"
                  rows={4}
                />
              </label>

              <div className="form-actions">
                <button type="submit" className="primary-button">
                  Create Release
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="summary-cards">
          <div className="card">
            <p>Total Releases</p>
            <h3>{totalReleases}</h3>
          </div>

          <div className="card">
            <p>Pending Analysis</p>
            <h3>{pendingReleases}</h3>
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
