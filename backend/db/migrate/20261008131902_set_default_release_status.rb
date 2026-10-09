class SetDefaultReleaseStatus < ActiveRecord::Migration[7.2]
  def change
    change_column_default :releases, :status, from: nil, to: "pending"
  end
end
