function ReleaseChanges({
  sectionRef, 
  selectedRelease,
  changeSource,
  setChangeSource,
  changeSuccess,
  releaseChanges,
  changeData,
  onChangeInput,
  onSaveChange,
  savingChange,
}) {
  if (!selectedRelease) {
    return null;
  }

  return (
    <section className="releases-section" ref={sectionRef}>
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
        <form className="release-form" onSubmit={onSaveChange}>
          <label>
            File Name
            <input
              type="text"
              name="file_name"
              value={changeData.file_name}
              onChange={onChangeInput}
              placeholder="e.g. app/models/order.rb"
              required
            />
          </label>

          <label>
            Change Type
            <select
              name="change_type"
              value={changeData.change_type}
              onChange={onChangeInput}
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
              onChange={onChangeInput}
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
  );
}

export default ReleaseChanges;
