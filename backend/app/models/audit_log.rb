class AuditLog < ApplicationRecord
  belongs_to :release
  
  validates :action, presence: true
end
