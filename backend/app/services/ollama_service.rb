
require "net/http"
require "json"

class OllamaService
  def self.generate(prompt)
    uri = URI("http://localhost:11434/api/generate")

    request = Net::HTTP::Post.new(uri)
    request["Content-Type"] = "application/json"
    request.body = {
      model: "llama3.2:3b",
      prompt: prompt,
      stream: false
    }.to_json

    response = Net::HTTP.start(
      uri.hostname,
      uri.port,
      read_timeout: 120
    ) do |http|
      http.request(request)
    end

    raise "Ollama request failed: #{response.code}" unless response.is_a?(Net::HTTPSuccess)

    JSON.parse(response.body).fetch("response")
  end
end
