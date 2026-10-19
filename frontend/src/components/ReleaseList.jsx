function ReleaseList({
  releases,
  loading,
  error,
  analyzingReleaseId,
  onManageChanges,
  onViewRiskAnalysis,
  onGenerateRiskAnalysis,
}) {
  return (
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

            <button
              type="button"
              className="secondary-button"
              onClick={() => onManageChanges(release)}
            >
              Manage Changes
            </button>

            <button
              type="button"
              className="secondary-button"
              disabled={analyzingReleaseId !== null}
              onClick={() => onViewRiskAnalysis(release.id)}
            >
              View Risk Analysis
            </button>

            <button
              type="button"
              className="primary-button"
              disabled={analyzingReleaseId !== null}
              onClick={() => onGenerateRiskAnalysis(release.id)}
            >
              {analyzingReleaseId === release.id
                ? "Analyzing..."
                : "Generate Risk Analysis"}
            </button>
          </div>
        ))}
    </section>
  );
}

export default ReleaseList;
