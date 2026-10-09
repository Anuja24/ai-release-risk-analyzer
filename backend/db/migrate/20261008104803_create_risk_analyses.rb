class CreateRiskAnalyses < ActiveRecord::Migration[7.2]
  def change
    create_table :risk_analyses do |t|
      t.references :release, null: false, foreign_key: true
      t.integer :risk_score
      t.string :risk_level
      t.text :summary
      t.jsonb :risks
      t.jsonb :recommendations
      t.jsonb :testing_recommendations

      t.timestamps
    end
  end
end
