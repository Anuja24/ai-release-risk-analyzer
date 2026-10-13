
module Api
  module V1
    class ReleaseChangesController < ApplicationController
      def index
        release = Release.find(params[:release_id])
        render json: release.release_changes
      end
      
      def create
        release = Release.find_by(id: params[:release_id])

        unless release
          return render json: { error: "Release not found" },
                        status: :not_found
        end

        release_change = release.release_changes.new(change_params)

        if release_change.save
          render json: release_change, status: :created
        else
          render json: {
            errors: release_change.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      private

      def change_params
        params.require(:change).permit(
          :file_name,
          :change_type,
          :description
        )
      end
    end
  end
end

