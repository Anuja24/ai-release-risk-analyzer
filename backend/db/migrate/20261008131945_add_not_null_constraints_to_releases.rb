class AddNotNullConstraintsToReleases < ActiveRecord::Migration[7.2]
  def change
    change_column_null :releases, :version, false
    change_column_null :releases, :environment, false
    change_column_null :releases, :status, false
  end
end
