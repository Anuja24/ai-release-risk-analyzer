class CreateReleases < ActiveRecord::Migration[7.2]
  def change
    create_table :releases do |t|
      t.references :user, null: false, foreign_key: true
      t.string :version
      t.string :environment
      t.text :description
      t.string :status

      t.timestamps
    end
  end
end
