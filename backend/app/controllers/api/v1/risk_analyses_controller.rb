module Api
  module V1
    class RiskAnalysesController < ApplicationController
      def show
        release = Release.find(params[:release_id])
        analysis = release.risk_analysis

        if analysis
          render json: analysis
        else
          render json: { error: "Risk analysis not found" },
                 status: :not_found
        end
      end

      def create
       release = Release.find(params[:release_id])
       analysis = RiskAnalysisService.analyze_and_save(release)
       release.update!(status: "analyzed")
       render json: analysis, status: :created
       rescue StandardError => e
       Rails.logger.error("Risk analysis failed: #{e.message}")
       render json: { error: "Unable to generate risk analysis" },
       status: :unprocessable_entity
      end
    end
  end
end
