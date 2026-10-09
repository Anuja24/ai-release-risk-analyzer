class ReleaseChange < ApplicationRecord
  belongs_to :release
  validates :file_name, presence: true
  validates :change_type, presence: true
end
