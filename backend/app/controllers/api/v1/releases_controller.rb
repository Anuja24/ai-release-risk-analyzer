module Api
  module V1
    class ReleasesController < ApplicationController
      def index
        releases = Release.includes(:risk_analysis).order(created_at: :desc)
        render json: releases.as_json(
        include: {
          risk_analysis: {
            only: [:risk_level, :risk_score]
          }
        })
      end

      def show
        release = Release.find_by(id: params[:id])
        if release
          render json: release, include: :release_changes
        else    
          render json: { error: "Release not found" }, status: :not_found
        end
      end

      def create
        release = Release.new(release_params)
        if release.save
          render json: release, status: :created
        else
          render json: { errors: release.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private
      
      def release_params
        params.require(:release).permit(:user_id, :environment, :name, :version, :description)
      end
    end
  end
end

