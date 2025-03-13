import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { weatherTool } from '../tools';
// Define and export a new agent called weatherAgent using the Agent class
export const weatherAgent = new Agent({
  // Agent configuration options:
  // Name of the agent
  // Describes the purpose of the agent
  name: 'Weather Agent',
  instructions: `
      You are a helpful weather assistant that provides accurate weather information.

      Your primary function is to help users get weather details for specific locations. When responding:
      - Always ask for a location if none is provided
      - If giving a location with multiple parts (e.g. "New York, NY"), use the most relevant part (e.g. "New York")
      - Include relevant details like humidity, wind conditions, and precipitation
      - Keep responses concise but informative

      Use the weatherTool to fetch current weather data.
`,
  // Specifies the LLM to use, here gpt-4o
  model: openai('gpt-4o'),
  // Register the tool with the agent
  tools: { weatherTool },
});
