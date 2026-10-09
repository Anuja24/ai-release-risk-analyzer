class Release < ApplicationRecord
  belongs_to :user
  has_many :release_changes, dependent: :destroy
  has_many :audit_logs, dependent: :destroy
  has_one :risk_analysis, dependent: :destroy

  validates :version, presence: true
  validates :environment, presence: true
  validates :status, presence: true
end
