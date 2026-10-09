class RiskAnalysis < ApplicationRecord
  belongs_to :release

  validates :risk_score, presence: true
  validates :risk_level, presence: true
end
