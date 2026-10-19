function CreateReleaseForm({
  formData,
  onInputChange,
  onSubmit,
  submitError,
  showForm,
  setShowForm,
}) {
  return (
    <section className="releases-section">
      <div className="section-header">
        <h2>Create Release</h2>
        <button
          type="button"
          className="primary-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "New Release"}
        </button>
      </div>

      {submitError && (
        <p className="error-message" role="alert">
          {submitError}
        </p>
      )}

      {showForm && (
        <form className="release-form" onSubmit={onSubmit}>
          <label>
            Version
            <input
              type="text"
              name="version"
              value={formData.version}
              onChange={onInputChange}
              placeholder="e.g. 1.2.0"
              required
            />
          </label>

          <label>
            Environment
            <select
              name="environment"
              value={formData.environment}
              onChange={onInputChange}
              required
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
              onChange={onInputChange}
              placeholder="Describe this release"
              rows={4}
            />
          </label>

          <button type="submit" className="primary-button">
            Create Release
          </button>
        </form>
      )}
    </section>
  );
}

export default CreateReleaseForm;
