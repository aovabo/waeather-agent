
import { Mastra } from '@mastra/core/mastra'; // Import the Mastra class from the @mastra/core/mastra module. This is the main class for creating a Mastra instance.
import { createLogger } from '@mastra/core/logger'; // Import the createLogger function from the @mastra/core/logger module. This function is used to create a logger instance.

import { weatherAgent } from './agents'; // Import the weatherAgent from the ./agents module. This is a pre-defined agent that will be used by Mastra.

// Create a new Mastra instance.
// This instance is configured with the weatherAgent and a logger.
// The logger is set to the 'info' level, meaning it will log informational messages and higher.
export const mastra = new Mastra({
  agents: { weatherAgent },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
