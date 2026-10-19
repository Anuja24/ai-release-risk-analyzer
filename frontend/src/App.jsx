import { useEffect, useRef, useState } from "react";
import apiClient from "./api/client";
import RiskAnalysisReport from "./components/RiskAnalysisReport";
import SummaryCards from "./components/SummaryCards";
import ReleaseList from "./components/ReleaseList";
import ReleaseChanges from "./components/ReleaseChanges";
import CreateReleaseForm from "./components/CreateReleaseForm";
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
        </div>
        {successMessage && (
          <p className="success-message" role="status">
            {successMessage}
          </p>
        )}
        <CreateReleaseForm
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          submitError={submitError}
          successMessage={successMessage}
          showForm={showForm}
          setShowForm={setShowForm}
        />
        <ReleaseChanges
          sectionRef={changeSectionRef}
          selectedRelease={selectedRelease}
          changeSource={changeSource}
          setChangeSource={setChangeSource}
          changeSuccess={changeSuccess}
          releaseChanges={releaseChanges}
          changeData={changeData}
          onChangeInput={handleChangeInput}
          onSaveChange={handleSaveChange}
          savingChange={savingChange}
        />
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
