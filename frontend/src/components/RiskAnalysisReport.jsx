function RiskAnalysisReport({ riskAnalysis }) {
  if (!riskAnalysis) {
    return null;
  }

  return (
    <section className="risk-report">
      <div className="risk-report-header">
        <div>
          <h2>Risk Analysis Report</h2>
          <p>AI-powered release risk assessment</p>
        </div>

        <span
          className={`risk-badge risk-${riskAnalysis.risk_level?.toLowerCase()}`}
        >
          {riskAnalysis.risk_level}
        </span>
      </div>

      <div className="risk-score-card">
        <span>Risk Score</span>
        <div className="risk-score">
          {riskAnalysis.risk_score}
          <span>/100</span>
        </div>
        <p>Overall release risk assessment</p>
      </div>

      <div className="risk-report-section">
        <h3>Summary</h3>
        <p>{riskAnalysis.summary}</p>
      </div>

      <div className="risk-report-section">
        <h3>Identified Risks</h3>
        {riskAnalysis.risks?.length ? (
          <ul>
            {riskAnalysis.risks.map((risk, index) => (
              <li key={index}>{risk}</li>
            ))}
          </ul>
        ) : (
          <p>No specific risks identified.</p>
        )}
      </div>

      <div className="risk-report-section">
        <h3>Recommendations</h3>
        {riskAnalysis.recommendations?.length ? (
          <ul>
            {riskAnalysis.recommendations.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p>No recommendations available.</p>
        )}
      </div>

      <div className="risk-report-section">
        <h3>Testing Recommendations</h3>
        {riskAnalysis.testing_recommendations?.length ? (
          <ul>
            {riskAnalysis.testing_recommendations.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p>No testing recommendations available.</p>
        )}
      </div>
    </section>
  );
}

export default RiskAnalysisReport;
