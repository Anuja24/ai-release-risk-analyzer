class CreateAuditLogs < ActiveRecord::Migration[7.2]
  def change
    create_table :audit_logs do |t|
      t.references :release, null: false, foreign_key: true
      t.string :action
      t.text :details

      t.timestamps
    end
  end
end
