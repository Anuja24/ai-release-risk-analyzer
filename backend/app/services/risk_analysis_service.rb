
require "json"

class RiskAnalysisService
  def self.analyze(release)
    changes = release.release_changes.map do |change|
      {
        file_name: change.file_name,
        change_type: change.change_type,
        description: change.description
      }
    end

    prompt = <<~PROMPT
      You are a senior software release risk analyst.

      Analyze this software release using its description and changes.

      Release version: #{release.version}
      Environment: #{release.environment}
      Release description: #{release.description}

      Changes:
      #{JSON.pretty_generate(changes)}

      Return ONLY valid JSON with these keys:
      {
        "risk_score": 0,
        "risk_level": "low",
        "summary": "Short summary",
        "risks": ["Risk description"],
        "recommendations": ["Recommendation"],
        "testing_recommendations": ["Test suggestion"]
      }

      risk_score must be an integer from 0 to 100.
      risk_level must be low, medium, or high.
      Base the analysis on the supplied information. Do not invent
      implementation details that were not provided.
    PROMPT

    response = OllamaService.generate(prompt)
    JSON.parse(response)
  end
  
  def self.analyze_and_save(release)
  result = analyze(release)

  risk_analysis = RiskAnalysis.find_or_initialize_by(
    release_id: release.id
  )

  risk_analysis.update!(
    risk_score: result.fetch("risk_score"),
    risk_level: result.fetch("risk_level"),
    summary: result.fetch("summary"),
    risks: result.fetch("risks"),
    recommendations: result.fetch("recommendations"),
    testing_recommendations: result.fetch("testing_recommendations")
  )

  risk_analysis
end
end
