# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2026_10_08_131945) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "audit_logs", force: :cascade do |t|
    t.bigint "release_id", null: false
    t.string "action"
    t.text "details"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["release_id"], name: "index_audit_logs_on_release_id"
  end

  create_table "release_changes", force: :cascade do |t|
    t.bigint "release_id", null: false
    t.string "file_name"
    t.string "change_type"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["release_id"], name: "index_release_changes_on_release_id"
  end

  create_table "releases", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "version", null: false
    t.string "environment", null: false
    t.text "description"
    t.string "status", default: "pending", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["status"], name: "index_releases_on_status"
    t.index ["user_id"], name: "index_releases_on_user_id"
  end

  create_table "risk_analyses", force: :cascade do |t|
    t.bigint "release_id", null: false
    t.integer "risk_score"
    t.string "risk_level"
    t.text "summary"
    t.jsonb "risks"
    t.jsonb "recommendations"
    t.jsonb "testing_recommendations"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["release_id"], name: "index_risk_analyses_on_release_id", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "audit_logs", "releases"
  add_foreign_key "release_changes", "releases"
  add_foreign_key "releases", "users"
  add_foreign_key "risk_analyses", "releases"
end
