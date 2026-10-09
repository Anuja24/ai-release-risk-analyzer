class User < ApplicationRecord
  has_many :releases
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
end
