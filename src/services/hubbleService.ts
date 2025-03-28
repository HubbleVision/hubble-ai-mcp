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
    const apiKey = process.env.HUBBLE_API_KEY || "";
    try {
      const result = await fetch(
        `${HUBBLE_API_URL}/api/workflows/hubbleWorkflow/createRun`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "HUBBLE-API-Key": apiKey,
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
            "HUBBLE-API-Key": apiKey,
          },
          body: JSON.stringify({
            message: query,
          }),
        }
      );

      const responseJson = await resultStart.json();

      // Extract the output field from the response
      if (
        responseJson &&
        responseJson.context &&
        responseJson.context.steps &&
        responseJson.context.steps.text2sql &&
        responseJson.context.steps.text2sql.output
      ) {
        return responseJson.context.steps.text2sql.output;
      }

      // Return the full response if the output field is not found
      return responseJson;
    } catch (error) {
      throw ErrorHandler.handleError(error, "Failed to search Hubble");
    }
  }
}
