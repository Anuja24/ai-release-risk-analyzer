import { useEffect, useRef, useState } from "react";
import apiClient from "./api/client";
import RiskAnalysisReport from "./components/RiskAnalysisReport";
import SummaryCards from "./components/SummaryCards";
import ReleaseList from "./components/ReleaseList";
import "./App.css";

function App() {
  const [releases, setReleases] = useState([]);
  const totalReleases = releases.length;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedRelease, setSelectedRelease] = useState(null);
  const [changeSource, setChangeSource] = useState("manual");
  const [changeSuccess, setChangeSuccess] = useState("");
  const [riskAnalysis, setRiskAnalysis] = useState(null);
  const [analyzingReleaseId, setAnalyzingReleaseId] = useState(null);
  const [analysisError, setAnalysisError] = useState("");
  const changeSectionRef = useRef(null);
  const riskReportRef = useRef(null);
  const pendingReleases = releases.filter(
    (release) => release.status === "pending",
  ).length;
  const highRiskReleases = releases.filter(
    (release) => release.risk_analysis?.risk_level === "high",
  ).length;

  const [formData, setFormData] = useState({
    version: "",
    environment: "staging",
    description: "",
  });

  const [changeData, setChangeData] = useState({
    file_name: "",
    change_type: "modified",
    description: "",
  });
  const [releaseChanges, setReleaseChanges] = useState([]);
  const [savingChange, setSavingChange] = useState(false);
  const handleManageChanges = (release) => {
    setSelectedRelease(release);
    setChangeSource("manual");
    setChangeSuccess("");
    setReleaseChanges([]);
    fetchReleaseChanges(release.id);
  };

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

  useEffect(() => {
    if (selectedRelease) {
      changeSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedRelease]);

  useEffect(() => {
    if (riskAnalysis) {
      riskReportRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [riskAnalysis]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setError("");
    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    setChangeSuccess("");
    setChangeData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSaveChange = async (event) => {
    event.preventDefault();

    if (!selectedRelease) {
      return;
    }

    try {
      setSavingChange(true);
      const response = await apiClient.post(
        `/releases/${selectedRelease.id}/changes`,
        {
          change: {
            file_name: changeData.file_name,
            change_type: changeData.change_type,
            description: changeData.description,
          },
        },
      );
      setReleaseChanges((previousChanges) => [
        ...previousChanges,
        response.data,
      ]);
      setReleases((previousReleases) =>
        previousReleases.map((release) =>
          release.id === selectedRelease.id
            ? { ...release, status: "pending" }
            : release,
        ),
      );

      setSelectedRelease((previousRelease) =>
        previousRelease
          ? { ...previousRelease, status: "pending" }
          : previousRelease,
      );
      setChangeData({
        file_name: "",
        change_type: "modified",
        description: "",
      });
      setRiskAnalysis(null);
      setAnalysisError("");
      setChangeSuccess("Release change saved successfully!");
    } catch (error) {
      alert(
        error.response?.data?.errors?.join(", ") ||
          "Failed to save release change. Please try again.",
      );
    } finally {
      setSavingChange(false);
    }
  };

  const fetchReleaseChanges = async (releaseId) => {
    try {
      const response = await apiClient.get(`/releases/${releaseId}/changes`);

      setReleaseChanges(response.data);
    } catch (error) {
      console.error("Unable to load release changes:", error);
    }
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
      setSelectedRelease(response.data);
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

  const fetchRiskAnalysis = async (releaseId) => {
    setAnalysisError("");
    setRiskAnalysis(null);

    try {
      const response = await apiClient.get(
        `/releases/${releaseId}/risk_analysis`,
      );

      setRiskAnalysis(response.data);
    } catch (error) {
      setAnalysisError(
        error.response?.data?.error || "Unable to load risk analysis.",
      );
    }
  };

  const generateRiskAnalysis = async (releaseId) => {
    setAnalyzingReleaseId(releaseId);
    setAnalysisError("");
    setRiskAnalysis(null);

    try {
      const response = await apiClient.post(
        `/releases/${releaseId}/risk_analysis`,
      );

      setRiskAnalysis(response.data.risk_analysis ?? response.data);
      setSelectedRelease(null);
      setReleaseChanges([]);
      setChangeSuccess("");

      // Refresh releases from Rails after analysis completes
      const releasesResponse = await apiClient.get("/releases");
      setReleases(releasesResponse.data);
    } catch (error) {
      setAnalysisError(
        error.response?.data?.error || "Unable to generate risk analysis.",
      );
    } finally {
      setAnalyzingReleaseId(null);
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
        {selectedRelease && (
          <section className="releases-section" ref={changeSectionRef}>
            <h2>Release Changes</h2>
            <p>Add changes for Release {selectedRelease.version}.</p>

            <div className="form-actions">
              <button
                type="button"
                className="primary-button"
                onClick={() => setChangeSource("manual")}
              >
                Manual Entry
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={() => setChangeSource("github")}
              >
                GitHub Repository (Coming Soon)
              </button>
            </div>
            {changeSuccess && (
              <p className="success-message" role="status">
                {changeSuccess}
              </p>
            )}
            {changeSource === "manual" && (
              <form className="release-form" onSubmit={handleSaveChange}>
                <label>
                  File Name
                  <input
                    type="text"
                    name="file_name"
                    value={changeData.file_name}
                    onChange={handleChangeInput}
                    placeholder="e.g. app/models/order.rb"
                    required
                  />
                </label>

                <label>
                  Change Type
                  <select
                    name="change_type"
                    value={changeData.change_type}
                    onChange={handleChangeInput}
                  >
                    <option value="added">Added</option>
                    <option value="modified">Modified</option>
                    <option value="deleted">Deleted</option>
                  </select>
                </label>

                <label>
                  Change Description
                  <textarea
                    name="description"
                    value={changeData.description}
                    onChange={handleChangeInput}
                    placeholder="Describe what changed and why"
                    rows={4}
                  />
                </label>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={savingChange}
                >
                  {savingChange ? "Saving..." : "Save Change"}
                </button>
              </form>
            )}

            {releaseChanges.length > 0 && (
              <div>
                <h3>Added Changes</h3>
                {releaseChanges.map((change, index) => (
                  <div className="release-row" key={change.id || index}>
                    <div>
                      <h4>{change.file_name}</h4>
                      <p>{change.description || "No description provided"}</p>
                      <small>Type: {change.change_type}</small>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {changeSource === "github" && (
              <p>GitHub integration is planned for a future step.</p>
            )}
          </section>
        )}

        {analyzingReleaseId !== null && <p>Analyzing release...</p>}

        {analysisError && (
          <p className="form-error" role="alert">
            {analysisError}
          </p>
        )}
        <div ref={riskReportRef}>
          <RiskAnalysisReport riskAnalysis={riskAnalysis} />
        </div>
        <SummaryCards
          totalReleases={totalReleases}
          pendingReleases={pendingReleases}
          highRiskReleases={highRiskReleases}
        />
        <ReleaseList
          releases={releases}
          loading={loading}
          error={error}
          analyzingReleaseId={analyzingReleaseId}
          onManageChanges={handleManageChanges}
          onViewRiskAnalysis={fetchRiskAnalysis}
          onGenerateRiskAnalysis={generateRiskAnalysis}
        />
      </main>
    </div>
  );
}

export default App;
