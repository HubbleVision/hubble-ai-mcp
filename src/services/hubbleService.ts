import { HUBBLE_API_URL } from "../config/constants.js";
import { ErrorHandler } from "../utils/errors.js";

/**
 * Service for handling Hubble API interactions
 */
export class HubbleService {

  /**
   * Executes a search query against the Hubble API
   */
  async search(query: string): Promise<any> {
    try {
        const result = await fetch(
          `${HUBBLE_API_URL}/api/workflows/hubbleWorkflow/createRun`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const runResult = await result.json();
  
        console.log("runResult", runResult);
  
        const resultStart = await fetch(
          `${HUBBLE_API_URL}/api/workflows/hubbleWorkflow/startAsync?runId=${runResult.runId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: query,
            }),
          }
        );
      
      return await resultStart.json();
    } catch (error) {
      throw ErrorHandler.handleError(error, "Failed to search Hubble");
    }
  }
}
