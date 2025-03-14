import { MastraClient } from "@mastra/client-js";
import { HUBBLE_API_URL } from "../config/constants.js";
import { ErrorHandler } from "../utils/errors.js";

/**
 * Service for handling Hubble API interactions
 */
export class HubbleService {
  private client: MastraClient;

  constructor() {
    this.client = new MastraClient({
      baseUrl: HUBBLE_API_URL,
    });
  }

  /**
   * Executes a search query against the Hubble API
   */
  async search(query: string): Promise<any> {
    try {
      const workflow = this.client.getWorkflow("hubbleWorkflow");
      
      // Start a new workflow run
      const result = await workflow.execute({
        message: query,
      });
      
      return result;
    } catch (error) {
      throw ErrorHandler.handleError(error, "Failed to search Hubble");
    }
  }
}
