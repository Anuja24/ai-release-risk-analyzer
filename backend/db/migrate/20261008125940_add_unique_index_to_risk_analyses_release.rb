class AddUniqueIndexToRiskAnalysesRelease < ActiveRecord::Migration[7.2]
  def change
    remove_index :risk_analyses, :release_id
    add_index :risk_analyses, :release_id, unique: true
  end
end
