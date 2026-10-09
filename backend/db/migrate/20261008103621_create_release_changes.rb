class CreateReleaseChanges < ActiveRecord::Migration[7.2]
  def change
    create_table :release_changes do |t|
      t.references :release, null: false, foreign_key: true
      t.string :file_name
      t.string :change_type
      t.text :description

      t.timestamps
    end
  end
end
