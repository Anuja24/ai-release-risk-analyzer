class AddIndexToReleasesStatus < ActiveRecord::Migration[7.2]
  def change
    add_index :releases, :status
  end
end
