function SummaryCards({
  totalReleases,
  pendingReleases,
  highRiskReleases,
}) {
  return (
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
        <h3>{highRiskReleases}</h3>
      </div>
    </section>
  );
}

export default SummaryCards;
